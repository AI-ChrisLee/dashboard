"use client"

import { useEffect } from 'react'
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType
    })
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // You can send this data to your analytics service
    // Example: Google Analytics, PostHog, etc.
    const body = JSON.stringify({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })

    // Send to our analytics endpoint
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    }).catch(error => {
      console.error('Failed to send web vitals:', error)
    })
  }
}

export function WebVitals() {
  useEffect(() => {
    // Core Web Vitals
    onCLS(sendToAnalytics) // Cumulative Layout Shift
    onFID(sendToAnalytics) // First Input Delay
    onLCP(sendToAnalytics) // Largest Contentful Paint
    
    // Additional metrics
    onFCP(sendToAnalytics) // First Contentful Paint
    onTTFB(sendToAnalytics) // Time to First Byte
    onINP(sendToAnalytics) // Interaction to Next Paint (new metric)
  }, [])

  return null
}

// Performance Observer for custom metrics
export function usePerformanceObserver() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Observe long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.log('[Performance] Long Task:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            })
          }
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })

      return () => longTaskObserver.disconnect()
    } catch (e) {
      // Some browsers don't support longtask
      console.debug('Long task observer not supported')
    }
  }, [])
}

// Hook to measure component render performance
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // Longer than one frame (16ms)
        console.log(`[Performance] ${componentName} render time:`, {
          duration: renderTime.toFixed(2) + 'ms',
          warning: renderTime > 100 ? 'Slow render detected' : null
        })
      }
    }
  }, [componentName])
}

// Performance marks for custom measurements
export const performanceMark = {
  start: (markName: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${markName}-start`)
    }
  },
  
  end: (markName: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${markName}-end`)
      
      try {
        performance.measure(
          markName,
          `${markName}-start`,
          `${markName}-end`
        )
        
        const measure = performance.getEntriesByName(markName)[0]
        if (measure && process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${markName}:`, {
            duration: measure.duration.toFixed(2) + 'ms'
          })
        }
      } catch (e) {
        // Ignore errors if marks don't exist
      }
    }
  }
}