export interface YouTubeVideo {
  id: string
  title: string
  description: string
  channelId: string
  channelTitle: string
  publishedAt: string
  thumbnail: {
    url: string
    width: number
    height: number
  }
  statistics: {
    viewCount: number
    likeCount: number
    commentCount: number
  }
}

export interface YouTubeChannel {
  id: string
  title: string
  description: string
  customUrl?: string
  publishedAt: string
  thumbnail: {
    url: string
    width: number
    height: number
  }
  statistics: {
    viewCount: number
    subscriberCount: number
    videoCount: number
  }
}

export interface YouTubeSearchResult {
  items: YouTubeVideo[]
  nextPageToken?: string
  totalResults: number
}

export interface ViralVideo extends YouTubeVideo {
  channel: YouTubeChannel
  viralScore: number
  engagementRate: number
}

export interface YouTubeApiError {
  error: {
    code: number
    message: string
    errors: Array<{
      message: string
      domain: string
      reason: string
    }>
  }
}