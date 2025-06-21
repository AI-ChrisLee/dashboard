"use client"

import { useState } from "react"
import { Bell, Settings, Trash2, Check, TrendingUp, Users, Hash, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { useNotifications } from "@/contexts/notifications"
import { NotificationPreferences } from "@/components/notification-preferences"
import Image from "next/image"

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useNotifications()
  const [open, setOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case 'viral_video':
        return <TrendingUp className="h-4 w-4" />
      case 'channel_milestone':
        return <Users className="h-4 w-4" />
      case 'keyword_trend':
        return <Hash className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    }
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    
    if (notification.data?.videoId) {
      window.open(`https://youtube.com/watch?v=${notification.data.videoId}`, '_blank')
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Stay updated with viral videos and trends
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-[500px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet. We'll notify you when videos go viral!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        notification.read ? 'bg-muted/30' : 'bg-background hover:bg-muted/50'
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{notification.title}</p>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          {notification.data && (
                            <div className="flex items-center gap-4 mt-2">
                              {notification.data.thumbnail && (
                                <Image
                                  src={notification.data.thumbnail}
                                  alt=""
                                  width={80}
                                  height={45}
                                  className="rounded object-cover"
                                />
                              )}
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                {notification.data.viralScore && (
                                  <span>Score: {notification.data.viralScore}</span>
                                )}
                                {notification.data.viewCount && (
                                  <span>{(notification.data.viewCount / 1000).toFixed(0)}K views</span>
                                )}
                              </div>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}