import { GET } from '../route'
import { createMockRequest, getJsonResponse } from '@/test-utils/api'

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ 
        data: { 
          user: { 
            id: 'test-user-123',
            email: 'test@example.com'
          } 
        }, 
        error: null 
      })
    }
  })
}))

jest.mock('@/lib/supabase/db', () => ({
  DatabaseService: {
    getNotifications: jest.fn()
  }
}))

describe('Notifications Check API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset Math.random for consistent tests
    jest.spyOn(Math, 'random')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return empty array when no notifications', async () => {
    // Mock Math.random to return a value that won't trigger notification
    Math.random = jest.fn().mockReturnValue(0.5)

    const request = createMockRequest('/api/notifications/check')
    const response = await GET(request)
    const data = await getJsonResponse(response)

    expect(response.status).toBe(200)
    expect(data).toEqual([])
  })

  it('should return notification when triggered', async () => {
    // Mock Math.random to return a value that will trigger notification
    Math.random = jest.fn().mockReturnValue(0.05)

    const request = createMockRequest('/api/notifications/check')
    const response = await GET(request)
    const data = await getJsonResponse(response)

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0]).toHaveProperty('type', 'viral_video')
    expect(data[0]).toHaveProperty('title')
    expect(data[0]).toHaveProperty('message')
    expect(data[0]).toHaveProperty('data')
    expect(data[0]).toHaveProperty('priority')
  })

  it('should return correct notification structure', async () => {
    // Mock Math.random to trigger notification
    Math.random = jest.fn().mockReturnValue(0.05)

    const request = createMockRequest('/api/notifications/check')
    const response = await GET(request)
    const data = await getJsonResponse(response)

    const notification = data[0]
    expect(notification.type).toBe('viral_video')
    expect(notification.priority).toBe('high')
    expect(notification.data).toHaveProperty('videoId')
    expect(notification.data).toHaveProperty('viralScore')
    expect(notification.data).toHaveProperty('viewCount')
    expect(notification.data).toHaveProperty('thumbnail')
  })

  it('should not include cache headers for real-time data', async () => {
    const request = createMockRequest('/api/notifications/check')
    const response = await GET(request)

    expect(response.headers.get('Cache-Control')).toContain('no-store')
    expect(response.headers.get('Cache-Control')).toContain('no-cache')
  })

  it('should handle errors gracefully', async () => {
    // Mock console.error to suppress error logs in tests
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    
    // Force an error by mocking createClient to throw
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockRejectedValueOnce(new Error('Database error'))

    const request = createMockRequest('/api/notifications/check')
    const response = await GET(request)
    const data = await getJsonResponse(response)

    expect(response.status).toBe(500)
    expect(data).toEqual([])

    consoleError.mockRestore()
  })

  it('should work with unauthenticated users', async () => {
    // Mock unauthenticated user
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: null }, 
          error: null 
        })
      }
    })

    // Mock to trigger notification
    Math.random = jest.fn().mockReturnValue(0.05)

    const request = createMockRequest('/api/notifications/check')
    const response = await GET(request)
    const data = await getJsonResponse(response)

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
  })

  it('should respect 10% probability', async () => {
    const results = []
    
    // Run 100 times to test probability
    for (let i = 0; i < 100; i++) {
      Math.random = jest.fn().mockReturnValue(i / 100)
      const request = createMockRequest('/api/notifications/check')
      const response = await GET(request)
      const data = await getJsonResponse(response)
      results.push(data.length > 0)
    }

    // Should have notifications for first 10 iterations (0-9%)
    const notificationCount = results.filter(r => r).length
    expect(notificationCount).toBe(10)
  })
})