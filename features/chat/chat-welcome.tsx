"use client";

import { FolderOpen, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/patterns/query-error-state";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { listSuggestedQuestions } from "@/lib/mock/api";

/** Shown in an empty conversation: a short intro and example questions. */
export function ChatWelcome({ projectId, onAsk }: { projectId: string; onAsk: (question: string) => void }) {
  const suggestions = useMockQuery((signal) => listSuggestedQuestions(projectId, { signal }), [projectId]);

  if (suggestions.status === "error") {
    return <QueryErrorState error={suggestions.error} onRetry={suggestions.refetch} action="load example questions" />;
  }

  if (suggestions.status === "success" && suggestions.data.length === 0) {
    return (
      <EmptyState
        framed
        icon={<FolderOpen />}
        title="Nothing to search yet"
        description="Plumb answers from this project's documents. Once specs, diaries and minutes are added, ask anything about them here."
        actions={
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}/documents`}>Go to documents</Link>
          </Button>
        }
      />
    );
  }

  return (
    <section aria-labelledby="chat-welcome-title" className="flex flex-col gap-6 rounded-md border-2 border-border bg-surface p-5 sm:p-8">
      <div className="flex flex-col gap-3">
        <span className="flex size-12 items-center justify-center rounded-md bg-primary-subtle text-primary-subtle-foreground [&_svg]:size-icon-lg" aria-hidden>
          <MessageSquareText />
        </span>
        <h2 id="chat-welcome-title" className="font-display text-h3 text-foreground">
          Ask Plumb about this project
        </h2>
        <p className="max-w-prose text-body text-foreground-muted">
          You get a short answer with the documents and pages it came from. If it isn&apos;t in the documents, Plumb says so.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-overline uppercase text-foreground-subtle">Try one of these</h3>
        {suggestions.status === "loading" ? (
          <div aria-busy="true" className="flex flex-col gap-2">
            <span className="sr-only">Loading example questions…</span>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-control-md w-full" />
            ))}
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {suggestions.data.map((question) => (
              <li key={question}>
                <Button
                  variant="secondary"
                  fullWidth
                  className="h-full min-h-control-md justify-start py-3 text-left whitespace-normal"
                  onClick={() => onAsk(question)}
                >
                  {question}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
