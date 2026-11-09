import type { DocumentSort, DocumentSortKey, SortDirection } from "@/lib/mock/types";
import { DEFAULT_DOCUMENT_SORT } from "@/lib/mock/api";

const KEYS: DocumentSortKey[] = ["title", "type", "trade", "date", "author"];

/** Sort lives in the URL (?sort=date&dir=desc) so a sorted list can be shared and survives reloads. */
export function parseDocumentSort(params: URLSearchParams): DocumentSort {
  const key = params.get("sort") as DocumentSortKey | null;
  const dir = params.get("dir") as SortDirection | null;
  if (!key || !KEYS.includes(key)) return DEFAULT_DOCUMENT_SORT;
  return { key, direction: dir === "asc" || dir === "desc" ? dir : defaultDirection(key) };
}

export function serializeDocumentSort(params: URLSearchParams, sort: DocumentSort): string {
  const next = new URLSearchParams(params);
  if (sort.key === DEFAULT_DOCUMENT_SORT.key && sort.direction === DEFAULT_DOCUMENT_SORT.direction) {
    next.delete("sort");
    next.delete("dir");
  } else {
    next.set("sort", sort.key);
    next.set("dir", sort.direction);
  }
  const query = next.toString();
  return query ? `?${query}` : "";
}

/** Dates start newest-first, text columns A–Z. */
export function defaultDirection(key: DocumentSortKey): SortDirection {
  return key === "date" ? "desc" : "asc";
}

/** Clicking a column: same column flips direction, a new column starts at its default. */
export function toggleSort(current: DocumentSort, key: DocumentSortKey): DocumentSort {
  if (current.key === key) return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  return { key, direction: defaultDirection(key) };
}

/** Options for the mobile "Sort by" select. */
export const SORT_OPTIONS: { value: string; label: string; sort: DocumentSort }[] = [
  { value: "date:desc", label: "Newest first", sort: { key: "date", direction: "desc" } },
  { value: "date:asc", label: "Oldest first", sort: { key: "date", direction: "asc" } },
  { value: "title:asc", label: "Title A–Z", sort: { key: "title", direction: "asc" } },
  { value: "title:desc", label: "Title Z–A", sort: { key: "title", direction: "desc" } },
  { value: "type:asc", label: "Type", sort: { key: "type", direction: "asc" } },
  { value: "trade:asc", label: "Trade", sort: { key: "trade", direction: "asc" } },
  { value: "author:asc", label: "Author", sort: { key: "author", direction: "asc" } },
];

export const sortToValue = (sort: DocumentSort) => `${sort.key}:${sort.direction}`;
