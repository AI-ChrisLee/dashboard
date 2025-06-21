"use client"

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { SearchFilters } from '@/types/filters'

interface ActiveFiltersProps {
  filters: SearchFilters
  onRemoveFilter: (filterType: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: { type: string; label: string; value: string }[] = []

  // Date range filter
  if (filters.dateRange.preset && filters.dateRange.preset !== 'alltime') {
    const labels: Record<string, string> = {
      today: 'Last 24 hours',
      yesterday: 'Yesterday',
      last7days: 'Last 7 days',
      last30days: 'Last 30 days',
      last3months: 'Last 3 months',
      last6months: 'Last 6 months',
      lastyear: 'Last year'
    }
    activeFilters.push({
      type: 'dateRange',
      label: 'Time',
      value: labels[filters.dateRange.preset] || filters.dateRange.preset
    })
  }

  // Viral score filter
  if (filters.sortBy === 'viralScore') {
    activeFilters.push({
      type: 'sortBy',
      label: 'Sort',
      value: 'Viral Score'
    })
  }

  // View count filter
  if (filters.viewCount.min) {
    const formatCount = (num: number) => {
      if (num >= 1000000) return `${num / 1000000}M`
      if (num >= 1000) return `${num / 1000}K`
      return num.toString()
    }
    activeFilters.push({
      type: 'viewCount',
      label: 'Views',
      value: `>${formatCount(filters.viewCount.min)}`
    })
  }

  // Duration filter
  if (filters.duration && filters.duration !== 'any') {
    const durationLabels: Record<string, string> = {
      short: 'Short videos',
      medium: '4-20 min',
      long: 'Long videos'
    }
    activeFilters.push({
      type: 'duration',
      label: 'Length',
      value: durationLabels[filters.duration] || filters.duration
    })
  }

  // Shorts filter
  if (!filters.includeShorts) {
    activeFilters.push({
      type: 'includeShorts',
      label: 'Shorts',
      value: 'Excluded'
    })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map((filter, index) => (
        <Badge
          key={`${filter.type}-${index}`}
          variant="secondary"
          className="gap-1 pr-1.5 hover:bg-secondary/80 transition-colors"
        >
          <span className="text-xs">{filter.label}:</span>
          <span className="font-medium">{filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.type)}
            className="ml-1 rounded-full hover:bg-background/80 p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}