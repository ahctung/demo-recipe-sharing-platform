import { redirect } from "next/navigation";

import { createRecipeAction } from "@/app/dashboard/recipes/actions";
import { RecipeForm } from "@/components/RecipeForm";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function NewRecipePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/auth/login");
  }

  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;

  return (
    <div className="flex-1 px-6 py-10">
      {error ? (
        <div className="mx-auto mb-6 max-w-2xl rounded-md border border-red-600/30 bg-red-600/[0.06] px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}
      <RecipeForm action={createRecipeAction} />
    </div>
  );
}
