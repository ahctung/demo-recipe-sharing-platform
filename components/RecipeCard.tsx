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
    <article className="flex flex-col rounded-xl border border-black/10 bg-background p-4 shadow-sm dark:border-white/15">
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
    </article>
  );
}
