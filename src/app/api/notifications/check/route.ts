import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/supabase/db'
import type { Notification } from '@/types/notifications'
import { setCacheHeaders, CachePresets } from '@/lib/cache-headers'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // TEMPORARILY DISABLED: Viral video notifications are turned off
    // Uncomment the code below when ready to re-enable the notification system
    /*
    // For demo purposes, occasionally return a mock notification
    // In production, this would check real viral videos from the database
    const shouldSendNotification = Math.random() < 0.1 // 10% chance
    
    if (shouldSendNotification) {
      const mockNotifications: Omit<Notification, 'id' | 'createdAt' | 'read'>[] = [
        {
          type: 'viral_video',
          title: 'New Viral Video Detected!',
          message: 'A video about "AI Coding" just went viral with a score of 92',
          data: {
            videoId: 'dQw4w9WgXcQ',
            viralScore: 92,
            viewCount: 125000,
            thumbnail: 'https://via.placeholder.com/120x68'
          },
          priority: 'high'
        }
      ]
      
      const response = NextResponse.json(mockNotifications)
      // Don't cache notifications - they should be real-time
      return setCacheHeaders(response, CachePresets.noCache)
    }
    */
    
    // Always return empty array while notifications are disabled
    const response = NextResponse.json([])
    // Don't cache empty notifications response
    return setCacheHeaders(response, CachePresets.noCache)
  } catch (error) {
    console.error('Failed to check notifications:', error)
    return NextResponse.json([], { status: 500 })
  }
}