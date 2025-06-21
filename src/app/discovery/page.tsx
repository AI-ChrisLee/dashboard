"use client"

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, Bookmark, RefreshCw, Sparkles, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SearchFiltersV2 } from '@/components/discovery/search-filters-v2'
import { ActiveFilters } from '@/components/discovery/active-filters'
import { VideoCard } from '@/components/discovery/video-card'
import { useYouTubeSearch } from '@/hooks/use-youtube-search'
import { useSavedVideos } from '@/hooks/use-saved-videos'
import { toast } from 'sonner'
import type { SearchFilters as SearchFiltersType } from '@/types/filters'
import type { ViralVideo } from '@/types/youtube'

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('search')
  const [filters, setFilters] = useState<SearchFiltersType>({
    sortBy: 'relevance',
    sortOrder: 'desc',
    dateRange: { preset: 'last7days', from: null, to: null },
    subscriberCount: { min: null, max: null },
    viewCount: { min: null, max: null },
    duration: 'any',
    includeShorts: false  // Changed to false by default
  })
  
  const { videos, loading, error, search, loadMore, nextPageToken } = useYouTubeSearch()
  const { savedVideoIds, toggleSaveVideo, isSaved, fetchSavedVideoIds } = useSavedVideos()
  const [isSearching, setIsSearching] = useState(false)
  const [savedVideos, setSavedVideos] = useState<any[]>([])
  const [loadingSaved, setLoadingSaved] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }
    
    setIsSearching(true)
    try {
      await search(searchQuery, filters)
    } catch (err) {
      console.error('Search error:', err)
      toast.error('Failed to search videos')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Load saved videos when switching to saved tab
  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedVideos()
    }
  }, [activeTab])

  const loadSavedVideos = async () => {
    setLoadingSaved(true)
    try {
      const response = await fetch('/api/saved-videos')
      if (response.ok) {
        const data = await response.json()
        setSavedVideos(data.items || [])
      } else {
        toast.error('Failed to load saved videos')
      }
    } catch (error) {
      console.error('Error loading saved videos:', error)
      toast.error('Failed to load saved videos')
    } finally {
      setLoadingSaved(false)
    }
  }

  const mapVideoToCardProps = (video: ViralVideo) => {
    const formatDuration = (seconds?: number) => {
      if (!seconds) return '0:00'
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const formatUploadedAt = (date: string) => {
      const now = new Date()
      const uploaded = new Date(date)
      const diffMs = now.getTime() - uploaded.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
      return `${Math.floor(diffDays / 365)} years ago`
    }

    return {
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail.url,
      channel: video.channelTitle,
      views: video.statistics.viewCount,
      uploadedAt: formatUploadedAt(video.publishedAt),
      duration: formatDuration(video.duration),
      ctr: video.engagementRate ? Math.round(video.engagementRate * 100) : undefined,
      growthRate: video.multiplier > 1 ? Math.round((video.multiplier - 1) * 100) : undefined,
      viralScore: Math.round(video.viralScore),
      tags: video.viralPotential ? [video.viralPotential] : []
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            Viral Video Discovery
          </h1>
          <p className="text-lg text-muted-foreground">
            Spy on what's working. Steal the best ideas. Ship before the trend dies.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="recommend" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recommend
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Viral Opportunities
                </CardTitle>
                <CardDescription>
                  Search for videos that are blowing up right now in your niche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for viral videos, topics, or channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button onClick={handleSearch} disabled={loading || isSearching}>
                    {loading || isSearching ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                  <SearchFiltersV2 
                    onFiltersChange={setFilters} 
                    currentFilters={filters}
                  />
                </div>

                {/* Active Filters Display */}
                <ActiveFilters 
                  filters={filters}
                  onRemoveFilter={(filterType) => {
                    // Handle individual filter removal
                    const newFilters = { ...filters }
                    switch (filterType) {
                      case 'dateRange':
                        newFilters.dateRange = { preset: 'alltime', from: null, to: null }
                        break
                      case 'sortBy':
                        newFilters.sortBy = 'relevance'
                        break
                      case 'viewCount':
                        newFilters.viewCount = { min: null, max: null }
                        break
                      case 'duration':
                        newFilters.duration = 'any'
                        break
                      case 'includeShorts':
                        newFilters.includeShorts = true
                        break
                    }
                    setFilters(newFilters)
                  }}
                  onClearAll={() => {
                    // Reset to default filters
                    setFilters({
                      sortBy: 'relevance',
                      sortOrder: 'desc',
                      dateRange: { preset: 'alltime', from: null, to: null },
                      subscriberCount: { min: null, max: null },
                      viewCount: { min: null, max: null },
                      duration: 'any',
                      includeShorts: true
                    })
                  }}
                />
              </CardContent>
            </Card>

            {/* Search Results */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <p className="text-destructive text-center">{error}</p>
                </CardContent>
              </Card>
            )}

            {!searchQuery && !loading && videos.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to steal viral content?</h3>
                    <p className="text-muted-foreground">
                      Search for videos, topics, or channels to analyze
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {videos.length > 0 ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video, index) => (
                    <VideoCard
                      key={`${video.id}-${index}`}
                      video={mapVideoToCardProps(video)}
                      isSaved={isSaved(video.id)}
                      onSave={async (id) => {
                        const videoToSave = videos.find(v => v.id === id)
                        if (videoToSave) {
                          await toggleSaveVideo(videoToSave)
                        }
                      }}
                      onAnalyze={(id) => toast.info('Analysis feature coming soon')}
                    />
                  ))}
                </div>
                
                {nextPageToken && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            ) : !loading && searchQuery && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search query or filters
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recommend Tab */}
          <TabsContent value="recommend" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>
                      Videos you should steal from, based on your niche and past searches
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Recommendations Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-600">HOT</Badge>
                      <span className="text-sm font-medium">Perfect match for your channel</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This format has 92% success rate in your niche
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold">
                      "I Tried X for 30 Days" Format Template
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Gaming</Badge>
                      <Badge variant="secondary">10-15 min</Badge>
                      <Badge variant="secondary">High retention</Badge>
                    </div>
                    <div className="pt-2">
                      <Button className="w-full">
                        See Videos Using This Format
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5" />
                      Your Theft Library
                    </CardTitle>
                    <CardDescription>
                      Videos you've saved to steal from later
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={loadSavedVideos}
                    disabled={loadingSaved}
                  >
                    {loadingSaved ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {loadingSaved ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : savedVideos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedVideos.map((video, index) => (
                  <VideoCard
                    key={`saved-${video.id}-${index}`}
                    video={mapVideoToCardProps(video)}
                    isSaved={true}
                    onSave={async (id) => {
                      const videoToToggle = savedVideos.find(v => v.id === id)
                      if (videoToToggle) {
                        await toggleSaveVideo(videoToToggle)
                        // Reload saved videos
                        loadSavedVideos()
                      }
                    }}
                    onAnalyze={(id) => toast.info('Analysis feature coming soon')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No saved videos yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start saving videos you want to analyze and steal from
                </p>
                <Button variant="outline" onClick={() => setActiveTab('search')}>
                  <Search className="h-4 w-4 mr-2" />
                  Discover Videos
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}