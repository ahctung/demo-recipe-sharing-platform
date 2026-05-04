"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type ParsedRecipe = {
  title: string;
  description: string | null;
  category: string;
  cook_time_minutes: number | null;
  difficulty: string | null;
  ingredients: string[];
  instructions: string[];
};

function parseRecipeFromFormData(formData: FormData): ParsedRecipe {
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

  return {
    title,
    description,
    category,
    cook_time_minutes,
    difficulty,
    ingredients,
    instructions,
  };
}

function assertValidRecipe(
  parsed: ParsedRecipe,
  errorRedirect: (msg: string) => void,
) {
  if (!parsed.title) {
    errorRedirect("Title is required.");
  }
  if (!parsed.category) {
    errorRedirect("Category is required.");
  }
  if (parsed.ingredients.length === 0) {
    errorRedirect("Add at least one ingredient.");
  }
  if (parsed.instructions.length === 0) {
    errorRedirect("Add at least one instruction step.");
  }
}

export async function createRecipeAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const parsed = parseRecipeFromFormData(formData);
  assertValidRecipe(parsed, (msg) =>
    redirect(`/dashboard/recipes/new?error=${encodeURIComponent(msg)}`),
  );

  const { data: inserted, error } = await supabase
    .from("recipes")
    .insert({
      user_id: user.id,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      cook_time_minutes: parsed.cook_time_minutes,
      difficulty: parsed.difficulty,
      ingredients: parsed.ingredients,
      instructions: parsed.instructions,
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

export async function updateRecipeAction(
  recipeId: string,
  formData: FormData,
) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const parsed = parseRecipeFromFormData(formData);
  assertValidRecipe(parsed, (msg) =>
    redirect(
      `/dashboard/recipes/${recipeId}?error=${encodeURIComponent(msg)}`,
    ),
  );

  const { data: updated, error } = await supabase
    .from("recipes")
    .update({
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      cook_time_minutes: parsed.cook_time_minutes,
      difficulty: parsed.difficulty,
      ingredients: parsed.ingredients,
      instructions: parsed.instructions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", recipeId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    redirect(
      `/dashboard/recipes/${recipeId}?error=${encodeURIComponent(error.message)}`,
    );
  }

  if (!updated) {
    redirect(
      `/dashboard/recipes/${recipeId}?error=${encodeURIComponent("Recipe not found or you do not have access.")}`,
    );
  }

  redirect(`/dashboard/recipes/${recipeId}?success=1`);
}

export async function deleteRecipeAction(recipeId: string, _formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/auth/login");
  }

  const { data: deleted, error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    redirect(`/dashboard/recipes/${recipeId}?error=${encodeURIComponent(error.message)}`);
  }

  if (!deleted) {
    redirect(
      `/dashboard/recipes/${recipeId}?error=${encodeURIComponent("Recipe not found or you do not have access.")}`,
    );
  }

  redirect("/dashboard");
}
