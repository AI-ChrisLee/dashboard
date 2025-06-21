import { GET } from '../route'
import { createMockRequest, getJsonResponse, mockYouTubeClient, mockRateLimiter } from '@/test-utils/api'
import { viralScoreCalculator } from '@/lib/youtube/scoring'

// Mock dependencies
jest.mock('@/lib/youtube/client', () => ({
  youtubeClient: mockYouTubeClient
}))

jest.mock('@/lib/youtube/rate-limiter', () => ({
  rateLimiter: mockRateLimiter
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
    }
  })
}))

jest.mock('@/lib/supabase/db', () => ({
  DatabaseService: {
    cacheChannel: jest.fn().mockResolvedValue({}),
    cacheVideo: jest.fn().mockResolvedValue({}),
    cacheViralScore: jest.fn().mockResolvedValue({}),
    saveSearch: jest.fn().mockResolvedValue({})
  }
}))

describe('YouTube Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockVideoData = {
    id: 'test-video-1',
    title: 'Test Video',
    description: 'Test description',
    channelId: 'test-channel-1',
    channelTitle: 'Test Channel',
    publishedAt: new Date().toISOString(),
    thumbnail: { url: 'https://example.com/thumb.jpg', width: 320, height: 180 },
    statistics: { viewCount: 100000, likeCount: 5000, commentCount: 500 },
    duration: 'PT10M'
  }

  const mockChannelData = {
    id: 'test-channel-1',
    title: 'Test Channel',
    description: 'Channel description',
    customUrl: '@testchannel',
    statistics: { viewCount: 1000000, subscriberCount: 10000, videoCount: 100 },
    publishedAt: '2020-01-01T00:00:00Z',
    thumbnail: { url: 'https://example.com/channel.jpg', width: 240, height: 240 }
  }

  describe('Successful requests', () => {
    it('should return videos with viral scores', async () => {
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [mockVideoData],
        nextPageToken: 'next-page-token',
        totalResults: 100
      })
      
      mockYouTubeClient.getChannels.mockResolvedValueOnce([mockChannelData])

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { q: 'test query' }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.items).toHaveLength(1)
      expect(data.items[0]).toHaveProperty('viralScore')
      expect(data.items[0]).toHaveProperty('engagementRate')
      expect(data.items[0]).toHaveProperty('channel')
      expect(data.nextPageToken).toBe('next-page-token')
      expect(data.totalResults).toBe(100)
    })

    it('should apply filters correctly', async () => {
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [mockVideoData],
        nextPageToken: null,
        totalResults: 1
      })
      
      mockYouTubeClient.getChannels.mockResolvedValueOnce([mockChannelData])

      const request = createMockRequest('/api/youtube/search', {
        searchParams: {
          q: 'test',
          order: 'date',
          publishedAfter: '2024-01-01',
          videoDuration: 'medium',
          maxSubscribers: '50000'
        }
      })
      
      await GET(request)

      expect(mockYouTubeClient.searchVideos).toHaveBeenCalledWith(
        'test',
        20,
        undefined,
        {
          order: 'date',
          publishedAfter: '2024-01-01',
          videoDuration: 'medium'
        }
      )
    })

    it('should sort by viral score by default', async () => {
      const video1 = { ...mockVideoData, id: 'video1', statistics: { ...mockVideoData.statistics, viewCount: 50000 } }
      const video2 = { ...mockVideoData, id: 'video2', statistics: { ...mockVideoData.statistics, viewCount: 200000 } }
      
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [video1, video2],
        nextPageToken: null,
        totalResults: 2
      })
      
      mockYouTubeClient.getChannels.mockResolvedValueOnce([mockChannelData])

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { q: 'test' }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      // Video with higher views should have higher viral score and come first
      expect(data.items[0].id).toBe('video2')
      expect(data.items[1].id).toBe('video1')
    })
  })

  describe('Error handling', () => {
    it('should return 400 if query is missing', async () => {
      const request = createMockRequest('/api/youtube/search')
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query parameter is required')
    })

    it('should return 429 if rate limit exceeded', async () => {
      mockRateLimiter.checkLimit.mockResolvedValueOnce(false)

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { q: 'test' }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(response.status).toBe(429)
      expect(data.error).toContain('Rate limit exceeded')
      expect(data.remainingRequests).toBeDefined()
      expect(data.resetTime).toBeDefined()
    })

    it('should handle YouTube API errors gracefully', async () => {
      mockYouTubeClient.searchVideos.mockRejectedValueOnce(new Error('YouTube API error'))

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { q: 'test' }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to search videos')
    })

    it('should return empty results if no videos found', async () => {
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [],
        nextPageToken: null,
        totalResults: 0
      })

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { q: 'nonexistent' }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(response.status).toBe(200)
      expect(data.items).toEqual([])
      expect(data.totalResults).toBe(0)
    })
  })

  describe('Filtering', () => {
    it('should filter by subscriber count', async () => {
      const smallChannel = { ...mockChannelData, statistics: { ...mockChannelData.statistics, subscriberCount: 5000 } }
      const largeChannel = { ...mockChannelData, id: 'channel2', statistics: { ...mockChannelData.statistics, subscriberCount: 100000 } }
      
      const video1 = { ...mockVideoData, channelId: smallChannel.id }
      const video2 = { ...mockVideoData, id: 'video2', channelId: largeChannel.id }
      
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [video1, video2],
        nextPageToken: null,
        totalResults: 2
      })
      
      mockYouTubeClient.getChannels.mockResolvedValueOnce([smallChannel, largeChannel])

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { 
          q: 'test',
          maxSubscribers: '10000'
        }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(data.items).toHaveLength(1)
      expect(data.items[0].channel.id).toBe(smallChannel.id)
    })

    it('should filter by view count', async () => {
      const video1 = { ...mockVideoData, statistics: { ...mockVideoData.statistics, viewCount: 5000 } }
      const video2 = { ...mockVideoData, id: 'video2', statistics: { ...mockVideoData.statistics, viewCount: 15000 } }
      
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [video1, video2],
        nextPageToken: null,
        totalResults: 2
      })
      
      mockYouTubeClient.getChannels.mockResolvedValueOnce([mockChannelData])

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { 
          q: 'test',
          minViews: '10000',
          maxViews: '20000'
        }
      })
      
      const response = await GET(request)
      const data = await getJsonResponse(response)

      expect(data.items).toHaveLength(1)
      expect(data.items[0].id).toBe('video2')
    })
  })

  describe('Caching', () => {
    it('should include cache headers', async () => {
      mockYouTubeClient.searchVideos.mockResolvedValueOnce({
        items: [mockVideoData],
        nextPageToken: null,
        totalResults: 1
      })
      
      mockYouTubeClient.getChannels.mockResolvedValueOnce([mockChannelData])

      const request = createMockRequest('/api/youtube/search', {
        searchParams: { q: 'test' }
      })
      
      const response = await GET(request)

      expect(response.headers.get('Cache-Control')).toContain('public')
      expect(response.headers.get('Cache-Control')).toContain('s-maxage')
    })
  })
})