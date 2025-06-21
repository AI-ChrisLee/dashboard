-- YouTube Production Platform Schema Migration
-- This migration sets up the complete database structure for the production platform

-- =====================================================
-- SCRIPTING MODULE TABLES
-- =====================================================

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
  status VARCHAR(50) DEFAULT 'draft', -- draft, in_progress, completed, archived
  version INTEGER DEFAULT 1,
  parent_script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  word_count INTEGER DEFAULT 0,
  estimated_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Outlines table for script structure
CREATE TABLE IF NOT EXISTS outlines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  position INTEGER NOT NULL,
  parent_outline_id UUID REFERENCES outlines(id) ON DELETE CASCADE,
  outline_type VARCHAR(50), -- hook, intro, main_point, conclusion, cta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

-- Projects table for video projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  script_id UUID REFERENCES scripts(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'planning', -- planning, filming, editing, published
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
  file_type VARCHAR(50) NOT NULL, -- video, audio, image
  file_size BIGINT NOT NULL, -- in bytes
  file_url TEXT NOT NULL,
  duration INTEGER, -- in seconds for video/audio
  metadata JSONB,
  upload_status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Transcripts for videos
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_upload_id UUID REFERENCES media_uploads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  timestamps JSONB, -- Array of {start, end, text} objects
  processing_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Edit markers for sync points
CREATE TABLE IF NOT EXISTS edit_markers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  media_upload_id UUID REFERENCES media_uploads(id) ON DELETE CASCADE NOT NULL,
  marker_type VARCHAR(50) NOT NULL, -- cut, transition, effect, sync_point
  timecode DECIMAL(10,3) NOT NULL, -- in seconds
  duration DECIMAL(10,3), -- for transitions/effects
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
  average_view_duration INTEGER DEFAULT 0, -- in seconds
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
  milestone_type VARCHAR(50) NOT NULL, -- views, likes, ctr, watch_time
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
  auto_save_interval INTEGER DEFAULT 30, -- in seconds
  theme VARCHAR(20) DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_category ON ideas(category);
CREATE INDEX idx_ideas_is_used ON ideas(is_used);

CREATE INDEX idx_scripts_user_id ON scripts(user_id);
CREATE INDEX idx_scripts_status ON scripts(status);
CREATE INDEX idx_scripts_created_at ON scripts(created_at DESC);

CREATE INDEX idx_outlines_script_id ON outlines(script_id);
CREATE INDEX idx_outlines_position ON outlines(position);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_youtube_video_id ON projects(youtube_video_id);

CREATE INDEX idx_media_uploads_project_id ON media_uploads(project_id);
CREATE INDEX idx_media_uploads_file_type ON media_uploads(file_type);

CREATE INDEX idx_video_analytics_project_id ON video_analytics(project_id);
CREATE INDEX idx_video_analytics_youtube_video_id ON video_analytics(youtube_video_id);
CREATE INDEX idx_video_analytics_recorded_at ON video_analytics(recorded_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_markers ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Ideas policies
CREATE POLICY "Users can manage their own ideas" ON ideas
  FOR ALL USING (auth.uid() = user_id);

-- Scripts policies
CREATE POLICY "Users can manage their own scripts" ON scripts
  FOR ALL USING (auth.uid() = user_id);

-- Outlines policies
CREATE POLICY "Users can manage outlines for their scripts" ON outlines
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scripts 
      WHERE scripts.id = outlines.script_id 
      AND scripts.user_id = auth.uid()
    )
  );

-- Script revisions policies
CREATE POLICY "Users can view revisions for their scripts" ON script_revisions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM scripts 
      WHERE scripts.id = script_revisions.script_id 
      AND scripts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create revisions for their scripts" ON script_revisions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM scripts 
      WHERE scripts.id = script_revisions.script_id 
      AND scripts.user_id = auth.uid()
    )
  );

-- Projects policies
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- Media uploads policies
CREATE POLICY "Users can manage their own media" ON media_uploads
  FOR ALL USING (auth.uid() = user_id);

-- Transcripts policies
CREATE POLICY "Users can manage transcripts for their media" ON transcripts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM media_uploads 
      WHERE media_uploads.id = transcripts.media_upload_id 
      AND media_uploads.user_id = auth.uid()
    )
  );

-- Edit markers policies
CREATE POLICY "Users can manage markers for their projects" ON edit_markers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = edit_markers.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Video analytics policies
CREATE POLICY "Users can view analytics for their projects" ON video_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = video_analytics.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Performance milestones policies
CREATE POLICY "Users can manage milestones for their projects" ON performance_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = performance_milestones.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outlines_updated_at BEFORE UPDATE ON outlines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcripts_updated_at BEFORE UPDATE ON transcripts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate script word count
CREATE OR REPLACE FUNCTION update_script_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(NEW.content, ' '), 1);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_script_word_count_trigger
  BEFORE INSERT OR UPDATE OF content ON scripts
  FOR EACH ROW EXECUTE FUNCTION update_script_word_count();

-- Function to auto-increment script version
CREATE OR REPLACE FUNCTION increment_script_version()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_script_id IS NOT NULL THEN
    SELECT COALESCE(MAX(version), 0) + 1 INTO NEW.version
    FROM scripts
    WHERE (parent_script_id = NEW.parent_script_id
    OR id = NEW.parent_script_id)
    AND user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER auto_increment_script_version
  BEFORE INSERT ON scripts
  FOR EACH ROW EXECUTE FUNCTION increment_script_version();