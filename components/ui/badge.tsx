import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border-2 font-bold [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "border-transparent bg-surface-active text-foreground",
        primary: "border-transparent bg-primary-subtle text-primary-subtle-foreground",
        accent: "border-transparent bg-accent text-accent-foreground",
        success: "border-transparent bg-success-subtle text-success-subtle-foreground",
        warning: "border-transparent bg-warning-subtle text-warning-subtle-foreground",
        danger: "border-transparent bg-danger-subtle text-danger-subtle-foreground",
        info: "border-transparent bg-info-subtle text-info-subtle-foreground",
        outline: "border-border-strong bg-transparent text-foreground-muted",
        solid: "border-transparent bg-primary text-primary-foreground",
      },
      size: {
        sm: "h-6 px-1.5 text-caption [&_svg]:size-icon-xs",
        md: "h-7 px-2 text-body-sm [&_svg]:size-icon-sm",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

const dotTone: Record<string, string> = {
  neutral: "bg-foreground-subtle",
  primary: "bg-primary",
  accent: "bg-accent-foreground",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  outline: "bg-foreground-subtle",
  solid: "bg-primary-foreground",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Leading status dot. */
  dot?: boolean;
}

/** Non-interactive status/metadata label. For interactive chips use Tag. */
export function Badge({ className, tone, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot && <span aria-hidden className={cn("size-2 rounded-full", dotTone[tone ?? "neutral"])} />}
      {children}
    </span>
  );
}
