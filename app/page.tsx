import Link from "next/link";

import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getSupabaseHealth(): Promise<{
  ok: boolean;
  detail: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      return {
        ok: false,
        detail: `${error.message}${error.hint ? ` (${error.hint})` : ""}`,
      };
    }

    return {
      ok: true,
      detail:
        "Server client reached your project and `profiles` query completed without error.",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      detail: message,
    };
  }
}

export default async function Home() {
  const supabaseHealth = await getSupabaseHealth();

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            RecipeShare
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/recipes"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >
              Browse
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <h1 className="text-pretty text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Share recipes. Save favourites. Cook more often.
            </h1>
            <p className="max-w-xl text-pretty text-base leading-7 text-black/70 dark:text-white/70">
              A simple recipe library for home cooks and creators. Publish your
              best recipes, browse new ideas, and keep everything in one place.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/recipes"
                className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
              >
                Browse recipes
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Go to dashboard
              </Link>
            </div>

            <div
              className={`rounded-lg border p-4 text-sm ${
                supabaseHealth.ok
                  ? "border-emerald-600/30 bg-emerald-600/[0.06] dark:border-emerald-500/35 dark:bg-emerald-500/10"
                  : "border-red-600/35 bg-red-600/[0.06] dark:border-red-500/40 dark:bg-red-500/10"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-black/60 dark:text-white/60">
                Supabase check
              </div>
              <p className="mt-1 font-medium text-foreground">
                {supabaseHealth.ok
                  ? "Connected"
                  : "Something went wrong"}
              </p>
              <p className="mt-1 text-xs leading-5 text-black/70 dark:text-white/70">
                {supabaseHealth.detail}
              </p>
            </div>

            <div className="rounded-lg border border-black/10 bg-black/[0.02] p-4 dark:border-white/15 dark:bg-white/[0.04]">
              <label
                htmlFor="home-search"
                className="text-xs font-medium text-black/70 dark:text-white/70"
              >
                Search (coming next)
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="home-search"
                  name="q"
                  placeholder="Try “chicken”, “pasta”, “gluten free”…"
                  className="h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none placeholder:text-black/40 focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:placeholder:text-white/40 dark:focus:ring-white/20"
                  disabled
                />
                <button
                  type="button"
                  className="h-11 shrink-0 rounded-md bg-black/10 px-4 text-sm font-medium text-black/60 dark:bg-white/10 dark:text-white/60"
                  disabled
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-gradient-to-br from-black/[0.03] to-black/[0.01] p-6 dark:border-white/15 dark:from-white/[0.06] dark:to-white/[0.02]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-black/10 bg-background p-4 dark:border-white/15">
                <div className="text-xs font-medium text-black/60 dark:text-white/60">
                  Publish
                </div>
                <div className="mt-2 text-sm font-medium">
                  Ingredients, steps, time, servings
                </div>
                <div className="mt-1 text-sm text-black/60 dark:text-white/60">
                  Keep recipes consistent and easy to follow.
                </div>
              </div>
              <div className="rounded-xl border border-black/10 bg-background p-4 dark:border-white/15">
                <div className="text-xs font-medium text-black/60 dark:text-white/60">
                  Discover
                </div>
                <div className="mt-2 text-sm font-medium">
                  Search, tags, and filters
                </div>
                <div className="mt-1 text-sm text-black/60 dark:text-white/60">
                  Find dinner ideas fast.
                </div>
              </div>
              <div className="rounded-xl border border-black/10 bg-background p-4 dark:border-white/15">
                <div className="text-xs font-medium text-black/60 dark:text-white/60">
                  Save
                </div>
                <div className="mt-2 text-sm font-medium">Favourites</div>
                <div className="mt-1 text-sm text-black/60 dark:text-white/60">
                  Build your personal cookbook.
                </div>
              </div>
              <div className="rounded-xl border border-black/10 bg-background p-4 dark:border-white/15">
                <div className="text-xs font-medium text-black/60 dark:text-white/60">
                  Profile
                </div>
                <div className="mt-2 text-sm font-medium">
                  A home for your recipes
                </div>
                <div className="mt-1 text-sm text-black/60 dark:text-white/60">
                  Share a clean, simple recipe page.
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-16 border-t border-black/10 pt-6 text-xs text-black/60 dark:border-white/15 dark:text-white/60">
          MVP focus: publishing + browsing. Supabase Auth comes next.
        </footer>
      </main>
    </div>
  );
}
