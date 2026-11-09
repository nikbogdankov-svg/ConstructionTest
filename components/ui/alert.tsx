import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full items-start gap-3 rounded-md border-2 border-l-6 p-4 text-body",
  {
    variants: {
      tone: {
        info: "border-info/40 border-l-info bg-info-subtle text-info-subtle-foreground",
        success: "border-success/40 border-l-success bg-success-subtle text-success-subtle-foreground",
        warning: "border-warning/60 border-l-warning bg-warning-subtle text-warning-subtle-foreground",
        danger: "border-danger/40 border-l-danger bg-danger-subtle text-danger-subtle-foreground",
        neutral: "border-border border-l-border-strong bg-surface-sunken text-foreground",
      },
      /** banner: full-width strip at the top of a page/region, no rounded corners. */
      layout: { inline: "", banner: "rounded-none border-x-0 border-t-0 border-l-0 border-b-2 px-4 py-3 sm:px-6" },
    },
    defaultVariants: { tone: "info", layout: "inline" },
  },
);

const icons = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert, neutral: Info } as const;

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  /** Buttons rendered on the right (stacked below on mobile). */
  action?: React.ReactNode;
  onDismiss?: () => void;
  icon?: React.ReactNode | false;
}

/** Inline message or page banner. Danger/warning are announced (role="alert"); others are role="status". */
export function Alert({ className, tone = "info", layout, title, action, onDismiss, icon, children, ...props }: AlertProps) {
  const Icon = icons[tone ?? "info"];
  return (
    <div
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ tone, layout }), className)}
      {...props}
    >
      {icon !== false && (
        <span className="mt-0.5 flex shrink-0 [&_svg]:size-icon-md" aria-hidden>
          {icon ?? <Icon />}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-0.5">
          {title && <p className="font-bold">{title}</p>}
          {children && <div className={cn(title && "text-body-sm")}>{children}</div>}
        </div>
        {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-my-2 -mr-2 inline-flex size-control-sm shrink-0 items-center justify-center rounded-sm hover:bg-foreground/10 focus-visible:focus-ring"
        >
          <X className="size-icon-md" aria-hidden />
        </button>
      )}
    </div>
  );
}
