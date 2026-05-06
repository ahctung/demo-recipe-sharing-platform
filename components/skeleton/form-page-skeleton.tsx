import { Skeleton } from "@/components/skeleton/skeleton";

export function FormPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <div className="mt-8 space-y-5 rounded-xl border border-black/10 bg-background p-6 shadow-sm dark:border-white/15">
        <div>
          <Skeleton className="h-3 w-12" />
          <Skeleton className="mt-2 h-11 w-full" />
        </div>
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-20 w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-11 w-full" />
          </div>
          <div>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-2 h-11 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-11 w-full" />
        </div>
        <div>
          <Skeleton className="h-3 w-24" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-3 w-24" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-black/10 pt-5 dark:border-white/15">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-24" />
        </div>
      </div>
    </div>
  );
}
