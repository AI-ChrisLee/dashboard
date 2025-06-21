import { useEffect, useRef } from 'react'
import { useNotifications } from '@/contexts/notifications'
import { ViralVideo } from '@/types/youtube'

export function useViralMonitor(videos: ViralVideo[]) {
  const { addNotification, preferences } = useNotifications()
  const seenVideos = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!preferences.enabled || !preferences.types.viralVideo) return

    // Check for new viral videos
    videos.forEach(video => {
      if (
        !seenVideos.current.has(video.id) &&
        video.viralScore >= preferences.viralThreshold
      ) {
        seenVideos.current.add(video.id)

        // Check if it matches watched keywords
        const matchesKeyword = preferences.keywords.length === 0 ||
          preferences.keywords.some(keyword => 
            video.title.toLowerCase().includes(keyword.toLowerCase()) ||
            video.description.toLowerCase().includes(keyword.toLowerCase())
          )

        // Check if it matches watched channels
        const matchesChannel = preferences.channels.length === 0 ||
          preferences.channels.some(channel =>
            video.channel.title.toLowerCase().includes(channel.toLowerCase())
          )

        if (matchesKeyword && matchesChannel) {
          addNotification({
            type: 'viral_video',
            title: `Viral Video Alert! Score: ${video.viralScore}`,
            message: `"${video.title}" by ${video.channel.title} is going viral!`,
            data: {
              videoId: video.id,
              viralScore: video.viralScore,
              viewCount: video.statistics.viewCount,
              thumbnail: video.thumbnail.url
            },
            priority: video.viralScore >= 90 ? 'high' : 
                     video.viralScore >= 80 ? 'medium' : 'low'
          })
        }
      }
    })
  }, [videos, preferences, addNotification])
}