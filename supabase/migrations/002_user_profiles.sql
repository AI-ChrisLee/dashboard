-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create saved_videos table
CREATE TABLE IF NOT EXISTS saved_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  thumbnail_url TEXT,
  viral_score INTEGER,
  view_count BIGINT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, video_id)
);

-- Create watchlists table
CREATE TABLE IF NOT EXISTS watchlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create watchlist_videos table (junction table)
CREATE TABLE IF NOT EXISTS watchlist_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  thumbnail_url TEXT,
  viral_score INTEGER,
  view_count BIGINT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(watchlist_id, video_id)
);

-- Create user_search_history table
CREATE TABLE IF NOT EXISTS user_search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for saved_videos
CREATE POLICY "Users can view own saved videos" ON saved_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved videos" ON saved_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved videos" ON saved_videos
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for watchlists
CREATE POLICY "Users can view own watchlists" ON watchlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public watchlists" ON watchlists
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own watchlists" ON watchlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watchlists" ON watchlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlists" ON watchlists
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for watchlist_videos
CREATE POLICY "Users can view videos in accessible watchlists" ON watchlist_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM watchlists 
      WHERE watchlists.id = watchlist_videos.watchlist_id 
      AND (watchlists.user_id = auth.uid() OR watchlists.is_public = true)
    )
  );

CREATE POLICY "Users can manage videos in own watchlists" ON watchlist_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM watchlists 
      WHERE watchlists.id = watchlist_videos.watchlist_id 
      AND watchlists.user_id = auth.uid()
    )
  );

-- RLS Policies for user_search_history
CREATE POLICY "Users can view own search history" ON user_search_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own search history" ON user_search_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_videos_user_id ON saved_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_videos_saved_at ON saved_videos(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_videos_watchlist_id ON watchlist_videos(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_user_search_history_user_id ON user_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_search_history_searched_at ON user_search_history(searched_at DESC);

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at
  BEFORE UPDATE ON watchlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();