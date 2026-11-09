import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-sm border-2 border-transparent text-label transition-colors",
    "focus-visible:focus-ring",
    "disabled:pointer-events-none aria-disabled:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** The one main action on a screen. Spruce fill. */
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-surface-active disabled:text-foreground-disabled",
        /** Hi-vis lime. Reserved for the single most important on-site action (e.g. "Ask"). */
        accent:
          "bg-accent text-accent-foreground border-ring-inner hover:bg-accent-hover active:bg-accent-active disabled:bg-surface-active disabled:text-foreground-disabled disabled:border-transparent",
        /** Outlined. Default for secondary actions. */
        secondary:
          "bg-surface text-foreground border-border-strong hover:bg-surface-hover active:bg-surface-active disabled:text-foreground-disabled disabled:border-border",
        /** Tinted spruce, for supporting actions inside cards. */
        subtle:
          "bg-primary-subtle text-primary-subtle-foreground hover:bg-primary-subtle-hover active:bg-primary-subtle-hover disabled:bg-surface-sunken disabled:text-foreground-disabled",
        /** No chrome. Toolbars and tertiary actions. */
        ghost:
          "bg-transparent text-foreground hover:bg-surface-hover active:bg-surface-active disabled:text-foreground-disabled",
        /** Destructive actions. Always confirm with an AlertDialog. */
        danger:
          "bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-hover disabled:bg-surface-active disabled:text-foreground-disabled",
        /** Inline text link styled as a button. */
        link: "h-auto border-0 px-0 text-primary underline underline-offset-4 decoration-2 hover:decoration-3 disabled:text-foreground-disabled",
      },
      size: {
        sm: "h-control-sm px-3 [&_svg]:size-icon-sm",
        md: "h-control-md px-5 [&_svg]:size-icon-md",
        lg: "h-control-lg px-6 text-body-lg font-bold [&_svg]:size-icon-lg",
      },
      fullWidth: { true: "w-full" },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a Next <Link>) with button styles. */
  asChild?: boolean;
  /** Shows a spinner, keeps the width, sets aria-busy and blocks clicks. */
  loading?: boolean;
  /** Text announced/shown while loading. Defaults to the children. */
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, asChild = false, loading = false, loadingText, disabled, children, type, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);
  if (asChild) {
    return (
      <Slot.Root ref={ref} className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === "lg" ? "md" : "sm"} label={null} />
          <span>{loadingText ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
