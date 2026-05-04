"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createRecipeAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const description = descriptionRaw === "" ? null : descriptionRaw;
  const category = String(formData.get("category") ?? "").trim();

  const cookRaw = formData.get("cook_time_minutes");
  let cook_time_minutes: number | null = null;
  if (cookRaw !== null && cookRaw !== "") {
    const n = Number(cookRaw);
    if (Number.isFinite(n) && n >= 0) {
      cook_time_minutes = Math.floor(n);
    }
  }

  const diffRaw = String(formData.get("difficulty") ?? "").trim();
  const difficulty = diffRaw === "" ? null : diffRaw;

  const ingredients = formData
    .getAll("ingredient")
    .map((s) => String(s).trim())
    .filter(Boolean);

  const instructions = formData
    .getAll("instruction")
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (!title) {
    redirect(
      `/dashboard/recipes/new?error=${encodeURIComponent("Title is required.")}`,
    );
  }
  if (!category) {
    redirect(
      `/dashboard/recipes/new?error=${encodeURIComponent("Category is required.")}`,
    );
  }
  if (ingredients.length === 0) {
    redirect(
      `/dashboard/recipes/new?error=${encodeURIComponent("Add at least one ingredient.")}`,
    );
  }
  if (instructions.length === 0) {
    redirect(
      `/dashboard/recipes/new?error=${encodeURIComponent("Add at least one instruction step.")}`,
    );
  }

  const { data: inserted, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title,
      description,
      category,
      cook_time_minutes,
      difficulty,
      ingredients,
      instructions,
    })
    .select("id")
    .single();

  if (error) {
    redirect(
      `/dashboard/recipes/new?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/dashboard?created=${inserted?.id ?? "1"}`);
}
