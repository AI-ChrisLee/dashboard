"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Bell, BellOff } from "lucide-react"
import { useNotifications } from "@/contexts/notifications"
import { toast } from "sonner"

export function NotificationPreferences() {
  const { preferences, updatePreferences } = useNotifications()
  const [newKeyword, setNewKeyword] = useState("")
  const [newChannel, setNewChannel] = useState("")

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      updatePreferences({
        keywords: [...preferences.keywords, newKeyword.trim()]
      })
      setNewKeyword("")
      toast.success(`Added keyword: ${newKeyword}`)
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    updatePreferences({
      keywords: preferences.keywords.filter(k => k !== keyword)
    })
  }

  const handleAddChannel = () => {
    if (newChannel.trim()) {
      updatePreferences({
        channels: [...preferences.channels, newChannel.trim()]
      })
      setNewChannel("")
      toast.success(`Added channel: ${newChannel}`)
    }
  }

  const handleRemoveChannel = (channel: string) => {
    updatePreferences({
      channels: preferences.channels.filter(c => c !== channel)
    })
  }

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>
                Receive alerts when videos go viral
              </CardDescription>
            </div>
            <Switch
              checked={preferences.enabled}
              onCheckedChange={(enabled) => updatePreferences({ enabled })}
            />
          </div>
        </CardHeader>
      </Card>

      {preferences.enabled && (
        <>
          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Types</CardTitle>
              <CardDescription>
                Choose what you want to be notified about
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="viral-videos">Viral Videos</Label>
                <Switch
                  id="viral-videos"
                  checked={preferences.types.viralVideo}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      types: { ...preferences.types, viralVideo: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="channel-milestones">Channel Milestones</Label>
                <Switch
                  id="channel-milestones"
                  checked={preferences.types.channelMilestone}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      types: { ...preferences.types, channelMilestone: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="keyword-trends">Keyword Trends</Label>
                <Switch
                  id="keyword-trends"
                  checked={preferences.types.keywordTrend}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      types: { ...preferences.types, keywordTrend: checked }
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system">System Notifications</Label>
                <Switch
                  id="system"
                  checked={preferences.types.system}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      types: { ...preferences.types, system: checked }
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Viral Threshold */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Viral Score Threshold</CardTitle>
              <CardDescription>
                Minimum score to trigger notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Score: {preferences.viralThreshold}</span>
                  <Badge variant={preferences.viralThreshold >= 90 ? "destructive" : 
                                preferences.viralThreshold >= 80 ? "default" : "secondary"}>
                    {preferences.viralThreshold >= 90 ? 'Ultra Viral' :
                     preferences.viralThreshold >= 80 ? 'Very Viral' :
                     preferences.viralThreshold >= 70 ? 'Viral' : 'Trending'}
                  </Badge>
                </div>
                <Slider
                  value={[preferences.viralThreshold]}
                  onValueChange={([value]) => updatePreferences({ viralThreshold: value })}
                  min={50}
                  max={100}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Frequency</CardTitle>
              <CardDescription>
                How often to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={preferences.frequency}
                onValueChange={(value: any) => updatePreferences({ frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Watched Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Watched Keywords</CardTitle>
              <CardDescription>
                Get notified when these keywords have viral videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="pr-1">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {preferences.keywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">No keywords added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Watched Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Watched Channels</CardTitle>
              <CardDescription>
                Get notified when these channels post viral videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add channel name..."
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChannel()}
                />
                <Button onClick={handleAddChannel} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.channels.map((channel) => (
                  <Badge key={channel} variant="secondary" className="pr-1">
                    {channel}
                    <button
                      onClick={() => handleRemoveChannel(channel)}
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {preferences.channels.length === 0 && (
                  <p className="text-sm text-muted-foreground">No channels added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}