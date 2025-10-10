import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if keys are placeholder/dummy values
const isPlaceholderKey = (key: string) => {
  return key.includes('dummy') || key.includes('placeholder') || key.includes('your-') || 
         key.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnem5hdHpteXNva3BhdGxhanhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MzQsImV4cCI6MjA1MDU1MDgzNH0.placeholder_key_replace_with_real_anon_key')
}

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  !isPlaceholderKey(supabaseUrl) && !isPlaceholderKey(supabaseAnonKey) &&
  supabaseAnonKey.length > 100 // Real keys are much longer

// Debug logging
console.log('Environment check:')
console.log('- URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('- Key:', supabaseAnonKey ? 'Present' : 'Missing')
console.log('- URL value:', supabaseUrl)
console.log('- Key length:', supabaseAnonKey?.length)
console.log('- Is placeholder URL:', isPlaceholderKey(supabaseUrl || ''))
console.log('- Is placeholder key:', isPlaceholderKey(supabaseAnonKey || ''))
console.log('- Is configured:', isSupabaseConfigured)

// Create fallback Supabase client for development
const createFallbackClient = () => {
  const fallbackUrl = 'https://placeholder.supabase.co'
  const fallbackKey = 'placeholder-key'
  
  return createClient(fallbackUrl, fallbackKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Use real Supabase client if properly configured, otherwise use fallback
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createFallbackClient()

// For server-side operations that require service role key
// Only create admin client if service role key is available (server-side only)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null
