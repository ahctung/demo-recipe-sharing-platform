import Link from "next/link";
import { redirect } from "next/navigation";

import { RecipeCard, type RecipeCardRecipe } from "@/components/RecipeCard";
import { ensureProfileForUser } from "@/lib/profiles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const createdId =
    typeof sp.created === "string" && sp.created.length > 0
      ? sp.created
      : null;

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  const { profile, error: profileError } = await ensureProfileForUser(
    supabase,
    data.user,
  );

  const { data: recipeRows, error: recipesError } = await supabase
    .from("recipes")
    .select("id, title, cook_time_minutes, difficulty, profiles(username)")
    .order("created_at", { ascending: false });

  const recipes = (recipeRows ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      title: string;
      cook_time_minutes: number | null;
      difficulty: string | null;
      profiles?: { username: string } | null;
    };

    return {
      id: r.id,
      title: r.title,
      cook_time_minutes: r.cook_time_minutes,
      difficulty: r.difficulty,
      creator_username: r.profiles?.username ?? null,
    } satisfies RecipeCardRecipe;
  });

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Signed in as{" "}
          <span className="font-medium text-foreground">{data.user.email}</span>
        </p>
        {profile ? (
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-black/60 dark:text-white/60">Username</dt>
              <dd className="font-medium text-foreground">{profile.username}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-black/60 dark:text-white/60">Full name</dt>
              <dd className="font-medium text-foreground">{profile.full_name}</dd>
            </div>
            {profile.bio ? (
              <div className="flex flex-col gap-1">
                <dt className="text-black/60 dark:text-white/60">Bio</dt>
                <dd className="text-foreground">{profile.bio}</dd>
              </div>
            ) : null}
          </dl>
        ) : profileError ? (
          <p className="mt-4 text-sm text-red-700 dark:text-red-200">
            Could not load profile: {profileError}
          </p>
        ) : null}
      </div>

      {createdId ? (
        <p className="mt-6 max-w-md rounded-md border border-emerald-600/30 bg-emerald-600/[0.06] px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          Recipe saved. (Id: <span className="font-mono">{createdId}</span>)
        </p>
      ) : null}

      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">All recipes</h2>
            <p className="mt-0.5 text-sm text-black/60 dark:text-white/60">
              Recipes created by everyone.
            </p>
          </div>
          <Link
            href="/dashboard/recipes/new"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
          >
            Create new recipe
          </Link>
        </div>

        {recipesError ? (
          <p className="text-sm text-red-700 dark:text-red-200">
            Could not load recipes: {recipesError.message}
          </p>
        ) : recipes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/60 dark:border-white/20 dark:text-white/60">
            No recipes yet. Create the first one with the button above.
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

