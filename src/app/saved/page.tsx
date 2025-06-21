"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Heart, Eye, ThumbsUp, Users, Trash2, ExternalLink, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"

interface SavedVideo {
  id: string
  video_id: string
  title: string
  channel_title: string
  thumbnail_url: string
  viral_score: number
  view_count: number
  saved_at: string
}

export default function SavedVideosPage() {
  const { user, loading: authLoading } = useAuth()
  const [videos, setVideos] = useState<SavedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("saved_at")
  const [filterBy, setFilterBy] = useState("all")

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchSavedVideos()
    }
  }, [user])

  const fetchSavedVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_videos')
        .select('*')
        .eq('user_id', user?.id)
        .order('saved_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching saved videos:', error)
      toast.error('Failed to load saved videos')
    } finally {
      setLoading(false)
    }
  }

  const removeSavedVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('saved_videos')
        .delete()
        .eq('user_id', user?.id)
        .eq('video_id', videoId)

      if (error) throw error
      
      setVideos(prev => prev.filter(v => v.video_id !== videoId))
      toast.success('Video removed from saved')
    } catch (error) {
      console.error('Error removing video:', error)
      toast.error('Failed to remove video')
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const filteredAndSortedVideos = videos
    .filter(video => {
      if (searchTerm) {
        return video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               video.channel_title.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return true
    })
    .filter(video => {
      if (filterBy === 'high-viral') return video.viral_score >= 80
      if (filterBy === 'medium-viral') return video.viral_score >= 60 && video.viral_score < 80
      if (filterBy === 'trending') return video.viral_score < 60
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'saved_at') return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime()
      if (sortBy === 'viral_score') return b.viral_score - a.viral_score
      if (sortBy === 'view_count') return b.view_count - a.view_count
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card>
          <CardContent className="p-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground">
              Please sign in to view your saved videos
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved Videos</h1>
        <p className="text-muted-foreground">
          Your collection of viral videos ({videos.length} videos)
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search saved videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Videos</SelectItem>
                  <SelectItem value="high-viral">High Viral (80+)</SelectItem>
                  <SelectItem value="medium-viral">Medium Viral (60-79)</SelectItem>
                  <SelectItem value="trending">Trending (&lt;60)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saved_at">Recently Saved</SelectItem>
                  <SelectItem value="viral_score">Viral Score</SelectItem>
                  <SelectItem value="view_count">View Count</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      {filteredAndSortedVideos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || filterBy !== 'all' ? 'No videos found' : 'No saved videos yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start saving videos from your search results to build your collection'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative">
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  width={320}
                  height={180}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={video.viral_score >= 80 ? "default" : 
                                video.viral_score >= 60 ? "secondary" : "outline"}>
                    Score: {video.viral_score}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {video.channel_title}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatNumber(video.view_count)}
                  </span>
                  <span>
                    Saved {new Date(video.saved_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`https://youtube.com/watch?v=${video.video_id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSavedVideo(video.video_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}