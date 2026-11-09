"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const tagBase =
  "inline-flex min-h-control-sm max-w-full items-center gap-1.5 rounded-full border-2 px-3.5 text-body-sm font-bold transition-colors [&_svg]:size-icon-sm [&_svg]:shrink-0";

export interface TagProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Toggleable chip (filters). Sets aria-pressed. */
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Shows a remove button; the chip itself is then not clickable. */
  onRemove?: () => void;
  removeLabel?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

/**
 * Chip. Three modes:
 *  - static: no onClick/onRemove → plain label
 *  - toggle: onClick (+ selected) → button with aria-pressed
 *  - removable: onRemove → label + remove button
 */
export function Tag({
  className,
  selected,
  onClick,
  onRemove,
  removeLabel,
  icon,
  size = "md",
  disabled,
  children,
  ...props
}: TagProps) {
  const visual = cn(
    tagBase,
    size === "sm" && "min-h-8 px-2.5 text-caption",
    selected
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border-strong bg-surface text-foreground",
    disabled && "border-border bg-surface-sunken text-foreground-disabled",
    className,
  );

  if (onRemove) {
    return (
      <span className={cn(visual, "pr-1")}>
        {icon}
        <span className="truncate">{children}</span>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "item"}`}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-full focus-visible:focus-ring",
            selected ? "hover:bg-primary-hover" : "hover:bg-surface-active",
          )}
        >
          <X aria-hidden />
        </button>
      </span>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={selected ?? undefined}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          visual,
          "focus-visible:focus-ring",
          !disabled && (selected ? "hover:bg-primary-hover" : "hover:bg-surface-hover hover:border-foreground-muted"),
        )}
        {...props}
      >
        {icon}
        <span className="truncate">{children}</span>
      </button>
    );
  }

  return (
    <span className={visual}>
      {icon}
      <span className="truncate">{children}</span>
    </span>
  );
}
