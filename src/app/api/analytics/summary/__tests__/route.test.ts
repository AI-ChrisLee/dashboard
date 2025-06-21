import { GET } from '../route'
import { getJsonResponse } from '@/test-utils/api'

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
    }
  })
}))

jest.mock('@/lib/supabase/db', () => ({
  DatabaseService: {
    getAnalyticsSummary: jest.fn()
  }
}))

describe('Analytics Summary API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return analytics summary data', async () => {
    const response = await GET()
    const data = await getJsonResponse(response)

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('trending')
    expect(data).toHaveProperty('topPerformer')
    expect(data).toHaveProperty('avgEngagement')
    expect(data).toHaveProperty('viralVelocity')
  })

  it('should return correct data structure', async () => {
    const response = await GET()
    const data = await getJsonResponse(response)

    // Check trending structure
    expect(data.trending).toHaveProperty('direction')
    expect(data.trending).toHaveProperty('percentage')
    expect(data.trending).toHaveProperty('description')
    expect(['up', 'down']).toContain(data.trending.direction)

    // Check top performer structure
    expect(data.topPerformer).toHaveProperty('title')
    expect(data.topPerformer).toHaveProperty('channel')
    expect(data.topPerformer).toHaveProperty('viralScore')
    expect(data.topPerformer).toHaveProperty('views')

    // Check average engagement structure
    expect(data.avgEngagement).toHaveProperty('current')
    expect(data.avgEngagement).toHaveProperty('previous')
    expect(data.avgEngagement).toHaveProperty('change')

    // Check viral velocity structure
    expect(data.viralVelocity).toHaveProperty('count')
    expect(data.viralVelocity).toHaveProperty('timeframe')
  })

  it('should include cache headers', async () => {
    const response = await GET()

    expect(response.headers.get('Cache-Control')).toContain('max-age')
    expect(response.headers.get('Cache-Control')).toContain('stale-while-revalidate')
  })

  it('should handle errors gracefully', async () => {
    // Mock console.error to suppress error logs in tests
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    
    // Force an error by mocking createClient to throw
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockRejectedValueOnce(new Error('Database connection error'))

    const response = await GET()
    const data = await getJsonResponse(response)

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch analytics summary')

    consoleError.mockRestore()
  })

  it('should return numeric values in correct ranges', async () => {
    const response = await GET()
    const data = await getJsonResponse(response)

    // Trending percentage should be reasonable
    expect(data.trending.percentage).toBeGreaterThan(0)
    expect(data.trending.percentage).toBeLessThan(100)

    // Viral score should be 0-100
    expect(data.topPerformer.viralScore).toBeGreaterThanOrEqual(0)
    expect(data.topPerformer.viralScore).toBeLessThanOrEqual(100)

    // Views should be positive
    expect(data.topPerformer.views).toBeGreaterThan(0)

    // Engagement rates should be percentages
    expect(data.avgEngagement.current).toBeGreaterThanOrEqual(0)
    expect(data.avgEngagement.previous).toBeGreaterThanOrEqual(0)

    // Viral velocity count should be non-negative
    expect(data.viralVelocity.count).toBeGreaterThanOrEqual(0)
  })
})