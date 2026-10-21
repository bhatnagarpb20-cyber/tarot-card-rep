import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { supabasePublicEnv } from "./env";

/** Supabase client bound to the current request's auth cookies, or null if Supabase is not configured. */
export async function createSupabaseServerClient() {
  const env = supabasePublicEnv();
  if (!env) return null;
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only; middleware refreshes them.
        }
      },
    },
  });
}

export type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;

/**
 * Returns the signed-in user, verified with Supabase Auth (not just read from the cookie).
 * Null when signed out or when Supabase is not configured.
 */
export async function getCurrentUser(): Promise<{ user: User; supabase: SupabaseServerClient } | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { user: data.user, supabase };
}
