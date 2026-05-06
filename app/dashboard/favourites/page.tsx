import Link from "next/link";
import { redirect } from "next/navigation";

import { RecipeCard, type RecipeCardRecipe } from "@/components/RecipeCard";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type LikeRow = {
  created_at: string;
  recipes: {
    id: string;
    title: string;
    category: string;
    cook_time_minutes: number | null;
    difficulty: string | null;
    profiles?: { username: string } | null;
  } | null;
};

export default async function FavouritesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/auth/login");
  }

  const { data: likeRows, error: likesError } = await supabase
    .from("recipe_likes")
    .select(
      "created_at, recipes!recipe_likes_recipe_id_fkey(id, title, category, cook_time_minutes, difficulty, profiles(username))",
    )
    .eq("user_id", authData.user.id)
    .order("created_at", { ascending: false });

  const recipes: RecipeCardRecipe[] = (likeRows ?? []).flatMap((row) => {
    const r = row as unknown as LikeRow;
    const recipe = r.recipes;
    if (!recipe) {
      return [];
    }
    return [
      {
        id: recipe.id,
        title: recipe.title,
        category: recipe.category,
        cook_time_minutes: recipe.cook_time_minutes,
        difficulty: recipe.difficulty,
        creator_username: recipe.profiles?.username ?? null,
      } satisfies RecipeCardRecipe,
    ];
  });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Favourites</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Recipes you have liked.
        </p>
      </div>

      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Liked recipes</h2>
            <p className="mt-0.5 text-sm text-black/60 dark:text-white/60">
              Newest likes first.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>

        {likesError ? (
          <p className="text-sm text-red-700 dark:text-red-200">
            Could not load favourites: {likesError.message}
          </p>
        ) : recipes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/60 dark:border-white/20 dark:text-white/60">
            You have not liked any recipes yet. Browse the{" "}
            <Link href="/dashboard" className="font-medium text-foreground underline-offset-4 hover:underline">
              dashboard
            </Link>{" "}
            and tap the heart on a recipe.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
