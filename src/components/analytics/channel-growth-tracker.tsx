"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, TrendingUp, Users, Eye } from "lucide-react"
import { format, subDays } from "date-fns"

interface ChannelData {
  id: string
  name: string
  thumbnail: string
  subscribers: number
  totalViews: number
  avgViralScore: number
  videoCount: number
  growth: {
    subscribers: number
    views: number
    viralScore: number
  }
  history: {
    date: string
    subscribers: number
    views: number
    viralScore: number
  }[]
}

export function ChannelGrowthTracker() {
  const [channels, setChannels] = useState<ChannelData[]>([])
  const [selectedChannel, setSelectedChannel] = useState<ChannelData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChannelData()
  }, [])

  const fetchChannelData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/analytics/channels')
      if (response.ok) {
        const data = await response.json()
        setChannels(data)
      }
    } catch (error) {
      console.error('Failed to fetch channel data:', error)
    } finally {
      // Generate mock data for now
      const mockChannels: ChannelData[] = [
        {
          id: "1",
          name: "Tech Explained",
          thumbnail: "https://via.placeholder.com/48",
          subscribers: 1200,
          totalViews: 450000,
          avgViralScore: 82,
          videoCount: 24,
          growth: {
            subscribers: 15.2,
            views: 28.5,
            viralScore: 5.3
          },
          history: generateHistory()
        },
        {
          id: "2",
          name: "Coding Dreams",
          thumbnail: "https://via.placeholder.com/48",
          subscribers: 850,
          totalViews: 320000,
          avgViralScore: 78,
          videoCount: 18,
          growth: {
            subscribers: 22.1,
            views: 35.2,
            viralScore: 8.7
          },
          history: generateHistory()
        },
        {
          id: "3",
          name: "Study Corner",
          thumbnail: "https://via.placeholder.com/48",
          subscribers: 2100,
          totalViews: 890000,
          avgViralScore: 75,
          videoCount: 42,
          growth: {
            subscribers: 8.5,
            views: 12.3,
            viralScore: -2.1
          },
          history: generateHistory()
        }
      ]
      setChannels(mockChannels)
      setSelectedChannel(mockChannels[0])
      setLoading(false)
    }
  }

  function generateHistory() {
    const history = []
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i)
      history.push({
        date: format(date, 'MMM dd'),
        subscribers: Math.floor(Math.random() * 500) + 500,
        views: Math.floor(Math.random() * 50000) + 100000,
        viralScore: Math.floor(Math.random() * 20) + 70
      })
    }
    return history
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const scatterData = channels.map(channel => ({
    x: channel.subscribers,
    y: channel.avgViralScore,
    z: channel.totalViews / 1000, // Scale down for bubble size
    name: channel.name
  }))

  return (
    <div className="space-y-6">
      {/* Channel Search and List */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Tracked Channels</CardTitle>
            <CardDescription>Monitor channel growth metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="w-full" variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Channel
            </Button>
            <div className="space-y-2">
              {channels
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(channel => (
                  <div
                    key={channel.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChannel?.id === channel.id ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={channel.thumbnail} />
                      <AvatarFallback>{channel.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatNumber(channel.subscribers)} subs
                      </p>
                    </div>
                    <Badge variant={channel.growth.subscribers > 0 ? "default" : "secondary"}>
                      {channel.growth.subscribers > 0 ? '+' : ''}{channel.growth.subscribers.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Channel Details and Charts */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedChannel?.name || 'Select a channel'}</CardTitle>
                <CardDescription>
                  {selectedChannel && `${selectedChannel.videoCount} videos • ${formatNumber(selectedChannel.totalViews)} total views`}
                </CardDescription>
              </div>
              {selectedChannel && (
                <div className="flex gap-2">
                  <Badge variant="outline">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Score: {selectedChannel.avgViralScore}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedChannel ? (
              <div className="space-y-6">
                {/* Growth Metrics */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Subscriber Growth</p>
                    <p className={`text-2xl font-bold ${
                      selectedChannel.growth.subscribers > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedChannel.growth.subscribers > 0 ? '+' : ''}{selectedChannel.growth.subscribers}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">View Growth</p>
                    <p className={`text-2xl font-bold ${
                      selectedChannel.growth.views > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedChannel.growth.views > 0 ? '+' : ''}{selectedChannel.growth.views}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Viral Score Change</p>
                    <p className={`text-2xl font-bold ${
                      selectedChannel.growth.viralScore > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedChannel.growth.viralScore > 0 ? '+' : ''}{selectedChannel.growth.viralScore}%
                    </p>
                  </div>
                </div>

                {/* Growth Chart */}
                <div>
                  <h4 className="text-sm font-medium mb-4">30-Day Growth Trend</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedChannel.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="subscribers"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Subscribers"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="viralScore"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Viral Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Select a channel to view growth metrics
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Channel Comparison Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance Matrix</CardTitle>
          <CardDescription>
            Compare channels by subscribers vs viral score (bubble size = total views)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x" 
                name="Subscribers" 
                unit="" 
                tickFormatter={(value) => formatNumber(value)}
              />
              <YAxis dataKey="y" name="Viral Score" unit="" />
              <ZAxis dataKey="z" range={[100, 1000]} name="Views" unit="K" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded p-2 shadow-lg">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">Subscribers: {formatNumber(data.x)}</p>
                        <p className="text-sm">Viral Score: {data.y}</p>
                        <p className="text-sm">Views: {formatNumber(data.z * 1000)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter 
                name="Channels" 
                data={scatterData} 
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}