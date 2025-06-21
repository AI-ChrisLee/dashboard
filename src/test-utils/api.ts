import { NextRequest } from 'next/server'

/**
 * Creates a mock NextRequest for testing API routes
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string
    headers?: Record<string, string>
    body?: any
    searchParams?: Record<string, string>
  } = {}
): NextRequest {
  const { method = 'GET', headers = {}, body, searchParams = {} } = options

  // Build URL with search params
  const fullUrl = new URL(url, 'http://localhost:3000')
  Object.entries(searchParams).forEach(([key, value]) => {
    fullUrl.searchParams.append(key, value)
  })

  // Create request init
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  // Add body if provided
  if (body && method !== 'GET' && method !== 'HEAD') {
    init.body = JSON.stringify(body)
  }

  return new NextRequest(fullUrl, init)
}

/**
 * Extracts JSON response from NextResponse
 */
export async function getJsonResponse(response: Response): Promise<any> {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Mock YouTube API client for testing
 */
export const mockYouTubeClient = {
  searchVideos: jest.fn(),
  getChannels: jest.fn(),
  getVideoDetails: jest.fn()
}

/**
 * Mock Supabase client for testing
 */
export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null })
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null })
  }))
}

/**
 * Mock rate limiter for testing
 */
export const mockRateLimiter = {
  checkLimit: jest.fn().mockResolvedValue(true),
  getRemainingRequests: jest.fn().mockReturnValue(50),
  getResetTime: jest.fn().mockReturnValue(Date.now() + 3600000)
}