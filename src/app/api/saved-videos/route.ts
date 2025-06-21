import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/supabase/db'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get saved video IDs
    const { data: savedVideos, error } = await supabase
      .from('saved_videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved videos:', error)
      return NextResponse.json({ error: 'Failed to fetch saved videos' }, { status: 500 })
    }

    // Get video details from viral_videos table
    const videoIds = savedVideos.map(sv => sv.video_id)
    
    if (videoIds.length === 0) {
      return NextResponse.json({ items: [] })
    }

    const { data: videos, error: videosError } = await supabase
      .from('viral_videos')
      .select(`
        *,
        video:videos!inner(
          *,
          channel:channels!inner(*)
        )
      `)
      .in('video_id', videoIds)

    if (videosError) {
      console.error('Error fetching video details:', videosError)
      return NextResponse.json({ error: 'Failed to fetch video details' }, { status: 500 })
    }

    // Map to proper format
    const formattedVideos = videos.map(v => ({
      id: v.video_id,
      title: v.video.title,
      description: v.video.description,
      channelId: v.video.channel_id,
      channelTitle: v.video.channel.title,
      publishedAt: v.video.published_at,
      thumbnail: {
        url: v.video.thumbnail_url,
        width: 320,
        height: 180
      },
      statistics: {
        viewCount: v.video.view_count,
        likeCount: v.video.like_count,
        commentCount: v.video.comment_count
      },
      duration: v.video.duration,
      channel: v.video.channel,
      viralScore: v.viral_score,
      multiplier: v.multiplier,
      engagementRate: v.engagement_rate,
      savedAt: savedVideos.find(sv => sv.video_id === v.video_id)?.created_at
    }))

    return NextResponse.json({ items: formattedVideos })
  } catch (error) {
    console.error('Error in saved videos API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_videos')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Video already saved' })
    }

    // Save the video
    const { error } = await supabase
      .from('saved_videos')
      .insert({
        user_id: user.id,
        video_id: videoId
      })

    if (error) {
      console.error('Error saving video:', error)
      return NextResponse.json({ error: 'Failed to save video' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Video saved successfully' })
  } catch (error) {
    console.error('Error in save video API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('saved_videos')
      .delete()
      .eq('user_id', user.id)
      .eq('video_id', videoId)

    if (error) {
      console.error('Error removing saved video:', error)
      return NextResponse.json({ error: 'Failed to remove video' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Video removed successfully' })
  } catch (error) {
    console.error('Error in remove video API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}