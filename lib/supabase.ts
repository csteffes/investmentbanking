import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

let adminClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient | null {
  if (adminClient) return adminClient;

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  adminClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  });

  return adminClient;
}

export function getPublicSupabase(): SupabaseClient | null {
  if (publicClient) return publicClient;

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  publicClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  });

  return publicClient;
}
