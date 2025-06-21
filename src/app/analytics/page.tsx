"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, BarChart3, Clock, Users, Eye, ThumbsUp, AlertCircle } from "lucide-react"
import { ViralTrendsChart } from "@/components/analytics/viral-trends-chart"
import { KeywordPerformance } from "@/components/analytics/keyword-performance"
import { ChannelGrowthTracker } from "@/components/analytics/channel-growth-tracker"
import { ViralTimeline } from "@/components/analytics/viral-timeline"
import { InsightsSummary } from "@/components/analytics/insights-summary"
import { DemoNotificationTrigger } from "@/components/demo-notification-trigger"

export default function AnalyticsPage() {
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
      <InsightsSummary />

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Viral Trends</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Viral Score Trends</CardTitle>
              <CardDescription>
                Track how viral scores change over time across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ViralTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Performance</CardTitle>
              <CardDescription>
                Analyze which keywords generate the most viral content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordPerformance />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Channel Growth Tracking</CardTitle>
              <CardDescription>
                Monitor channel growth and viral performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChannelGrowthTracker />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Viral Video Timeline</CardTitle>
              <CardDescription>
                Visualize when videos go viral and track their trajectory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ViralTimeline />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}