"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FolderOpen, MessageSquareText, Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
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
import { DocumentViewerSheet } from "./document-viewer-sheet";
import { DOCUMENT_QUERY_PARAM, filterDocuments } from "./document-search";
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

  // Search filters instantly as you type; the URL (?q=) follows shortly after so a reload or shared link restores it.
  const [query, setQuery] = React.useState(() => searchParams.get(DOCUMENT_QUERY_PARAM) ?? "");
  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === (searchParams.get(DOCUMENT_QUERY_PARAM) ?? "")) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set(DOCUMENT_QUERY_PARAM, trimmed);
      else next.delete(DOCUMENT_QUERY_PARAM);
      const search = next.toString();
      router.replace(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router, pathname, searchParams]);

  const visibleDocuments = React.useMemo(
    () => (documents.status === "success" ? filterDocuments(documents.data, query) : []),
    [documents.status, documents.data, query],
  );
  const isSearching = query.trim().length > 0;

  // ?doc=<documentId> opens that document in the viewer panel, so a link (or reload) reopens it.
  const openDocId = searchParams.get("doc");
  const openDoc = openDocId && documents.status === "success" ? documents.data.find((d) => d.id === openDocId) : undefined;
  const closeViewer = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("doc");
    const search = next.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
  };

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
        <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <FormField label="Search documents" className="w-full md:max-w-md">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && query) {
                  e.preventDefault();
                  setQuery("");
                }
              }}
              placeholder="Name, code, type or trade, e.g. concrete spec"
              autoComplete="off"
              leadingIcon={<Search />}
              trailing={
                query && (
                  <IconButton size="sm" label="Clear search" tooltip={false} onClick={() => setQuery("")}>
                    <X aria-hidden />
                  </IconButton>
                )
              }
            />
          </FormField>
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
          <p className="flex items-center gap-2 text-body text-foreground-muted" aria-live="polite">
            {isSearching ? (
              <span>
                <strong className="text-foreground">{visibleDocuments.length}</strong> of {formatCount(count ?? 0, "document")} match
                “{query.trim()}”
              </span>
            ) : (
              <strong className="text-foreground">{formatCount(count ?? 0, "document")}</strong>
            )}
            {documents.isRefetching && <Spinner size="sm" tone="muted" label="Sorting" />}
          </p>
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

      {documents.status === "success" && documents.data.length > 0 && visibleDocuments.length === 0 && (
        <EmptyState
          framed
          icon={<SearchX />}
          title="No documents match your search"
          description={`Nothing matches “${query.trim()}” by name, code, type or trade. Try fewer or different words.`}
          actions={
            <Button variant="secondary" onClick={() => setQuery("")}>
              Clear search
            </Button>
          }
        />
      )}

      {documents.status === "success" && visibleDocuments.length > 0 && (
        <div className={documents.isRefetching ? "opacity-70 transition-opacity" : "transition-opacity"}>
          <div className="hidden md:block">
            <DocumentsTable documents={visibleDocuments} sort={sort} onSort={onColumnSort} caption={listLabel} />
          </div>
          <div className="md:hidden">
            <DocumentsCardList documents={visibleDocuments} label={listLabel} />
          </div>
        </div>
      )}

      {openDoc && (
        <DocumentViewerSheet doc={openDoc} open onOpenChange={(open) => !open && closeViewer()} />
      )}
    </div>
  );
}
