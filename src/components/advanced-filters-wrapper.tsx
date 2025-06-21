"use client"

import dynamic from 'next/dynamic'

const DynamicAdvancedFilters = dynamic(
  () => import('./advanced-filters').then(mod => mod.AdvancedFilters),
  { 
    ssr: false,
    loading: () => {
      console.log('Loading advanced filters...')
      return <div className="h-64 bg-secondary/20 rounded-lg border animate-pulse" />
    }
  }
)

export function AdvancedFiltersWrapper(props: any) {
  console.log('AdvancedFiltersWrapper props:', props)
  return <DynamicAdvancedFilters {...props} />
}