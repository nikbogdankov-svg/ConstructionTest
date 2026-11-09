"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

/** Shared surface for floating panels (popover, menus, select, combobox). */
export const floatingSurface =
  "z-50 rounded-md border-2 border-border-strong bg-surface-raised text-foreground shadow-md outline-none data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out";

export function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(floatingSurface, "w-80 max-w-[calc(100vw-2rem)] p-4", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
