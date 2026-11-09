import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small label above the title, e.g. the project code. */
  eyebrow?: React.ReactNode;
  /** Buttons aligned right on desktop, below the title on mobile. */
  actions?: React.ReactNode;
  /** Breadcrumbs or other navigation above everything. */
  breadcrumbs?: React.ReactNode;
}

/** Standard page title block with the brand's measuring-tape rule underneath. */
export function PageHeader({ title, description, eyebrow, actions, breadcrumbs, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3 pb-6 rule-ticks", className)} {...props}>
      {breadcrumbs}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow && <p className="text-overline uppercase text-primary">{eyebrow}</p>}
          <h1 className="font-display text-h2 text-balance text-foreground md:text-h1">{title}</h1>
          {description && <p className="max-w-prose text-body text-foreground-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </header>
  );
}
