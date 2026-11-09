import { cn } from "@/lib/utils";

/**
 * Plinthwork mark, inline so it follows the theme via tokens.
 * Static files for other uses live in /public/brand.
 */
export function LogoMark({ className, title = "Plinthwork" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} className={cn("size-9 shrink-0", className)}>
      <rect width="64" height="64" rx="10" className="fill-primary" />
      <rect x="12" y="46" width="40" height="6" rx="1" className="fill-primary-foreground" />
      <rect x="19" y="39" width="26" height="5" rx="1" className="fill-primary-foreground" />
      <rect x="30.75" y="11" width="2.5" height="15" className="fill-primary-foreground" />
      <rect x="25" y="9" width="14" height="3" rx="1" className="fill-primary-foreground" />
      <path d="M25 26h14l-7 11z" className="fill-accent stroke-primary-foreground [stroke-width:0] dark:[stroke-width:1.5]" strokeLinejoin="round" />
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
