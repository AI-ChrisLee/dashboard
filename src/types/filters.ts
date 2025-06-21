export interface SearchFilters {
  dateRange: {
    from: Date | null
    to: Date | null
    preset?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom'
  }
  subscriberCount: {
    min: number | null
    max: number | null
  }
  viewCount: {
    min: number | null
    max: number | null
  }
  duration?: 'short' | 'medium' | 'long' | 'any'
  sortBy: 'relevance' | 'date' | 'viewCount' | 'rating' | 'viralScore'
  sortOrder: 'desc' | 'asc'
}

export const defaultFilters: SearchFilters = {
  dateRange: {
    from: null,
    to: null,
    preset: 'last30days'
  },
  subscriberCount: {
    min: null,
    max: null
  },
  viewCount: {
    min: null,
    max: null
  },
  duration: 'any',
  sortBy: 'viralScore',
  sortOrder: 'desc'
}

export const subscriberRanges = [
  { label: 'Any', min: null, max: null },
  { label: '0 - 1K', min: 0, max: 1000 },
  { label: '1K - 10K', min: 1000, max: 10000 },
  { label: '10K - 100K', min: 10000, max: 100000 },
  { label: '100K - 1M', min: 100000, max: 1000000 },
  { label: '1M+', min: 1000000, max: null }
]

export const viewRanges = [
  { label: 'Any', min: null, max: null },
  { label: '0 - 1K', min: 0, max: 1000 },
  { label: '1K - 10K', min: 1000, max: 10000 },
  { label: '10K - 100K', min: 10000, max: 100000 },
  { label: '100K - 1M', min: 100000, max: 1000000 },
  { label: '1M - 10M', min: 1000000, max: 10000000 },
  { label: '10M+', min: 10000000, max: null }
]