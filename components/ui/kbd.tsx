import * as React from "react";
import { cn } from "@/lib/utils";

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-xs border-2 border-b-3 border-border-strong bg-surface px-1.5 font-mono text-caption font-bold text-foreground-muted",
        className,
      )}
      {...props}
    />
  );
}
