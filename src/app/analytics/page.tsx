import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3, Clock, Users, Eye, ThumbsUp, AlertCircle } from "lucide-react"
import { InsightsSummary } from "@/components/analytics/insights-summary"
import { DemoNotificationTrigger } from "@/components/demo-notification-trigger"
import { AnalyticsTabs } from "./analytics-tabs"
import { DatabaseService } from '@/lib/supabase/db'
import { createClient } from '@/lib/supabase/server'

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

async function getAnalyticsData(): Promise<AnalyticsData> {
  const supabase = await createClient()
  
  // Get trending data
  const trendingData = {
    direction: 'up' as const,
    percentage: 15.3,
    description: 'More viral videos this week'
  }

  // Get top performer (would come from DB in production)
  const topPerformer = {
    title: "The Ultimate Productivity Setup",
    channel: "Tech Minimalist",
    viralScore: 94,
    views: 1250000
  }

  // Get average engagement
  const avgEngagement = {
    current: 5.8,
    previous: 4.2,
    change: 1.6
  }

  // Get viral velocity
  const viralVelocity = {
    count: 12,
    timeframe: "last 24h"
  }

  return {
    trending: trendingData,
    topPerformer,
    avgEngagement,
    viralVelocity
  }
}

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData()
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Track viral trends, analyze performance, and discover insights
          </p>
        </div>
        <DemoNotificationTrigger />
      </div>

      {/* Insights Summary Cards */}
      <InsightsSummary initialData={analyticsData} />

      {/* Main Analytics Tabs */}
      <AnalyticsTabs />
    </div>
  )
}