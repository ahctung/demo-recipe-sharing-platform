import { redirect } from "next/navigation";

import { logoutAction } from "@/app/auth/actions";
import { ensureProfileForUser } from "@/lib/profiles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  const { profile, error: profileError } = await ensureProfileForUser(
    supabase,
    data.user,
  );

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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

        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md border border-black/15 px-4 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-10 max-w-md">
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

