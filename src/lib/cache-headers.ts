import { NextResponse } from 'next/server'

export type CacheOptions = {
  maxAge?: number // Cache duration in seconds
  sMaxAge?: number // CDN cache duration in seconds
  staleWhileRevalidate?: number // Serve stale content while revalidating
  private?: boolean // Private cache (browser only) vs public (CDN)
  noStore?: boolean // Disable caching completely
  mustRevalidate?: boolean // Force revalidation when stale
}

export function setCacheHeaders(response: NextResponse, options: CacheOptions = {}) {
  const {
    maxAge = 0,
    sMaxAge = maxAge,
    staleWhileRevalidate = 0,
    private: isPrivate = false,
    noStore = false,
    mustRevalidate = false
  } = options

  if (noStore) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    return response
  }

  const directives: string[] = []

  // Public vs Private
  directives.push(isPrivate ? 'private' : 'public')

  // Max age for browser cache
  if (maxAge > 0) {
    directives.push(`max-age=${maxAge}`)
  }

  // Max age for CDN cache
  if (sMaxAge > 0 && !isPrivate) {
    directives.push(`s-maxage=${sMaxAge}`)
  }

  // Stale while revalidate
  if (staleWhileRevalidate > 0) {
    directives.push(`stale-while-revalidate=${staleWhileRevalidate}`)
  }

  // Must revalidate
  if (mustRevalidate) {
    directives.push('must-revalidate')
  }

  response.headers.set('Cache-Control', directives.join(', '))
  
  // Add ETag for conditional requests
  const etag = generateETag(response)
  if (etag) {
    response.headers.set('ETag', etag)
  }

  return response
}

function generateETag(response: NextResponse): string | null {
  try {
    // Get response body if it exists
    const body = response.body
    if (!body) return null
    
    // Simple ETag based on content and timestamp
    const timestamp = Date.now()
    return `W/"${timestamp}"`
  } catch {
    return null
  }
}

// Preset cache configurations
export const CachePresets = {
  // No caching
  noCache: { noStore: true },
  
  // Cache for 1 minute, serve stale for 5 minutes while revalidating
  shortLived: { 
    maxAge: 60, 
    staleWhileRevalidate: 300 
  },
  
  // Cache for 5 minutes, serve stale for 1 hour while revalidating
  medium: { 
    maxAge: 300, 
    sMaxAge: 300,
    staleWhileRevalidate: 3600 
  },
  
  // Cache for 1 hour, serve stale for 1 day while revalidating
  longLived: { 
    maxAge: 3600, 
    sMaxAge: 3600,
    staleWhileRevalidate: 86400 
  },
  
  // Cache static assets for 1 year
  static: { 
    maxAge: 31536000, 
    sMaxAge: 31536000 
  },
  
  // User-specific data: browser cache only, short duration
  userData: { 
    private: true, 
    maxAge: 60, 
    mustRevalidate: true 
  },
  
  // API responses: CDN cache with revalidation
  apiResponse: {
    maxAge: 120, // 2 minutes browser cache
    sMaxAge: 300, // 5 minutes CDN cache
    staleWhileRevalidate: 3600 // 1 hour stale-while-revalidate
  }
}