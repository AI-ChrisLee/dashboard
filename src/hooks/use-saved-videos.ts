import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth'
import { createClient } from '@/lib/supabase/client'
import { ViralVideo } from '@/types/youtube'
import { toast } from 'sonner'

export function useSavedVideos() {
  const { user } = useAuth()
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchSavedVideoIds()
    }
  }, [user])

  const fetchSavedVideoIds = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('saved_videos')
        .select('video_id')
        .eq('user_id', user.id)

      if (error) throw error
      
      const ids = new Set(data.map(item => item.video_id))
      setSavedVideoIds(ids)
    } catch (error) {
      console.error('Error fetching saved video IDs:', error)
    }
  }

  const saveVideo = async (video: ViralVideo) => {
    if (!user) {
      toast.error('Please sign in to save videos')
      return false
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('saved_videos')
        .insert({
          user_id: user.id,
          video_id: video.id,
          title: video.title,
          channel_title: video.channel.title,
          thumbnail_url: video.thumbnail.url,
          viral_score: video.viralScore,
          view_count: video.statistics.viewCount
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Video already saved')
          return false
        }
        throw error
      }

      setSavedVideoIds(prev => new Set([...prev, video.id]))
      toast.success('Video saved!')
      return true
    } catch (error) {
      console.error('Error saving video:', error)
      toast.error('Failed to save video')
      return false
    } finally {
      setLoading(false)
    }
  }

  const unsaveVideo = async (videoId: string) => {
    if (!user) return false

    setLoading(true)
    try {
      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .eq('user_id', user.id)
        .eq('video_id', videoId)

      if (error) throw error

      setSavedVideoIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(videoId)
        return newSet
      })
      toast.success('Video removed from saved')
      return true
    } catch (error) {
      console.error('Error removing video:', error)
      toast.error('Failed to remove video')
      return false
    } finally {
      setLoading(false)
    }
  }

  const toggleSaveVideo = async (video: ViralVideo) => {
    if (savedVideoIds.has(video.id)) {
      return await unsaveVideo(video.id)
    } else {
      return await saveVideo(video)
    }
  }

  const isSaved = (videoId: string) => savedVideoIds.has(videoId)

  return {
    savedVideoIds,
    loading,
    saveVideo,
    unsaveVideo,
    toggleSaveVideo,
    isSaved,
    fetchSavedVideoIds
  }
}