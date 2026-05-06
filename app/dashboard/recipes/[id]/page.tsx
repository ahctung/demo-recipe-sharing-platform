import { notFound, redirect } from "next/navigation";

import { deleteRecipeAction, updateRecipeAction } from "@/app/dashboard/recipes/actions";
import { RecipeForm, type RecipeFormInitialValues } from "@/components/RecipeForm";
import type { Recipe, RecipeCommentWithAuthor, RecipeWithSocial } from "@/lib/database.types";
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

  const [likesCountRes, myLikeRes, commentsRes] = await Promise.all([
    supabase
      .from("recipe_likes")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", id),
    supabase
      .from("recipe_likes")
      .select("id")
      .eq("recipe_id", id)
      .eq("user_id", authData.user.id)
      .maybeSingle(),
    supabase
      .from("recipe_comments")
      .select(
        "id, recipe_id, user_id, comment, created_at, updated_at, deleted_at, profiles!recipe_comments_user_id_fkey(username, full_name)",
      )
      .eq("recipe_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
  ]);

  const likes_count =
    likesCountRes.error || likesCountRes.count === null ? 0 : likesCountRes.count;
  const user_has_liked = !myLikeRes.error && !!myLikeRes.data;
  const comments = (commentsRes.data ?? []) as unknown as RecipeCommentWithAuthor[];

  const recipeWithSocial: RecipeWithSocial = {
    ...recipe,
    likes_count,
    user_has_liked,
    comments,
  };

  const initialValues: RecipeFormInitialValues = {
    title: recipeWithSocial.title,
    description: recipeWithSocial.description,
    category: recipeWithSocial.category,
    cook_time_minutes: recipeWithSocial.cook_time_minutes,
    difficulty: recipeWithSocial.difficulty,
    ingredients: [...recipeWithSocial.ingredients],
    instructions: [...recipeWithSocial.instructions],
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
        key={`${recipeWithSocial.id}-${recipeWithSocial.updated_at}`}
        mode="display"
        initialValues={initialValues}
        creatorUsername={creatorUsername}
        allowEdit={allowEdit}
        likeCount={recipeWithSocial.likes_count}
        userHasLiked={recipeWithSocial.user_has_liked}
        action={updateRecipeAction.bind(null, recipeWithSocial.id)}
        deleteAction={deleteRecipeAction.bind(null, recipeWithSocial.id)}
      />
    </div>
  );
}
