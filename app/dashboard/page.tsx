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
  const qRaw = typeof sp.q === "string" ? sp.q : "";
  const q = qRaw.trim();
  const categoryRaw = typeof sp.category === "string" ? sp.category : "";
  const category = categoryRaw.trim();
  const difficultyRaw = typeof sp.difficulty === "string" ? sp.difficulty : "";
  const difficulty = difficultyRaw.trim();

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  const { profile, error: profileError } = await ensureProfileForUser(
    supabase,
    data.user,
  );

  let recipesQuery = supabase
    .from("recipes")
    .select(
      "id, title, category, cook_time_minutes, difficulty, profiles(username)",
    )
    .order("created_at", { ascending: false });

  if (category) {
    recipesQuery = recipesQuery.eq("category", category);
  }

  if (difficulty) {
    recipesQuery = recipesQuery.eq("difficulty", difficulty);
  }

  if (q) {
    const escaped = q.replaceAll(",", "\\,");
    recipesQuery = recipesQuery.or(
      `title.ilike.%${escaped}%,category.ilike.%${escaped}%`,
    );
  }

  const { data: recipeRows, error: recipesError } = await recipesQuery;

  const categories = Array.from(
    new Set(
      (recipeRows ?? [])
        .map((row) => (row as unknown as { category?: string | null }).category)
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim()),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const recipes = (recipeRows ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      title: string;
      category: string;
      cook_time_minutes: number | null;
      difficulty: string | null;
      profiles?: { username: string } | null;
    };

    return {
      id: r.id,
      title: r.title,
      category: r.category,
      cook_time_minutes: r.cook_time_minutes,
      difficulty: r.difficulty,
      creator_username: r.profiles?.username ?? null,
    } satisfies RecipeCardRecipe;
  });

  // Remount the filter form when URL params change so defaultValue (search + selects) stays in sync
  // with the server after client-side navigation (e.g. Clear → /dashboard).
  const filterFormKey = `q:${qRaw}|d:${difficultyRaw}|c:${categoryRaw}`;

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
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <form
              key={filterFormKey}
              action="/dashboard"
              className="flex items-center gap-2"
            >
              <input
                name="q"
                defaultValue={qRaw}
                placeholder="Search recipes…"
                className="h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 sm:w-64 dark:border-white/15 dark:focus:ring-white/20"
              />
              <select
                name="category"
                defaultValue={categoryRaw}
                className="h-11 rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
                name="difficulty"
                defaultValue={difficultyRaw}
                className="h-11 rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
              >
                <option value="">All difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-md border border-black/15 px-4 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Search
              </button>
              {qRaw.trim() || difficultyRaw.trim() || categoryRaw.trim() ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Clear
                </Link>
              ) : null}
            </form>
            <Link
              href="/dashboard/recipes/new"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
            >
              Create new recipe
            </Link>
          </div>
        </div>

        {recipesError ? (
          <p className="text-sm text-red-700 dark:text-red-200">
            Could not load recipes: {recipesError.message}
          </p>
        ) : recipes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/60 dark:border-white/20 dark:text-white/60">
            {qRaw.trim() || difficultyRaw.trim() || categoryRaw.trim()
              ? "No recipes found for the current filters."
              : "No recipes yet. Create the first one with the button above."}
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

