"use client";

import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconButtonVariants } from "./icon-button";

/** Side panel. Built on Dialog: focus-trapped, Escape closes, returns focus to the trigger. */
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

const sheetVariants = cva(
  "fixed z-50 flex flex-col bg-surface-raised text-foreground shadow-lg outline-none border-border-strong",
  {
    variants: {
      side: {
        right: "inset-y-0 right-0 h-full w-full border-l-2 data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right",
        left: "inset-y-0 left-0 h-full w-full border-r-2 data-[state=open]:animate-slide-in-left data-[state=closed]:animate-slide-out-left",
        bottom: "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-lg border-t-2 data-[state=open]:animate-slide-in-bottom data-[state=closed]:animate-slide-out-bottom",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      { side: ["left", "right"], size: "sm", className: "max-w-sidebar" },
      { side: ["left", "right"], size: "md", className: "max-w-sheet" },
      { side: ["left", "right"], size: "lg", className: "max-w-sheet-lg" },
    ],
    defaultVariants: { side: "right", size: "md" },
  },
);

export interface SheetContentProps
  extends React.ComponentProps<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideClose?: boolean;
}

export function SheetContent({ className, children, side, size, hideClose = false, ...props }: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
      <SheetPrimitive.Content className={cn(sheetVariants({ side, size }), className)} {...props}>
        {children}
        {!hideClose && (
          <SheetPrimitive.Close
            className={cn(iconButtonVariants({ variant: "ghost", size: "md" }), "absolute top-2 right-2")}
            aria-label="Close panel"
          >
            <X aria-hidden />
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 border-b-2 border-border px-5 py-4 pr-16", className)} {...props} />;
}

export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex gap-3 border-t-2 border-border px-5 py-4", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn("font-display text-h3", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={cn("text-body-sm text-foreground-muted", className)} {...props} />;
}
