import type { DocumentSummary } from "@/lib/mock/types";
import { DOCUMENT_TYPE_META, TRADE_LABELS } from "./document-meta";

/** URL key for the documents search box: /documents?q=concrete+spec */
export const DOCUMENT_QUERY_PARAM = "q";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[–—_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Everything a document can be found by: name, code, type (singular + plural) and trade. */
function searchableText(doc: DocumentSummary): string {
  const type = DOCUMENT_TYPE_META[doc.type];
  return normalize([doc.title, doc.code, type.label, type.plural, TRADE_LABELS[doc.trade]].join(" "));
}

/**
 * Smart search: every word must match somewhere in the name, code, type or trade,
 * in any order. "concrete spec" finds concrete specifications; "rfi facade" finds facade RFIs.
 */
export function filterDocuments(documents: DocumentSummary[], query: string): DocumentSummary[] {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return documents;
  return documents.filter((doc) => {
    const text = searchableText(doc);
    return terms.every((term) => text.includes(term));
  });
}
