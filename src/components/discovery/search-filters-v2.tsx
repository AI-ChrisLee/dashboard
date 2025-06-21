"use client"

import { useState } from 'react'
import { Filter, X, Sparkles, Calendar, Eye, MousePointer, TrendingUp, Clock, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import type { SearchFilters } from '@/types/filters'

interface SearchFiltersV2Props {
  onFiltersChange?: (filters: SearchFilters) => void
  currentFilters: SearchFilters
}

interface FilterOption {
  id: string
  label: string
  icon: any
  enabled: boolean
  config: any
}

export function SearchFiltersV2({ onFiltersChange, currentFilters }: SearchFiltersV2Props) {
  const [open, setOpen] = useState(false)
  
  // Convert SearchFilters to internal filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    {
      id: 'dateRange',
      label: 'Time Period',
      icon: Calendar,
      enabled: currentFilters.dateRange.preset !== 'alltime',
      config: {
        preset: currentFilters.dateRange.preset || 'last7days'
      }
    },
    {
      id: 'viralScore',
      label: 'Viral Score',
      icon: TrendingUp,
      enabled: currentFilters.sortBy === 'viralScore',
      config: {
        minScore: 70
      }
    },
    {
      id: 'viewCount',
      label: 'View Count',
      icon: Eye,
      enabled: currentFilters.viewCount.min !== null || currentFilters.viewCount.max !== null,
      config: {
        min: currentFilters.viewCount.min || 100000,
        max: currentFilters.viewCount.max || null
      }
    },
    {
      id: 'engagement',
      label: 'High Engagement',
      icon: MousePointer,
      enabled: false,
      config: {
        minCTR: 10
      }
    },
    {
      id: 'duration',
      label: 'Video Length',
      icon: Clock,
      enabled: currentFilters.duration !== 'any',
      config: {
        type: currentFilters.duration || 'medium'
      }
    },
    {
      id: 'shorts',
      label: 'Include Shorts',
      icon: Youtube,
      enabled: currentFilters.includeShorts ?? false,  // Default to false
      config: {}
    }
  ])

  const toggleFilter = (id: string) => {
    setFilterOptions(prev => 
      prev.map(filter => 
        filter.id === id ? { ...filter, enabled: !filter.enabled } : filter
      )
    )
  }

  const updateFilterConfig = (id: string, newConfig: any) => {
    setFilterOptions(prev =>
      prev.map(filter =>
        filter.id === id ? { ...filter, config: { ...filter.config, ...newConfig } } : filter
      )
    )
  }

  const applyFilters = () => {
    // Convert internal format to SearchFilters
    const dateFilter = filterOptions.find(f => f.id === 'dateRange')
    const viralFilter = filterOptions.find(f => f.id === 'viralScore')
    const viewFilter = filterOptions.find(f => f.id === 'viewCount')
    const durationFilter = filterOptions.find(f => f.id === 'duration')
    const shortsFilter = filterOptions.find(f => f.id === 'shorts')
    
    const filters: SearchFilters = {
      sortBy: viralFilter?.enabled ? 'viralScore' : 'relevance',
      sortOrder: 'desc',
      dateRange: {
        preset: dateFilter?.enabled ? dateFilter.config.preset : 'alltime',
        from: null,
        to: null
      },
      subscriberCount: {
        min: null,
        max: null
      },
      viewCount: {
        min: viewFilter?.enabled ? viewFilter.config.min : null,
        max: viewFilter?.enabled ? viewFilter.config.max : null
      },
      duration: durationFilter?.enabled ? durationFilter.config.type : 'any',
      includeShorts: shortsFilter?.enabled ?? true
    }
    
    onFiltersChange?.(filters)
    setOpen(false)
  }

  const getActiveFilterCount = () => {
    return filterOptions.filter(f => f.enabled && f.id !== 'shorts').length
  }

  const clearAll = () => {
    setFilterOptions(prev =>
      prev.map(filter => ({ ...filter, enabled: filter.id === 'shorts' }))
    )
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
            {getActiveFilterCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Search Filters</SheetTitle>
            <SheetDescription>
              Toggle filters on/off to refine your viral video search
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6">
            {/* Filter Options */}
            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <filter.icon className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor={filter.id} className="font-medium cursor-pointer">
                      {filter.label}
                    </Label>
                  </div>
                  <Switch
                    id={filter.id}
                    checked={filter.enabled}
                    onCheckedChange={() => toggleFilter(filter.id)}
                  />
                </div>

                {/* Filter-specific configurations */}
                {filter.enabled && (
                  <div className="pl-6 space-y-2">
                    {filter.id === 'dateRange' && (
                      <Select
                        value={filter.config.preset}
                        onValueChange={(value) => updateFilterConfig('dateRange', { preset: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Last 24 hours</SelectItem>
                          <SelectItem value="last7days">Last 7 days</SelectItem>
                          <SelectItem value="last30days">Last 30 days</SelectItem>
                          <SelectItem value="last3months">Last 3 months</SelectItem>
                          <SelectItem value="lastyear">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {filter.id === 'viralScore' && (
                      <Select
                        value={filter.config.minScore.toString()}
                        onValueChange={(value) => updateFilterConfig('viralScore', { minScore: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50%+ Viral Score</SelectItem>
                          <SelectItem value="70">70%+ Viral Score</SelectItem>
                          <SelectItem value="85">85%+ Viral Score</SelectItem>
                          <SelectItem value="95">95%+ Explosive Growth</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {filter.id === 'viewCount' && (
                      <Select
                        value={filter.config.min?.toString() || '100000'}
                        onValueChange={(value) => updateFilterConfig('viewCount', { min: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10000">10K+ views</SelectItem>
                          <SelectItem value="100000">100K+ views</SelectItem>
                          <SelectItem value="1000000">1M+ views</SelectItem>
                          <SelectItem value="10000000">10M+ views</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {filter.id === 'engagement' && (
                      <div className="text-sm text-muted-foreground">
                        Videos with CTR above 10% and high retention
                      </div>
                    )}

                    {filter.id === 'duration' && (
                      <Select
                        value={filter.config.type}
                        onValueChange={(value) => updateFilterConfig('duration', { type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Under 4 minutes</SelectItem>
                          <SelectItem value="medium">4-20 minutes</SelectItem>
                          <SelectItem value="long">Over 20 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </div>
            ))}

            <Separator />

            {/* Preset Templates */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Quick Presets
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-2"
                  onClick={() => {
                    // Apply "Viral Research Mode" - best settings for finding truly viral content
                    setFilterOptions([
                      { id: 'dateRange', label: 'Time Period', icon: Calendar, enabled: true, config: { preset: 'last7days' } },
                      { id: 'viralScore', label: 'Viral Score', icon: TrendingUp, enabled: true, config: { minScore: 70 } },
                      { id: 'viewCount', label: 'View Count', icon: Eye, enabled: true, config: { min: 10000, max: 1000000 } },
                      { id: 'engagement', label: 'High Engagement', icon: MousePointer, enabled: true, config: { minCTR: 10 } },
                      { id: 'duration', label: 'Video Length', icon: Clock, enabled: true, config: { type: 'medium' } },
                      { id: 'shorts', label: 'Include Shorts', icon: Youtube, enabled: false, config: {} }
                    ])
                  }}
                >
                  🔬 Viral Research Mode (Recommended)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Apply "Hot Right Now" preset - videos exploding today
                    setFilterOptions([
                      { id: 'dateRange', label: 'Time Period', icon: Calendar, enabled: true, config: { preset: 'today' } },
                      { id: 'viralScore', label: 'Viral Score', icon: TrendingUp, enabled: true, config: { minScore: 90 } },
                      { id: 'viewCount', label: 'View Count', icon: Eye, enabled: true, config: { min: 50000, max: null } },
                      { id: 'engagement', label: 'High Engagement', icon: MousePointer, enabled: true, config: { minCTR: 10 } },
                      { id: 'duration', label: 'Video Length', icon: Clock, enabled: false, config: { type: 'medium' } },
                      { id: 'shorts', label: 'Include Shorts', icon: Youtube, enabled: false, config: {} }
                    ])
                  }}
                >
                  🔥 Hot Right Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Apply "Mega Viral" preset
                    setFilterOptions([
                      { id: 'dateRange', label: 'Time Period', icon: Calendar, enabled: true, config: { preset: 'last7days' } },
                      { id: 'viralScore', label: 'Viral Score', icon: TrendingUp, enabled: true, config: { minScore: 95 } },
                      { id: 'viewCount', label: 'View Count', icon: Eye, enabled: true, config: { min: 1000000, max: null } },
                      { id: 'engagement', label: 'High Engagement', icon: MousePointer, enabled: false, config: { minCTR: 10 } },
                      { id: 'duration', label: 'Video Length', icon: Clock, enabled: false, config: { type: 'medium' } },
                      { id: 'shorts', label: 'Include Shorts', icon: Youtube, enabled: false, config: {} }
                    ])
                  }}
                >
                  💎 Mega Viral
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Apply "Rising Stars" preset
                    setFilterOptions([
                      { id: 'dateRange', label: 'Time Period', icon: Calendar, enabled: true, config: { preset: 'last30days' } },
                      { id: 'viralScore', label: 'Viral Score', icon: TrendingUp, enabled: true, config: { minScore: 70 } },
                      { id: 'viewCount', label: 'View Count', icon: Eye, enabled: true, config: { min: 10000, max: 100000 } },
                      { id: 'engagement', label: 'High Engagement', icon: MousePointer, enabled: true, config: { minCTR: 10 } },
                      { id: 'duration', label: 'Video Length', icon: Clock, enabled: false, config: { type: 'medium' } },
                      { id: 'shorts', label: 'Include Shorts', icon: Youtube, enabled: true, config: {} }
                    ])
                  }}
                >
                  ⭐ Rising Stars
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Apply "Shorts Only" preset
                    setFilterOptions([
                      { id: 'dateRange', label: 'Time Period', icon: Calendar, enabled: true, config: { preset: 'last7days' } },
                      { id: 'viralScore', label: 'Viral Score', icon: TrendingUp, enabled: false, config: { minScore: 70 } },
                      { id: 'viewCount', label: 'View Count', icon: Eye, enabled: false, config: { min: 100000, max: null } },
                      { id: 'engagement', label: 'High Engagement', icon: MousePointer, enabled: false, config: { minCTR: 10 } },
                      { id: 'duration', label: 'Video Length', icon: Clock, enabled: true, config: { type: 'short' } },
                      { id: 'shorts', label: 'Include Shorts', icon: Youtube, enabled: true, config: {} }
                    ])
                  }}
                >
                  ⚡ Shorts Only
                </Button>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={clearAll}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button className="flex-1" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}