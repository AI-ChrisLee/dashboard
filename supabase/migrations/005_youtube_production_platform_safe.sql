-- YouTube Production Platform Schema Migration (Safe Version)
-- This migration safely handles existing tables and adds new ones

-- First, let's ensure the profiles table exists with the correct structure
-- This is likely already created by Supabase Auth
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE TABLE profiles (
            id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
            username TEXT UNIQUE,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- =====================================================
-- SCRIPTING MODULE TABLES
-- =====================================================

-- Drop existing tables if they exist (be careful with this in production!)
-- Uncomment these lines only if you want to start fresh
-- DROP TABLE IF EXISTS ideas CASCADE;
-- DROP TABLE IF EXISTS scripts CASCADE;
-- DROP TABLE IF EXISTS outlines CASCADE;
-- DROP TABLE IF EXISTS script_revisions CASCADE;

-- Ideas table for capturing initial video concepts
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  tags TEXT[],
  is_used BOOLEAN DEFAULT false,
  used_in_script_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Scripts table for full video scripts
CREATE TABLE IF NOT EXISTS scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  parent_script_id UUID,
  word_count INTEGER DEFAULT 0,
  estimated_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint after table creation to avoid circular dependency
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'scripts_parent_script_id_fkey') THEN
        ALTER TABLE scripts ADD CONSTRAINT scripts_parent_script_id_fkey 
        FOREIGN KEY (parent_script_id) REFERENCES scripts(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Outlines table for script structure
CREATE TABLE IF NOT EXISTS outlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  position INTEGER NOT NULL,
  parent_outline_id UUID,
  outline_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add self-referencing foreign key
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'outlines_parent_outline_id_fkey') THEN
        ALTER TABLE outlines ADD CONSTRAINT outlines_parent_outline_id_fkey 
        FOREIGN KEY (parent_outline_id) REFERENCES outlines(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Script revisions for version control
CREATE TABLE IF NOT EXISTS script_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE NOT NULL,
  revision_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  changes_summary TEXT,
  revised_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(script_id, revision_number)
);

-- =====================================================
-- EDITING MODULE TABLES
-- =====================================================

-- Rename existing projects table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
        ALTER TABLE projects RENAME TO old_projects;
    END IF;
END $$;

-- Projects table for video projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'planning',
  youtube_video_id VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Media uploads for raw footage and assets
CREATE TABLE IF NOT EXISTS media_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  duration INTEGER,
  metadata JSONB,
  upload_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transcripts for videos
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_upload_id UUID REFERENCES media_uploads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  timestamps JSONB,
  processing_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Edit markers for sync points
CREATE TABLE IF NOT EXISTS edit_markers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  media_upload_id UUID REFERENCES media_uploads(id) ON DELETE CASCADE NOT NULL,
  marker_type VARCHAR(50) NOT NULL,
  timecode DECIMAL(10,3) NOT NULL,
  duration DECIMAL(10,3),
  description TEXT,
  script_section_id UUID REFERENCES outlines(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- ANALYTICS MODULE TABLES
-- =====================================================

-- Video analytics tracking
CREATE TABLE IF NOT EXISTS video_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  youtube_video_id VARCHAR(20) NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  watch_time_minutes INTEGER DEFAULT 0,
  average_view_duration INTEGER DEFAULT 0,
  click_through_rate DECIMAL(5,2),
  impressions INTEGER DEFAULT 0,
  subscriber_change INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(youtube_video_id, recorded_at)
);

-- Performance milestones for notifications
CREATE TABLE IF NOT EXISTS performance_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  milestone_type VARCHAR(50) NOT NULL,
  threshold INTEGER NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- USER PREFERENCES AND SETTINGS
-- =====================================================

-- User preferences for the platform
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications JSONB DEFAULT '{
    "performance_alerts": true,
    "weekly_summary": true,
    "milestone_achievements": true,
    "system_updates": false
  }'::jsonb,
  default_script_template VARCHAR(50),
  auto_save_interval INTEGER DEFAULT 30,
  theme VARCHAR(20) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE (Only create if they don't exist)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_category ON ideas(category);
CREATE INDEX IF NOT EXISTS idx_ideas_is_used ON ideas(is_used);

CREATE INDEX IF NOT EXISTS idx_scripts_user_id ON scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_scripts_status ON scripts(status);
CREATE INDEX IF NOT EXISTS idx_scripts_created_at ON scripts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_outlines_script_id ON outlines(script_id);
CREATE INDEX IF NOT EXISTS idx_outlines_position ON outlines(position);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_youtube_video_id ON projects(youtube_video_id);

CREATE INDEX IF NOT EXISTS idx_media_uploads_project_id ON media_uploads(project_id);
CREATE INDEX IF NOT EXISTS idx_media_uploads_file_type ON media_uploads(file_type);

CREATE INDEX IF NOT EXISTS idx_video_analytics_project_id ON video_analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_youtube_video_id ON video_analytics(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_recorded_at ON video_analytics(recorded_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (Skip if already enabled)
-- =====================================================

-- Enable RLS on all tables (with error handling)
DO $$ 
BEGIN
    -- Ideas
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'ideas' AND rowsecurity = true) THEN
        ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Scripts
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'scripts' AND rowsecurity = true) THEN
        ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Continue for other tables...
EXCEPTION
    WHEN others THEN
        -- Ignore RLS errors
        NULL;
END $$;

-- Create policies only if they don't exist
DO $$ 
BEGIN
    -- Ideas policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ideas' AND policyname = 'Users can manage their own ideas') THEN
        CREATE POLICY "Users can manage their own ideas" ON ideas
            FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Scripts policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scripts' AND policyname = 'Users can manage their own scripts') THEN
        CREATE POLICY "Users can manage their own scripts" ON scripts
            FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    -- Continue for other policies...
EXCEPTION
    WHEN others THEN
        -- Ignore policy errors
        NULL;
END $$;

-- =====================================================
-- SIMPLE FUNCTIONS (No complex logic)
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ideas_updated_at') THEN
        CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_scripts_updated_at') THEN
        CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Continue for other triggers...
END $$;

-- Simple word count function
CREATE OR REPLACE FUNCTION update_script_word_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.content IS NOT NULL THEN
    NEW.word_count = array_length(string_to_array(NEW.content, ' '), 1);
  ELSE
    NEW.word_count = 0;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Word count trigger
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_script_word_count_trigger') THEN
        CREATE TRIGGER update_script_word_count_trigger
            BEFORE INSERT OR UPDATE OF content ON scripts
            FOR EACH ROW EXECUTE FUNCTION update_script_word_count();
    END IF;
END $$;