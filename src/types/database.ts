export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          title: string
          description: string | null
          custom_url: string | null
          subscriber_count: number
          video_count: number
          view_count: number
          thumbnail_url: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          custom_url?: string | null
          subscriber_count?: number
          video_count?: number
          view_count?: number
          thumbnail_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          custom_url?: string | null
          subscriber_count?: number
          video_count?: number
          view_count?: number
          thumbnail_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          description: string | null
          channel_id: string | null
          thumbnail_url: string | null
          published_at: string | null
          view_count: number
          like_count: number
          comment_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          channel_id?: string | null
          thumbnail_url?: string | null
          published_at?: string | null
          view_count?: number
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          channel_id?: string | null
          thumbnail_url?: string | null
          published_at?: string | null
          view_count?: number
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      searches: {
        Row: {
          id: string
          user_id: string | null
          query: string
          results_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          query: string
          results_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          query?: string
          results_count?: number
          created_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      playlist_videos: {
        Row: {
          id: string
          playlist_id: string
          video_id: string
          position: number
          notes: string | null
          added_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          video_id: string
          position: number
          notes?: string | null
          added_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          video_id?: string
          position?: number
          notes?: string | null
          added_at?: string
        }
      }
      viral_scores: {
        Row: {
          id: string
          video_id: string
          channel_id: string
          viral_score: number
          engagement_rate: number
          view_count: number
          subscriber_count: number
          calculated_at: string
        }
        Insert: {
          id?: string
          video_id: string
          channel_id: string
          viral_score: number
          engagement_rate: number
          view_count: number
          subscriber_count: number
          calculated_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          channel_id?: string
          viral_score?: number
          engagement_rate?: number
          view_count?: number
          subscriber_count?: number
          calculated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}