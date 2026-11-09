"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

/** Page numbers with ellipses, e.g. [1, "…", 4, 5, 6, "…", 12]. */
export function getPageRange(page: number, pageCount: number, siblings = 1): (number | "ellipsis")[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeftDots = left > 3;
  const showRightDots = right < pageCount - 2;
  if (!showLeftDots && showRightDots) {
    const count = 3 + siblings * 2;
    return [...Array.from({ length: count }, (_, i) => i + 1), "ellipsis", pageCount];
  }
  if (showLeftDots && !showRightDots) {
    const count = 3 + siblings * 2;
    return [1, "ellipsis", ...Array.from({ length: count }, (_, i) => pageCount - count + i + 1)];
  }
  return [1, "ellipsis", ...Array.from({ length: right - left + 1 }, (_, i) => left + i), "ellipsis", pageCount];
}

export interface PaginationProps {
  page: number; // 1-based
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Compact: "Page 2 of 5" with prev/next only (mobile). */
  compact?: boolean;
}

export function Pagination({ page, pageCount, onPageChange, className, compact = false }: PaginationProps) {
  if (pageCount <= 1) return null;
  const itemClass = cn(buttonVariants({ variant: "ghost", size: "sm" }), "min-w-control-sm px-2");
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "pl-2")}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft aria-hidden />
        <span className={cn(compact && "sr-only", "max-sm:sr-only")}>Previous</span>
      </button>
      {compact ? (
        <span className="px-3 text-body-sm text-foreground-muted" aria-live="polite">
          Page <strong className="text-foreground">{page}</strong> of {pageCount}
        </span>
      ) : (
        <ul className="flex items-center gap-1">
          {getPageRange(page, pageCount).map((p, i) =>
            p === "ellipsis" ? (
              <li key={`e${i}`} className="px-1 text-foreground-subtle" aria-hidden>
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  className={cn(itemClass, p === page && "bg-primary text-primary-foreground hover:bg-primary-hover")}
                  aria-current={p === page ? "page" : undefined}
                  aria-label={`Page ${p}`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              </li>
            ),
          )}
        </ul>
      )}
      <button
        type="button"
        className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "pr-2")}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        <span className={cn(compact && "sr-only", "max-sm:sr-only")}>Next</span>
        <ChevronRight aria-hidden />
      </button>
    </nav>
  );
}
