"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root className={cn("flex flex-col gap-1", className)} {...props} />;
}

export interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function RadioGroupItem({ className, label, description, id, ...props }: RadioGroupItemProps) {
  const autoId = React.useId();
  const itemId = id ?? autoId;
  const radio = (
    <RadioGroupPrimitive.Item
      id={itemId}
      className={cn(
        "peer grid size-6 shrink-0 place-items-center rounded-full border-2 border-input-border bg-surface transition-colors",
        "hover:border-foreground-muted focus-visible:focus-ring",
        "data-[state=checked]:border-primary aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-sunken",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-3 rounded-full bg-primary data-[disabled]:bg-foreground-disabled" />
    </RadioGroupPrimitive.Item>
  );
  if (!label) return radio;
  return (
    <div className="flex min-h-control-md items-start gap-3 py-3">
      {radio}
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={itemId}
          className={cn("cursor-pointer text-body font-bold leading-6", props.disabled && "cursor-not-allowed text-foreground-disabled")}
        >
          {label}
        </label>
        {description && <p className="text-body-sm text-foreground-muted">{description}</p>}
      </div>
    </div>
  );
}
