"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { controlBase } from "./input";
import { useFormFieldControlProps } from "./form-field";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with content up to `maxRows`. */
  autoResize?: boolean;
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, autoResize = false, maxRows = 10, rows = 3, onInput, ...props },
  forwardedRef,
) {
  const fieldProps = useFormFieldControlProps(props);
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const resize = React.useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
    const max = lineHeight * maxRows + 24;
    el.style.height = `${Math.min(el.scrollHeight + 4, max)}px`;
    el.style.overflowY = el.scrollHeight + 4 > max ? "auto" : "hidden";
  }, [autoResize, maxRows]);

  React.useLayoutEffect(resize, [resize, props.value]);

  return (
    <textarea
      ref={(node) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      rows={rows}
      onInput={(e) => {
        resize();
        onInput?.(e);
      }}
      {...props}
      {...fieldProps}
      className={cn(controlBase, "min-h-control-lg resize-y px-4 py-3 leading-6", autoResize && "resize-none", className)}
    />
  );
});
