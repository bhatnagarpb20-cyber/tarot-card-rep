/**
 * Supabase configuration. The URL and anon key are safe to expose to the browser (row-level
 * security protects the data). The service-role key is server-only and is read only in
 * `admin.ts`, which must never be imported from client components.
 */
export function supabasePublicEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return supabasePublicEnv() !== null;
}
