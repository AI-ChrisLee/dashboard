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
    pageToken?: string
  ): Promise<YouTubeSearchResult> {
    const response = await this.fetch<any>('/search', {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults.toString(),
      order: 'viewCount',
      publishedAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
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
      part: 'snippet,statistics',
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
      }
    }))
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
}

// Export singleton instance
export const youtubeClient = new YouTubeAPIClient()