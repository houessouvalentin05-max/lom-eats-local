import { createClient } from "@supabase/supabase-js";

function getEnvValue(name: string): string | undefined {
  const runtimeEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const fromVite = runtimeEnv?.[name];
  if (fromVite) return fromVite;

  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }

  return undefined;
}

const supabaseUrl = getEnvValue("VITE_SUPABASE_URL") ?? getEnvValue("SUPABASE_URL");
const supabaseAnonKey = getEnvValue("VITE_SUPABASE_ANON_KEY") ?? getEnvValue("SUPABASE_ANON_KEY");

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

export function getSupabaseClient() {
  return supabase;
}

/** True when a Supabase URL + anon key are configured in this environment. */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
