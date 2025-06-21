-- Performance Optimization Migration
-- Adding composite indexes and optimizing queries

-- Composite indexes for common query patterns

-- 1. Videos: Common filter combinations
CREATE INDEX IF NOT EXISTS idx_videos_channel_published ON public.videos(channel_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views_published ON public.videos(view_count DESC, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_published_views ON public.videos(published_at DESC, view_count DESC);

-- 2. Viral scores: Optimize for trending queries
CREATE INDEX IF NOT EXISTS idx_viral_scores_score_calculated ON public.viral_scores(viral_score DESC, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_viral_scores_channel_calculated ON public.viral_scores(channel_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_viral_scores_video_channel ON public.viral_scores(video_id, channel_id);

-- 3. Saved videos: Optimize for user queries
CREATE INDEX IF NOT EXISTS idx_saved_videos_user_viral_score ON saved_videos(user_id, viral_score DESC);
CREATE INDEX IF NOT EXISTS idx_saved_videos_user_saved_at ON saved_videos(user_id, saved_at DESC);

-- 4. Search history: Optimize for analytics
CREATE INDEX IF NOT EXISTS idx_user_search_history_user_query ON user_search_history(user_id, query);
CREATE INDEX IF NOT EXISTS idx_user_search_history_query_count ON user_search_history(query, results_count);

-- 5. Partial indexes for common filters
CREATE INDEX IF NOT EXISTS idx_videos_high_engagement ON public.videos(like_count, comment_count) 
  WHERE view_count > 10000;

CREATE INDEX IF NOT EXISTS idx_channels_small_creators ON public.channels(subscriber_count) 
  WHERE subscriber_count < 100000;

-- 6. BRIN indexes for time-series data (more efficient for large tables)
CREATE INDEX IF NOT EXISTS idx_viral_scores_calculated_brin ON public.viral_scores 
  USING BRIN (calculated_at) WITH (pages_per_range = 128);

-- Create materialized view for analytics summary
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_summary AS
SELECT 
  DATE_TRUNC('day', vs.calculated_at) as date,
  COUNT(DISTINCT vs.video_id) as viral_videos_count,
  AVG(vs.viral_score) as avg_viral_score,
  MAX(vs.viral_score) as max_viral_score,
  AVG(vs.engagement_rate) as avg_engagement_rate,
  COUNT(DISTINCT vs.channel_id) as unique_channels
FROM public.viral_scores vs
WHERE vs.calculated_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', vs.calculated_at)
ORDER BY date DESC;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON analytics_summary(date DESC);

-- Function to refresh materialized view (can be called periodically)
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;
END;
$$ LANGUAGE plpgsql;

-- Create function for efficient video search with viral score
CREATE OR REPLACE FUNCTION search_viral_videos(
  search_query TEXT DEFAULT NULL,
  min_viral_score INTEGER DEFAULT 0,
  max_subscriber_count BIGINT DEFAULT NULL,
  published_after TIMESTAMP DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  video_id TEXT,
  title TEXT,
  channel_id TEXT,
  channel_title TEXT,
  viral_score INTEGER,
  view_count BIGINT,
  subscriber_count BIGINT,
  engagement_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (v.id)
    v.id,
    v.title,
    v.channel_id,
    c.title as channel_title,
    vs.viral_score,
    v.view_count,
    c.subscriber_count,
    vs.engagement_rate
  FROM public.videos v
  JOIN public.channels c ON v.channel_id = c.id
  JOIN public.viral_scores vs ON v.id = vs.video_id
  WHERE 
    (search_query IS NULL OR v.title ILIKE '%' || search_query || '%')
    AND vs.viral_score >= min_viral_score
    AND (max_subscriber_count IS NULL OR c.subscriber_count <= max_subscriber_count)
    AND (published_after IS NULL OR v.published_at >= published_after)
  ORDER BY v.id, vs.calculated_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function for getting trending videos
CREATE OR REPLACE FUNCTION get_trending_videos(
  time_period INTERVAL DEFAULT INTERVAL '24 hours',
  min_views BIGINT DEFAULT 10000,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  video_id TEXT,
  title TEXT,
  channel_title TEXT,
  viral_score INTEGER,
  view_count BIGINT,
  score_change INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH recent_scores AS (
    SELECT 
      vs.video_id,
      vs.viral_score,
      vs.calculated_at,
      LAG(vs.viral_score) OVER (PARTITION BY vs.video_id ORDER BY vs.calculated_at) as prev_score
    FROM public.viral_scores vs
    WHERE vs.calculated_at >= NOW() - time_period
  ),
  score_changes AS (
    SELECT 
      video_id,
      viral_score,
      viral_score - COALESCE(prev_score, viral_score) as score_change,
      calculated_at
    FROM recent_scores
  )
  SELECT DISTINCT ON (sc.video_id)
    sc.video_id,
    v.title,
    c.title as channel_title,
    sc.viral_score,
    v.view_count,
    sc.score_change
  FROM score_changes sc
  JOIN public.videos v ON sc.video_id = v.id
  JOIN public.channels c ON v.channel_id = c.id
  WHERE v.view_count >= min_views
  ORDER BY sc.video_id, sc.calculated_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Add table partitioning for viral_scores (for very large datasets)
-- This is commented out by default as it requires recreating the table
-- Uncomment and modify if you need partitioning for scale

/*
-- Create partitioned viral_scores table
CREATE TABLE IF NOT EXISTS public.viral_scores_partitioned (
  LIKE public.viral_scores INCLUDING ALL
) PARTITION BY RANGE (calculated_at);

-- Create monthly partitions
CREATE TABLE viral_scores_2024_01 PARTITION OF viral_scores_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
  
CREATE TABLE viral_scores_2024_02 PARTITION OF viral_scores_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
  
-- Add more partitions as needed
*/

-- Update statistics for query planner
ANALYZE public.videos;
ANALYZE public.channels;
ANALYZE public.viral_scores;
ANALYZE public.saved_videos;
ANALYZE public.user_search_history;