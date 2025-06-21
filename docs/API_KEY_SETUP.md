# API Key Configuration Guide

## Overview
This application uses a dual API key setup for enhanced security:
1. **Server-side key** - For Next.js API routes (backend)
2. **Client-side key** - For future browser-based calls (frontend) - Optional

## YouTube API Keys

### Server-Side Key (Required)
- **Environment Variable**: `YOUTUBE_API_KEY`
- **Usage**: Next.js API routes (`/api/youtube/*`)
- **Restrictions**: 
  - No HTTP referrer restrictions (server requests don't have referrers)
  - Use IP restrictions for production (if possible)
  - API restricted to YouTube Data API v3

### Client-Side Key (Optional)
- **Environment Variable**: `NEXT_PUBLIC_YOUTUBE_API_KEY`
- **Usage**: Direct browser requests (not currently used)
- **Restrictions**:
  - HTTP referrer restrictions (your domains)
  - API restricted to YouTube Data API v3

## Security Best Practices

### Development Environment
1. Use separate API keys for development and production
2. Set quota alerts in Google Cloud Console
3. Monitor usage regularly

### Production Environment
1. **For Vercel/Serverless:**
   - Server-side key: No IP restrictions (dynamic IPs)
   - Monitor usage closely
   - Set up billing alerts

2. **For Traditional Hosting:**
   - Server-side key: Restrict to server IP
   - Client-side key: Restrict to your domain

### Key Rotation
- Rotate API keys every 90 days
- Immediately rotate if exposed
- Keep old keys active for 24 hours during rotation

## Setting Up Keys in Google Cloud Console

### Creating a Server-Side Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Create new API key
4. Name it descriptively (e.g., "YouTube API - Server - Production")
5. Restrictions:
   - Application: None or IP addresses
   - API: YouTube Data API v3 only

### Creating a Client-Side Key
1. Create another API key
2. Name it descriptively (e.g., "YouTube API - Client - Production")
3. Restrictions:
   - Application: HTTP referrers
   - Add your domains:
     ```
     https://yourdomain.com/*
     https://www.yourdomain.com/*
     http://localhost:3000/* (for development)
     ```
   - API: YouTube Data API v3 only

## Monitoring and Alerts

### Set Up Quotas
1. Go to APIs & Services > YouTube Data API v3
2. Click on "Quotas & System Limits"
3. Set up alerts before hitting limits

### Usage Monitoring
1. Check daily quota usage
2. Look for unusual patterns
3. Set up email alerts for quota warnings

## Troubleshooting

### "Requests from referer <empty> are blocked"
- This means you're using a client-side key for server-side requests
- Use the server-side key (without HTTP referrer restrictions)

### "API key not valid"
- Check if the key is enabled
- Verify API restrictions include YouTube Data API v3
- Ensure the key hasn't been deleted

### Rate Limit Issues
- YouTube API has a quota of 10,000 units per day
- Search operations cost 100 units each
- Implement caching to reduce API calls

## Environment Variables Reference

```bash
# .env.local example

# Server-side YouTube API key (no referrer restrictions)
YOUTUBE_API_KEY=AIza...

# Client-side YouTube API key (with referrer restrictions) - Optional
# NEXT_PUBLIC_YOUTUBE_API_KEY=AIza...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Remember: Never commit API keys to version control!