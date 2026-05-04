import { notFound, redirect } from "next/navigation";

import { deleteRecipeAction, updateRecipeAction } from "@/app/dashboard/recipes/actions";
import { RecipeForm, type RecipeFormInitialValues } from "@/components/RecipeForm";
import type { Recipe } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function RecipeDetailEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const success = sp.success === "1";

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/auth/login");
  }

  const { data: row, error: fetchError } = await supabase
    .from("recipes")
    .select("*, profiles(username)")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !row) {
    notFound();
  }

  const recipe = row as Recipe;
  const creatorUsername =
    (
      row as unknown as {
        profiles?: { username: string } | null;
      }
    ).profiles?.username ?? null;
  const allowEdit = recipe.user_id === authData.user.id;

  const initialValues: RecipeFormInitialValues = {
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    cook_time_minutes: recipe.cook_time_minutes,
    difficulty: recipe.difficulty,
    ingredients: [...recipe.ingredients],
    instructions: [...recipe.instructions],
  };

  return (
    <div className="flex-1 px-6 py-10">
      {success ? (
        <div className="mx-auto mb-6 max-w-2xl rounded-md border border-emerald-600/30 bg-emerald-600/[0.06] px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          Recipe updated.
        </div>
      ) : null}
      {error ? (
        <div className="mx-auto mb-6 max-w-2xl rounded-md border border-red-600/30 bg-red-600/[0.06] px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}
      <RecipeForm
        key={`${recipe.id}-${recipe.updated_at}`}
        mode="display"
        initialValues={initialValues}
        creatorUsername={creatorUsername}
        allowEdit={allowEdit}
        action={updateRecipeAction.bind(null, recipe.id)}
        deleteAction={deleteRecipeAction.bind(null, recipe.id)}
      />
    </div>
  );
}
