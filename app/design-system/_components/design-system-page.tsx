"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { Foundations } from "./foundations";
import { InputsShowcase } from "./inputs-showcase";
import { DisplayShowcase } from "./display-showcase";
import { PreviewModeContext, type PreviewMode } from "./showcase";

const TOC = [
  ["Foundations", [["logo", "Logo"], ["colour", "Colour"], ["typography", "Typography"], ["spacing", "Spacing & elevation"]]],
  ["Actions & inputs", [["button", "Button"], ["icon-button", "IconButton"], ["input", "Input & Textarea"], ["form-field", "Label & FormField"], ["select", "Select & Combobox"], ["choice", "Checkbox, Radio, Switch"]]],
  ["Display", [["badge", "Badge & Tag"], ["avatar", "Avatar"], ["card", "Card"], ["table", "Table"], ["text", "Typography & Markdown"]]],
  ["Overlays & feedback", [["overlays", "Dialog, Sheet, Menus…"], ["feedback", "Alert, Toast, Progress…"], ["empty-state", "EmptyState"]]],
  ["Navigation & misc", [["tabs", "Tabs"], ["navigation", "Breadcrumbs, Pagination"], ["misc", "Separator, Kbd, Accordion…"]]],
] as const;

export function DesignSystemPage() {
  const [mode, setMode] = React.useState<PreviewMode>("both");
  return (
    <PreviewModeContext.Provider value={mode}>
      <div className="min-h-dvh bg-background">
        <header className="sticky top-0 z-20 flex h-topbar items-center gap-3 border-b-2 border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <ProductLogo />
          <span className="hidden text-label text-foreground-muted sm:inline">Design system</span>
          <div className="ml-auto flex items-center gap-2">
            <Tabs value={mode} onValueChange={(v) => setMode(v as PreviewMode)}>
              <TabsList variant="segmented" aria-label="Preview theme">
                <TabsTrigger value="both">Both</TabsTrigger>
                <TabsTrigger value="light">Light</TabsTrigger>
                <TabsTrigger value="dark">Dark</TabsTrigger>
              </TabsList>
            </Tabs>
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/projects"><ArrowLeft aria-hidden />Back to app</Link>
            </Button>
          </div>
        </header>
        <div className="mx-auto flex max-w-440 gap-10 px-4 py-8 sm:px-6">
          <nav aria-label="Design system sections" className="sticky top-24 hidden h-[calc(100dvh-8rem)] w-56 shrink-0 overflow-y-auto lg:block">
            {TOC.map(([group, items]) => (
              <div key={group} className="mb-5">
                <p className="mb-1 px-2 text-overline uppercase text-foreground-subtle">{group}</p>
                <ul>
                  {items.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`} className="block rounded-sm px-2 py-1.5 text-body-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground focus-visible:focus-ring">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <main className="flex min-w-0 flex-1 flex-col gap-14">
            <div className="flex flex-col gap-2">
              <p className="text-overline uppercase text-primary">Plinthwork · Plumb</p>
              <h1 className="font-display text-h1 md:text-display">Design system</h1>
              <p className="max-w-prose text-body-lg text-foreground-muted">
                Every token and component, in light and dark. Built for the outdoors: high contrast, 48px controls, hi-vis focus.
                Source: <code className="font-mono text-code">styles/tokens.css</code> and <code className="font-mono text-code">components/ui</code>. Brand rules: <code className="font-mono text-code">BRAND.md</code>.
              </p>
            </div>
            <Foundations />
            <InputsShowcase />
            <DisplayShowcase />
          </main>
        </div>
      </div>
    </PreviewModeContext.Provider>
  );
}
