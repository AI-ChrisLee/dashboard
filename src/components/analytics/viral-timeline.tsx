"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, TrendingUp, Eye, ThumbsUp, Play, Calendar } from "lucide-react"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import Image from "next/image"

interface TimelineVideo {
  id: string
  title: string
  channel: string
  thumbnail: string
  publishedAt: string
  viralMoment: string // When it went viral
  viewsAtViral: number
  currentViews: number
  viralScore: number
  growthRate: number // Views per hour during viral period
  milestones: {
    date: string
    views: number
    event: string
  }[]
}

export function ViralTimeline() {
  const [videos, setVideos] = useState<TimelineVideo[]>([])
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTimelineData()
  }, [timeRange])

  const fetchTimelineData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/timeline?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Failed to fetch timeline data:', error)
    } finally {
      // Generate mock data for now
      const mockVideos: TimelineVideo[] = [
        {
          id: "1",
          title: "I Tried Coding for 24 Hours Straight",
          channel: "Tech Experiments",
          thumbnail: "https://via.placeholder.com/320x180",
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          viralMoment: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          viewsAtViral: 10000,
          currentViews: 850000,
          viralScore: 92,
          growthRate: 15000,
          milestones: [
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), views: 5000, event: "Initial traction" },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), views: 10000, event: "Viral threshold" },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), views: 100000, event: "100K milestone" },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), views: 500000, event: "Half million views" }
          ]
        },
        {
          id: "2",
          title: "Why Everyone is Wrong About AI",
          channel: "Future Think",
          thumbnail: "https://via.placeholder.com/320x180",
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          viralMoment: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          viewsAtViral: 8000,
          currentViews: 420000,
          viralScore: 88,
          growthRate: 8500,
          milestones: [
            { date: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000).toISOString(), views: 3000, event: "Shared by influencer" },
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), views: 8000, event: "Reddit front page" },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), views: 50000, event: "50K milestone" },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), views: 200000, event: "Algorithm boost" }
          ]
        },
        {
          id: "3",
          title: "The Hidden Pattern in Every Viral Video",
          channel: "Content Science",
          thumbnail: "https://via.placeholder.com/320x180",
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          viralMoment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          viewsAtViral: 15000,
          currentViews: 280000,
          viralScore: 85,
          growthRate: 12000,
          milestones: [
            { date: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(), views: 7000, event: "Strong CTR" },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), views: 15000, event: "Viral velocity reached" },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), views: 100000, event: "100K in 24 hours" }
          ]
        }
      ]
      setVideos(mockVideos)
      setLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getViralVelocity = (video: TimelineVideo) => {
    const hoursToViral = (new Date(video.viralMoment).getTime() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60)
    return hoursToViral < 24 ? "Lightning Fast" : hoursToViral < 72 ? "Fast" : "Steady"
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline items */}
        <div className="space-y-8">
          {videos.map((video, index) => (
            <div key={video.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-primary" />
                <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-ping" />
              </div>

              {/* Content */}
              <Card className="flex-1">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={160}
                        height={90}
                        className="rounded object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Video info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.channel}</p>
                      </div>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(video.currentViews)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span>{formatNumber(video.growthRate)}/hr</span>
                        </div>
                        <Badge variant="secondary">
                          Score: {video.viralScore}
                        </Badge>
                        <Badge variant={getViralVelocity(video) === "Lightning Fast" ? "default" : "outline"}>
                          {getViralVelocity(video)}
                        </Badge>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Viral Timeline
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Published:</span>
                            <span>{formatDistanceToNow(parseISO(video.publishedAt))} ago</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Went viral:</span>
                            <span className="font-medium text-green-600">
                              {formatDistanceToNow(parseISO(video.viralMoment))} ago
                            </span>
                            <span className="text-muted-foreground">
                              ({formatNumber(video.viewsAtViral)} views)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Key Milestones</p>
                        <div className="grid grid-cols-2 gap-2">
                          {video.milestones.map((milestone, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-muted/50 rounded">
                              <Calendar className="h-3 w-3" />
                              <div>
                                <span className="font-medium">{milestone.event}</span>
                                <span className="text-muted-foreground ml-1">
                                  ({formatNumber(milestone.views)})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading timeline...</div>
        </div>
      )}
    </div>
  )
}