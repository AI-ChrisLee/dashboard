"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, TrendingUp, Users, Eye, ThumbsUp, Loader2, AlertCircle, Heart, BookmarkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useYouTubeSearch } from "@/hooks/use-youtube-search"
// Lazy load components that aren't critical for initial render
const ScoreBreakdown = dynamic(() => import("@/components/score-breakdown").then(mod => ({ default: mod.ScoreBreakdown })), {
  loading: () => <div className="h-20 bg-muted animate-pulse rounded" />,
  ssr: false
})

const AdvancedFilters = dynamic(() => import("@/components/advanced-filters").then(mod => ({ default: mod.AdvancedFilters })), {
  loading: () => <div className="w-full h-96 bg-muted animate-pulse rounded-xl" />,
  ssr: false
})

const RelatedKeywords = dynamic(() => import("@/components/related-keywords").then(mod => ({ default: mod.RelatedKeywords })), {
  loading: () => null,
  ssr: false
})

import type { SearchFilters } from "@/types/filters"
import { defaultFilters } from "@/types/filters"
import { useViralMonitor } from "@/hooks/use-viral-monitor"
import { useSavedVideos } from "@/hooks/use-saved-videos"
// import { useRenderPerformance, performanceMark } from "@/components/web-vitals"

export default function DashboardPage() {
  // useRenderPerformance('DashboardPage')
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const { videos, loading, error, totalResults, search, loadMore, nextPageToken } = useYouTubeSearch()

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    // performanceMark.start('youtube-search')
    await search(searchQuery, filters)
    // performanceMark.end('youtube-search')
  }

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword)
    search(keyword, filters)
  }

  // Monitor for viral videos
  useViralMonitor(videos)

  // Saved videos functionality
  const { toggleSaveVideo, isSaved, loading: saveLoading } = useSavedVideos()
  

  // Calculate statistics
  const avgMultiplier = videos.length > 0
    ? videos.reduce((sum, v) => sum + v.multiplier, 0) / videos.length
    : 0
  
  const totalViews = videos.reduce((sum, v) => sum + v.statistics.viewCount, 0)
  const avgEngagement = videos.length > 0
    ? (videos.reduce((sum, v) => sum + v.engagementRate, 0) / videos.length).toFixed(1)
    : "0"

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Viral Video Dashboard</h1>
          <p className="text-muted-foreground">
            Discover YouTube videos with high viral potential in your niche
          </p>
        </div>
        <Link href="/saved">
          <Button variant="outline">
            <BookmarkIcon className="h-4 w-4 mr-2" />
            Saved Videos
          </Button>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Videos</CardTitle>
          <CardDescription>
            Enter keywords to find videos with viral potential from the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., vibe coding, productivity tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </form>

          {/* Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleSearch}
          />
        </CardContent>
      </Card>

      {/* Related Keywords */}
      {videos.length > 0 && (
        <RelatedKeywords
          videos={videos}
          currentQuery={searchQuery}
          onKeywordClick={handleKeywordClick}
        />
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-2 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      {videos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos Found</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{videos.length}</div>
              <p className="text-xs text-muted-foreground">
                of {formatNumber(totalResults)} total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Multiplier</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgMultiplier.toFixed(1)}x</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalViews)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEngagement}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Section */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Videos sorted by viral potential score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={`https://youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <Image
                      src={video.thumbnail.url}
                      alt={video.title}
                      width={160}
                      height={90}
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {video.channel.title} • {formatNumber(video.channel.statistics.subscriberCount)} subscribers
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatNumber(video.statistics.viewCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {formatNumber(video.statistics.likeCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {formatNumber(video.statistics.commentCount)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className={`text-2xl font-bold ${
                      video.multiplier >= 50 ? 'text-green-600' :
                      video.multiplier >= 10 ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
                      {video.multiplier >= 1000 ? `${(video.multiplier / 1000).toFixed(1)}K` : video.multiplier.toFixed(1)}x
                    </div>
                    <p className="text-xs text-muted-foreground">Multiplier</p>
                    <p className="text-xs text-muted-foreground">
                      {video.engagementRate.toFixed(2)}% engagement
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant={isSaved(video.id) ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleSaveVideo(video)
                          }}
                          disabled={saveLoading}
                          className="flex-1"
                        >
                          <Heart className={`h-3 w-3 mr-1 ${isSaved(video.id) ? 'fill-current' : ''}`} />
                          {isSaved(video.id) ? 'Saved' : 'Save'}
                        </Button>
                      </div>
                      <ScoreBreakdown video={video} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Load More Button */}
            {nextPageToken && (
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={loadMore} 
                  disabled={loading}
                  variant="outline"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No videos found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Start by searching for keywords to discover videos with viral potential
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  )
}