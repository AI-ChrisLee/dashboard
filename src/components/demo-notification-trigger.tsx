"use client"

import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/notifications"
import { Bell } from "lucide-react"

export function DemoNotificationTrigger() {
  const { addNotification } = useNotifications()

  const triggerDemoNotifications = () => {
    // Viral Video Notification
    setTimeout(() => {
      addNotification({
        type: 'viral_video',
        title: 'New Viral Video!',
        message: 'How I Built an AI That Codes Better Than Me just hit 95 viral score!',
        data: {
          videoId: 'abc123',
          viralScore: 95,
          viewCount: 850000,
          thumbnail: 'https://via.placeholder.com/120x68'
        },
        priority: 'high'
      })
    }, 1000)

    // Channel Milestone
    setTimeout(() => {
      addNotification({
        type: 'channel_milestone',
        title: 'Channel Milestone',
        message: 'Tech Explained just reached 100K subscribers!',
        data: {
          channelId: 'channel123'
        },
        priority: 'medium'
      })
    }, 3000)

    // Keyword Trend
    setTimeout(() => {
      addNotification({
        type: 'keyword_trend',
        title: 'Trending Keyword',
        message: '"AI Coding" is trending with 45% more viral videos this week',
        data: {
          keyword: 'AI Coding'
        },
        priority: 'low'
      })
    }, 5000)
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={triggerDemoNotifications}
      className="gap-2"
    >
      <Bell className="h-4 w-4" />
      Demo Notifications
    </Button>
  )
}