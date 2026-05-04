import Link from "next/link";
import { redirect } from "next/navigation";

import { updateProfileAction } from "@/app/dashboard/profile/actions";
import { ensureProfileForUser } from "@/lib/profiles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProfileSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const success = sp.success === "1";

  const supabase = await createServerSupabaseClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/auth/login");
  }

  const { profile, error: profileError } = await ensureProfileForUser(
    supabase,
    authData.user,
  );

  if (!profile) {
    return (
      <div className="mx-auto w-full max-w-lg flex-1 px-6 py-14">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-4 text-sm text-red-700 dark:text-red-200">
          {profileError ?? "Could not load your profile."}
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-14">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Profile settings
        </h1>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          Update the fields stored in{" "}
          <span className="font-medium text-foreground">public.profiles</span>.
        </p>
      </div>

      {success ? (
        <div className="mb-4 rounded-md border border-emerald-600/30 bg-emerald-600/[0.06] px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          Profile saved.
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-md border border-red-600/30 bg-red-600/[0.06] px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <form
        action={updateProfileAction}
        className="space-y-5 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15"
      >
        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Email
          </span>
          <input
            type="email"
            readOnly
            value={profile.email}
            className="mt-2 h-11 w-full cursor-not-allowed rounded-md border border-black/10 bg-black/[0.03] px-3 text-sm text-black/70 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/70"
          />
          <p className="mt-1 text-xs text-black/55 dark:text-white/55">
            Sign-in email comes from Supabase Auth. We keep a copy in{" "}
            <code className="rounded bg-black/5 px-1 py-0.5 text-[0.7rem] dark:bg-white/10">
              profiles.email
            </code>{" "}
            in sync when you log in.
          </p>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Username
          </span>
          <input
            name="username"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9_]{3,30}"
            title="Lowercase letters, digits, underscores only (3–30 characters)"
            defaultValue={profile.username}
            className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Full name
          </span>
          <input
            name="full_name"
            type="text"
            required
            defaultValue={profile.full_name}
            className="mt-2 h-11 w-full rounded-md border border-black/10 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-black/70 dark:text-white/70">
            Bio
          </span>
          <textarea
            name="bio"
            rows={4}
            defaultValue={profile.bio ?? ""}
            placeholder="Tell others about your cooking style…"
            className="mt-2 w-full rounded-md border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/15 dark:focus:ring-white/20"
          />
        </label>

        <div className="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2 text-xs text-black/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/60">
          <span className="font-medium text-foreground">Not editable here:</span>{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 text-[0.7rem] dark:bg-white/10">
            id
          </code>
          ,{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 text-[0.7rem] dark:bg-white/10">
            created_at
          </code>
          ,{" "}
          <code className="rounded bg-black/5 px-1 py-0.5 text-[0.7rem] dark:bg-white/10">
            updated_at
          </code>{" "}
          (timestamps are set by the database).
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90"
          >
            Save changes
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-md border border-black/15 px-5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
