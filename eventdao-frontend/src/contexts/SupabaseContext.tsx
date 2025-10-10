'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: unknown; error: unknown }>
  signUp: (email: string, password: string, username?: string, fullName?: string) => Promise<{ data: unknown; error: unknown }>
  signOut: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if Supabase is properly configured
  const isPlaceholderKey = (key: string) => {
    return key.includes('dummy') || key.includes('placeholder') || key.includes('your-') || 
           key.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnem5hdHpteXNva3BhdGxhanhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MzQsImV4cCI6MjA1MDU1MDgzNH0.placeholder_key_replace_with_real_anon_key')
  }
  
  // Check if Supabase is properly configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !isPlaceholderKey(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    !isPlaceholderKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 100 // Real keys are much longer

  // Debug logging
  console.log('SupabaseContext Debug:')
  console.log('- URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('- Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)
  console.log('- Is placeholder URL:', isPlaceholderKey(process.env.NEXT_PUBLIC_SUPABASE_URL || ''))
  console.log('- Is placeholder key:', isPlaceholderKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''))
  console.log('- Is configured:', isSupabaseConfigured)

         useEffect(() => {
           if (isSupabaseConfigured) {
             // Use real Supabase authentication with error handling
             supabase.auth.getSession()
               .then(({ data: { session } }) => {
                 setSession(session)
                 setUser(session?.user ?? null)
                 setLoading(false)
               })
               .catch((error) => {
                 console.error('Supabase session error:', error)
                 setSession(null)
                 setUser(null)
                 setLoading(false)
               })

             // Listen for auth changes
             const {
               data: { subscription },
             } = supabase.auth.onAuthStateChange((_event, session) => {
               setSession(session)
               setUser(session?.user ?? null)
               setLoading(false)
             })

             return () => subscription.unsubscribe()
           } else {
      // Use development mode with localStorage
      const loadDevUser = () => {
        const devUser = localStorage.getItem('dev-user')
        if (devUser) {
          try {
            const userData = JSON.parse(devUser)
            setUser(userData as User)
            setSession({ user: userData } as Session)
          } catch (error) {
            console.error('Error parsing dev user:', error)
            localStorage.removeItem('dev-user')
            setUser(null)
            setSession(null)
          }
        } else {
          setUser(null)
          setSession(null)
        }
        setLoading(false)
      }
      
      loadDevUser()
      
      // Listen for auth state changes
      const handleAuthStateChange = () => {
        loadDevUser()
      }
      
      window.addEventListener('authStateChanged', handleAuthStateChange)
      
      return () => {
        window.removeEventListener('authStateChanged', handleAuthStateChange)
      }
    }
  }, [isSupabaseConfigured])

  const signIn = async (email: string, password: string) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured) {
      // Development mode: simulate sign in
      console.log('Development mode: simulating sign in for', email)
      
      // Simulate successful sign in
      const mockUser = {
        id: 'dev-user-' + Date.now(),
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        confirmation_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        invited_at: null,
        action_link: null,
        email_change: null,
        email_change_token: null,
        phone_change: null,
        phone_change_token: null,
        phone_confirmed_at: null,
        phone_change_sent_at: null,
        confirmed_at: new Date().toISOString(),
        email_change_confirm_status: 0,
        banned_until: null,
        reauthentication_sent_at: null,
        reauthentication_token: null,
        is_sso_user: false,
        deleted_at: null,
        is_anonymous: false
      }
      
      // Store in localStorage for development
      localStorage.setItem('dev-user', JSON.stringify(mockUser))
      
      // Dispatch custom event to update auth state
      window.dispatchEvent(new CustomEvent('authStateChanged'))
      
      return { 
        data: { user: mockUser }, 
        error: null 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: 'Authentication service unavailable. Please check your configuration.' 
        } 
      }
    }
  }

  const signUp = async (email: string, password: string, username?: string, fullName?: string) => {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured) {
      // Development mode: simulate sign up
      console.log('Development mode: simulating sign up for', email, 'username:', username)
      
      // Simulate successful sign up
      const mockUser = {
        id: 'dev-user-' + Date.now(),
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: null,
        last_sign_in_at: null,
        app_metadata: {},
        user_metadata: {
          username: username || email.split('@')[0],
          full_name: fullName || ''
        },
        aud: 'authenticated',
        confirmation_sent_at: new Date().toISOString(),
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        invited_at: null,
        action_link: null,
        email_change: null,
        email_change_token: null,
        phone_change: null,
        phone_change_token: null,
        phone_confirmed_at: null,
        phone_change_sent_at: null,
        confirmed_at: null,
        email_change_confirm_status: 0,
        banned_until: null,
        reauthentication_sent_at: null,
        reauthentication_token: null,
        is_sso_user: false,
        deleted_at: null,
        is_anonymous: false
      }
      
      // Store in localStorage for development
      localStorage.setItem('dev-user', JSON.stringify(mockUser))
      
      // Dispatch custom event to update auth state
      window.dispatchEvent(new CustomEvent('authStateChanged'))
      
      return { 
        data: { user: mockUser }, 
        error: null 
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username: username || email.split('@')[0],
            full_name: fullName || ''
          }
        }
      })
      return { data, error }
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: 'Authentication service unavailable. Please check your configuration.' 
        } 
      }
    }
  }

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      // Development mode: clear localStorage
      localStorage.removeItem('dev-user')
      setUser(null)
      setSession(null)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
