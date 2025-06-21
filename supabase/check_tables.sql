-- Check what tables exist in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if profiles table has the expected columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if any of our new tables already exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ideas', 'scripts', 'outlines', 'script_revisions', 
                   'projects', 'media_uploads', 'transcripts', 'edit_markers',
                   'video_analytics', 'performance_milestones', 'user_preferences')
ORDER BY table_name;