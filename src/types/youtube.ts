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
  duration?: number // duration in seconds
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
  multiplier: number // views / subscribers ratio
  engagementRate: number
  scoreBreakdown?: {
    subscriberImpact: number
    viewVelocity: number
    engagementScore: number
    freshnessBonus: number
    explanation: {
      subscriberRatio: string
      viewsPerDay: string
      engagementRate: string
      ageInDays: number
    }
  }
  viralPotential?: string
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