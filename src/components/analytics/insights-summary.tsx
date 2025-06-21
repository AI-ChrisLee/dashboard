"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Eye, Users, Clock, Zap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AnalyticsData {
  trending: {
    direction: 'up' | 'down'
    percentage: number
    description: string
  }
  topPerformer: {
    title: string
    channel: string
    viralScore: number
    views: number
  }
  avgEngagement: {
    current: number
    previous: number
    change: number
  }
  viralVelocity: {
    count: number
    timeframe: string
  }
}

export function InsightsSummary() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics/summary')
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Trending Direction */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viral Trend</CardTitle>
          {data?.trending.direction === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.trending.direction === 'up' ? '+' : '-'}{data?.trending.percentage}%
          </div>
          <p className="text-xs text-muted-foreground">
            {data?.trending.description || 'vs last week'}
          </p>
        </CardContent>
      </Card>

      {/* Top Performer */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
          <Zap className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.topPerformer.viralScore || 0}</div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {data?.topPerformer.title || 'No data yet'}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatNumber(data?.topPerformer.views || 0)} views
          </p>
        </CardContent>
      </Card>

      {/* Average Engagement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data?.avgEngagement.current.toFixed(2) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">
            <span className={data?.avgEngagement.change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data?.avgEngagement.change >= 0 ? '+' : ''}{data?.avgEngagement.change.toFixed(1)}%
            </span>
            {' '}from last period
          </p>
        </CardContent>
      </Card>

      {/* Viral Velocity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viral Velocity</CardTitle>
          <Clock className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.viralVelocity.count || 0}</div>
          <p className="text-xs text-muted-foreground">
            New viral videos in {data?.viralVelocity.timeframe || 'last 24h'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}