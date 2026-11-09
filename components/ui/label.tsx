"use client";

import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
}

export function Label({ className, required, optional, disabled, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "inline-flex items-center gap-1 text-label text-foreground",
        disabled && "text-foreground-disabled",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger" aria-hidden>
          *
        </span>
      )}
      {optional && <span className="text-body-sm text-foreground-subtle">(optional)</span>}
    </LabelPrimitive.Root>
  );
}
