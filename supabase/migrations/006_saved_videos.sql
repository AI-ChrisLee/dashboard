-- Create saved_videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a user can only save a video once
  UNIQUE(user_id, video_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_videos_user_id ON saved_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_videos_video_id ON saved_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_saved_videos_created_at ON saved_videos(created_at DESC);

-- Enable RLS
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own saved videos
CREATE POLICY "Users can view own saved videos" ON saved_videos
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own saved videos
CREATE POLICY "Users can save videos" ON saved_videos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own saved videos
CREATE POLICY "Users can remove saved videos" ON saved_videos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_saved_videos_updated_at ON saved_videos;
CREATE TRIGGER update_saved_videos_updated_at
  BEFORE UPDATE ON saved_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();