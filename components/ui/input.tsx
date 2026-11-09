"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useFormFieldControlProps } from "./form-field";

/** Shared look for text-like controls (Input, Textarea, Select trigger, Combobox trigger). */
export const controlBase = [
  "w-full min-w-0 rounded-sm border-2 border-input-border bg-surface text-body text-foreground transition-colors",
  "placeholder:text-foreground-subtle",
  "hover:border-foreground-muted",
  "focus-visible:focus-ring focus-visible:border-ring-inner",
  "aria-invalid:border-danger aria-invalid:hover:border-danger",
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-sunken disabled:text-foreground-disabled",
  "read-only:bg-surface-sunken",
].join(" ");

export const inputVariants = cva(controlBase, {
  variants: {
    size: {
      sm: "h-control-sm px-3 text-body-sm",
      md: "h-control-md px-4",
      lg: "h-control-lg px-4 text-body-lg",
    },
  },
  defaultVariants: { size: "md" },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Icon rendered inside the field on the left (decorative). */
  leadingIcon?: React.ReactNode;
  /** Element rendered inside the field on the right (icon, unit, clear button). */
  trailing?: React.ReactNode;
  /** Classes for the wrapper when leadingIcon/trailing is used. */
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, leadingIcon, trailing, wrapperClassName, type = "text", ...props },
  ref,
) {
  const fieldProps = useFormFieldControlProps(props);
  const input = (
    <input
      ref={ref}
      type={type}
      {...props}
      {...fieldProps}
      className={cn(inputVariants({ size }), leadingIcon && "pl-11", trailing && "pr-12", className)}
    />
  );
  if (!leadingIcon && !trailing) return input;
  return (
    <div className={cn("relative flex w-full items-center", wrapperClassName)}>
      {leadingIcon && (
        <span
          className="pointer-events-none absolute left-3.5 flex text-foreground-subtle [&_svg]:size-icon-md"
          aria-hidden
        >
          {leadingIcon}
        </span>
      )}
      {input}
      {trailing && <span className="absolute right-1.5 flex items-center text-foreground-subtle">{trailing}</span>}
    </div>
  );
});
