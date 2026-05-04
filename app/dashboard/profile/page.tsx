import Link from "next/link";
import { redirect } from "next/navigation";

import { updateProfileAction } from "@/app/dashboard/profile/actions";
import { ProfileForm } from "@/components/ProfileForm";
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
      <ProfileForm
        profile={profile}
        error={error}
        success={success}
        action={updateProfileAction}
      />
    </div>
  );
}
