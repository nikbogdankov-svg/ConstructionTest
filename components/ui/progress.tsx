"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface ProgressProps extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value"> {
  /** 0–100. Omit or pass null for an indeterminate bar. */
  value?: number | null;
  tone?: "primary" | "accent" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  label?: string;
  /** Show the percentage next to the label. */
  showValue?: boolean;
}

const toneClass = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

export function Progress({ className, value = null, tone = "primary", size = "md", label, showValue = false, ...props }: ProgressProps) {
  const indeterminate = value === null || value === undefined;
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3 text-body-sm">
          {label && <span className="font-bold text-foreground">{label}</span>}
          {showValue && !indeterminate && <span className="font-mono text-foreground-muted">{Math.round(value)}%</span>}
        </div>
      )}
      <ProgressPrimitive.Root
        value={indeterminate ? null : value}
        aria-label={label}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-surface-active",
          size === "sm" && "h-1.5",
          size === "md" && "h-2.5",
          size === "lg" && "h-4",
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full rounded-full transition-transform duration-300",
            toneClass[tone],
            indeterminate ? "w-2/5 animate-progress-indeterminate" : "w-full",
          )}
          style={indeterminate ? undefined : { transform: `translateX(-${100 - Math.min(100, Math.max(0, value))}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
