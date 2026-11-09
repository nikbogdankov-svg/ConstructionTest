import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Buttons. Put the primary action first. */
  actions?: React.ReactNode;
  /** neutral: nothing here yet. danger: something failed. */
  tone?: "neutral" | "danger";
  size?: "sm" | "md" | "lg";
  /** Draw a dashed frame (use when the empty state sits inside a page, not a card). */
  framed?: boolean;
  headingLevel?: "h1" | "h2" | "h3" | "p";
}

/** For empty lists, first-run, not-found and error states. */
export function EmptyState({
  icon,
  title,
  description,
  actions,
  tone = "neutral",
  size = "md",
  framed = false,
  headingLevel = "h2",
  className,
  ...props
}: EmptyStateProps) {
  const Heading = headingLevel;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" && "gap-2 px-4 py-8",
        size === "md" && "gap-3 px-6 py-12",
        size === "lg" && "gap-4 px-6 py-20",
        framed && "rounded-md border-2 border-dashed border-border-strong bg-surface",
        className,
      )}
      {...props}
    >
      {icon && (
        <div
          aria-hidden
          className={cn(
            "mb-1 flex items-center justify-center rounded-md [&_svg]:size-icon-xl",
            size === "sm" ? "size-12 [&_svg]:size-icon-lg" : "size-16",
            tone === "neutral" ? "bg-primary-subtle text-primary-subtle-foreground" : "bg-danger-subtle text-danger-subtle-foreground",
          )}
        >
          {icon}
        </div>
      )}
      <Heading className={cn("font-display text-foreground", size === "sm" ? "text-h4 font-sans" : "text-h3")}>{title}</Heading>
      {description && <p className="max-w-prose text-body text-foreground-muted">{description}</p>}
      {actions && <div className="mt-2 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  );
}
