import { YouTubeVideo, YouTubeChannel, ViralVideo } from '@/types/youtube'

export interface ScoreBreakdown {
  subscriberImpact: number
  viewVelocity: number
  engagementScore: number
  freshnessBonus: number
  totalScore: number
  explanation: {
    subscriberRatio: string
    viewsPerDay: string
    engagementRate: string
    ageInDays: number
  }
}

export class ViralScoreCalculator {
  // Core principle: Views relative to subscriber base shows true virality
  calculateViralScore(video: YouTubeVideo, channel: YouTubeChannel): number {
    const breakdown = this.getScoreBreakdown(video, channel)
    return breakdown.totalScore
  }

  getScoreBreakdown(video: YouTubeVideo, channel: YouTubeChannel): ScoreBreakdown {
    const daysSincePublished = this.getDaysSincePublished(video.publishedAt)
    
    // Skip videos older than 30 days
    if (daysSincePublished > 30) {
      return {
        subscriberImpact: 0,
        viewVelocity: 0,
        engagementScore: 0,
        freshnessBonus: 0,
        totalScore: 0,
        explanation: {
          subscriberRatio: 'Video too old (>30 days)',
          viewsPerDay: '0',
          engagementRate: '0%',
          ageInDays: daysSincePublished
        }
      }
    }

    // 1. Subscriber Impact Score (40% weight)
    // This is the KEY metric - views relative to subscriber base
    const subscriberImpact = this.calculateSubscriberImpact(
      video.statistics.viewCount,
      channel.statistics.subscriberCount
    )

    // 2. View Velocity Score (30% weight)
    // How fast the video is gaining views
    const viewVelocity = this.calculateViewVelocity(
      video.statistics.viewCount,
      daysSincePublished
    )

    // 3. Engagement Score (20% weight)
    // Quality of engagement relative to views
    const engagementScore = this.calculateEngagementScore(video)

    // 4. Freshness Bonus (10% weight)
    // Newer videos get a slight boost
    const freshnessBonus = this.calculateFreshnessBonus(daysSincePublished)

    // Calculate weighted total
    const totalScore = Math.round(
      subscriberImpact * 0.4 +
      viewVelocity * 0.3 +
      engagementScore * 0.2 +
      freshnessBonus * 0.1
    )

    // Create explanation
    const viewsPerSub = channel.statistics.subscriberCount > 0 
      ? (video.statistics.viewCount / channel.statistics.subscriberCount).toFixed(2)
      : 'N/A'
    
    const viewsPerDay = (video.statistics.viewCount / Math.max(1, daysSincePublished)).toFixed(0)
    const engagementRate = this.getEngagementRate(video).toFixed(2)

    return {
      subscriberImpact,
      viewVelocity,
      engagementScore,
      freshnessBonus,
      totalScore,
      explanation: {
        subscriberRatio: `${viewsPerSub}x subscriber count`,
        viewsPerDay: `${viewsPerDay} views/day`,
        engagementRate: `${engagementRate}%`,
        ageInDays: daysSincePublished
      }
    }
  }

  private calculateSubscriberImpact(viewCount: number, subscriberCount: number): number {
    // Handle edge cases
    if (viewCount === 0) return 0
    if (subscriberCount === 0) subscriberCount = 1 // Treat 0 as 1 to avoid division issues
    
    // Calculate views-to-subscriber ratio
    const ratio = viewCount / subscriberCount
    
    // Scoring based on ratio (higher ratio = more viral)
    if (ratio >= 100) return 100      // 100x subscribers = perfect score
    if (ratio >= 50) return 95        // 50x subscribers = amazing
    if (ratio >= 20) return 90        // 20x subscribers = excellent
    if (ratio >= 10) return 85        // 10x subscribers = very good
    if (ratio >= 5) return 75         // 5x subscribers = good
    if (ratio >= 2) return 60         // 2x subscribers = decent
    if (ratio >= 1) return 40         // 1x subscribers = average
    if (ratio >= 0.5) return 20       // 0.5x subscribers = below average
    return 10                          // Less than 0.5x = poor
  }

