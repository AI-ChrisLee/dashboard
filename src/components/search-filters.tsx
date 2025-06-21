"use client"

import { useState } from "react"
import { Calendar, Filter, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { SearchFilters } from "@/types/filters"
import { defaultFilters, subscriberRanges, viewRanges } from "@/types/filters"

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onApply: () => void
}

export function SearchFiltersComponent({ filters, onFiltersChange, onApply }: SearchFiltersProps) {
  const [open, setOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  const handleApply = () => {
    onFiltersChange(localFilters)
    onApply()
    setOpen(false)
  }

  const handleReset = () => {
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.dateRange.preset !== 'last30days') count++
    if (localFilters.subscriberCount.min || localFilters.subscriberCount.max) count++
    if (localFilters.viewCount.min || localFilters.viewCount.max) count++
    if (localFilters.duration !== 'any') count++
    if (localFilters.sortBy !== 'viralScore') count++
    return count
  }

  const activeCount = getActiveFilterCount()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Search Filters</SheetTitle>
          <SheetDescription>
            Refine your search to find the most viral videos
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          {/* Date Range */}
          <div className="space-y-3">
            <Label>Date Range</Label>
            <RadioGroup
              value={localFilters.dateRange.preset || 'custom'}
              onValueChange={(value) => {
                const preset = value as typeof localFilters.dateRange.preset
                let from: Date | null = null
                let to: Date | null = new Date()

                switch (preset) {
                  case 'today':
                    from = new Date()
                    from.setHours(0, 0, 0, 0)
                    break
                  case 'yesterday':
                    from = new Date()
                    from.setDate(from.getDate() - 1)
                    to = new Date(from)
                    to.setHours(23, 59, 59, 999)
                    break
                  case 'last7days':
                    from = new Date()
                    from.setDate(from.getDate() - 7)
                    break
                  case 'last30days':
                    from = new Date()
                    from.setDate(from.getDate() - 30)
                    break
                }

                setLocalFilters({
                  ...localFilters,
                  dateRange: { from, to, preset }
                })
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today">Today</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yesterday" id="yesterday" />
                <Label htmlFor="yesterday">Yesterday</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last7days" id="last7days" />
                <Label htmlFor="last7days">Last 7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last30days" id="last30days" />
                <Label htmlFor="last30days">Last 30 days</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subscriber Count Range */}
          <div className="space-y-3">
            <Label>Channel Subscriber Count</Label>
            <Select
              value={`${localFilters.subscriberCount.min || ''}-${localFilters.subscriberCount.max || ''}`}
              onValueChange={(value) => {
                const range = subscriberRanges.find(r => `${r.min || ''}-${r.max || ''}` === value)
                if (range) {
                  setLocalFilters({
                    ...localFilters,
                    subscriberCount: { min: range.min, max: range.max }
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {subscriberRanges.map((range) => (
                  <SelectItem key={range.label} value={`${range.min || ''}-${range.max || ''}`}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Count Range */}
          <div className="space-y-3">
            <Label>Video View Count</Label>
            <Select
              value={`${localFilters.viewCount.min || ''}-${localFilters.viewCount.max || ''}`}
              onValueChange={(value) => {
                const range = viewRanges.find(r => `${r.min || ''}-${r.max || ''}` === value)
                if (range) {
                  setLocalFilters({
                    ...localFilters,
                    viewCount: { min: range.min, max: range.max }
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {viewRanges.map((range) => (
                  <SelectItem key={range.label} value={`${range.min || ''}-${range.max || ''}`}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Video Duration */}
          <div className="space-y-3">
            <Label>Video Duration</Label>
            <RadioGroup
              value={localFilters.duration || 'any'}
              onValueChange={(value) => {
                setLocalFilters({
                  ...localFilters,
                  duration: value as typeof localFilters.duration
                })
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" />
                <Label htmlFor="any">Any duration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="short" id="short" />
                <Label htmlFor="short">Short (&lt; 4 minutes)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium (4-20 minutes)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long">Long (&gt; 20 minutes)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sort Options */}
          <div className="space-y-3">
            <Label>Sort By</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value) => {
                setLocalFilters({
                  ...localFilters,
                  sortBy: value as typeof localFilters.sortBy
                })
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viralScore">Viral Score</SelectItem>
                <SelectItem value="viewCount">View Count</SelectItem>
                <SelectItem value="date">Upload Date</SelectItem>
                <SelectItem value="rating">Engagement</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}