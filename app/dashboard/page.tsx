import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/auth/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Signed in as{" "}
            <span className="font-medium text-foreground">{data.user.email}</span>
          </p>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md border border-black/15 px-4 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/recipes"
          className="rounded-xl border border-black/10 bg-background p-5 hover:bg-black/[0.02] dark:border-white/15 dark:hover:bg-white/[0.04]"
        >
          <div className="text-sm font-medium">Browse recipes</div>
          <div className="mt-1 text-sm text-black/60 dark:text-white/60">
            Public feed (we’ll build this next).
          </div>
        </Link>
        <div className="rounded-xl border border-black/10 bg-background p-5 dark:border-white/15">
          <div className="text-sm font-medium">My recipes</div>
          <div className="mt-1 text-sm text-black/60 dark:text-white/60">
            Coming next: create, edit, delete.
          </div>
        </div>
      </div>
    </div>
  );
}

