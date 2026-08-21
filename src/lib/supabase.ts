import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export async function getSupabase() {
  if (client) return client
  const response = await fetch('/api/config')
  if (!response.ok) {
    throw new Error('Could not load MichaelOS configuration from Netlify.')
  }
  const config = await response.json()
  client = createClient(config.supabaseUrl, config.supabaseAnonKey)
  return client
}
