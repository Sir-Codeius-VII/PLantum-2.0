import { SecurityService } from './security';
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { authenticator } from 'otplib';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null })
    }))
  }))
}));

describe('SecurityService', () => {
  let securityService: SecurityService;
  const mockContext = {
    ipAddress: '127.0.0.1',
    userAgent: 'Mozilla/5.0'
  };

  beforeEach(() => {
    securityService = SecurityService.getInstance();
  });

  describe('Password Validation', () => {
    it('should validate password requirements', () => {
      const result = securityService.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one special character');
      expect(result.errors).toContain('Password must contain at least one number');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should accept valid password', () => {
      const result = securityService.validatePassword('StrongP@ss123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await securityService.hashPassword(password);
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('should compare passwords correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hash(password, 12);
      const result = await securityService.comparePasswords(password, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('JWT Handling', () => {
    it('should generate valid token', () => {
      const payload = { userId: '123', role: 'user' };
      const token = securityService.generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify valid token', () => {
      const payload = { userId: '123', role: 'user' };
      const token = sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
      const verified = securityService.verifyToken(token);
      expect(verified).toMatchObject(payload);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        securityService.verifyToken('invalid-token');
      }).toThrow('Invalid or expired token');
    });
  });

  describe('Session Management', () => {
    it('should create session', async () => {
      const userId = '123';
      const sessionId = await securityService.createSession(userId, mockContext);
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
    });

    it('should validate session', async () => {
      const sessionId = 'valid-session-id';
      const isValid = await securityService.validateSession(sessionId);
      expect(typeof isValid).toBe('boolean');
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize input', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = securityService.sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
    });

    it('should escape HTML', () => {
      const input = '<div>test</div>';
      const escaped = securityService.escapeHtml(input);
      expect(escaped).toBe('&lt;div&gt;test&lt;/div&gt;');
    });
  });

  describe('CSRF Protection', () => {
    it('should generate CSRF token', () => {
      const token = securityService.generateCsrfToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should validate CSRF token', () => {
      const token = securityService.generateCsrfToken();
      const isValid = securityService.validateCsrfToken(token, token);
      expect(isValid).toBe(true);
    });

    it('should reject invalid CSRF token', () => {
      const token = securityService.generateCsrfToken();
      const isValid = securityService.validateCsrfToken(token, 'different-token');
      expect(isValid).toBe(false);
    });
  });

  describe('Security Headers', () => {
    it('should return security headers', () => {
      const headers = securityService.getSecurityHeaders();
      expect(headers).toHaveProperty('Content-Security-Policy');
      expect(headers).toHaveProperty('X-Content-Type-Options');
      expect(headers).toHaveProperty('X-Frame-Options');
      expect(headers).toHaveProperty('X-XSS-Protection');
      expect(headers).toHaveProperty('Strict-Transport-Security');
      expect(headers).toHaveProperty('Referrer-Policy');
    });
  });

  describe('Rate Limiting', () => {
    it('should check rate limit', async () => {
      const userId = '123';
      const action = 'login';
      const result = await securityService.checkRateLimit(userId, action, mockContext);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Login Attempt Tracking', () => {
    it('should track failed login attempt', async () => {
      const userId = '123';
      await securityService.trackLoginAttempt(userId, false, mockContext);
      // Verify that the security event was logged
      expect(createClient).toHaveBeenCalled();
    });

    it('should track successful login attempt', async () => {
      const userId = '123';
      await securityService.trackLoginAttempt(userId, true, mockContext);
      // Verify that the security event was logged
      expect(createClient).toHaveBeenCalled();
    });
  });

  describe('Two-Factor Authentication', () => {
    it('should setup 2FA and return QR code', async () => {
      const userId = '123';
      const result = await securityService.setupTwoFactor(userId);
      expect(result.secret).toBeDefined();
      expect(result.qrCode).toMatch(/^data:image\/png;base64,/);
    });

    it('should verify valid 2FA token', async () => {
      const userId = '123';
      const secret = authenticator.generateSecret();
      const token = authenticator.generate(secret);

      // Mock Supabase response
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { two_factor_secret: secret }
          })
        }))
      }));

      const isValid = await securityService.verifyTwoFactor(userId, token);
      expect(isValid).toBe(true);
    });

    it('should reject invalid 2FA token', async () => {
      const userId = '123';
      const secret = authenticator.generateSecret();
      const invalidToken = '000000';

      // Mock Supabase response
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { two_factor_secret: secret }
          })
        }))
      }));

      const isValid = await securityService.verifyTwoFactor(userId, invalidToken);
      expect(isValid).toBe(false);
    });

    it('should enable 2FA with valid token', async () => {
      const userId = '123';
      const secret = authenticator.generateSecret();
      const token = authenticator.generate(secret);

      // Mock Supabase response
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { two_factor_secret: secret }
          }),
          update: jest.fn().mockReturnThis()
        }))
      }));

      await expect(securityService.enableTwoFactor(userId, token)).resolves.not.toThrow();
    });

    it('should disable 2FA with valid token', async () => {
      const userId = '123';
      const secret = authenticator.generateSecret();
      const token = authenticator.generate(secret);

      // Mock Supabase response
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { two_factor_secret: secret }
          }),
          update: jest.fn().mockReturnThis()
        }))
      }));

      await expect(securityService.disableTwoFactor(userId, token)).resolves.not.toThrow();
    });

    it('should check if 2FA is required', async () => {
      const userId = '123';
      const result = await securityService.isTwoFactorRequired(userId);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('IP Whitelisting', () => {
    it('should add IP to whitelist', async () => {
      const userId = '123';
      const ip = '192.168.1.1';
      const description = 'Home IP';

      await expect(securityService.addIpToWhitelist(userId, ip, description)).resolves.not.toThrow();
    });

    it('should remove IP from whitelist', async () => {
      const userId = '123';
      const ip = '192.168.1.1';

      await expect(securityService.removeIpFromWhitelist(userId, ip)).resolves.not.toThrow();
    });

    it('should check if IP is whitelisted', async () => {
      const userId = '123';
      const ip = '192.168.1.1';

      const result = await securityService.isIpWhitelisted(userId, ip);
      expect(typeof result).toBe('boolean');
    });

    it('should get whitelisted IPs', async () => {
      const userId = '123';
      const result = await securityService.getWhitelistedIps(userId);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should enforce IP whitelist limit', async () => {
      const userId = '123';
      const mockIps = Array(6).fill(null).map((_, i) => `192.168.1.${i}`);

      // Mock Supabase response for existing whitelist
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: mockIps.map(ip => ({ ip_address: ip }))
          })
        }))
      }));

      await expect(
        securityService.addIpToWhitelist(userId, '192.168.1.6', 'New IP')
      ).rejects.toThrow('IP whitelist limit reached');
    });
  });

  describe('Enhanced Login Validation', () => {
    it('should validate login with whitelisted IP and no 2FA', async () => {
      const userId = '123';
      const ip = '192.168.1.1';
      const userAgent = 'test-agent';

      // Mock IP whitelist check
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ ip_address: ip }]
          })
        }))
      }));

      const result = await securityService.validateLogin(userId, ip, userAgent);
      expect(result.valid).toBe(true);
      expect(result.requiresTwoFactor).toBe(false);
    });

    it('should reject login with non-whitelisted IP', async () => {
      const userId = '123';
      const ip = '192.168.1.1';
      const userAgent = 'test-agent';

      // Mock IP whitelist check
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: []
          })
        }))
      }));

      const result = await securityService.validateLogin(userId, ip, userAgent);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('IP not whitelisted');
    });

    it('should require 2FA when enabled', async () => {
      const userId = '123';
      const ip = '192.168.1.1';
      const userAgent = 'test-agent';

      // Mock IP whitelist and 2FA checks
      const mockSupabase = createClient as jest.Mock;
      mockSupabase.mockImplementation(() => ({
        from: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ ip_address: ip }],
            two_factor_enabled: true
          })
        }))
      }));

      const result = await securityService.validateLogin(userId, ip, userAgent);
      expect(result.valid).toBe(true);
      expect(result.requiresTwoFactor).toBe(true);
    });
  });
}); 