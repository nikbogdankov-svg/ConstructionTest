"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

type TabsVariant = "line" | "segmented";
const TabsVariantContext = React.createContext<TabsVariant>("line");

export function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}

export interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  /** line: underlined tabs for page sections. segmented: compact toggle for views. */
  variant?: TabsVariant;
}

export function TabsList({ className, variant = "line", ...props }: TabsListProps) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        className={cn(
          "flex max-w-full items-stretch overflow-x-auto",
          variant === "line" && "gap-1 border-b-2 border-border",
          variant === "segmented" && "w-fit gap-1 rounded-sm border-2 border-border bg-surface-sunken p-1",
          className,
        )}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-label transition-colors focus-visible:focus-ring disabled:pointer-events-none disabled:text-foreground-disabled [&_svg]:size-icon-md",
        variant === "line" &&
          "-mb-0.5 min-h-control-md border-b-3 border-transparent px-4 text-foreground-muted hover:text-foreground hover:border-border-strong data-[state=active]:border-primary data-[state=active]:text-foreground",
        variant === "segmented" &&
          "min-h-control-sm rounded-xs px-4 text-foreground-muted hover:text-foreground data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("outline-none focus-visible:focus-ring", className)} {...props} />;
}
