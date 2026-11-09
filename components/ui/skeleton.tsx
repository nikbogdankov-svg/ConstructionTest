import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Placeholder block. Renders a block-level <span> so it is valid inside text elements (<p>, <h1>).
 * Wrap groups of skeletons in an element with aria-busy and a visually hidden label.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span aria-hidden className={cn("block animate-shimmer rounded-sm bg-skeleton", className)} {...props} />;
}

/** Lines of text placeholder; the last line is shorter. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
      ))}
    </div>
  );
}
