"use client";

import { CloudOff, FileQuestion, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isMockApiError } from "@/lib/mock/errors";

export interface QueryErrorStateProps {
  error: Error;
  onRetry?: () => void;
  /** What failed, in the user's words: "load documents". */
  action: string;
  size?: "sm" | "md" | "lg";
  framed?: boolean;
}

/** Standard error state for a failed mock-API call. Not-found errors get their own wording. */
export function QueryErrorState({ error, onRetry, action, size = "md", framed = true }: QueryErrorStateProps) {
  if (isMockApiError(error) && error.code === "not-found") {
    return (
      <EmptyState
        framed={framed}
        size={size}
        icon={<FileQuestion />}
        title="We couldn't find that"
        description="It may have been moved or deleted, or the link is wrong."
      />
    );
  }
  return (
    <EmptyState
      framed={framed}
      size={size}
      tone="danger"
      icon={<CloudOff />}
      title={`Couldn't ${action}`}
      description="Check your connection and try again. Nothing you entered has been lost."
      actions={
        onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            <RotateCw aria-hidden />
            Try again
          </Button>
        )
      }
    />
  );
}
