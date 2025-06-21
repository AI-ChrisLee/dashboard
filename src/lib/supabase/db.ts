import { createClient } from './server'
import type { YouTubeVideo, YouTubeChannel, ViralVideo } from '@/types/youtube'
import type { Database } from '@/types/database'

type Video = Database['public']['Tables']['videos']['Row']
type Channel = Database['public']['Tables']['channels']['Row']

export class DatabaseService {
  // Cache YouTube video data
  static async cacheVideo(video: YouTubeVideo) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('videos')
      .upsert({
        id: video.id,
        title: video.title,
        description: video.description,
        channel_id: video.channelId,
        thumbnail_url: video.thumbnail.url,
        published_at: video.publishedAt,
        view_count: video.statistics.viewCount,
        like_count: video.statistics.likeCount,
        comment_count: video.statistics.commentCount,
      })
      .select()
    
    if (error) {
      console.error('Error caching video:', error)
    }
  }
  
  // Cache YouTube channel data
  static async cacheChannel(channel: YouTubeChannel) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('channels')
      .upsert({
        id: channel.id,
        title: channel.title,
        description: channel.description,
        custom_url: channel.customUrl,
        subscriber_count: channel.statistics.subscriberCount,
        video_count: channel.statistics.videoCount,
        view_count: channel.statistics.viewCount,
        thumbnail_url: channel.thumbnail.url,
        published_at: channel.publishedAt,
      })
      .select()
    
    if (error) {
      console.error('Error caching channel:', error)
    }
  }
  
  // Cache viral score
  static async cacheViralScore(video: ViralVideo) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('viral_scores')
      .insert({
        video_id: video.id,
        channel_id: video.channel.id,
        viral_score: video.viralScore,
        engagement_rate: video.engagementRate,
        view_count: video.statistics.viewCount,
        subscriber_count: video.channel.statistics.subscriberCount,
      })
    
    if (error) {
      console.error('Error caching viral score:', error)
    }
  }
  
  // Save search history
  static async saveSearch(userId: string | null, query: string, resultsCount: number) {
    if (!userId) return
    
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('searches')
      .insert({
        user_id: userId,
        query,
        results_count: resultsCount,
      })
    
    if (error) {
      console.error('Error saving search:', error)
    }
  }
  
  // Get user's search history
  static async getUserSearchHistory(userId: string, limit = 10) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error fetching search history:', error)
      return []
    }
    
    return data || []
  }
}