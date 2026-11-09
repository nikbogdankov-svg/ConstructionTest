import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Matches the conversation layout (question bubble + answer) while a past conversation loads. */
export function ChatThreadLoading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-8">
      <span className="sr-only">Loading conversation…</span>
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="flex flex-col gap-4" aria-hidden>
          <Skeleton className="ml-8 h-12 w-3/5 self-end sm:ml-16" />
          <div className="flex gap-3">
            <Skeleton className="mt-1 hidden size-8 shrink-0 sm:block" />
            <div className="flex flex-1 flex-col gap-4">
              <SkeletonText lines={4} />
              <div className="flex gap-2">
                <Skeleton className="h-control-sm w-32 rounded-full" />
                <Skeleton className="h-control-sm w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
