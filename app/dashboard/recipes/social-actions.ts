"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function toggleRecipeLikeAction(recipeId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const { data: existing, error: existingError } = await supabase
    .from("recipe_likes")
    .select("id")
    .eq("recipe_id", recipeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    const { error: deleteError } = await supabase
      .from("recipe_likes")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", user.id);

    if (deleteError) {
      throw deleteError;
    }
  } else {
    const { error: insertError } = await supabase.from("recipe_likes").insert({
      recipe_id: recipeId,
      user_id: user.id,
    });

    // If you have a unique constraint on (recipe_id, user_id),
    // treat duplicate-like races as success.
    if (insertError && insertError.code !== "23505") {
      throw insertError;
    }
  }

  revalidatePath(`/dashboard/recipes/${recipeId}`);
}

export async function addRecipeCommentAction(recipeId: string, comment: string) {
  const text = String(comment ?? "").trim();
  if (!text) {
    return;
  }

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase.from("recipe_comments").insert({
    recipe_id: recipeId,
    user_id: user.id,
    comment: text,
  });

  if (error) {
    throw error;
  }

  revalidatePath(`/dashboard/recipes/${recipeId}`);
}

