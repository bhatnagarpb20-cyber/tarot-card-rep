"use client";
import { createBrowserClient } from "@supabase/ssr";
import { supabasePublicEnv } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;

/** Browser Supabase client (anon key only), or null when Supabase is not configured. */
export function getSupabaseBrowserClient() {
  const env = supabasePublicEnv();
  if (!env) return null;
  client ??= createBrowserClient(env.url, env.anonKey);
  return client;
}
