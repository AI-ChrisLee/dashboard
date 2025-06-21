import { useState, useCallback } from 'react'
import { ViralVideo } from '@/types/youtube'

interface UseYouTubeSearchResult {
  videos: ViralVideo[]
  loading: boolean
  error: string | null
  nextPageToken?: string
  totalResults: number
  search: (query: string) => Promise<void>
  loadMore: () => Promise<void>
}

export function useYouTubeSearch(): UseYouTubeSearchResult {
  const [videos, setVideos] = useState<ViralVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextPageToken, setNextPageToken] = useState<string | undefined>()
  const [totalResults, setTotalResults] = useState(0)
  const [currentQuery, setCurrentQuery] = useState('')

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)
    setCurrentQuery(query)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
      
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
      const response = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(currentQuery)}&pageToken=${nextPageToken}`
      )
      
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
  }, [currentQuery, nextPageToken])

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