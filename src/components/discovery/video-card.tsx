"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  MousePointer, 
  Bookmark, 
  BookmarkCheck,
  Play,
  MoreVertical,
  Copy,
  ExternalLink,
  BarChart
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'

interface VideoCardProps {
  video: {
    id: string
    title: string
    thumbnail: string
    channel: string
    channelAvatar?: string
    views: number
    uploadedAt: string
    duration: string
    ctr?: number
    growthRate?: number
    viralScore?: number
    tags?: string[]
  }
  isSaved?: boolean
  onSave?: (videoId: string) => void
  onAnalyze?: (videoId: string) => void
}

export function VideoCard({ video, isSaved: initialIsSaved = false, onSave, onAnalyze }: VideoCardProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsSaved(initialIsSaved)
  }, [initialIsSaved])

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(video.id)
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`
    }
    return views.toString()
  }

  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration to readable format
    return duration
  }

  const getViralScoreColor = (score?: number) => {
    if (!score) return 'secondary'
    if (score >= 90) return 'destructive'
    if (score >= 70) return 'default'
    return 'secondary'
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-muted">
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Video thumbnail</p>
            </div>
          </div>
        ) : (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          {video.duration}
        </div>

        {/* Viral Score Badge */}
        {video.viralScore && (
          <div className="absolute top-2 left-2">
            <Badge variant={getViralScoreColor(video.viralScore)} className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {video.viralScore}% Viral
            </Badge>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSave()
                    }}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSaved ? 'Remove from library' : 'Save to library'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
            {video.title}
          </h3>

          {/* Channel Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {video.channelAvatar && (
                <div className="w-6 h-6 rounded-full bg-muted" />
              )}
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {video.channel}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAnalyze?.(video.id)}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Analyze Video
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Title Format
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in YouTube
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSave}>
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Remove from Library
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save to Library
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{formatViews(video.views)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{video.uploadedAt}</span>
            </div>
          </div>

          {/* Performance Badges */}
          <div className="flex flex-wrap gap-2">
            {video.growthRate && video.growthRate > 100 && (
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{video.growthRate}%
              </Badge>
            )}
            {video.ctr && (
              <Badge variant="outline" className="text-xs">
                <MousePointer className="h-3 w-3 mr-1" />
                CTR: {video.ctr}%
              </Badge>
            )}
          </div>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}