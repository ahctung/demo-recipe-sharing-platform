"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const USERNAME_RE = /^[a-z0-9_]{3,30}$/;

export async function updateProfileAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const full_name = String(formData.get("full_name") ?? "").trim();
  const bioRaw = formData.get("bio");
  const bio =
    bioRaw === null || bioRaw === "" ? null : String(bioRaw).trim() || null;

  if (!USERNAME_RE.test(username)) {
    redirect(
      `/dashboard/profile?error=${encodeURIComponent(
        "Username must be 3–30 characters: lowercase letters, digits, and underscores only.",
      )}`,
    );
  }

  if (!full_name) {
    redirect(
      `/dashboard/profile?error=${encodeURIComponent("Full name is required.")}`,
    );
  }

  const { data: other } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (other && other.id !== user.id) {
    redirect(
      `/dashboard/profile?error=${encodeURIComponent(
        "That username is already taken.",
      )}`,
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    redirect(
      `/dashboard/profile?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/dashboard/profile?success=1");
}
