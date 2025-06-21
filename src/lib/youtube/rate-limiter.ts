interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private config: RateLimitConfig

  constructor(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
    this.config = config
  }

  async checkLimit(identifier: string): Promise<boolean> {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside the time window
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.config.windowMs
    )
    
    if (validRequests.length >= this.config.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.config.windowMs
    )
    
    return Math.max(0, this.config.maxRequests - validRequests.length)
  }

  getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier) || []
    if (userRequests.length === 0) return 0
    
    const oldestRequest = Math.min(...userRequests)
    return oldestRequest + this.config.windowMs
  }
}

// YouTube API has a quota of 10,000 units per day
// Search costs 100 units, so we limit to 50 searches per hour per IP
export const rateLimiter = new RateLimiter({
  maxRequests: 50,
  windowMs: 60 * 60 * 1000 // 1 hour
})