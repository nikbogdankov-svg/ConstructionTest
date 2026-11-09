import { Skeleton } from "@/components/ui/skeleton";

/** Skeletons that match the real table/cards so the layout doesn't jump. */
export function DocumentsLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading documents…</span>
      <div className="hidden overflow-hidden rounded-md border-2 border-border bg-surface md:block" aria-hidden>
        <div className="flex h-control-md items-center gap-6 border-b-2 border-border-strong bg-surface-sunken px-4">
          {[30, 10, 10, 10, 14].map((w, i) => (
            <Skeleton key={i} className="h-3" style={{ width: `${w}%` }} />
          ))}
        </div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-6 border-b border-border px-4 py-4 last:border-0">
            <div className="flex w-[34%] items-center gap-3">
              <Skeleton className="size-5 shrink-0" />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
            <Skeleton className="h-6 w-[10%]" />
            <Skeleton className="h-4 w-[9%]" />
            <Skeleton className="h-4 w-[10%]" />
            <Skeleton className="h-4 w-[18%]" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 md:hidden" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-md border-2 border-border bg-surface p-4">
            <div className="flex gap-3">
              <Skeleton className="size-10 shrink-0" />
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
