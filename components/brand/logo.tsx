import { useId } from "react";
import { cn } from "@/lib/utils";

/** Wave path across the mark: crests at x = 8 / 40, troughs at x = 24 / 56, shifted down by `dy`. */
const wave = (dy: number) =>
  `M-8 ${44 + dy} C-2 ${44 + dy} 2 ${37 + dy} 8 ${37 + dy} S18 ${44 + dy} 24 ${44 + dy} S34 ${37 + dy} 40 ${37 + dy} S50 ${44 + dy} 56 ${44 + dy} S66 ${37 + dy} 72 ${37 + dy}`;

/**
 * Brand mark: navy disc with a coral sun over two waves.
 * The artwork's own colours are fixed (they are the logo, not theme tokens).
 * Static files for other uses live in /public/brand.
 */
export function LogoMark({ className, title = "Plinthwork" }: { className?: string; title?: string }) {
  const clipId = `logo-clip-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 64 64" role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} className={cn("size-9 shrink-0", className)}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="32" cy="32" r="32" fill="#1D3A5A" />
        <circle cx="41.7" cy="21.3" r="7.5" fill="#EC7457" />
        <path d={wave(0)} fill="none" stroke="#EFE6D2" strokeWidth="4.8" />
        <path d={wave(10.6)} fill="none" stroke="#929A9B" strokeWidth="4.8" />
      </g>
    </svg>
  );
}

/** Product lockup: mark + "Plumb" + "by Plinthwork". */
export function ProductLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark title="" className="size-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-h3 leading-none font-bold text-foreground">Plumb</span>
        <span className="text-overline uppercase text-foreground-subtle">by Plinthwork</span>
      </span>
    </span>
  );
}
