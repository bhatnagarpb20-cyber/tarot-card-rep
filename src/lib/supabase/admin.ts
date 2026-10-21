import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client that bypasses row-level security. Use only for operations that cannot be
 * done as the user, such as deleting an auth account. Never import from client code.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
