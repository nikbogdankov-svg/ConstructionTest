"use client";

import * as React from "react";
import { Toaster as Sonner, toast } from "sonner";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Spinner } from "./spinner";

/**
 * Mounted once in the root layout. Trigger toasts with:
 *   toast("Saved"), toast.success(...), toast.error(...), toast.warning(...),
 *   toast.info(...), toast.promise(...), toast("…", { action: { label, onClick } })
 */
export function Toaster(props: React.ComponentProps<typeof Sonner>) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      gap={10}
      visibleToasts={4}
      icons={{
        success: <CircleCheck className="size-icon-md text-success" aria-hidden />,
        error: <CircleAlert className="size-icon-md text-danger" aria-hidden />,
        warning: <TriangleAlert className="size-icon-md text-warning-subtle-foreground dark:text-warning" aria-hidden />,
        info: <Info className="size-icon-md text-info" aria-hidden />,
        loading: <Spinner size="sm" tone="primary" label={null} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex w-full items-start gap-3 rounded-md border-2 border-border-strong border-l-6 bg-surface-raised p-4 text-foreground shadow-md sm:w-88",
          success: "border-l-success",
          error: "border-l-danger",
          warning: "border-l-warning",
          info: "border-l-info",
          default: "border-l-primary",
          loading: "border-l-primary",
          icon: "mt-0.5 flex shrink-0",
          content: "flex flex-1 flex-col gap-1",
          title: "text-body font-bold",
          description: "text-body-sm text-foreground-muted",
          actionButton:
            "ml-2 shrink-0 self-center rounded-sm bg-primary px-3 py-2 text-label text-primary-foreground hover:bg-primary-hover focus-visible:focus-ring",
          cancelButton:
            "ml-2 shrink-0 self-center rounded-sm border-2 border-border-strong px-3 py-1.5 text-label hover:bg-surface-hover focus-visible:focus-ring",
          closeButton: "border-2 border-border-strong bg-surface-raised text-foreground",
        },
      }}
      {...props}
    />
  );
}

export { toast };