  private calculateViewVelocity(viewCount: number, daysSincePublished: number): number {
    const viewsPerDay = viewCount / Math.max(1, daysSincePublished)
    
    // Adjusted for realistic viral thresholds
    if (viewsPerDay >= 100000) return 100  // 100K+ views/day = mega viral
    if (viewsPerDay >= 50000) return 95    // 50K+ views/day = super viral
    if (viewsPerDay >= 20000) return 90    // 20K+ views/day = very viral
    if (viewsPerDay >= 10000) return 80    // 10K+ views/day = viral
    if (viewsPerDay >= 5000) return 70     // 5K+ views/day = trending
    if (viewsPerDay >= 2000) return 60     // 2K+ views/day = good momentum
    if (viewsPerDay >= 1000) return 50     // 1K+ views/day = decent
    if (viewsPerDay >= 500) return 40      // 500+ views/day = moderate
    if (viewsPerDay >= 100) return 30      // 100+ views/day = slow growth
    return 20                               // Less = minimal traction
  }

  private calculateEngagementScore(video: YouTubeVideo): number {
    const { viewCount, likeCount, commentCount } = video.statistics
    
    if (viewCount === 0) return 0
    
    // Calculate engagement rate
    const engagementRate = ((likeCount + commentCount) / viewCount) * 100
    
    // Scoring based on engagement rate
    if (engagementRate >= 15) return 100   // 15%+ = exceptional
    if (engagementRate >= 10) return 90    // 10%+ = excellent
    if (engagementRate >= 7) return 80     // 7%+ = very good
    if (engagementRate >= 5) return 70     // 5%+ = good
    if (engagementRate >= 3) return 60     // 3%+ = above average
    if (engagementRate >= 2) return 50     // 2%+ = average
    if (engagementRate >= 1) return 40     // 1%+ = below average
    if (engagementRate >= 0.5) return 30   // 0.5%+ = poor
    return 20                               // Less = very poor
  }

  private calculateFreshnessBonus(daysSincePublished: number): number {
    // Linear decay from 100 to 0 over 30 days
    if (daysSincePublished <= 1) return 100
    if (daysSincePublished >= 30) return 0
    
    return Math.round(100 * (1 - (daysSincePublished / 30)))
  }

  private getDaysSincePublished(publishedAt: string): number {
    const publishDate = new Date(publishedAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - publishDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  getEngagementRate(video: YouTubeVideo): number {
    const { viewCount, likeCount, commentCount } = video.statistics
    if (viewCount === 0) return 0
    return ((likeCount + commentCount) / viewCount) * 100
  }

  createViralVideo(video: YouTubeVideo, channel: YouTubeChannel): ViralVideo {
    const viralScore = this.calculateViralScore(video, channel)
    const engagementRate = this.getEngagementRate(video)
    const multiplier = channel.statistics.subscriberCount > 0 
      ? video.statistics.viewCount / channel.statistics.subscriberCount
      : 0
    
    return {
      ...video,
      channel,
      viralScore,
      multiplier,
      engagementRate
    }
  }

  // Additional methods to find potentially viral videos
  
  /**
   * Identifies videos that are overperforming relative to channel size
   */
  isOverperforming(video: YouTubeVideo, channel: YouTubeChannel): boolean {
    const viewToSubRatio = video.statistics.viewCount / Math.max(1, channel.statistics.subscriberCount)
    return viewToSubRatio > 5 // Video has 5x more views than channel has subscribers
  }

  /**
   * Calculates viral potential based on early performance indicators
   */
  calculateViralPotential(video: YouTubeVideo, channel: YouTubeChannel): string {
    const daysSincePublished = this.getDaysSincePublished(video.publishedAt)
    const viewToSubRatio = video.statistics.viewCount / Math.max(1, channel.statistics.subscriberCount)
    const engagementRate = this.getEngagementRate(video)
    
    // Early viral indicators
    if (daysSincePublished <= 2 && viewToSubRatio > 2 && engagementRate > 5) {
      return 'High - Strong early performance'
    }
    if (daysSincePublished <= 7 && viewToSubRatio > 5) {
      return 'High - Exceeding channel average'
    }
    if (viewToSubRatio > 10) {
      return 'Very High - Massive overperformance'
    }
    if (engagementRate > 10 && viewToSubRatio > 1) {
      return 'Medium - High engagement driving growth'
    }
    
    return 'Low - Normal performance'
  }
}

export const viralScoreCalculator = new ViralScoreCalculator()