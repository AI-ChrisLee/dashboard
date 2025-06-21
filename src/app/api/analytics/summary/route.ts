import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/supabase/db'
import { createClient } from '@/lib/supabase/server'
import { setCacheHeaders, CachePresets } from '@/lib/cache-headers'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get trending data
    const trendingData = {
      direction: 'up' as const,
      percentage: 15.3,
      description: 'More viral videos this week'
    }

    // Get top performer (would come from DB in production)
    const topPerformer = {
      title: "The Ultimate Productivity Setup",
      channel: "Tech Minimalist",
      viralScore: 94,
      views: 1250000
    }

    // Get average engagement
    const avgEngagement = {
      current: 5.8,
      previous: 4.2,
      change: 1.6
    }

    // Get viral velocity
    const viralVelocity = {
      count: 12,
      timeframe: "last 24h"
    }

    const response = NextResponse.json({
      trending: trendingData,
      topPerformer,
      avgEngagement,
      viralVelocity
    })
    
    // Cache analytics data for 2 minutes
    return setCacheHeaders(response, CachePresets.shortLived)
  } catch (error) {
    console.error('Analytics summary error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics summary' },
      { status: 500 }
    )
  }
}