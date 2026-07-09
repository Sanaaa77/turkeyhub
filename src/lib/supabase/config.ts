const FALLBACK_SUPABASE_URL = 'http://127.0.0.1:54321'
const FALLBACK_SUPABASE_ANON_KEY = 'local-build-placeholder-anon-key'

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY

  return {
    url,
    anonKey,
    isConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  }
}
