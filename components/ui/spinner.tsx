import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent", {
  variants: {
    size: {
      xs: "size-icon-xs border-2",
      sm: "size-icon-sm border-2",
      md: "size-icon-md border-2",
      lg: "size-icon-lg border-3",
      xl: "size-icon-xl border-3",
    },
    tone: {
      current: "text-current",
      primary: "text-primary",
      muted: "text-foreground-subtle",
    },
  },
  defaultVariants: { size: "md", tone: "current" },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  /** Accessible label. Pass `null` when a parent already announces the busy state. */
  label?: string | null;
}

export function Spinner({ className, size, tone, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={cn(spinnerVariants({ size, tone }), className)}
      {...props}
    />
  );
}
