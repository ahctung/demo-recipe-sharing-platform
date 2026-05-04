import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
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
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Go to dashboard
              </Link>
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
