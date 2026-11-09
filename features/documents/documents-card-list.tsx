import { Calendar, FileStack, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCount, formatDate } from "@/lib/format";
import type { DocumentSummary } from "@/lib/mock/types";
import { DOCUMENT_TYPE_META, TRADE_LABELS } from "./document-meta";

/** Mobile layout (below md). */
export function DocumentsCardList({ documents, label }: { documents: DocumentSummary[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-col gap-3">
      {documents.map((doc) => {
        const meta = DOCUMENT_TYPE_META[doc.type];
        const Icon = meta.icon;
        return (
          <li key={doc.id}>
            <Card padding="sm" className="gap-3 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-surface-sunken text-foreground-muted">
                  <Icon className="size-icon-md" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-body font-bold text-foreground">{doc.title}</h3>
                  <span className="font-mono text-caption text-foreground-subtle">{doc.code}</span>
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
              <dl className="grid grid-cols-1 gap-1.5 text-body-sm text-foreground-muted">
                <div className="flex items-center gap-2">
                  <dt>
                    <Calendar className="size-icon-sm" aria-hidden />
                    <span className="sr-only">Date</span>
                  </dt>
                  <dd>
                    <time dateTime={doc.date}>{formatDate(doc.date)}</time>
                  </dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt>
                    <UserRound className="size-icon-sm" aria-hidden />
                    <span className="sr-only">Author</span>
                  </dt>
                  <dd className="truncate">{doc.author}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt>
                    <FileStack className="size-icon-sm" aria-hidden />
                    <span className="sr-only">Length</span>
                  </dt>
                  <dd>{formatCount(doc.pageCount, "page")}</dd>
                </div>
              </dl>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
