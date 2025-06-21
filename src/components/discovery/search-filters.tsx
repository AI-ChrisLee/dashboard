"use client"

import { useState } from 'react'
import { Filter, X, TrendingUp, Clock, Eye, MousePointer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface SearchFiltersProps {
  onFiltersChange?: (filters: any) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    timeRange: 'last7days',
    minViews: [100000],
    maxViews: [10000000],
    minCTR: [5],
    viralScore: 'all',
    contentType: 'all',
    duration: 'all',
    trending: true,
    highRetention: false,
    includeShorts: true,
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Track active filters
    if (value && value !== 'all' && value !== false) {
      setActiveFilters([...new Set([...activeFilters, key])])
    } else {
      setActiveFilters(activeFilters.filter(f => f !== key))
    }
    
    onFiltersChange?.(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      timeRange: 'last7days',
      minViews: [100000],
      maxViews: [10000000],
      minCTR: [5],
      viralScore: 'all',
      contentType: 'all',
      duration: 'all',
      trending: true,
      highRetention: false,
      includeShorts: true,
    })
    setActiveFilters([])
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />
          {activeFilters.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Fine-tune your search to find the perfect videos to steal from
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Time Range */}
          <div className="space-y-3">
            <Label>Time Range</Label>
            <RadioGroup value={filters.timeRange} onValueChange={(value) => updateFilter('timeRange', value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today" className="font-normal cursor-pointer">
                  Last 24 hours
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last7days" id="last7days" />
                <Label htmlFor="last7days" className="font-normal cursor-pointer">
                  Last 7 days
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last30days" id="last30days" />
                <Label htmlFor="last30days" className="font-normal cursor-pointer">
                  Last 30 days
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alltime" id="alltime" />
                <Label htmlFor="alltime" className="font-normal cursor-pointer">
                  All time
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* View Count Range */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Count Range
            </Label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Minimum views</span>
                  <span className="text-sm font-medium">
                    {filters.minViews[0].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={filters.minViews}
                  onValueChange={(value) => updateFilter('minViews', value)}
                  min={0}
                  max={10000000}
                  step={100000}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Maximum views</span>
                  <span className="text-sm font-medium">
                    {filters.maxViews[0].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={filters.maxViews}
                  onValueChange={(value) => updateFilter('maxViews', value)}
                  min={0}
                  max={50000000}
                  step={1000000}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* CTR Threshold */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Minimum CTR
            </Label>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Click-through rate</span>
              <span className="text-sm font-medium">{filters.minCTR[0]}%</span>
            </div>
            <Slider
              value={filters.minCTR}
              onValueChange={(value) => updateFilter('minCTR', value)}
              min={0}
              max={30}
              step={1}
            />
          </div>

          <Separator />

          {/* Viral Score */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Viral Score
            </Label>
            <Select value={filters.viralScore} onValueChange={(value) => updateFilter('viralScore', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All videos</SelectItem>
                <SelectItem value="high">High viral potential (80%+)</SelectItem>
                <SelectItem value="medium">Medium viral potential (50-79%)</SelectItem>
                <SelectItem value="explosive">Explosive growth only (95%+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Content Type */}
          <div className="space-y-3">
            <Label>Content Type</Label>
            <Select value={filters.contentType} onValueChange={(value) => updateFilter('contentType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="tutorial">Tutorials</SelectItem>
                <SelectItem value="reaction">Reactions</SelectItem>
                <SelectItem value="vlog">Vlogs</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="shorts">Shorts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Video Duration */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Video Duration
            </Label>
            <Select value={filters.duration} onValueChange={(value) => updateFilter('duration', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any duration</SelectItem>
                <SelectItem value="short">Under 4 minutes</SelectItem>
                <SelectItem value="medium">4-20 minutes</SelectItem>
                <SelectItem value="long">Over 20 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Additional Filters */}
          <div className="space-y-4">
            <Label>Additional Filters</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="trending" className="font-normal cursor-pointer">
                Currently trending
              </Label>
              <Switch
                id="trending"
                checked={filters.trending}
                onCheckedChange={(checked) => updateFilter('trending', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="highRetention" className="font-normal cursor-pointer">
                High retention (70%+)
              </Label>
              <Switch
                id="highRetention"
                checked={filters.highRetention}
                onCheckedChange={(checked) => updateFilter('highRetention', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="includeShorts" className="font-normal cursor-pointer">
                Include YouTube Shorts
              </Label>
              <Switch
                id="includeShorts"
                checked={filters.includeShorts}
                onCheckedChange={(checked) => updateFilter('includeShorts', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <Button className="flex-1" onClick={() => {
              // Convert internal filter format to SearchFilters format
              const searchFilters = {
                sortBy: filters.viralScore === 'all' ? 'viralScore' : 'viralScore',
                sortOrder: 'desc' as const,
                dateRange: {
                  preset: filters.timeRange as any,
                  from: null,
                  to: null
                },
                subscriberCount: {
                  min: null,
                  max: null
                },
                viewCount: {
                  min: filters.minViews[0],
                  max: filters.maxViews[0]
                },
                duration: filters.duration as any,
                includeShorts: filters.includeShorts
              }
              onFiltersChange?.(searchFilters)
            }}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}