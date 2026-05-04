import Link from "next/link";

function formatCookTime(minutes: number | null): string {
  if (minutes === null || minutes === undefined) {
    return "Time not set";
  }
  if (minutes === 0) {
    return "0 min";
  }
  if (minutes === 1) {
    return "1 min";
  }
  return `${minutes} min`;
}

function formatDifficulty(value: string | null): string {
  if (!value) {
    return "—";
  }
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export type RecipeCardRecipe = {
  id: string;
  title: string;
  cook_time_minutes: number | null;
  difficulty: string | null;
};

type Props = {
  recipe: RecipeCardRecipe;
};

export function RecipeCard({ recipe }: Props) {
  return (
    <Link
      href={`/dashboard/recipes/${recipe.id}`}
      className="block rounded-xl border border-black/10 bg-background p-4 shadow-sm outline-none ring-offset-background transition-colors hover:border-black/20 hover:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-black/25 dark:border-white/15 dark:hover:bg-white/[0.04] dark:focus-visible:ring-white/30"
    >
      <article className="flex flex-col">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground">
          {recipe.title}
        </h2>
        <dl className="mt-3 grid gap-2 text-sm text-black/65 dark:text-white/65">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-black/50 dark:text-white/50">Time</dt>
            <dd className="font-medium text-foreground">
              {formatCookTime(recipe.cook_time_minutes)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="text-black/50 dark:text-white/50">Difficulty</dt>
            <dd className="font-medium text-foreground">
              {formatDifficulty(recipe.difficulty)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs font-medium text-foreground/80">
          Display recipe →
        </p>
      </article>
    </Link>
  );
}
