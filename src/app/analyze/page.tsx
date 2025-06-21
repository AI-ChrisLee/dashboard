"use client"

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AnalyzePage() {
  // Temporarily redirect to analytics until Analyze module is built
  useEffect(() => {
    redirect('/analytics')
  }, [])

  return null
}