"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** Optional inline label; the whole row becomes a 48px touch target. */
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function Checkbox({ className, label, description, id, ...props }: CheckboxProps) {
  const autoId = React.useId();
  const checkboxId = id ?? autoId;
  const box = (
    <CheckboxPrimitive.Root
      id={checkboxId}
      className={cn(
        "peer grid size-6 shrink-0 place-items-center rounded-xs border-2 border-input-border bg-surface text-primary-foreground transition-colors",
        "hover:border-foreground-muted focus-visible:focus-ring",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
        "aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-sunken data-[state=checked]:disabled:bg-foreground-disabled data-[state=checked]:disabled:border-foreground-disabled",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex">
        {props.checked === "indeterminate" ? (
          <Minus className="size-icon-sm" strokeWidth={3} aria-hidden />
        ) : (
          <Check className="size-icon-sm" strokeWidth={3} aria-hidden />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
  if (!label) return box;
  return (
    <div className="flex min-h-control-md items-start gap-3 py-3">
      {box}
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={checkboxId}
          className={cn("cursor-pointer text-body font-bold leading-6", props.disabled && "cursor-not-allowed text-foreground-disabled")}
        >
          {label}
        </label>
        {description && <p className="text-body-sm text-foreground-muted">{description}</p>}
      </div>
    </div>
  );
}
