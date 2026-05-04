import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Profile } from "@/lib/database.types";

function usernameBaseFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "user";
  let s = local
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  if (!s) s = "user";
  return s.slice(0, 30);
}

/**
 * Ensures a `profiles` row exists for this auth user and matches your table schema:
 * id, username, full_name, email, bio, created_at, updated_at (last two from DB defaults).
 */
export async function ensureProfileForUser(
  supabase: SupabaseClient,
  user: User,
): Promise<{ profile: Profile | null; error: string | null }> {
  const email = user.email?.trim() ?? "";
  if (!email) {
    return { profile: null, error: "Auth user has no email." };
  }

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    return { profile: null, error: readError.message };
  }

  if (existing) {
    const profile = existing as Profile;
    if (profile.email !== email) {
      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({ email })
        .eq("id", user.id)
        .select("*")
        .single();
      if (updateError) {
        return { profile: null, error: updateError.message };
      }
      return { profile: updated as Profile, error: null };
    }
    return { profile, error: null };
  }

  let username = usernameBaseFromEmail(email);
  const { data: nameTaken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (nameTaken && nameTaken.id !== user.id) {
    username = `${usernameBaseFromEmail(email).slice(0, 20)}_${user.id.replace(/-/g, "").slice(0, 8)}`;
  }

  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const fullName =
    (typeof meta?.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta?.name === "string" && meta.name.trim()) ||
    username;

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      username,
      full_name: fullName,
      email,
      bio: null,
    })
    .select("*")
    .single();

  if (insertError) {
    return { profile: null, error: insertError.message };
  }

  return { profile: inserted as Profile, error: null };
}
