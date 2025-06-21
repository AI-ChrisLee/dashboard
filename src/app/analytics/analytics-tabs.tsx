"use client"

import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Lazy load heavy chart components
const ViralTrendsChart = dynamic(() => import("@/components/analytics/viral-trends-chart").then(mod => ({ default: mod.ViralTrendsChart })), {
  loading: () => <div className="h-64 bg-muted animate-pulse rounded" />,
  ssr: false
})

const KeywordPerformance = dynamic(() => import("@/components/analytics/keyword-performance").then(mod => ({ default: mod.KeywordPerformance })), {
  loading: () => <div className="h-96 bg-muted animate-pulse rounded" />,
  ssr: false
})

const ChannelGrowthTracker = dynamic(() => import("@/components/analytics/channel-growth-tracker").then(mod => ({ default: mod.ChannelGrowthTracker })), {
  loading: () => <div className="h-64 bg-muted animate-pulse rounded" />,
  ssr: false
})

const ViralTimeline = dynamic(() => import("@/components/analytics/viral-timeline").then(mod => ({ default: mod.ViralTimeline })), {
  loading: () => <div className="h-96 bg-muted animate-pulse rounded" />,
  ssr: false
})

export function AnalyticsTabs() {
  return (
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
  )
}