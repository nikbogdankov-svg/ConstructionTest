"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PreviewMode = "both" | "light" | "dark";
export const PreviewModeContext = React.createContext<PreviewMode>("both");

/** Renders children once per theme (forced with the .light / .dark classes). */
export function ThemePanels({ children, className }: { children: React.ReactNode; className?: string }) {
  const mode = React.useContext(PreviewModeContext);
  const themes = mode === "both" ? (["light", "dark"] as const) : ([mode] as const);
  return (
    <div className={cn("grid gap-4", mode === "both" && "2xl:grid-cols-2")}>
      {themes.map((theme) => (
        <div
          key={theme}
          className={cn(theme, "min-w-0 rounded-md border-2 border-border bg-background p-4 text-foreground sm:p-6", className)}
        >
          <p className="mb-4 text-overline uppercase text-foreground-subtle">{theme}</p>
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      ))}
    </div>
  );
}

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col gap-1 pb-2 rule-ticks">
        <h2 id={`${id}-title`} className="font-display text-h2">
          {title}
        </h2>
        {description && <p className="max-w-prose text-body text-foreground-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** A labelled row of examples. */
export function Demo({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-foreground-muted">{label}</p>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>
    </div>
  );
}

/** Caption under a single example. */
export function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      {children}
      <span className="font-mono text-caption text-foreground-subtle">{label}</span>
    </div>
  );
}

/**
 * Turns `hover:x active:y focus-visible:z` classes from a cva() result into
 * static classes so a state can be shown without interacting.
 */
export function forceState(classes: string, state: "hover" | "active" | "focus" | "invalid"): string {
  const prefix = { hover: "hover:", active: "active:", focus: "focus-visible:", invalid: "aria-invalid:" }[state];
  const forced = classes
    .split(/\s+/)
    .filter((c) => c.startsWith(prefix))
    .map((c) => c.slice(prefix.length));
  return forced.join(" ");
}
