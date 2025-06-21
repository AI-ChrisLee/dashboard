import { YouTubeVideo, YouTubeChannel, ViralVideo } from '@/types/youtube'

export class ViralScoreCalculator {
  // Weights for different factors
  private readonly SUBSCRIBER_WEIGHT = 0.4
  private readonly VIEW_WEIGHT = 0.3
  private readonly ENGAGEMENT_WEIGHT = 0.3

  calculateViralScore(video: YouTubeVideo, channel: YouTubeChannel): number {
    // Calculate days since published
    const daysSincePublished = this.getDaysSincePublished(video.publishedAt)
    
    // Skip videos older than 30 days
    if (daysSincePublished > 30) {
      return 0
    }

    // Calculate individual scores
    const subscriberScore = this.calculateSubscriberScore(channel.statistics.subscriberCount)
    const viewScore = this.calculateViewScore(video.statistics.viewCount, daysSincePublished)
    const engagementScore = this.calculateEngagementScore(video)

    // Calculate weighted score (0-100)
    const rawScore = (
      subscriberScore * this.SUBSCRIBER_WEIGHT +
      viewScore * this.VIEW_WEIGHT +
      engagementScore * this.ENGAGEMENT_WEIGHT
    )

    // Apply time decay factor (newer videos get a slight boost)
    const timeDecayFactor = 1 + (0.2 * (1 - daysSincePublished / 30))
    
    return Math.min(100, Math.round(rawScore * timeDecayFactor))
  }

  private getDaysSincePublished(publishedAt: string): number {
    const publishDate = new Date(publishedAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - publishDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  private calculateSubscriberScore(subscriberCount: number): number {
    // Lower subscriber count = higher score
    // Score calculation: inverse logarithmic scale
    if (subscriberCount <= 0) return 0
    
    if (subscriberCount < 1000) return 100
    if (subscriberCount < 10000) return 90
    if (subscriberCount < 50000) return 80
    if (subscriberCount < 100000) return 70
    if (subscriberCount < 500000) return 50
    if (subscriberCount < 1000000) return 30
    return 10
  }

  private calculateViewScore(viewCount: number, daysSincePublished: number): number {
    // Calculate views per day
    const viewsPerDay = viewCount / Math.max(1, daysSincePublished)
    
    // Score based on views per day
    if (viewsPerDay >= 50000) return 100
    if (viewsPerDay >= 20000) return 90
    if (viewsPerDay >= 10000) return 80
    if (viewsPerDay >= 5000) return 70
    if (viewsPerDay >= 2000) return 60
    if (viewsPerDay >= 1000) return 50
    if (viewsPerDay >= 500) return 40
    if (viewsPerDay >= 100) return 30
    return 20
  }

  private calculateEngagementScore(video: YouTubeVideo): number {
    const { viewCount, likeCount, commentCount } = video.statistics
    
    if (viewCount === 0) return 0
    
    // Calculate engagement rate
    const engagementRate = ((likeCount + commentCount) / viewCount) * 100
    
    // Score based on engagement rate
    if (engagementRate >= 10) return 100
    if (engagementRate >= 7) return 90
    if (engagementRate >= 5) return 80
    if (engagementRate >= 3) return 70
    if (engagementRate >= 2) return 60
    if (engagementRate >= 1) return 50
    if (engagementRate >= 0.5) return 40
    return 30
  }

  getEngagementRate(video: YouTubeVideo): number {
    const { viewCount, likeCount, commentCount } = video.statistics
    if (viewCount === 0) return 0
    return ((likeCount + commentCount) / viewCount) * 100
  }

  createViralVideo(video: YouTubeVideo, channel: YouTubeChannel): ViralVideo {
    const viralScore = this.calculateViralScore(video, channel)
    const engagementRate = this.getEngagementRate(video)
    
    return {
      ...video,
      channel,
      viralScore,
      engagementRate
    }
  }
}

export const viralScoreCalculator = new ViralScoreCalculator()