import { supabase } from './supabase'

// Event-related functions
export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizer: string
  created_at: string
  updated_at: string
}

export interface EventClaim {
  id: string
  event_id: string
  user_id: string
  claim_text: string
  evidence_url?: string
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}

// Event operations
export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
  
  if (error) throw error
  return data as Event[]
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Event
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single()
  
  if (error) throw error
  return data as Event
}

// Event claim operations
export async function getEventClaims(eventId: string) {
  const { data, error } = await supabase
    .from('event_claims')
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as (EventClaim & { profiles: { username: string; avatar_url: string } })[]
}

export async function createEventClaim(claim: Omit<EventClaim, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('event_claims')
    .insert([claim])
    .select()
    .single()
  
  if (error) throw error
  return data as EventClaim
}

export async function updateEventClaimStatus(id: string, status: 'verified' | 'rejected') {
  const { data, error } = await supabase
    .from('event_claims')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as EventClaim
}

// User profile operations
export interface Profile {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data as Profile
}

// Leaderboard operations
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      event_claims!inner (
        status
      )
    `)
    .eq('event_claims.status', 'verified')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
