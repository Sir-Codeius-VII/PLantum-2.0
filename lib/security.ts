import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'
import { SecurityError, ErrorCategory, ErrorSeverity } from './error-handling'
import { rateLimit } from './rate-limit'
import { hash, compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { authenticator } from 'otplib'
import qrcode from 'qrcode'

interface SecurityConfig {
  maxPaymentAmount: number
  minPaymentAmount: number
  maxDailyPayments: number
  maxFailedAttempts: number
  suspiciousAmountThreshold: number
  maxLoginAttempts: number
  lockoutDuration: number
  passwordMinLength: number
  requireSpecialChars: boolean
  requireNumbers: boolean
  requireUppercase: boolean
  sessionTimeout: number
  jwtSecret: string
  jwtExpiresIn: string
  twoFactorEnabled: boolean
  twoFactorIssuer: string
  ipWhitelistEnabled: boolean
  maxIpWhitelistEntries: number
  twoFactorGracePeriod: number // in days
}

export interface SecurityLog {
  id: string
  userId: string
  eventType: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export class SecurityService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  private redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  })

  private config: SecurityConfig = {
    maxPaymentAmount: 1000000, // $1M
    minPaymentAmount: 1, // $1
    maxDailyPayments: 10,
    maxFailedAttempts: 3,
    suspiciousAmountThreshold: 100000, // $100K
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: '24h',
    twoFactorEnabled: true,
    twoFactorIssuer: 'Plantum',
    ipWhitelistEnabled: true,
    maxIpWhitelistEntries: 5,
    twoFactorGracePeriod: 7 // 7 days grace period for 2FA setup
  }

  private static instance: SecurityService

  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  async validatePayment(userId: string, amount: number, ip: string): Promise<{ valid: boolean; reason?: string }> {
    try {
      // Check amount limits
      if (amount < this.config.minPaymentAmount) {
        return { valid: false, reason: 'Amount below minimum limit' }
      }
      if (amount > this.config.maxPaymentAmount) {
        return { valid: false, reason: 'Amount above maximum limit' }
      }

      // Check daily payment limit
      const dailyKey = `daily_payments:${userId}:${new Date().toISOString().split('T')[0]}`
      const dailyCount = await this.redis.incr(dailyKey)
      if (dailyCount > this.config.maxDailyPayments) {
        return { valid: false, reason: 'Daily payment limit exceeded' }
      }

      // Check failed attempts
      const failedKey = `failed_attempts:${userId}`
      const failedCount = await this.redis.get(failedKey) || 0
      if (failedCount >= this.config.maxFailedAttempts) {
        return { valid: false, reason: 'Too many failed attempts' }
      }

      // Check for suspicious activity
      const isSuspicious = await this.checkSuspiciousActivity(userId, amount, ip)
      if (isSuspicious) {
        return { valid: false, reason: 'Suspicious activity detected' }
      }

      return { valid: true }
    } catch (error) {
      console.error('Payment validation error:', error)
      return { valid: false, reason: 'Validation error' }
    }
  }

  private async checkSuspiciousActivity(userId: string, amount: number, ip: string): Promise<boolean> {
    try {
      // Check for large amounts
      if (amount > this.config.suspiciousAmountThreshold) {
        // Get user's payment history
        const { data: history } = await this.supabase
          .from('payments')
          .select('amount')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5)

        // If this is their first payment or amount is significantly larger than previous
        if (!history?.length || amount > Math.max(...history.map(p => p.amount)) * 10) {
          return true
        }
      }

      // Check IP history
      const ipKey = `ip_history:${ip}`
      const ipHistory = await this.redis.get(ipKey) || []
      if (ipHistory.length > 5) {
        return true
      }

      // Update IP history
      await this.redis.lpush(ipKey, userId)
      await this.redis.ltrim(ipKey, 0, 4)

      return false
    } catch (error) {
      console.error('Suspicious activity check error:', error)
      return true // Fail safe
    }
  }

  async recordFailedAttempt(userId: string): Promise<void> {
    const failedKey = `failed_attempts:${userId}`
    await this.redis.incr(failedKey)
    await this.redis.expire(failedKey, 3600) // Expire after 1 hour
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    const failedKey = `failed_attempts:${userId}`
    await this.redis.del(failedKey)
  }

  async logSecurityEvent(event: {
    type: string
    userId: string
    ip: string
    details: Record<string, any>
  }): Promise<void> {
    await this.supabase.from('security_logs').insert({
      type: event.type,
      user_id: event.userId,
      ip_address: event.ip,
      details: event.details,
      created_at: new Date().toISOString(),
    })
  }

  // Password validation
  public validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`)
    }

    if (this.config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Password hashing
  public async hashPassword(password: string): Promise<string> {
    return hash(password, 12)
  }

  public async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plainPassword, hashedPassword)
  }

  // JWT handling
  public generateToken(payload: Record<string, any>): string {
    return sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresIn
    })
  }

  public verifyToken(token: string): any {
    try {
      return verify(token, this.config.jwtSecret)
    } catch (error) {
      throw new SecurityError(
        'Invalid or expired token',
        {
          timestamp: new Date(),
          additionalData: { token }
        },
        ['Please log in again']
      )
    }
  }

  // Rate limiting
  public async checkRateLimit(
    userId: string,
    action: string,
    context: { ipAddress: string; userAgent: string }
  ): Promise<boolean> {
    const key = `${userId}:${action}`
    return rateLimit(key, context)
  }

  // Login attempt tracking
  public async trackLoginAttempt(
    userId: string,
    success: boolean,
    context: { ipAddress: string; userAgent: string }
  ): Promise<void> {
    const { data: attempts } = await this.supabase
      .from('login_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!success) {
      await this.logSecurityEvent({
        type: 'login_failed',
        userId,
        ...context,
        attemptCount: (attempts?.[0]?.attempt_count || 0) + 1
      })

      if (attempts?.[0]?.attempt_count >= this.config.maxLoginAttempts - 1) {
        await this.lockAccount(userId)
      }
    } else {
      await this.logSecurityEvent({
        type: 'login_success',
        userId,
        ...context
      })
    }
  }

  // Account locking
  private async lockAccount(userId: string): Promise<void> {
    const lockoutUntil = new Date(Date.now() + this.config.lockoutDuration)
    await this.supabase
      .from('user_security')
      .upsert({
        user_id: userId,
        is_locked: true,
        lockout_until: lockoutUntil.toISOString()
      })

    await this.logSecurityEvent({
      type: 'account_locked',
      userId,
      lockoutUntil
    })
  }

  // Session management
  public async createSession(userId: string, context: { ipAddress: string; userAgent: string }): Promise<string> {
    const sessionId = uuidv4()
    const expiresAt = new Date(Date.now() + this.config.sessionTimeout)

    await this.supabase.from('sessions').insert({
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
      ip_address: context.ipAddress,
      user_agent: context.userAgent
    })

    await this.logSecurityEvent({
      type: 'session_created',
      userId,
      sessionId,
      ...context
    })

    return sessionId
  }

  public async validateSession(sessionId: string): Promise<boolean> {
    const { data: session } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (!session || new Date(session.expires_at) < new Date()) {
      await this.logSecurityEvent({
        type: 'session_expired',
        sessionId
      })
      return false
    }

    return true
  }

  // Input sanitization
  public sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  }

  // XSS protection
  public escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // CSRF protection
  public generateCsrfToken(): string {
    return uuidv4()
  }

  public validateCsrfToken(token: string, storedToken: string): boolean {
    return token === storedToken
  }

  // Security headers
  public getSecurityHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }

  // 2FA Methods
  public async setupTwoFactor(userId: string): Promise<{ secret: string; qrCode: string }> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      userId,
      this.config.twoFactorIssuer,
      secret
    );

    const qrCode = await qrcode.toDataURL(otpauth);

    await this.supabase.from('user_security').upsert({
      user_id: userId,
      two_factor_secret: secret,
      two_factor_enabled: false,
      two_factor_setup_date: new Date().toISOString()
    });

    return { secret, qrCode };
  }

  public async verifyTwoFactor(userId: string, token: string): Promise<boolean> {
    const { data: userSecurity } = await this.supabase
      .from('user_security')
      .select('two_factor_secret')
      .eq('user_id', userId)
      .single();

    if (!userSecurity?.two_factor_secret) {
      throw new SecurityError(
        '2FA not set up',
        {
          timestamp: new Date(),
          userId
        },
        ['Set up 2FA first']
      );
    }

    return authenticator.verify({
      token,
      secret: userSecurity.two_factor_secret
    });
  }

  public async enableTwoFactor(userId: string, token: string): Promise<void> {
    const isValid = await this.verifyTwoFactor(userId, token);
    if (!isValid) {
      throw new SecurityError(
        'Invalid 2FA token',
        {
          timestamp: new Date(),
          userId
        },
        ['Try again with a valid token']
      );
    }

    await this.supabase
      .from('user_security')
      .update({ two_factor_enabled: true })
      .eq('user_id', userId);

    await this.logSecurityEvent({
      type: '2fa_enabled',
      userId,
      ip: 'system',
      details: { timestamp: new Date().toISOString() }
    });
  }

  public async disableTwoFactor(userId: string, token: string): Promise<void> {
    const isValid = await this.verifyTwoFactor(userId, token);
    if (!isValid) {
      throw new SecurityError(
        'Invalid 2FA token',
        {
          timestamp: new Date(),
          userId
        },
        ['Try again with a valid token']
      );
    }

    await this.supabase
      .from('user_security')
      .update({
        two_factor_enabled: false,
        two_factor_secret: null
      })
      .eq('user_id', userId);

    await this.logSecurityEvent({
      type: '2fa_disabled',
      userId,
      ip: 'system',
      details: { timestamp: new Date().toISOString() }
    });
  }

  public async isTwoFactorRequired(userId: string): Promise<boolean> {
    const { data: userSecurity } = await this.supabase
      .from('user_security')
      .select('two_factor_enabled, two_factor_setup_date')
      .eq('user_id', userId)
      .single();

    if (!userSecurity) return false;

    // Check if user is within grace period
    if (!userSecurity.two_factor_enabled && userSecurity.two_factor_setup_date) {
      const setupDate = new Date(userSecurity.two_factor_setup_date);
      const gracePeriodEnd = new Date(setupDate.getTime() + this.config.twoFactorGracePeriod * 24 * 60 * 60 * 1000);
      return new Date() > gracePeriodEnd;
    }

    return userSecurity.two_factor_enabled;
  }

  // IP Whitelisting Methods
  public async addIpToWhitelist(userId: string, ip: string, description: string): Promise<void> {
    const { data: whitelist } = await this.supabase
      .from('ip_whitelist')
      .select('*')
      .eq('user_id', userId);

    if (whitelist && whitelist.length >= this.config.maxIpWhitelistEntries) {
      throw new SecurityError(
        'IP whitelist limit reached',
        {
          timestamp: new Date(),
          userId
        },
        ['Remove some IPs from whitelist first']
      );
    }

    await this.supabase.from('ip_whitelist').insert({
      user_id: userId,
      ip_address: ip,
      description,
      created_at: new Date().toISOString()
    });

    await this.logSecurityEvent({
      type: 'ip_whitelisted',
      userId,
      ip,
      details: { description }
    });
  }

  public async removeIpFromWhitelist(userId: string, ip: string): Promise<void> {
    await this.supabase
      .from('ip_whitelist')
      .delete()
      .eq('user_id', userId)
      .eq('ip_address', ip);

    await this.logSecurityEvent({
      type: 'ip_removed_from_whitelist',
      userId,
      ip,
      details: { timestamp: new Date().toISOString() }
    });
  }

  public async isIpWhitelisted(userId: string, ip: string): Promise<boolean> {
    if (!this.config.ipWhitelistEnabled) return true;

    const { data: whitelist } = await this.supabase
      .from('ip_whitelist')
      .select('*')
      .eq('user_id', userId)
      .eq('ip_address', ip);

    return !!whitelist?.length;
  }

  public async getWhitelistedIps(userId: string): Promise<Array<{ ip: string; description: string; createdAt: Date }>> {
    const { data: whitelist } = await this.supabase
      .from('ip_whitelist')
      .select('*')
      .eq('user_id', userId);

    return whitelist?.map(entry => ({
      ip: entry.ip_address,
      description: entry.description,
      createdAt: new Date(entry.created_at)
    })) || [];
  }

  // Enhanced login validation
  public async validateLogin(
    userId: string,
    ip: string,
    userAgent: string
  ): Promise<{ valid: boolean; requiresTwoFactor: boolean; reason?: string }> {
    // Check if IP is whitelisted
    const isWhitelisted = await this.isIpWhitelisted(userId, ip);
    if (!isWhitelisted) {
      return {
        valid: false,
        requiresTwoFactor: false,
        reason: 'IP not whitelisted'
      };
    }

    // Check if 2FA is required
    const requiresTwoFactor = await this.isTwoFactorRequired(userId);
    if (requiresTwoFactor) {
      return {
        valid: true,
        requiresTwoFactor: true
      };
    }

    return {
      valid: true,
      requiresTwoFactor: false
    };
  }
} 