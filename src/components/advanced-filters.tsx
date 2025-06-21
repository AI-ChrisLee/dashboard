"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { SearchFilters } from "@/types/filters"

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onApply: () => void
}

export function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  onApply
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  // Update filters and immediately apply
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...localFilters, ...newFilters }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  const handleShortsToggle = (includeShorts: boolean) => {
    const updated = { ...localFilters, includeShorts }
    setLocalFilters(updated)
    onFiltersChange(updated)
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
      {/* Time Period - Fixed to 1 month */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Period:</span>
        <span className="text-sm text-muted-foreground">Last 30 days</span>
      </div>

      {/* Views Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Views:</span>
        <span className="text-sm text-muted-foreground">100K+</span>
      </div>

      {/* Sort by Multiplier */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort:</span>
        <span className="text-sm text-muted-foreground">Top Multiplier</span>
      </div>

      {/* Shorts Toggle */}
      <div className="flex items-center gap-2 ml-auto">
        <Label className="text-sm">Shorts:</Label>
        <div className="flex gap-1">
          <Button
            variant={localFilters.includeShorts !== false ? "default" : "outline"}
            size="sm"
            onClick={() => handleShortsToggle(true)}
          >
            On
          </Button>
          <Button
            variant={localFilters.includeShorts === false ? "default" : "outline"}
            size="sm"
            onClick={() => handleShortsToggle(false)}
          >
            Off
          </Button>
        </div>
      </div>
    </div>
  )
}