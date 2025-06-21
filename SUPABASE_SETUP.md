# Supabase Setup Guide

This guide will help you set up Supabase for the YouTube Viral Video Dashboard.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and sign up/login
2. Click "New project"
3. Fill in the project details:
   - Project name: `youtube-viral-dashboard` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to you
4. Click "Create new project" and wait for it to be ready

## 2. Get Your API Keys

Once your project is created:

1. Go to Settings → API
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Update Your Environment Variables

Create or update your `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the migration

This will create all the necessary tables, indexes, and Row Level Security policies.

## 5. Set Up Authentication (Optional)

To enable user authentication:

1. Go to Authentication → Providers
2. Enable the providers you want to use:
   - Email/Password (enabled by default)
   - Google
   - GitHub
   - etc.

3. Configure each provider with the necessary OAuth credentials

## 6. Test the Setup

1. Restart your development server: `npm run dev`
2. Try searching for videos - they should now be cached in your database
3. Check the Supabase dashboard → Table Editor to see the cached data

## Database Schema Overview

- **profiles**: User profile information
- **channels**: Cached YouTube channel data
- **videos**: Cached YouTube video data
- **searches**: User search history
- **playlists**: User-created playlists
- **playlist_videos**: Videos in playlists (many-to-many)
- **viral_scores**: Historical viral score tracking

## Row Level Security

The database is configured with Row Level Security (RLS) policies:

- Users can only see and modify their own data (profiles, searches, playlists)
- Public playlists can be viewed by anyone
- Cached video and channel data is publicly viewable
- All user data requires authentication

## Next Steps

1. Implement authentication UI (login/signup pages)
2. Add playlist management features
3. Create user profile pages
4. Add social features (sharing playlists, following users)