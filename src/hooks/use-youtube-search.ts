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
        
        // Handle date range
        if (filters.dateRange.from) {
          params.append('publishedAfter', filters.dateRange.from.toISOString())
        } else if (filters.dateRange.preset) {
          const now = new Date()
          let publishedAfter: Date | null = null
          
          switch (filters.dateRange.preset) {
            case 'today':
              publishedAfter = new Date(now.setHours(0, 0, 0, 0))
              break
            case 'yesterday':
              publishedAfter = new Date(now.setDate(now.getDate() - 1))
              break
            case 'last7days':
              publishedAfter = new Date(now.setDate(now.getDate() - 7))
              break
            case 'last30days':
              publishedAfter = new Date()
              publishedAfter.setDate(publishedAfter.getDate() - 30)
              break
            case 'lastmonth':
              publishedAfter = new Date(now.setMonth(now.getMonth() - 1))
              break
            case 'last3months':
              publishedAfter = new Date(now.setMonth(now.getMonth() - 3))
              break
            case 'last6months':
              publishedAfter = new Date(now.setMonth(now.getMonth() - 6))
              break
            case 'lastyear':
              publishedAfter = new Date(now.setFullYear(now.getFullYear() - 1))
              break
          }
          
          if (publishedAfter) {
            params.append('publishedAfter', publishedAfter.toISOString())
          }
        }
        
        if (filters.subscriberCount.min) params.append('minSubscribers', filters.subscriberCount.min.toString())
        if (filters.subscriberCount.max) params.append('maxSubscribers', filters.subscriberCount.max.toString())
        if (filters.viewCount.min) params.append('minViews', filters.viewCount.min.toString())
        if (filters.viewCount.max) params.append('maxViews', filters.viewCount.max.toString())
        if (filters.duration && filters.duration !== 'any') {
          // Map duration to videoDuration parameter
          const durationMap: Record<string, string> = {
            'short': 'short',
            'medium': 'medium', 
            'long': 'long'
          }
          params.append('videoDuration', durationMap[filters.duration] || filters.duration)
        }
        if (filters.includeShorts !== undefined) params.append('includeShorts', filters.includeShorts.toString())
      }

      console.log('Searching with params:', params.toString())
      const response = await fetch(`/api/youtube/search?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Search API error:', errorData)
        throw new Error(errorData.error || 'Failed to search videos')
      }

      const data = await response.json()
      console.log('Search results:', data)
      setVideos(data.items || [])
      setNextPageToken(data.nextPageToken)
      setTotalResults(data.totalResults || 0)
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
        
        // Handle date range
        if (currentFilters.dateRange.from) {
          params.append('publishedAfter', currentFilters.dateRange.from.toISOString())
        } else if (currentFilters.dateRange.preset) {
          const now = new Date()
          let publishedAfter: Date | null = null
          
          switch (currentFilters.dateRange.preset) {
            case 'today':
              publishedAfter = new Date(now.setHours(0, 0, 0, 0))
              break
            case 'yesterday':
              publishedAfter = new Date(now.setDate(now.getDate() - 1))
              break
            case 'last7days':
              publishedAfter = new Date(now.setDate(now.getDate() - 7))
              break
            case 'last30days':
              publishedAfter = new Date()
              publishedAfter.setDate(publishedAfter.getDate() - 30)
              break
            case 'lastmonth':
              publishedAfter = new Date(now.setMonth(now.getMonth() - 1))
              break
            case 'last3months':
              publishedAfter = new Date(now.setMonth(now.getMonth() - 3))
              break
            case 'last6months':
              publishedAfter = new Date(now.setMonth(now.getMonth() - 6))
              break
            case 'lastyear':
              publishedAfter = new Date(now.setFullYear(now.getFullYear() - 1))
              break
          }
          
          if (publishedAfter) {
            params.append('publishedAfter', publishedAfter.toISOString())
          }
        }
        
        if (currentFilters.subscriberCount.min) params.append('minSubscribers', currentFilters.subscriberCount.min.toString())
        if (currentFilters.subscriberCount.max) params.append('maxSubscribers', currentFilters.subscriberCount.max.toString())
        if (currentFilters.viewCount.min) params.append('minViews', currentFilters.viewCount.min.toString())
        if (currentFilters.viewCount.max) params.append('maxViews', currentFilters.viewCount.max.toString())
        if (currentFilters.duration && currentFilters.duration !== 'any') {
          // Map duration to videoDuration parameter
          const durationMap: Record<string, string> = {
            'short': 'short',
            'medium': 'medium', 
            'long': 'long'
          }
          params.append('videoDuration', durationMap[currentFilters.duration] || currentFilters.duration)
        }
        if (currentFilters.includeShorts !== undefined) params.append('includeShorts', currentFilters.includeShorts.toString())
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