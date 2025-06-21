"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithProvider: (provider: 'google' | 'github' | 'discord') => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!')
          router.push('/dashboard')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!')
          router.push('/')
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.success('Check your email for password reset instructions')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (!error) {
      toast.success('Check your email to confirm your account!')
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { error }
  }

  const signInWithProvider = async (provider: 'google' | 'github' | 'discord') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error signing out')
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (!error) {
      toast.success('Password reset email sent!')
    }

    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}