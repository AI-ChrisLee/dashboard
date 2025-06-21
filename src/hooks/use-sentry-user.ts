'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { useAuth } from '@/contexts/auth'

export function useSentryUser() {
  const { user } = useAuth()

  useEffect(() => {
    // Only set user context if Sentry is configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return
    }

    if (user) {
      // Set user context in Sentry
      Sentry.setUser({
        id: user.id,
        email: user.email || undefined,
      })
    } else {
      // Clear user context when logged out
      Sentry.setUser(null)
    }
  }, [user])
}