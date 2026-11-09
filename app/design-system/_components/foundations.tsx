"use client";

import * as React from "react";
import Image from "next/image";
import { FileText, Search, Brain, MessageSquareText, HardHat, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { Demo, Section, ThemePanels } from "./showcase";

function toHex(rgb: string) {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m) return rgb;
  const [r, g, b, a] = m.map(Number);
  const hex = `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
  return a !== undefined && a < 1 ? `${hex} · ${Math.round(a * 100)}%` : hex;
}

/** Colour chip that reads its resolved value from CSS, so the hex shown is always the real token. */
function Swatch({ token, className }: { token: string; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    if (!ref.current) return;
    const update = () => ref.current && setValue(toHex(getComputedStyle(ref.current).backgroundColor));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div ref={ref} className="h-14 rounded-sm border-2 border-border" style={{ background: `var(--${token})` }} />
      <span className="truncate font-mono text-caption text-foreground">--{token}</span>
      <span className="font-mono text-caption text-foreground-subtle">{value}</span>
    </div>
  );
}

const PRIMITIVES = {
  Spruce: ["spruce-950", "spruce-900", "spruce-800", "spruce-700", "spruce-600", "spruce-500", "spruce-400", "spruce-300", "spruce-200", "spruce-100", "spruce-50"],
  Lime: ["lime-700", "lime-600", "lime-500", "lime-400", "lime-300", "lime-100"],
  Concrete: ["concrete-900", "concrete-800", "concrete-700", "concrete-600", "concrete-500", "concrete-400", "concrete-300", "concrete-200", "concrete-100", "concrete-50", "concrete-25", "concrete-0"],
  Night: ["night-950", "night-900", "night-850", "night-800", "night-700", "night-600", "night-400", "night-300", "night-100"],
};

const SEMANTIC: Record<string, string[]> = {
  Surfaces: ["background", "surface", "surface-raised", "surface-sunken", "surface-hover", "surface-active", "overlay"],
  Text: ["foreground", "foreground-muted", "foreground-subtle", "foreground-disabled", "foreground-inverse"],
  Lines: ["border", "border-strong", "input-border", "ring", "ring-inner"],
  Primary: ["primary", "primary-hover", "primary-active", "primary-foreground", "primary-subtle", "primary-subtle-foreground"],
  Accent: ["accent", "accent-hover", "accent-active", "accent-foreground", "accent-subtle", "accent-subtle-foreground"],
  Success: ["success", "success-foreground", "success-subtle", "success-subtle-foreground"],
  Warning: ["warning", "warning-foreground", "warning-subtle", "warning-subtle-foreground"],
  Danger: ["danger", "danger-hover", "danger-foreground", "danger-subtle", "danger-subtle-foreground"],
  Info: ["info", "info-foreground", "info-subtle", "info-subtle-foreground"],
  Other: ["highlight", "skeleton"],
};

const TYPE_SCALE = [
  { name: "Display", cls: "font-display text-display", spec: "56/60 · 600 · Barlow Condensed" },
  { name: "Heading 1", cls: "font-display text-h1", spec: "40/44 · 600 · Barlow Condensed" },
  { name: "Heading 2", cls: "font-display text-h2", spec: "32/36 · 600 · Barlow Condensed" },
  { name: "Heading 3", cls: "font-display text-h3", spec: "24/30 · 600 · Barlow Condensed" },
  { name: "Heading 4", cls: "text-h4", spec: "20/28 · 700 · Atkinson Hyperlegible Next" },
  { name: "Body large", cls: "text-body-lg", spec: "18/28 · 400" },
  { name: "Body", cls: "text-body", spec: "16/24 · 400" },
  { name: "Body small", cls: "text-body-sm", spec: "14/20 · 400" },
  { name: "Label", cls: "text-label", spec: "15/20 · 700" },
  { name: "Caption", cls: "text-caption", spec: "13/18 · 400" },
  { name: "Overline", cls: "text-overline uppercase", spec: "12/16 · 700 · +0.08em · uppercase" },
  { name: "Code", cls: "font-mono text-code", spec: "14/20 · 400 · Atkinson Hyperlegible Mono" },
];

const SPACING = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
const RADII = ["rounded-none", "rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-full"];
const SHADOWS = ["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg"];
const SIZES = [
  { cls: "h-control-sm", label: "control-sm · 40px" },
  { cls: "h-control-md", label: "control-md · 48px" },
  { cls: "h-control-lg", label: "control-lg · 56px" },
];

export function Foundations() {
  return (
    <>
      <Section id="logo" title="Logo" description="Mark, company wordmark and product lockup. Files live in /public/brand.">
        <ThemePanels>
          <div className="flex flex-wrap items-center gap-8">
            <Image src="/brand/plinthwork-mark.svg" alt="Plinthwork mark" width={64} height={64} className="dark:hidden" />
            <Image src="/brand/plinthwork-mark-dark.svg" alt="Plinthwork mark (dark)" width={64} height={64} className="hidden dark:block" />
            <Image src="/brand/plinthwork-wordmark.svg" alt="Plinthwork wordmark" width={330} height={64} className="h-12 w-auto dark:hidden" />
            <Image src="/brand/plinthwork-wordmark-dark.svg" alt="Plinthwork wordmark (dark)" width={330} height={64} className="hidden h-12 w-auto dark:block" />
            <Image src="/brand/plumb-wordmark.svg" alt="Plumb by Plinthwork" width={183} height={64} className="h-12 w-auto dark:hidden" />
            <Image src="/brand/plumb-wordmark-dark.svg" alt="Plumb by Plinthwork (dark)" width={183} height={64} className="hidden h-12 w-auto dark:block" />
          </div>
        </ThemePanels>
      </Section>

      <Section id="colour" title="Colour" description="Components only use semantic tokens. Primitives are listed for reference.">
        <ThemePanels>
          {Object.entries(SEMANTIC).map(([group, tokens]) => (
            <Demo key={group} label={group} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {tokens.map((t) => (
                <Swatch key={t} token={t} />
              ))}
            </Demo>
          ))}
        </ThemePanels>
        <div className="flex flex-col gap-4 rounded-md border-2 border-border bg-surface p-4 sm:p-6">
          <p className="text-overline uppercase text-foreground-subtle">Primitives (theme-independent)</p>
          {Object.entries(PRIMITIVES).map(([group, tokens]) => (
            <Demo key={group} label={group} className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-12">
              {tokens.map((t) => (
                <Swatch key={t} token={t} />
              ))}
            </Demo>
          ))}
        </div>
      </Section>

      <Section id="typography" title="Typography" description="Barlow Condensed for headings, Atkinson Hyperlegible Next for everything you read, Atkinson Hyperlegible Mono for codes and numbers.">
        <ThemePanels>
          <div className="flex flex-col divide-y-2 divide-border">
            {TYPE_SCALE.map((t) => (
              <div key={t.name} className="flex flex-col gap-1 py-3 md:flex-row md:items-baseline md:gap-6">
                <div className="w-56 shrink-0">
                  <p className="text-label">{t.name}</p>
                  <p className="font-mono text-caption text-foreground-subtle">{t.spec}</p>
                </div>
                <p className={cn(t.cls, "min-w-0 truncate")}>Basement walls: C32/40 XD3</p>
              </div>
            ))}
          </div>
        </ThemePanels>
      </Section>

      <Section id="spacing" title="Spacing, sizes, radius, elevation" description="4px grid (Tailwind steps). Controls are 48px by default so they work with gloves.">
        <ThemePanels>
          <Demo label="Spacing (Tailwind step · px)" className="items-end">
            {SPACING.map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className="w-4 bg-primary" style={{ height: `calc(var(--spacing) * ${s})` }} />
                <span className="font-mono text-caption text-foreground-subtle">
                  {s}·{s * 4}
                </span>
              </div>
            ))}
          </Demo>
          <Demo label="Control heights" className="items-end">
            {SIZES.map((s) => (
              <div key={s.cls} className="flex flex-col items-start gap-1">
                <div className={cn(s.cls, "w-28 rounded-sm border-2 border-dashed border-primary bg-primary-subtle")} />
                <span className="font-mono text-caption text-foreground-subtle">{s.label}</span>
              </div>
            ))}
          </Demo>
          <Demo label="Radius">
            {RADII.map((r) => (
              <div key={r} className="flex flex-col items-center gap-1">
                <div className={cn(r, "size-16 border-2 border-border-strong bg-surface-sunken")} />
                <span className="font-mono text-caption text-foreground-subtle">{r.replace("rounded-", "")}</span>
              </div>
            ))}
          </Demo>
          <Demo label="Elevation" className="gap-6">
            {SHADOWS.map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={cn(s, "size-20 rounded-md bg-surface-raised")} />
                <span className="font-mono text-caption text-foreground-subtle">{s}</span>
              </div>
            ))}
          </Demo>
          <Demo label="Measuring-tape rule (rule-ticks utility)">
            <div className="h-2 w-full rule-ticks" />
          </Demo>
        </ThemePanels>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border-2 border-border bg-surface p-4">
            <p className="mb-2 text-label">Breakpoints</p>
            <ul className="font-mono text-code text-foreground-muted">
              <li>sm · 640px — large phones, landscape</li>
              <li>md · 768px — tablets: tables replace cards</li>
              <li>lg · 1024px — sidebar becomes fixed</li>
              <li>xl · 1280px — max content width</li>
              <li>2xl · 1536px</li>
            </ul>
          </div>
          <div className="rounded-md border-2 border-border bg-surface p-4">
            <p className="mb-2 text-label">Icons · lucide-react · stroke 2</p>
            <div className="flex flex-wrap items-end gap-4 text-foreground">
              {[
                { cls: "size-icon-xs", n: "xs 14" },
                { cls: "size-icon-sm", n: "sm 16" },
                { cls: "size-icon-md", n: "md 20" },
                { cls: "size-icon-lg", n: "lg 24" },
                { cls: "size-icon-xl", n: "xl 32" },
              ].map((i) => (
                <div key={i.n} className="flex flex-col items-center gap-1">
                  <Ruler className={i.cls} aria-hidden />
                  <span className="font-mono text-caption text-foreground-subtle">{i.n}</span>
                </div>
              ))}
              <div className="flex gap-3 text-foreground-muted">
                <FileText aria-hidden /> <Search aria-hidden /> <Brain aria-hidden /> <MessageSquareText aria-hidden /> <HardHat aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
