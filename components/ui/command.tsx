"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItemBase } from "./select";

/** Filterable list (cmdk). Used by Combobox; also good for a command palette. */
export function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return <CommandPrimitive className={cn("flex w-full flex-col overflow-hidden text-foreground", className)} {...props} />;
}

export function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-2 border-b-2 border-border px-3" cmdk-input-wrapper="">
      <Search className="size-icon-md shrink-0 text-foreground-subtle" aria-hidden />
      <CommandPrimitive.Input
        className={cn(
          "h-control-md w-full bg-transparent text-body outline-none placeholder:text-foreground-subtle disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return <CommandPrimitive.List className={cn("max-h-72 overflow-y-auto overscroll-contain p-1.5", className)} {...props} />;
}

export function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty className={cn("px-3 py-6 text-center text-body-sm text-foreground-muted", className)} {...props} />;
}

export function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-overline [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-foreground-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(menuItemBase, "data-[selected=true]:bg-primary-subtle data-[selected=true]:text-primary-subtle-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:text-foreground-disabled", className)}
      {...props}
    />
  );
}

export function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return <CommandPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-0.5 bg-border", className)} {...props} />;
}
