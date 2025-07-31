import { Redis } from '@upstash/redis'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface TokenBucket {
  tokens: number
  lastRefill: number
}

class RateLimiter {
  private buckets: Map<string, TokenBucket>
  private config: RateLimitConfig
  private redis: Redis | null

  constructor(config: RateLimitConfig) {
    this.buckets = new Map()
    this.config = config
    this.redis = null

    // Try to initialize Redis if environment variables are available
    try {
      if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
        this.redis = new Redis({
          url: process.env.UPSTASH_REDIS_URL,
          token: process.env.UPSTASH_REDIS_TOKEN,
        })
      }
    } catch (error) {
      console.warn('Failed to initialize Redis client:', error)
    }
  }

  private async refillTokens(key: string, bucket: TokenBucket): Promise<void> {
    const now = Date.now()
    const timePassed = now - bucket.lastRefill
    const tokensToAdd = Math.floor(timePassed / this.config.windowMs) * this.config.maxRequests
    
    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.config.maxRequests, bucket.tokens + tokensToAdd)
      bucket.lastRefill = now

      // Update Redis if available
      if (this.redis) {
        try {
          await this.redis.hset(key, {
            tokens: bucket.tokens,
            lastRefill: bucket.lastRefill,
          })
        } catch (error) {
          console.warn('Failed to update Redis:', error)
        }
      }
    }
  }

  private async getBucket(key: string): Promise<TokenBucket> {
    if (this.redis) {
      try {
        const data = await this.redis.hgetall(key)
        if (data) {
          return {
            tokens: data.tokens,
            lastRefill: data.lastRefill,
          }
        }
      } catch (error) {
        console.warn('Failed to get bucket from Redis:', error)
      }
    }

    if (!this.buckets.has(key)) {
      this.buckets.set(key, {
        tokens: this.config.maxRequests,
        lastRefill: Date.now(),
      })
    }
    return this.buckets.get(key)!
  }

  public async consume(key: string): Promise<boolean> {
    const bucket = await this.getBucket(key)
    await this.refillTokens(key, bucket)

    if (bucket.tokens > 0) {
      bucket.tokens--
      return true
    }

    return false
  }

  public async getRemainingTokens(key: string): Promise<number> {
    const bucket = await this.getBucket(key)
    await this.refillTokens(key, bucket)
    return bucket.tokens
  }

  public async getResetTime(key: string): Promise<number> {
    const bucket = await this.getBucket(key)
    const now = Date.now()
    const timeSinceLastRefill = now - bucket.lastRefill
    const timeUntilNextRefill = this.config.windowMs - (timeSinceLastRefill % this.config.windowMs)
    return Math.ceil(timeUntilNextRefill / 1000) // Convert to seconds
  }
}

// Create a singleton instance with default configuration
const defaultConfig: RateLimitConfig = {
  maxRequests: 100, // Maximum number of requests
  windowMs: 60 * 1000, // Time window in milliseconds (1 minute)
}

export const rateLimiter = new RateLimiter(defaultConfig)

// Middleware function for API routes
export function rateLimit(config?: Partial<RateLimitConfig>) {
  const limiter = config ? new RateLimiter({ ...defaultConfig, ...config }) : rateLimiter

  return async function rateLimitMiddleware(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const key = `rate-limit:${ip}`

    if (!(await limiter.consume(key))) {
      const resetTime = await limiter.getResetTime(key)
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please try again later',
          resetTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': (await limiter.getRemainingTokens(key)).toString(),
            'X-RateLimit-Reset': resetTime.toString(),
          },
        }
      )
    }

    return null
  }
} 