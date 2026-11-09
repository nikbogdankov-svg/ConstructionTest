import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("flex flex-col rounded-md border-2 text-foreground", {
  variants: {
    variant: {
      default: "border-border bg-surface shadow-xs",
      raised: "border-border bg-surface-raised shadow-sm",
      sunken: "border-transparent bg-surface-sunken",
      outline: "border-border-strong bg-transparent",
    },
    /** Whole card is a link/button: hover + focus ring + pressed state. */
    interactive: {
      true: "cursor-pointer transition-[border-color,box-shadow,background-color] hover:border-border-strong hover:shadow-sm active:bg-surface-hover focus-visible:focus-ring",
    },
    padding: { none: "", sm: "", md: "", lg: "" },
  },
  defaultVariants: { variant: "default", padding: "md" },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Render as the child element, e.g. a Next <Link>, for clickable cards. */
  asChild?: boolean;
}

export function Card({ className, variant, interactive, padding, asChild, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : "div";
  return <Comp data-padding={padding ?? "md"} className={cn(cardVariants({ variant, interactive, padding }), "group/card", className)} {...props} />;
}

const pad = "group-data-[padding=sm]/card:px-4 group-data-[padding=md]/card:px-5 group-data-[padding=lg]/card:px-8";

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 pt-5 pb-3", pad, className)} {...props} />;
}

export function CardTitle({
  className,
  as: Comp = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" | "p" }) {
  return <Comp className={cn("font-display text-h3 text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-body-sm text-foreground-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("py-3 first:pt-5 last:pb-5", pad, className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto flex flex-wrap items-center gap-3 border-t-2 border-border py-3", pad, className)}
      {...props}
    />
  );
}
