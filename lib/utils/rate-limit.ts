interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isRateLimited(identifier: string): { limited: boolean; remaining: number; reset: number } {
    const now = Date.now()
    const key = identifier
    const record = this.store[key]

    // Clean up expired records
    if (record && now > record.resetTime) {
      delete this.store[key]
    }

    if (!record) {
      // First request
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return {
        limited: false,
        remaining: this.maxRequests - 1,
        reset: now + this.windowMs
      }
    }

    if (record.count >= this.maxRequests) {
      return {
        limited: true,
        remaining: 0,
        reset: record.resetTime
      }
    }

    // Increment count
    record.count++
    return {
      limited: false,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime
    }
  }

  // Clean up expired records (call periodically)
  cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }
}

// Create rate limiters for different endpoints
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 requests per 15 minutes
export const paymentRateLimiter = new RateLimiter(10, 15 * 60 * 1000) // 10 requests per 15 minutes
export const generalRateLimiter = new RateLimiter(100, 15 * 60 * 1000) // 100 requests per 15 minutes

// Clean up expired records every 5 minutes
setInterval(() => {
  authRateLimiter.cleanup()
  paymentRateLimiter.cleanup()
  generalRateLimiter.cleanup()
}, 5 * 60 * 1000)

export function getClientIdentifier(request: Request): string {
  // Use IP address or user ID if available
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback to user agent hash
  return Buffer.from(userAgent).toString('base64').slice(0, 10)
}
