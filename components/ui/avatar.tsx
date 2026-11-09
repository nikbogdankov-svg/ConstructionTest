"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("relative inline-flex shrink-0 items-center justify-center overflow-hidden font-bold select-none", {
  variants: {
    size: {
      xs: "size-6 text-caption",
      sm: "size-8 text-caption",
      md: "size-10 text-body-sm",
      lg: "size-12 text-body",
      xl: "size-16 text-h4",
    },
    shape: {
      circle: "rounded-full",
      /** Square avatars represent projects/organisations, circles represent people. */
      square: "rounded-sm",
    },
    tone: {
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      info: "bg-info-subtle text-info-subtle-foreground",
      neutral: "bg-surface-active text-foreground",
    },
  },
  defaultVariants: { size: "md", shape: "circle", tone: "primary" },
});

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string;
  src?: string;
  className?: string;
  /** Override initials (defaults to first letters of the first two words). */
  initials?: string;
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, src, size, shape, tone, className, initials }: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn(avatarVariants({ size, shape, tone }), className)}>
      {src && <AvatarPrimitive.Image src={src} alt={name} className="size-full object-cover" />}
      <AvatarPrimitive.Fallback delayMs={src ? 400 : 0} aria-label={name} role="img">
        {initials ?? getInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export function AvatarGroup({ children, className, max = 4 }: { children: React.ReactNode; className?: string; max?: number }) {
  const items = React.Children.toArray(children);
  const extra = items.length - max;
  return (
    <div className={cn("flex items-center -space-x-2 [&>*]:ring-2 [&>*]:ring-background", className)}>
      {items.slice(0, max)}
      {extra > 0 && (
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-surface-active text-body-sm font-bold text-foreground">
          +{extra}
        </span>
      )}
    </div>
  );
}
