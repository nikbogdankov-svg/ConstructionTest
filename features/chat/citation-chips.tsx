"use client";

import { FileText } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { DOCUMENT_TYPE_META } from "@/features/documents/document-meta";
import type { Citation, DocumentSummary } from "@/lib/mock/types";

export interface CitationChipsProps {
  citations: Citation[];
  /** documentId → summary, for titles and codes. Missing entries fall back to a generic label. */
  documents: Map<string, DocumentSummary>;
  onOpen: (citation: Citation, index: number) => void;
}

/** One keyboard-accessible chip per citation: document code + page. */
export function CitationChips({ citations, documents, onOpen }: CitationChipsProps) {
  if (citations.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-overline uppercase text-foreground-subtle">Sources</p>
      <ul className="flex flex-wrap gap-2">
        {citations.map((citation, index) => {
          const doc = documents.get(citation.documentId);
          const Icon = doc ? DOCUMENT_TYPE_META[doc.type].icon : FileText;
          const name = doc?.code ?? "Document";
          return (
            <li key={`${citation.documentId}-${citation.page}-${index}`} className="max-w-full">
              <Tag
                icon={<Icon aria-hidden />}
                onClick={() => onOpen(citation, index)}
                aria-label={`Open ${doc?.title ?? "source document"}, page ${citation.page}`}
                title={doc?.title}
                className="min-h-control-md md:min-h-control-sm"
              >
                {name} · p. {citation.page}
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
