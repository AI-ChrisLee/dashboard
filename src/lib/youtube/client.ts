import { YouTubeVideo, YouTubeChannel, YouTubeSearchResult, YouTubeApiError } from '@/types/youtube'

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3'
const API_KEY = process.env.YOUTUBE_API_KEY

if (!API_KEY) {
  throw new Error('YouTube API key is not configured')
}

export class YouTubeAPIClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = API_KEY!
    this.baseUrl = YOUTUBE_API_BASE_URL
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append('key', this.apiKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      const error = await response.json() as YouTubeApiError
      throw new Error(error.error.message || 'YouTube API request failed')
    }

    return response.json()
  }

  async searchVideos(
    query: string,
    maxResults: number = 50,
    pageToken?: string,
    options?: {
      order?: 'relevance' | 'date' | 'rating' | 'viewCount' | 'title'
      publishedAfter?: string
      videoDuration?: 'short' | 'medium' | 'long'
    }
  ): Promise<YouTubeSearchResult> {
    const response = await this.fetch<any>('/search', {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      order: options?.order || 'viewCount',
      ...(options?.publishedAfter && { publishedAfter: options.publishedAfter }),
      ...(options?.videoDuration && { videoDuration: options.videoDuration }),
      ...(pageToken && { pageToken })
    })

    const videoIds = response.items.map((item: any) => item.id.videoId).join(',')
    
    if (!videoIds) {
      return {
        items: [],
        nextPageToken: response.nextPageToken,
        totalResults: 0
      }
    }

    // Get video statistics
    const videosWithStats = await this.getVideosWithStatistics(videoIds)

    return {
      items: videosWithStats,
      nextPageToken: response.nextPageToken,
      totalResults: response.pageInfo.totalResults
    }
  }

  async getVideosWithStatistics(videoIds: string): Promise<YouTubeVideo[]> {
    const response = await this.fetch<any>('/videos', {
      part: 'snippet,statistics,contentDetails',
      id: videoIds
    })

    return response.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: {
        url: item.snippet.thumbnails.medium.url,
        width: item.snippet.thumbnails.medium.width,
        height: item.snippet.thumbnails.medium.height
      },
      statistics: {
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0')
      },
      duration: this.parseDuration(item.contentDetails?.duration)
    }))
  }

  private parseDuration(isoDuration?: string): number | undefined {
    if (!isoDuration) return undefined
    
    // Parse ISO 8601 duration format (e.g., PT4M13S)
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return undefined
    
    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')
    
    return hours * 3600 + minutes * 60 + seconds
  }

  async getChannel(channelId: string): Promise<YouTubeChannel> {
    const response = await this.fetch<any>('/channels', {
      part: 'snippet,statistics',
      id: channelId
    })

    if (!response.items || response.items.length === 0) {
      throw new Error('Channel not found')
    }

    const channel = response.items[0]
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      thumbnail: {
        url: channel.snippet.thumbnails.medium.url,
        width: channel.snippet.thumbnails.medium.width,
        height: channel.snippet.thumbnails.medium.height
      },
      statistics: {
        viewCount: parseInt(channel.statistics.viewCount || '0'),
        subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics.videoCount || '0')
      }
    }
  }

  async getChannels(channelIds: string[]): Promise<YouTubeChannel[]> {
    if (channelIds.length === 0) return []
    
    const response = await this.fetch<any>('/channels', {
      part: 'snippet,statistics',
      id: channelIds.join(',')
    })

    return response.items.map((channel: any) => ({
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      thumbnail: {
        url: channel.snippet.thumbnails.medium.url,
        width: channel.snippet.thumbnails.medium.width,
        height: channel.snippet.thumbnails.medium.height
      },
      statistics: {
        viewCount: parseInt(channel.statistics.viewCount || '0'),
        subscriberCount: parseInt(channel.statistics.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics.videoCount || '0')
      }
    }))
  }

  /**
   * Search strategies for finding viral videos
   */
  
  // Strategy 1: Find recent videos sorted by rating (high engagement)
  async searchByEngagement(query: string, maxResults: number = 20): Promise<YouTubeSearchResult> {
    return this.searchVideos(query, maxResults, undefined, {
      order: 'rating',
      publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
    })
  }

  // Strategy 2: Find very recent videos to catch early viral trends
  async searchRecentVideos(query: string, maxResults: number = 20): Promise<YouTubeSearchResult> {
    return this.searchVideos(query, maxResults, undefined, {
      order: 'date',
      publishedAfter: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // Last 48 hours
    })
  }

  // Strategy 3: Search with niche/long-tail keywords
  async searchNicheContent(baseQuery: string, modifier: string, maxResults: number = 20): Promise<YouTubeSearchResult> {
    // Combine base query with modifiers like "tutorial", "explained", "for beginners"
    const nicheQuery = `${baseQuery} ${modifier}`
    return this.searchVideos(nicheQuery, maxResults, undefined, {
      order: 'relevance',
      publishedAfter: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // Last 14 days
    })
  }
}

// Export singleton instance
export const youtubeClient = new YouTubeAPIClient()