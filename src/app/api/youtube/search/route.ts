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
    
    // Extract filter parameters
    const order = searchParams.get('order') as 'relevance' | 'date' | 'rating' | 'viewCount' | 'viralScore' | undefined
    const publishedAfter = searchParams.get('publishedAfter') || undefined
    const videoDuration = searchParams.get('videoDuration') as 'short' | 'medium' | 'long' | undefined
    const minSubscribers = searchParams.get('minSubscribers') ? parseInt(searchParams.get('minSubscribers')!) : undefined
    const maxSubscribers = searchParams.get('maxSubscribers') ? parseInt(searchParams.get('maxSubscribers')!) : undefined
    const minViews = searchParams.get('minViews') ? parseInt(searchParams.get('minViews')!) : undefined
    const maxViews = searchParams.get('maxViews') ? parseInt(searchParams.get('maxViews')!) : undefined

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Map 'viralScore' to 'viewCount' for YouTube API (we'll sort by viral score later)
    const youtubeOrder = order === 'viralScore' ? 'viewCount' : order

    // Search for videos
    const searchResult = await youtubeClient.searchVideos(query, maxResults, pageToken, {
      order: youtubeOrder,
      publishedAfter,
      videoDuration
    })
    
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

    // Calculate viral scores and create viral videos with breakdowns
    let viralVideos: ViralVideo[] = searchResult.items
      .map(video => {
        const channel = channelMap.get(video.channelId)
        if (!channel) return null
        
        const viralVideo = viralScoreCalculator.createViralVideo(video, channel)
        const scoreBreakdown = viralScoreCalculator.getScoreBreakdown(video, channel)
        const viralPotential = viralScoreCalculator.calculateViralPotential(video, channel)
        
        return {
          ...viralVideo,
          scoreBreakdown,
          viralPotential
        }
      })
      .filter((video): video is ViralVideo => video !== null)
    
    // Apply subscriber and view count filters
    if (minSubscribers !== undefined || maxSubscribers !== undefined || minViews !== undefined || maxViews !== undefined) {
      viralVideos = viralVideos.filter(video => {
        if (minSubscribers !== undefined && video.channel.statistics.subscriberCount < minSubscribers) return false
        if (maxSubscribers !== undefined && video.channel.statistics.subscriberCount > maxSubscribers) return false
        if (minViews !== undefined && video.statistics.viewCount < minViews) return false
        if (maxViews !== undefined && video.statistics.viewCount > maxViews) return false
        return true
      })
    }
    
    // Sort based on the order parameter
    if (order === 'viralScore' || !order) {
      viralVideos.sort((a, b) => b.viralScore - a.viralScore)
    } else if (order === 'viewCount') {
      viralVideos.sort((a, b) => b.statistics.viewCount - a.statistics.viewCount)
    } else if (order === 'date') {
      viralVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    } else if (order === 'rating') {
      viralVideos.sort((a, b) => b.engagementRate - a.engagementRate)
    }

    // Cache results in background with proper order (don't await)
    (async () => {
      try {
        // 1. First cache channels
        await Promise.all(channels.map(channel => DatabaseService.cacheChannel(channel)))
        
        // 2. Then cache videos (which depend on channels)
        await Promise.all(searchResult.items.map(video => DatabaseService.cacheVideo(video)))
        
        // 3. Finally cache viral scores (which depend on videos)
        await Promise.all(viralVideos.map(video => DatabaseService.cacheViralScore(video)))
      } catch (err) {
        console.error('Error caching data:', err)
      }
    })()

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