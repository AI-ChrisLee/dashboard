'use client'

import { useSentryUser } from '@/hooks/use-sentry-user'

export function SentryProvider({ children }: { children: React.ReactNode }) {
  // Only set up Sentry user context if Sentry is configured
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    useSentryUser()
  }
  
  return <>{children}</>
}