"use client";

import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  /** "ticks" draws the brand's measuring-tape rule (horizontal only). */
  variant?: "solid" | "strong" | "ticks";
}

export function Separator({ className, orientation = "horizontal", decorative = true, variant = "solid", ...props }: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        variant === "solid" && "bg-border",
        variant === "strong" && "bg-border-strong",
        variant === "ticks" && "rule-ticks h-1.5",
        variant !== "ticks" && (orientation === "horizontal" ? "h-0.5 w-full" : "h-full w-0.5"),
        variant === "ticks" && "w-full",
        className,
      )}
      {...props}
    />
  );
}
