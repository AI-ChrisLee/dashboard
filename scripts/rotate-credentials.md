# ⚠️ URGENT: Credential Rotation Required

## Exposed Credentials Found

The following credentials have been exposed and need immediate rotation:

1. **YouTube API Key**: `AIzaSyAK-SaN8ZOLWwPyVYQB4hU2x7u4EVV2CyY`
2. **Supabase Access Token**: `sbp_02f6c8d7968b7b828c342838796fc7cc1b27cae9`
3. **Supabase URL & Anon Key**

## Immediate Actions:

### 1. Rotate YouTube API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Delete or regenerate the compromised key
4. Create a new API key
5. Add restrictions:
   - Application restrictions: HTTP referrers
   - API restrictions: YouTube Data API v3 only
6. Update `.env.local` with new key

### 2. Rotate Supabase Credentials
1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to Settings > API
3. Regenerate the anon key
4. Navigate to Account > Access Tokens
5. Delete the compromised access token
6. Create a new access token
7. Update `.env.local` with new credentials

### 3. Check for Unauthorized Usage
1. Check YouTube API quota usage in Google Cloud Console
2. Review Supabase logs for any suspicious activity
3. Monitor for any unexpected database changes

### 4. Update Environment Variables
```bash
# .env.local
YOUTUBE_API_KEY=your_new_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ACCESS_TOKEN=your_new_access_token
```

### 5. Prevention Measures
1. Never share `.env.local` files
2. Use environment variables in deployment platforms (Vercel, etc.)
3. Regularly rotate credentials
4. Set up monitoring alerts for API usage
5. Use least-privilege principle for API keys

## Security Checklist
- [ ] YouTube API key rotated
- [ ] Supabase credentials rotated
- [ ] Old credentials revoked/deleted
- [ ] New credentials tested
- [ ] API usage monitored
- [ ] Team notified of rotation
- [ ] Documentation updated

**Time Estimate**: 30 minutes
**Priority**: CRITICAL - Do this immediately