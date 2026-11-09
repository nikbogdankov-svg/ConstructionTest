"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: "md" | "lg";
}

export function Switch({ className, label, description, id, size = "md", ...props }: SwitchProps) {
  const autoId = React.useId();
  const switchId = id ?? autoId;
  const control = (
    <SwitchPrimitive.Root
      id={switchId}
      className={cn(
        "peer inline-flex shrink-0 items-center rounded-full border-2 border-input-border bg-surface-active p-0.5 transition-colors",
        "hover:border-foreground-muted focus-visible:focus-ring",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-sunken",
        size === "md" ? "h-7 w-12" : "h-8 w-14",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-surface shadow-xs ring-1 ring-border-strong transition-transform",
          "data-[state=checked]:ring-primary-active data-[disabled]:bg-surface-active",
          size === "md" ? "size-5 data-[state=checked]:translate-x-5" : "size-6 data-[state=checked]:translate-x-6",
        )}
      />
    </SwitchPrimitive.Root>
  );
  if (!label) return control;
  return (
    <div className="flex min-h-control-md items-center justify-between gap-4 py-2">
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={switchId}
          className={cn("cursor-pointer text-body font-bold", props.disabled && "cursor-not-allowed text-foreground-disabled")}
        >
          {label}
        </label>
        {description && <p className="text-body-sm text-foreground-muted">{description}</p>}
      </div>
      {control}
    </div>
  );
}
