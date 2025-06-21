import { NextRequest, NextResponse } from 'next/server'
import { youtubeClient } from '@/lib/youtube/client'
import { viralScoreCalculator } from '@/lib/youtube/scoring'
import { rateLimiter } from '@/lib/youtube/rate-limiter'
import { DatabaseService } from '@/lib/supabase/db'
import { createClient } from '@/lib/supabase/server'
import { ViralVideo } from '@/types/youtube'

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'anonymous'
    
    // Check rate limit
    const canProceed = await rateLimiter.checkLimit(clientIp)
    if (!canProceed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          remainingRequests: rateLimiter.getRemainingRequests(clientIp),
          resetTime: rateLimiter.getResetTime(clientIp)
        },
        { status: 429 }
      )
    }
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const pageToken = searchParams.get('pageToken') || undefined
    const maxResults = parseInt(searchParams.get('maxResults') || '20')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Search for videos
    const searchResult = await youtubeClient.searchVideos(query, maxResults, pageToken)
    
    if (searchResult.items.length === 0) {
      return NextResponse.json({
        items: [],
        nextPageToken: searchResult.nextPageToken,
        totalResults: 0
      })
    }

    // Get unique channel IDs
    const channelIds = [...new Set(searchResult.items.map(video => video.channelId))]
    
    // Fetch channel information
    const channels = await youtubeClient.getChannels(channelIds)
    const channelMap = new Map(channels.map(channel => [channel.id, channel]))

    // Calculate viral scores and create viral videos
    const viralVideos: ViralVideo[] = searchResult.items
      .map(video => {
        const channel = channelMap.get(video.channelId)
        if (!channel) return null
        return viralScoreCalculator.createViralVideo(video, channel)
      })
      .filter((video): video is ViralVideo => video !== null)
      .sort((a, b) => b.viralScore - a.viralScore)

    // Cache results in background (don't await)
    Promise.all([
      // Cache channels
      ...channels.map(channel => DatabaseService.cacheChannel(channel)),
      // Cache videos
      ...searchResult.items.map(video => DatabaseService.cacheVideo(video)),
      // Cache viral scores
      ...viralVideos.map(video => DatabaseService.cacheViralScore(video))
    ]).catch(err => console.error('Error caching data:', err))

    // Save search history for authenticated users
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      DatabaseService.saveSearch(user.id, query, viralVideos.length)
        .catch(err => console.error('Error saving search:', err))
    }

    return NextResponse.json({
      items: viralVideos,
      nextPageToken: searchResult.nextPageToken,
      totalResults: searchResult.totalResults
    })
  } catch (error) {
    console.error('YouTube search error:', error)
    return NextResponse.json(
      { error: 'Failed to search videos' },
      { status: 500 }
    )
  }
}