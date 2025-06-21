"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, TrendingDown } from "lucide-react"
import { Input } from "@/components/ui/input"

interface KeywordData {
  keyword: string
  searchCount: number
  avgViralScore: number
  totalViews: number
  topVideo: {
    title: string
    score: number
  }
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6']

export function KeywordPerformance() {
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null)

  useEffect(() => {
    fetchKeywordData()
  }, [])

  const fetchKeywordData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analytics/keywords')
      if (response.ok) {
        const data = await response.json()
        setKeywords(data)
      }
    } catch (error) {
      console.error('Failed to fetch keyword data:', error)
    } finally {
      // Generate mock data for now
      const mockData: KeywordData[] = [
        {
          keyword: "vibe coding",
          searchCount: 245,
          avgViralScore: 78,
          totalViews: 2340000,
          topVideo: { title: "Coding at 3am - lofi beats", score: 92 },
          trend: 'up',
          trendPercentage: 23
        },
        {
          keyword: "productivity tips",
          searchCount: 189,
          avgViralScore: 72,
          totalViews: 1890000,
          topVideo: { title: "5 Productivity Hacks That Actually Work", score: 88 },
          trend: 'up',
          trendPercentage: 15
        },
        {
          keyword: "study with me",
          searchCount: 167,
          avgViralScore: 69,
          totalViews: 1560000,
          topVideo: { title: "4-Hour Study Session with Timer", score: 85 },
          trend: 'stable',
          trendPercentage: 2
        },
        {
          keyword: "ai tutorial",
          searchCount: 156,
          avgViralScore: 82,
          totalViews: 3200000,
          topVideo: { title: "Build Your First AI App in 10 Minutes", score: 94 },
          trend: 'up',
          trendPercentage: 45
        },
        {
          keyword: "react hooks",
          searchCount: 134,
          avgViralScore: 65,
          totalViews: 890000,
          topVideo: { title: "React Hooks Explained Simply", score: 79 },
          trend: 'down',
          trendPercentage: -8
        }
      ]
      setKeywords(mockData)
      setLoading(false)
    }
  }

  const filteredKeywords = keywords.filter(k => 
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const pieData = keywords.slice(0, 5).map(k => ({
    name: k.keyword,
    value: k.searchCount
  }))

  const radarData = keywords.slice(0, 6).map(k => ({
    keyword: k.keyword,
    viralScore: k.avgViralScore,
    engagement: Math.min(100, (k.totalViews / k.searchCount / 10000))
  }))

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Keywords Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Keywords by Search Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keyword Performance Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="keyword" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Viral Score" dataKey="viralScore" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Radar name="Engagement" dataKey="engagement" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle>Keyword Performance Details</CardTitle>
          <CardDescription>
            Track search volume, viral scores, and trending keywords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Searches</TableHead>
                <TableHead>Avg Viral Score</TableHead>
                <TableHead>Total Views</TableHead>
                <TableHead>Top Video</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.keyword} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>{keyword.searchCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={keyword.avgViralScore} className="w-[60px]" />
                      <span className="text-sm">{keyword.avgViralScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(keyword.totalViews)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm line-clamp-1">{keyword.topVideo.title}</p>
                      <Badge variant="secondary" className="mt-1">
                        Score: {keyword.topVideo.score}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {keyword.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : keyword.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-gray-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        keyword.trend === 'up' ? 'text-green-600' : 
                        keyword.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {keyword.trend === 'stable' ? '0' : 
                         keyword.trendPercentage > 0 ? '+' : ''}{keyword.trendPercentage}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}