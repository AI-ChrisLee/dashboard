"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, TrendingUp, Users, Eye, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - will be replaced with real API data
  const mockVideos = [
    {
      id: "1",
      title: "Amazing Coding Tutorial",
      channel: "CodeMaster",
      subscribers: 1200,
      views: 45000,
      likes: 3200,
      comments: 450,
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      publishedAt: "2024-01-15",
      viralScore: 89,
    },
    {
      id: "2",
      title: "Vibe Coding Session",
      channel: "DevVibes",
      subscribers: 850,
      views: 38000,
      likes: 2800,
      comments: 320,
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      publishedAt: "2024-01-18",
      viralScore: 92,
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Viral Video Dashboard</h1>
        <p className="text-muted-foreground">
          Discover YouTube videos with high viral potential in your niche
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Videos</CardTitle>
          <CardDescription>
            Enter keywords to find videos with viral potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., vibe coding, productivity tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos Found</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVideos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Viral Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90.5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.3%</div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            Videos sorted by viral potential score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
              >
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={160}
                  height={96}
                  className="rounded object-cover"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {video.channel} • {video.subscribers.toLocaleString()} subscribers
                  </p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {video.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {video.comments}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {video.viralScore}
                  </div>
                  <p className="text-xs text-muted-foreground">Viral Score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}