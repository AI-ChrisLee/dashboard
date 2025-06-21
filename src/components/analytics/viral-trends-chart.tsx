"use client"

import { useState, useEffect } from "react"
import {
  Line,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { format, subDays } from "date-fns"

interface TrendData {
  date: string
  avgViralScore: number
  totalVideos: number
  topScore: number
  viewsToSubRatio: number
}

export function ViralTrendsChart() {
  const [data, setData] = useState<TrendData[]>([])
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendData()
  }, [timeRange])

  const fetchTrendData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/trends?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Failed to fetch trend data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Generate mock data for now
  useEffect(() => {
    const mockData: TrendData[] = []
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      mockData.push({
        date: format(date, 'MMM dd'),
        avgViralScore: Math.floor(Math.random() * 30) + 60,
        totalVideos: Math.floor(Math.random() * 50) + 20,
        topScore: Math.floor(Math.random() * 20) + 80,
        viewsToSubRatio: Math.floor(Math.random() * 100) + 50
      })
    }
    setData(mockData)
    setLoading(false)
  }, [timeRange])

  const exportData = () => {
    const csv = [
      ['Date', 'Avg Viral Score', 'Total Videos', 'Top Score', 'Views/Sub Ratio'],
      ...data.map(row => [
        row.date,
        row.avgViralScore,
        row.totalVideos,
        row.topScore,
        row.viewsToSubRatio
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `viral-trends-${timeRange}.csv`
    a.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading chart data...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Trend Chart */}
          <div>
            <h4 className="text-sm font-medium mb-4">Viral Score Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="avgViralScore"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Average Score"
                />
                <Area
                  type="monotone"
                  dataKey="topScore"
                  stackId="2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                  name="Top Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Video Count and Ratio Chart */}
          <div>
            <h4 className="text-sm font-medium mb-4">Volume & Performance</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="totalVideos"
                  fill="#3b82f6"
                  name="Total Videos"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="viewsToSubRatio"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Views/Sub Ratio"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}