import { Skeleton } from "@/components/skeleton/skeleton";

export function HomePageSkeleton() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-11 w-40" />
          </div>
          <div className="rounded-2xl border border-black/10 p-6 dark:border-white/15">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-black/10 bg-background p-4 dark:border-white/15"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="mt-16 border-t border-black/10 pt-6 dark:border-white/15">
          <Skeleton className="h-3 w-64" />
        </div>
      </main>
    </div>
  );
}
