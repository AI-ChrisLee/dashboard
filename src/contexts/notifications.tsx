"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Notification, NotificationPreferences } from '@/types/notifications'
import { toast } from 'sonner'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

const defaultPreferences: NotificationPreferences = {
  enabled: true,
  viralThreshold: 80,
  channels: [],
  keywords: [],
  frequency: 'instant',
  types: {
    viralVideo: true,
    channelMilestone: true,
    keywordTrend: true,
    system: true
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notificationPreferences')
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs))
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }

    // Set up polling for new notifications (in production, use WebSocket)
    const interval = setInterval(checkForNewNotifications, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const checkForNewNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/check')
      if (response.ok) {
        const newNotifications = await response.json()
        if (newNotifications.length > 0) {
          newNotifications.forEach((notif: Notification) => {
            addNotification(notif)
          })
        }
      }
    } catch (error) {
      console.error('Failed to check notifications:', error)
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Show toast notification if enabled
    if (preferences.enabled && preferences.types[notification.type as keyof typeof preferences.types]) {
      toast(notification.title, {
        description: notification.message,
        action: notification.data?.videoId ? {
          label: 'View',
          onClick: () => window.open(`https://youtube.com/watch?v=${notification.data.videoId}`, '_blank')
        } : undefined
      })
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferences(updated)
    localStorage.setItem('notificationPreferences', JSON.stringify(updated))
  }

  const clearNotifications = () => {
    setNotifications([])
    localStorage.removeItem('notifications')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        updatePreferences,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}