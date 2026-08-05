import { supabase } from "./supabase";

export type UserProfile = {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  city?: string | null;
  role?: string | null;
};

export async function getProfileForUser(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile", error);
    return null;
  }

  return (data as UserProfile | null) ?? null;
}

export async function upsertProfileForUser(
  userId: string,
  profile: Partial<UserProfile>,
): Promise<UserProfile | null> {
  if (!supabase) return null;

  const payload = {
    id: userId,
    full_name: profile.full_name ?? null,
    username: profile.username ?? null,
    avatar_url: profile.avatar_url ?? null,
    bio: profile.bio ?? null,
    city: profile.city ?? null,
    role: profile.role ?? "user",
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Failed to upsert profile", error);
    return null;
  }

  return data as UserProfile | null;
}
