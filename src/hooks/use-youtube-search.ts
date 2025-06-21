import { useState, useCallback } from 'react'
import { ViralVideo } from '@/types/youtube'
import type { SearchFilters } from '@/types/filters'

interface UseYouTubeSearchResult {
  videos: ViralVideo[]
  loading: boolean
  error: string | null
  nextPageToken?: string
  totalResults: number
  search: (query: string, filters?: SearchFilters) => Promise<void>
  loadMore: () => Promise<void>
}

export function useYouTubeSearch(): UseYouTubeSearchResult {
  const [videos, setVideos] = useState<ViralVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextPageToken, setNextPageToken] = useState<string | undefined>()
  const [totalResults, setTotalResults] = useState(0)
  const [currentQuery, setCurrentQuery] = useState('')
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | undefined>()

  const search = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentQuery(query)
    setCurrentFilters(filters)

    try {
      const params = new URLSearchParams({ q: query })
      
      if (filters) {
        if (filters.sortBy) params.append('order', filters.sortBy)
        if (filters.dateRange.from) params.append('publishedAfter', filters.dateRange.from.toISOString())
        if (filters.subscriberCount.min) params.append('minSubscribers', filters.subscriberCount.min.toString())
        if (filters.subscriberCount.max) params.append('maxSubscribers', filters.subscriberCount.max.toString())
        if (filters.viewCount.min) params.append('minViews', filters.viewCount.min.toString())
        if (filters.viewCount.max) params.append('maxViews', filters.viewCount.max.toString())
        if (filters.duration && filters.duration !== 'any') params.append('videoDuration', filters.duration)
      }

      const response = await fetch(`/api/youtube/search?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to search videos')
      }

      const data = await response.json()
      setVideos(data.items)
      setNextPageToken(data.nextPageToken)
      setTotalResults(data.totalResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (!nextPageToken || !currentQuery) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ q: currentQuery, pageToken: nextPageToken })
      
      if (currentFilters) {
        if (currentFilters.sortBy) params.append('order', currentFilters.sortBy)
        if (currentFilters.dateRange.from) params.append('publishedAfter', currentFilters.dateRange.from.toISOString())
        if (currentFilters.subscriberCount.min) params.append('minSubscribers', currentFilters.subscriberCount.min.toString())
        if (currentFilters.subscriberCount.max) params.append('maxSubscribers', currentFilters.subscriberCount.max.toString())
        if (currentFilters.viewCount.min) params.append('minViews', currentFilters.viewCount.min.toString())
        if (currentFilters.viewCount.max) params.append('maxViews', currentFilters.viewCount.max.toString())
        if (currentFilters.duration && currentFilters.duration !== 'any') params.append('videoDuration', currentFilters.duration)
      }

      const response = await fetch(`/api/youtube/search?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load more videos')
      }

      const data = await response.json()
      setVideos(prev => [...prev, ...data.items])
      setNextPageToken(data.nextPageToken)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [currentQuery, nextPageToken, currentFilters])

  return {
    videos,
    loading,
    error,
    nextPageToken,
    totalResults,
    search,
    loadMore
  }
}