import { Skeleton } from "@/components/skeleton/skeleton";

export function RecipeCardSkeleton() {
  return (
    <div className="rounded-xl border border-black/10 bg-background p-4 shadow-sm dark:border-white/15">
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="mt-3 grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
      <Skeleton className="mt-3 h-3 w-24" />
    </div>
  );
}
