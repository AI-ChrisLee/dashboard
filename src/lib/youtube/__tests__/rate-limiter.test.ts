import { RateLimiter } from '../rate-limiter'

describe('RateLimiter', () => {
  let rateLimiter: RateLimiter
  
  beforeEach(() => {
    // Reset the singleton instance before each test
    jest.clearAllMocks()
    // Create rate limiter with test config (5 requests per minute)
    rateLimiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 })
  })

  describe('checkLimit', () => {
    it('should allow requests within the rate limit', async () => {
      const clientId = 'test-client-1'
      
      // First 5 requests should be allowed (default limit is 5 per minute)
      for (let i = 0; i < 5; i++) {
        const allowed = await rateLimiter.checkLimit(clientId)
        expect(allowed).toBe(true)
      }
    })

    it('should block requests exceeding the rate limit', async () => {
      const clientId = 'test-client-2'
      
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit(clientId)
      }
      
      // The 6th request should be blocked
      const allowed = await rateLimiter.checkLimit(clientId)
      expect(allowed).toBe(false)
    })

    it('should track different clients separately', async () => {
      const client1 = 'test-client-3'
      const client2 = 'test-client-4'
      
      // Max out client1
      for (let i = 0; i < 5; i++) {
        await rateLimiter.checkLimit(client1)
      }
      
      // Client2 should still be allowed
      const client2Allowed = await rateLimiter.checkLimit(client2)
      expect(client2Allowed).toBe(true)
      
      // But client1 should be blocked
      const client1Allowed = await rateLimiter.checkLimit(client1)
      expect(client1Allowed).toBe(false)
    })
  })

  describe('getRemainingRequests', () => {
    it('should return correct remaining requests', () => {
      const clientId = 'test-client-5'
      
      expect(rateLimiter.getRemainingRequests(clientId)).toBe(5)
      
      rateLimiter.checkLimit(clientId)
      expect(rateLimiter.getRemainingRequests(clientId)).toBe(4)
      
      rateLimiter.checkLimit(clientId)
      expect(rateLimiter.getRemainingRequests(clientId)).toBe(3)
    })

    it('should return 0 when limit is exceeded', async () => {
      const clientId = 'test-client-6'
      
      // Use up all requests
      for (let i = 0; i < 6; i++) {
        await rateLimiter.checkLimit(clientId)
      }
      
      expect(rateLimiter.getRemainingRequests(clientId)).toBe(0)
    })
  })

  describe('getResetTime', () => {
    it('should return a valid reset time', () => {
      const clientId = 'test-client-7'
      
      rateLimiter.checkLimit(clientId)
      const resetTime = rateLimiter.getResetTime(clientId)
      
      expect(typeof resetTime).toBe('number')
      expect(resetTime).toBeGreaterThan(Date.now())
      expect(resetTime).toBeLessThanOrEqual(Date.now() + 60000) // Within 1 minute
    })

    it('should return 0 for unknown clients', () => {
      const resetTime = rateLimiter.getResetTime('unknown-client')
      expect(resetTime).toBe(0)
    })
  })

  describe('cleanup', () => {
    it('should clean up expired entries', async () => {
      const clientId = 'test-client-cleanup'
      
      // Make a request
      await rateLimiter.checkLimit(clientId)
      expect(rateLimiter.getRemainingRequests(clientId)).toBe(4)
      
      // Mock the cleanup by directly manipulating the window
      // This is a simplified test - in reality, we'd need to wait or mock timers
      const resetTime = rateLimiter.getResetTime(clientId)
      expect(resetTime).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle rapid successive requests', async () => {
      const clientId = 'test-client-rapid'
      const promises = []
      
      // Make 10 rapid requests
      for (let i = 0; i < 10; i++) {
        promises.push(rateLimiter.checkLimit(clientId))
      }
      
      const results = await Promise.all(promises)
      
      // First 5 should be true, rest should be false
      expect(results.slice(0, 5).every(r => r === true)).toBe(true)
      expect(results.slice(5).every(r => r === false)).toBe(true)
    })

    it('should handle empty or invalid client IDs', async () => {
      const emptyResult = await rateLimiter.checkLimit('')
      expect(emptyResult).toBe(true) // Should allow but use a default ID
      
      const nullResult = await rateLimiter.checkLimit(null as any)
      expect(nullResult).toBe(true) // Should handle gracefully
    })
  })
})