"use client";

import { CircleStop, RotateCw, SearchX } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";
import { Markdown } from "@/components/ui/markdown";
import { SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import type { Citation, DocumentSummary } from "@/lib/mock/types";
import { CitationChips } from "./citation-chips";
import type { Exchange } from "./use-chat";

export interface ChatExchangeProps {
  exchange: Exchange;
  isLatest: boolean;
  isBusy: boolean;
  documents: Map<string, DocumentSummary>;
  onRetry: (id: string) => void;
  onAsk: (question: string) => void;
  onOpenCitation: (citation: Citation, index: number) => void;
}

/** A question bubble and Plumb's answer, in whichever state it is in. */
export function ChatExchange({ exchange, isLatest, isBusy, documents, onRetry, onAsk, onOpenCitation }: ChatExchangeProps) {
  const { answer } = exchange;
  const showFollowUps = isLatest && !isBusy && answer.status === "done" && answer.followUps.length > 0;

  return (
    <li className="flex flex-col gap-4">
      <div className="ml-8 self-end rounded-md bg-primary-subtle px-4 py-3 text-body text-primary-subtle-foreground sm:ml-16">
        <h2 className="sr-only">You asked</h2>
        <p className="break-words whitespace-pre-wrap">{exchange.question}</p>
      </div>

      <article className="flex gap-3" aria-busy={answer.status === "thinking" || answer.status === "streaming"}>
        <span className="mt-1 hidden shrink-0 sm:block" aria-hidden>
          <LogoMark title="" className="size-8" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h2 className="sr-only">Plumb answered</h2>

          {answer.status === "thinking" && (
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2 text-body-sm text-foreground-muted">
                <Spinner size="sm" tone="primary" label={null} />
                Checking your documents…
              </p>
              <SkeletonText lines={3} className="max-w-prose" />
            </div>
          )}

          {answer.found === false && answer.status === "done" ? (
            <Alert tone="neutral" icon={<SearchX />} title="Not in your documents">
              {answer.content} Try rephrasing, or check the Documents library.
            </Alert>
          ) : (
            answer.content && (
              <Markdown className={answer.status === "error" ? "text-foreground-muted" : undefined}>{answer.content}</Markdown>
            )
          )}

          {answer.status === "streaming" && (
            <Badge tone="primary" className="gap-2">
              <Spinner size="xs" label={null} />
              Answering…
            </Badge>
          )}

          {answer.status === "stopped" && (
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="warning">
                <CircleStop aria-hidden />
                {answer.content ? "Stopped. Answer incomplete" : "Stopped before Plumb answered"}
              </Badge>
              {isLatest && (
                <Button variant="ghost" size="sm" className="max-md:h-control-md" onClick={() => onRetry(exchange.id)} disabled={isBusy}>
                  <RotateCw aria-hidden />
                  Ask again
                </Button>
              )}
            </div>
          )}

          {answer.status === "error" && (
            <Alert
              tone="danger"
              title="Plumb couldn't finish this answer"
              action={
                <Button variant="secondary" onClick={() => onRetry(exchange.id)} disabled={isBusy}>
                  <RotateCw aria-hidden />
                  Retry
                </Button>
              }
            >
              {answer.error} Your question is kept, so you can retry it.
            </Alert>
          )}

          {answer.status === "done" && (
            <CitationChips citations={answer.citations} documents={documents} onOpen={onOpenCitation} />
          )}

          {showFollowUps && (
            <div className="flex flex-col gap-2">
              <p className="text-overline uppercase text-foreground-subtle">Ask next</p>
              <ul className="flex flex-col items-start gap-2">
                {answer.followUps.map((question) => (
                  <li key={question} className="max-w-full">
                    <Button
                      variant="secondary"
                      className="h-auto min-h-control-md max-w-full py-2 text-left whitespace-normal"
                      onClick={() => onAsk(question)}
                    >
                      {question}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </li>
  );
}
