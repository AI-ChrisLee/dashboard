"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface RelatedKeywordsProps {
  videos: Array<{
    title: string
    description: string
    tags?: string[]
  }>
  currentQuery: string
  onKeywordClick: (keyword: string) => void
}

export function RelatedKeywords({ videos, currentQuery, onKeywordClick }: RelatedKeywordsProps) {
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])

  useEffect(() => {
    if (videos.length === 0) return

    // Extract keywords from video titles and descriptions
    const allText = videos.map(v => `${v.title} ${v.description}`).join(' ')
    
    // Common viral-related terms to look for
    const viralTerms = [
      'challenge', 'tutorial', 'review', 'reaction', 'explained', 
      'top 10', 'best', 'worst', 'tips', 'tricks', 'hacks',
      'how to', 'why', 'what', 'ultimate', 'complete guide',
      'for beginners', 'advanced', 'secrets', 'mistakes', 'comparison'
    ]

    // Extract relevant keywords from the content
    const keywords = new Set<string>()
    
    // Find viral terms in the content
    viralTerms.forEach(term => {
      if (allText.toLowerCase().includes(term) && !currentQuery.toLowerCase().includes(term)) {
        keywords.add(term)
      }
    })

    // Extract words that appear frequently (more than 3 times)
    const words = allText.toLowerCase().split(/\s+/)
      .filter(word => word.length > 4) // Only words longer than 4 chars
      .filter(word => !currentQuery.toLowerCase().includes(word))
    
    const wordFreq: Record<string, number> = {}
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })

    // Add frequent words as keywords
    Object.entries(wordFreq)
      .filter(([_, count]) => count > 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([word]) => keywords.add(word))

    // Get top 3 suggestions
    const suggestions = Array.from(keywords).slice(0, 3)
    setSuggestedKeywords(suggestions)
  }, [videos, currentQuery])

  if (suggestedKeywords.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>Try also:</span>
      </div>
      {suggestedKeywords.map((keyword) => (
        <Badge
          key={keyword}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onKeywordClick(keyword)}
        >
          {keyword}
        </Badge>
      ))}
    </div>
  )
}