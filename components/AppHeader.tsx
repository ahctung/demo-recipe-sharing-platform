import Link from "next/link";

import { logoutAction } from "@/app/auth/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function AppHeader() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          RecipeShare
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard/profile"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                Dashboard
              </Link>
              <form action={logoutAction} className="inline">
                <button
                  type="submit"
                  className="rounded-md border border-black/15 px-3 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
