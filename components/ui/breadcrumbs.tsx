import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: React.ReactNode;
  /** Omit for the current page (last item). */
  href?: string;
}

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-body-sm text-foreground-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={index} className="flex min-w-0 items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="truncate rounded-xs px-1 py-0.5 underline-offset-4 hover:text-foreground hover:underline focus-visible:focus-ring"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn("truncate px-1", last && "font-bold text-foreground")}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-icon-sm shrink-0 text-foreground-subtle" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
