import { RecipeCardSkeleton } from "@/components/skeleton/recipe-card-skeleton";
import { Skeleton } from "@/components/skeleton/skeleton";

export function DashboardPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-wrap gap-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>

      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Skeleton className="h-11 w-full sm:w-64" />
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-32" />
              <Skeleton className="h-11 w-20" />
            </div>
            <Skeleton className="h-11 w-40" />
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <RecipeCardSkeleton />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
