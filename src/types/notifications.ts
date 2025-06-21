export interface Notification {
  id: string
  type: 'viral_video' | 'channel_milestone' | 'keyword_trend' | 'system'
  title: string
  message: string
  data?: {
    videoId?: string
    channelId?: string
    keyword?: string
    viralScore?: number
    viewCount?: number
    thumbnail?: string
  }
  read: boolean
  createdAt: string
  priority: 'high' | 'medium' | 'low'
}

export interface NotificationPreferences {
  enabled: boolean
  viralThreshold: number // Minimum viral score to trigger notification
  channels: string[] // Specific channels to watch
  keywords: string[] // Keywords to monitor
  frequency: 'instant' | 'hourly' | 'daily'
  types: {
    viralVideo: boolean
    channelMilestone: boolean
    keywordTrend: boolean
    system: boolean
  }
}