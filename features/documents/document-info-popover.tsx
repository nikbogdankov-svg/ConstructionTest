"use client";

import Link from "next/link";
import { Calendar, FileStack, MessageSquareText, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatCount, formatDate } from "@/lib/format";
import type { DocumentSummary } from "@/lib/mock/types";
import { DOCUMENT_TYPE_META, TRADE_LABELS } from "./document-meta";

/** Document title that opens a popup with a short summary of the document. */
export function DocumentInfoPopover({ doc }: { doc: DocumentSummary }) {
  const meta = DOCUMENT_TYPE_META[doc.type];
  const Icon = meta.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          className="group -mx-2 -my-1 flex w-full items-start gap-3 rounded-sm px-2 py-1 text-left transition-colors hover:bg-surface-hover focus-visible:focus-ring data-[state=open]:bg-primary-subtle"
        >
          <Icon className="mt-0.5 size-icon-md shrink-0 text-foreground-subtle group-hover:text-primary" aria-hidden />
          <span className="flex min-w-0 flex-col">
            <span className="font-bold text-foreground underline-offset-4 decoration-2 group-hover:text-primary group-hover:underline">
              {doc.title}
            </span>
            <span className="font-mono text-caption text-foreground-subtle">{doc.code}</span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-surface-sunken text-foreground-muted" aria-hidden>
            <Icon className="size-icon-md" />
          </span>
          <div className="flex min-w-0 flex-col">
            <p className="font-bold text-foreground">{doc.title}</p>
            <p className="font-mono text-caption text-foreground-subtle">{doc.code}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone={meta.tone} size="sm">
            {meta.label}
          </Badge>
          <Badge tone="outline" size="sm">
            {TRADE_LABELS[doc.trade]}
          </Badge>
        </div>

        <dl className="grid gap-1.5 text-body-sm text-foreground-muted">
          <div className="flex items-center gap-2">
            <dt>
              <Calendar className="size-icon-sm" aria-hidden />
              <span className="sr-only">Date</span>
            </dt>
            <dd>
              <time dateTime={doc.date}>{formatDate(doc.date, "long")}</time>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>
              <UserRound className="size-icon-sm" aria-hidden />
              <span className="sr-only">Author</span>
            </dt>
            <dd className="min-w-0">{doc.author}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>
              <FileStack className="size-icon-sm" aria-hidden />
              <span className="sr-only">Length</span>
            </dt>
            <dd>{formatCount(doc.pageCount, "page")}</dd>
          </div>
        </dl>

        <Button asChild variant="subtle" fullWidth>
          <Link href={`/projects/${doc.projectId}/chat`}>
            <MessageSquareText aria-hidden />
            Ask about this document
          </Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
