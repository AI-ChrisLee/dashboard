// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Ignore specific errors on server
  ignoreErrors: [
    // Ignore rate limit errors
    'Rate limit exceeded',
    // Ignore YouTube API errors that are expected
    'quotaExceeded',
  ],

  beforeSend(event, hint) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }
    
    // Filter out specific API errors
    if (event.exception && hint.originalException) {
      const error = hint.originalException as Error
      
      // Don't log expected YouTube API errors
      if (error.message?.includes('YouTube API') && error.message?.includes('quota')) {
        return null
      }
    }
    
    return event
  },
})