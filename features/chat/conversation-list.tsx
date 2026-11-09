"use client";

import Link from "next/link";
import { MessagesSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/patterns/query-error-state";
import type { QueryResult } from "@/lib/hooks/use-mock-query";
import type { ConversationSummary } from "@/lib/mock/types";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ConversationListProps {
  projectId: string;
  activeId: string | null;
  conversations: QueryResult<ConversationSummary[]>;
  /** Called after a link is clicked (e.g. to close the mobile sheet). */
  onNavigate?: (isNewConversation: boolean) => void;
}

/** Past conversations. Rendered in a side column on wide screens and in a Sheet below that. */
export function ConversationList({ projectId, activeId, conversations, onNavigate }: ConversationListProps) {
  return (
    <nav aria-label="Past conversations" className="flex flex-col gap-3">
      <Button asChild variant={activeId ? "secondary" : "subtle"} fullWidth className="justify-start">
        <Link href={`/projects/${projectId}/chat`} onClick={() => onNavigate?.(true)} aria-current={activeId ? undefined : "page"}>
          <Plus aria-hidden />
          New conversation
        </Link>
      </Button>

      <h2 className="mt-2 text-overline uppercase text-foreground-subtle">Past conversations</h2>

      {conversations.status === "loading" && (
        <div aria-busy="true" className="flex flex-col gap-2">
          <span className="sr-only">Loading conversations…</span>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-sm px-3 py-3">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {conversations.status === "error" && (
        <QueryErrorState error={conversations.error} onRetry={conversations.refetch} action="load conversations" size="sm" />
      )}

      {conversations.status === "success" && conversations.data.length === 0 && (
        <EmptyState
          size="sm"
          icon={<MessagesSquare />}
          headingLevel="p"
          title="No conversations yet"
          description="Questions you ask are kept here."
        />
      )}

      {conversations.status === "success" && conversations.data.length > 0 && (
        <ul className="flex flex-col gap-1">
          {conversations.data.map((conversation) => {
            const active = conversation.id === activeId;
            return (
              <li key={conversation.id}>
                <Link
                  href={`/projects/${projectId}/chat/${conversation.id}`}
                  onClick={() => onNavigate?.(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-control-md flex-col justify-center gap-0.5 rounded-sm border-2 border-transparent px-3 py-2 focus-visible:focus-ring",
                    active
                      ? "border-primary bg-primary-subtle text-primary-subtle-foreground"
                      : "text-foreground hover:bg-surface-hover",
                  )}
                >
                  <span className="line-clamp-2 text-label">{conversation.title}</span>
                  <span className={cn("text-caption", active ? "text-primary-subtle-foreground" : "text-foreground-subtle")}>
                    {formatRelative(conversation.updatedAt)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
