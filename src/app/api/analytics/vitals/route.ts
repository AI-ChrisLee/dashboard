import { NextRequest, NextResponse } from 'next/server'
import { setCacheHeaders, CachePresets } from '@/lib/cache-headers'

interface VitalsPayload {
  metric: string
  value: number
  rating?: 'good' | 'needs-improvement' | 'poor'
  delta?: number
  navigationType?: string
  url: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const body: VitalsPayload = await request.json()
    
    // Validate payload
    if (!body.metric || typeof body.value !== 'number' || !body.url) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      )
    }
    
    // Log metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Web Vitals:', {
        metric: body.metric,
        value: body.value,
        rating: body.rating,
        url: body.url
      })
    }
    
    // In production, you would send this to your analytics service
    // Examples:
    // - Google Analytics
    // - PostHog
    // - Custom analytics database
    // - Application monitoring service (Sentry, DataDog, etc.)
    
    // For now, we'll just acknowledge receipt
    const response = NextResponse.json({ success: true })
    
    // Don't cache analytics posts
    return setCacheHeaders(response, CachePresets.noCache)
  } catch (error) {
    console.error('Failed to process vitals:', error)
    return NextResponse.json(
      { error: 'Failed to process vitals' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve aggregated metrics (optional)
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch aggregated metrics from your database
    const mockMetrics = {
      lcp: { p50: 2400, p75: 3200, p95: 4800 },
      fid: { p50: 100, p75: 200, p95: 300 },
      cls: { p50: 0.1, p75: 0.25, p95: 0.5 },
      fcp: { p50: 1800, p75: 2500, p95: 3500 },
      ttfb: { p50: 600, p75: 900, p95: 1200 },
      period: 'last_24_hours',
      sampleSize: 1000
    }
    
    const response = NextResponse.json(mockMetrics)
    
    // Cache aggregated metrics for 5 minutes
    return setCacheHeaders(response, CachePresets.medium)
  } catch (error) {
    console.error('Failed to fetch metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}