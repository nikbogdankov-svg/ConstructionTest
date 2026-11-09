import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("text-foreground text-balance", {
  variants: {
    size: {
      display: "font-display text-display",
      h1: "font-display text-h1",
      h2: "font-display text-h2",
      h3: "font-display text-h3",
      h4: "font-sans text-h4",
    },
  },
  defaultVariants: { size: "h2" },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Semantic level. Visual size is set separately with `size`. */
  as?: HeadingTag;
}

export function Heading({ as, size = "h2", className, ...props }: HeadingProps) {
  const Comp = as ?? (size === "display" ? "h1" : (size as HeadingTag));
  return <Comp className={cn(headingVariants({ size }), className)} {...props} />;
}

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body",
      sm: "text-body-sm",
      caption: "text-caption",
      label: "text-label",
      overline: "text-overline uppercase",
      code: "font-mono text-code",
    },
    tone: {
      default: "text-foreground",
      muted: "text-foreground-muted",
      subtle: "text-foreground-subtle",
      primary: "text-primary",
      danger: "text-danger",
      success: "text-success",
      inherit: "",
    },
    weight: { regular: "font-normal", bold: "font-bold" },
  },
  defaultVariants: { size: "md", tone: "default" },
});

export interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "small" | "strong" | "time" | "code";
}

export function Text({ as: Comp = "p", size, tone, weight, className, ...props }: TextProps) {
  return <Comp className={cn(textVariants({ size, tone, weight }), className)} {...props} />;
}

/** Inline code / identifiers such as document numbers. */
export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn("rounded-xs bg-surface-sunken px-1.5 py-0.5 font-mono text-code text-foreground", className)}
      {...props}
    />
  );
}
