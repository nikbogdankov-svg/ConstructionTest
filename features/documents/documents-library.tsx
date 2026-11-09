"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FolderOpen, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { PageHeader } from "@/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { QueryErrorState } from "@/components/patterns/query-error-state";
import { useProject } from "@/features/projects/project-context";
import { useMockQuery } from "@/lib/hooks/use-mock-query";
import { listDocuments } from "@/lib/mock/api";
import type { DocumentSort, DocumentSortKey } from "@/lib/mock/types";
import { formatCount } from "@/lib/format";
import { DocumentsCardList } from "./documents-card-list";
import { DocumentsLoading } from "./documents-loading";
import { DocumentsTable } from "./documents-table";
import { SORT_OPTIONS, parseDocumentSort, serializeDocumentSort, sortToValue, toggleSort } from "./document-sort";

/**
 * REFERENCE SCREEN — the pattern every new screen should follow:
 *
 *  1. The route file (app/…/page.tsx) only reads params and renders a feature component.
 *  2. The feature component owns UI state (here: sort, kept in the URL).
 *  3. Data comes from lib/mock/api through useMockQuery — never from the JSON files.
 *  4. Exactly one of: loading skeleton · error (with retry) · empty · content.
 *  5. Desktop and mobile layouts are separate small components (table vs cards).
 */
export function DocumentsLibrary({ projectId }: { projectId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = parseDocumentSort(searchParams);
  const project = useProject();

  const documents = useMockQuery(
    (signal) => listDocuments(projectId, { sort }, { signal }),
    [projectId, sort.key, sort.direction],
  );

  const setSort = React.useCallback(
    (next: DocumentSort) => {
      router.replace(`${pathname}${serializeDocumentSort(searchParams, next)}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const onColumnSort = (key: DocumentSortKey) => setSort(toggleSort(sort, key));
  const projectName = project.status === "success" ? project.data.name : null;
  const count = documents.status === "success" ? documents.data.length : null;
  const listLabel = `Documents${projectName ? ` in ${projectName}` : ""}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={
          project.status === "success" ? project.data.code : project.status === "loading" ? <Skeleton className="h-4 w-12" /> : undefined
        }
        title="Documents"
        description={
          project.status === "loading" ? (
            <Skeleton className="mt-1 h-5 w-80 max-w-full" />
          ) : (
            `Specifications, site diaries, minutes, RFIs and reports${projectName ? ` for ${projectName}` : ""}.`
          )
        }
        actions={
          <Button asChild variant="secondary">
            <Link href={`/projects/${projectId}/chat`}>
              <MessageSquareText aria-hidden />
              Ask about these documents
            </Link>
          </Button>
        }
      />

      {documents.status === "success" && documents.data.length > 0 && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="flex items-center gap-2 text-body text-foreground-muted" aria-live="polite">
            <strong className="text-foreground">{formatCount(count ?? 0, "document")}</strong>
            {documents.isRefetching && <Spinner size="sm" tone="muted" label="Sorting" />}
          </p>
          <FormField label="Sort by" className="w-full sm:w-56 md:hidden">
            <Select
              value={sortToValue(sort)}
              onValueChange={(value) => {
                const option = SORT_OPTIONS.find((o) => o.value === value);
                if (option) setSort(option.sort);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      )}

      {documents.status === "loading" && <DocumentsLoading />}

      {documents.status === "error" && (
        <QueryErrorState error={documents.error} onRetry={documents.refetch} action="load documents" />
      )}

      {documents.status === "success" && documents.data.length === 0 && (
        <EmptyState
          framed
          size="lg"
          icon={<FolderOpen />}
          title="No documents yet"
          description="When drawings, specs, site diaries and reports are added to this project, they'll be listed here and Plumb can answer questions about them."
        />
      )}

      {documents.status === "success" && documents.data.length > 0 && (
        <div className={documents.isRefetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
          <div className="hidden md:block">
            <DocumentsTable documents={documents.data} sort={sort} onSort={onColumnSort} caption={listLabel} />
          </div>
          <div className="md:hidden">
            <DocumentsCardList documents={documents.data} label={listLabel} />
          </div>
        </div>
      )}
    </div>
  );
}
