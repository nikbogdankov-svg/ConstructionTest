import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export const iconButtonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center rounded-sm border-2 border-transparent transition-colors",
    "focus-visible:focus-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-surface-active disabled:text-foreground-disabled",
        accent: "bg-accent text-accent-foreground border-ring-inner hover:bg-accent-hover active:bg-accent-active disabled:bg-surface-active disabled:text-foreground-disabled disabled:border-transparent",
        secondary: "bg-surface text-foreground border-border-strong hover:bg-surface-hover active:bg-surface-active disabled:text-foreground-disabled disabled:border-border",
        ghost: "bg-transparent text-foreground-muted hover:bg-surface-hover hover:text-foreground active:bg-surface-active disabled:text-foreground-disabled",
        danger: "bg-transparent text-danger hover:bg-danger-subtle active:bg-danger-subtle disabled:text-foreground-disabled",
      },
      size: {
        sm: "size-control-sm [&_svg]:size-icon-sm",
        md: "size-control-md [&_svg]:size-icon-md",
        lg: "size-control-lg [&_svg]:size-icon-lg",
      },
      shape: { square: "", round: "rounded-full" },
    },
    defaultVariants: { variant: "ghost", size: "md", shape: "square" },
  },
);

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  /** Required accessible name. Also shown as a tooltip unless `tooltip={false}`. */
  label: string;
  tooltip?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, variant, size, shape, label, tooltip = true, loading = false, asChild = false, disabled, children, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot.Root : "button";
  const button = (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? "button")}
      aria-label={label}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled || loading}
      className={cn(iconButtonVariants({ variant, size, shape }), className)}
      {...props}
    >
      {loading ? <Spinner size={size === "lg" ? "md" : "sm"} label={null} /> : children}
    </Comp>
  );
  if (!tooltip) return button;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
});
