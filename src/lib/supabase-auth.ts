import { supabase } from "./supabase";

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { ok: false, error: new Error("Supabase is not configured") };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { ok: !error, data, error };
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  if (!supabase) return { ok: false, error: new Error("Supabase is not configured") };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName ?? "",
      },
    },
  });

  return { ok: !error, data, error };
}

export async function signOut() {
  if (!supabase) return { ok: false, error: new Error("Supabase is not configured") };

  const { error } = await supabase.auth.signOut();
  return { ok: !error, error };
}

export async function getCurrentUser() {
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user;
}
