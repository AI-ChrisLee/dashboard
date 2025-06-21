"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { User, Mail, Bell, Shield, Loader2 } from "lucide-react"
import { usePlatformStore } from "@/store/platform"
import type { Database } from "@/types/database"

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const { preferences, updatePreferences } = usePlatformStore()
  
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    username: '',
    avatar_url: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data && !error) {
      setProfile({
        username: data.username || '',
        avatar_url: data.avatar_url || '',
      })
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setLoading(false)

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated successfully')
    }
  }

  if (authLoading || !user) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || user.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user.email?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <Button onClick={updateProfile} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="performance-alerts">Performance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your videos hit performance milestones
                  </p>
                </div>
                <Switch
                  id="performance-alerts"
                  checked={preferences.emailNotifications.performanceAlerts}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        performanceAlerts: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-summary">Weekly Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your channel performance
                  </p>
                </div>
                <Switch
                  id="weekly-summary"
                  checked={preferences.emailNotifications.weeklySummary}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        weeklySummary: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="milestone-achievements">Milestone Achievements</Label>
                  <p className="text-sm text-muted-foreground">
                    Celebrate when you reach subscriber and view milestones
                  </p>
                </div>
                <Switch
                  id="milestone-achievements"
                  checked={preferences.emailNotifications.milestoneAchievements}
                  onCheckedChange={(checked) =>
                    updatePreferences({
                      emailNotifications: {
                        ...preferences.emailNotifications,
                        milestoneAchievements: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Auto-save Settings
                </h4>
                <div className="space-y-2">
                  <Label htmlFor="autosave">Auto-save interval (seconds)</Label>
                  <Input
                    id="autosave"
                    type="number"
                    min="10"
                    max="300"
                    value={preferences.autoSaveInterval}
                    onChange={(e) =>
                      updatePreferences({ autoSaveInterval: parseInt(e.target.value) || 30 })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Password</h4>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Password Reset Email
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Account Created</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Last Sign In</h4>
                  <p className="text-sm text-muted-foreground">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Never'}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2 text-destructive flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Danger Zone
                  </h4>
                  <Button variant="destructive" className="mt-2">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}