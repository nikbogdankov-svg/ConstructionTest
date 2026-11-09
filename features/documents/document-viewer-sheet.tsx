"use client";

import { ChevronLeft, ChevronRight, FileQuestion, FileWarning, RotateCw } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SkeletonText } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/patterns/query-error-state";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { getDocument } from "@/lib/mock/api";
import { isMockApiError } from "@/lib/mock/errors";
import type { DocumentSummary } from "@/lib/mock/types";
import { formatDate } from "@/lib/format";
import { DOCUMENT_TYPE_META, TRADE_LABELS } from "./document-meta";

export interface DocumentViewerSheetProps {
  doc: DocumentSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where focus goes when the panel closes. */
  onCloseAutoFocus?: (event: Event) => void;
}

/** Side panel that opens a document's text. Header details come from the list, so they show even if the file fails. */
export function DocumentViewerSheet({ doc, open, onOpenChange, onCloseAutoFocus }: DocumentViewerSheetProps) {
  const meta = DOCUMENT_TYPE_META[doc.type];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="lg" onCloseAutoFocus={onCloseAutoFocus}>
        <SheetHeader className="gap-2">
          <p className="font-mono text-caption text-foreground-subtle">{doc.code}</p>
          <SheetTitle>{doc.title}</SheetTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={meta.tone} size="sm">
              {meta.label}
            </Badge>
            <Badge tone="outline" size="sm">
              {TRADE_LABELS[doc.trade]}
            </Badge>
          </div>
          <SheetDescription>
            {formatDate(doc.date)} · {doc.author}
          </SheetDescription>
        </SheetHeader>
        {/* Mounted only while open, so the file is loaded each time it's opened. */}
        {open && <DocumentViewerBody doc={doc} />}
      </SheetContent>
    </Sheet>
  );
}

function DocumentViewerBody({ doc }: { doc: DocumentSummary }) {
  const file = useMockQuery((signal) => getDocument(doc.id, { signal }), [doc.id]);
  const [pageIndex, setPageIndex] = React.useState(0);

  if (file.status === "loading") {
    return (
      <SheetBody aria-busy="true">
        <span className="sr-only">Opening document…</span>
        <SkeletonText lines={8} />
      </SheetBody>
    );
  }

  if (file.status === "error") {
    const code = isMockApiError(file.error) ? file.error.code : null;
    return (
      <SheetBody className="flex flex-col justify-center">
        {code === "corrupted" ? (
          <DocumentCorruptedState doc={doc} onRetry={file.refetch} />
        ) : code === "not-found" ? (
          <EmptyState
            icon={<FileQuestion />}
            title="Document not found"
            description="It may have been removed from this project."
            actions={
              <SheetClose asChild>
                <Button variant="secondary">Back to documents</Button>
              </SheetClose>
            }
          />
        ) : (
          <QueryErrorState error={file.error} onRetry={file.refetch} action="open this document" framed={false} />
        )}
      </SheetBody>
    );
  }

  const pages = file.data.pages;
  const page = pages[Math.min(pageIndex, pages.length - 1)];

  return (
    <>
      <SheetBody>
        <article aria-label={`Page ${page.number} of ${pages.length}`}>
          <p className="max-w-prose whitespace-pre-line text-body text-foreground">{page.text}</p>
        </article>
      </SheetBody>
      <SheetFooter className="items-center justify-between">
        <Button variant="secondary" onClick={() => setPageIndex((i) => i - 1)} disabled={pageIndex === 0}>
          <ChevronLeft aria-hidden />
          Previous
        </Button>
        <p className="text-body-sm text-foreground-muted" aria-live="polite">
          Page {page.number} of {pages.length}
        </p>
        <Button variant="secondary" onClick={() => setPageIndex((i) => i + 1)} disabled={pageIndex >= pages.length - 1}>
          Next
          <ChevronRight aria-hidden />
        </Button>
      </SheetFooter>
    </>
  );
}

/** The file exists but its contents can't be read. */
export function DocumentCorruptedState({ doc, onRetry }: { doc: DocumentSummary; onRetry: () => void }) {
  return (
    <EmptyState
      tone="danger"
      icon={<FileWarning />}
      title="This file is corrupted"
      description={
        <>
          Plumb can&apos;t read <span className="font-mono text-foreground">{doc.code}</span>. The file may be damaged or only
          partly uploaded, so Plumb can&apos;t use it in answers either. Ask {doc.author} to upload it again.
        </>
      }
      actions={
        <>
          <Button variant="secondary" onClick={onRetry}>
            <RotateCw aria-hidden />
            Try again
          </Button>
          <SheetClose asChild>
            <Button variant="ghost">Back to documents</Button>
          </SheetClose>
        </>
      }
    />
  );
}
