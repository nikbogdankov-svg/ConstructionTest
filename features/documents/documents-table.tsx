import { SortableTableHead, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { DocumentSort, DocumentSortKey, DocumentSummary } from "@/lib/mock/types";
import { DOCUMENT_TYPE_META, TRADE_LABELS } from "./document-meta";

interface DocumentsTableProps {
  documents: DocumentSummary[];
  sort: DocumentSort;
  onSort: (key: DocumentSortKey) => void;
  caption: string;
}

const sortedState = (sort: DocumentSort, key: DocumentSortKey) => (sort.key === key ? sort.direction : false);

/** Desktop layout (md and up). */
export function DocumentsTable({ documents, sort, onSort, caption }: DocumentsTableProps) {
  return (
    <Table>
      <caption className="sr-only">{caption}</caption>
      <TableHeader>
        <TableRow>
          <SortableTableHead sorted={sortedState(sort, "title")} onSort={() => onSort("title")} className="min-w-72">
            Title
          </SortableTableHead>
          <SortableTableHead sorted={sortedState(sort, "type")} onSort={() => onSort("type")}>
            Type
          </SortableTableHead>
          <SortableTableHead sorted={sortedState(sort, "trade")} onSort={() => onSort("trade")}>
            Trade
          </SortableTableHead>
          <SortableTableHead sorted={sortedState(sort, "date")} onSort={() => onSort("date")}>
            Date
          </SortableTableHead>
          <SortableTableHead sorted={sortedState(sort, "author")} onSort={() => onSort("author")} className="hidden xl:table-cell">
            Author
          </SortableTableHead>
          <TableHead className="text-right">Pages</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => {
          const meta = DOCUMENT_TYPE_META[doc.type];
          const Icon = meta.icon;
          return (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-icon-md shrink-0 text-foreground-subtle" aria-hidden />
                  <div className="flex min-w-0 flex-col">
                    <span className="font-bold text-foreground">{doc.title}</span>
                    <span className="font-mono text-caption text-foreground-subtle">{doc.code}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge tone={meta.tone} size="sm">
                  {meta.label}
                </Badge>
              </TableCell>
              <TableCell className="text-body-lg text-foreground-muted">{TRADE_LABELS[doc.trade]}</TableCell>
              <TableCell className="whitespace-nowrap tabular-nums">
                <time dateTime={doc.date}>{formatDate(doc.date)}</time>
              </TableCell>
              <TableCell className="hidden text-body-sm text-foreground-muted xl:table-cell">{doc.author}</TableCell>
              <TableCell className="text-right font-mono tabular-nums text-foreground-muted">{doc.pageCount}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
