import { Skeleton } from "@/components/skeleton/skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-6 py-14">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="space-y-5 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15">
        <div>
          <Skeleton className="h-3 w-10" />
          <Skeleton className="mt-2 h-11 w-full" />
          <Skeleton className="mt-2 h-3 w-5/6" />
        </div>

        <div>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-11 w-full" />
        </div>

        <div>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-11 w-full" />
        </div>

        <div>
          <Skeleton className="h-3 w-8" />
          <Skeleton className="mt-2 h-24 w-full" />
        </div>

        <div className="rounded-md border border-black/10 bg-black/[0.02] p-3 dark:border-white/15 dark:bg-white/[0.04]">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </div>

        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-24" />
        </div>
      </div>
    </div>
  );
}
