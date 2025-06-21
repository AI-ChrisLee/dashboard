"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Settings, Star, Eye, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { NotificationPreferences } from "@/components/notification-preferences"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  website: string | null
  created_at: string
  stats: {
    savedVideos: number
    watchlists: number
    totalViews: number
    avgViralScore: number
  }
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    location: "",
    website: ""
  })

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      // Get user profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const newProfile = {
          id: user?.id,
          email: user?.email,
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || null,
          bio: null,
          location: null,
          website: null
        }

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)

        if (!insertError) {
          setProfile({
            ...newProfile,
            created_at: new Date().toISOString(),
            stats: {
              savedVideos: 0,
              watchlists: 0,
              totalViews: 0,
              avgViralScore: 0
            }
          })
        }
      } else if (!error && data) {
        // Fetch user stats
        const stats = {
          savedVideos: 0, // Would fetch from saved_videos table
          watchlists: 0,  // Would fetch from watchlists table
          totalViews: 0,  // Would calculate from user activity
          avgViralScore: 0 // Would calculate from user's saved videos
        }

        setProfile({
          ...data,
          stats
        })
      }

      // Set form data
      setFormData({
        full_name: data?.full_name || user?.user_metadata?.full_name || '',
        bio: data?.bio || '',
        location: data?.location || '',
        website: data?.website || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!user) return

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          website: formData.website
        })
        .eq('id', user.id)

      if (!error) {
        toast.success('Profile updated successfully!')
        await fetchProfile()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Please sign in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-2xl">
                {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold">{profile?.full_name || 'User'}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {profile?.email}
              </p>
              {profile?.bio && (
                <p className="text-muted-foreground">{profile.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(profile?.created_at || user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{profile?.stats.savedVideos}</p>
                <p className="text-sm text-muted-foreground">Saved Videos</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.stats.watchlists}</p>
                <p className="text-sm text-muted-foreground">Watchlists</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{profile?.stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{profile?.stats.avgViralScore}</p>
                <p className="text-sm text-muted-foreground">Avg Viral Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">Pro</p>
                <p className="text-sm text-muted-foreground">Account Type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <Button onClick={updateProfile} disabled={updating}>
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreferences />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Preference settings coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}