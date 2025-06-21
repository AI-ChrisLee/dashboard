import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DatabaseService } from '@/lib/supabase/db'
import type { Notification } from '@/types/notifications'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
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
      
      return NextResponse.json(mockNotifications)
    }
    
    return NextResponse.json([])
  } catch (error) {
    console.error('Failed to check notifications:', error)
    return NextResponse.json([], { status: 500 })
  }
}