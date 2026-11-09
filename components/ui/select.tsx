"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlBase } from "./input";
import { floatingSurface } from "./popover";
import { useFormFieldControlProps } from "./form-field";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: "sm" | "md" | "lg";
}

export function SelectTrigger({ className, children, size = "md", ...props }: SelectTriggerProps) {
  const fieldProps = useFormFieldControlProps(props);
  return (
    <SelectPrimitive.Trigger
      {...props}
      {...fieldProps}
      className={cn(
        controlBase,
        "flex items-center justify-between gap-2 text-left data-[placeholder]:text-foreground-subtle [&>span]:truncate",
        size === "sm" && "h-control-sm px-3 text-body-sm",
        size === "md" && "h-control-md px-4",
        size === "lg" && "h-control-lg px-4 text-body-lg",
        className,
      )}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-icon-md shrink-0 text-foreground-muted" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          floatingSurface,
          "relative max-h-(--radix-select-content-available-height) min-w-32 overflow-hidden",
          position === "popper" && "w-full min-w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-1.5 data-[side=top]:-translate-y-1.5",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-8 items-center justify-center text-foreground-muted">
          <ChevronUp className="size-icon-sm" aria-hidden />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-8 items-center justify-center text-foreground-muted">
          <ChevronDown className="size-icon-sm" aria-hidden />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-3 pt-2 pb-1 text-overline uppercase text-foreground-subtle", className)}
      {...props}
    />
  );
}

/** Shared row style for list items in menus, selects and comboboxes. */
export const menuItemBase =
  "relative flex min-h-control-sm w-full cursor-pointer select-none items-center gap-3 rounded-sm px-3 py-2 text-body outline-none transition-colors data-[highlighted]:bg-primary-subtle data-[highlighted]:text-primary-subtle-foreground data-[disabled]:pointer-events-none data-[disabled]:text-foreground-disabled [&_svg]:size-icon-md [&_svg]:shrink-0";

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn(menuItemBase, "pr-10", className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-3 flex">
        <Check className="text-primary" strokeWidth={2.5} aria-hidden />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("-mx-1.5 my-1.5 h-0.5 bg-border", className)} {...props} />;
}
