/**
 * Static copies of the hover/active/focus/invalid classes used by Button,
 * IconButton and Input, so Tailwind generates them for the state matrix on
 * the design-system page (forceState() builds them at runtime).
 * Regenerate if those components change.
 */
export const FORCED_STATE_CLASSES = "bg-accent-active bg-accent-hover bg-danger-hover bg-danger-subtle bg-primary-active bg-primary-hover bg-primary-subtle-hover bg-surface-active bg-surface-hover border-danger border-foreground-muted border-ring-inner decoration-3 focus-ring text-foreground";
