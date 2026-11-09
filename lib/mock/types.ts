/**
 * Domain types for the Plumb mock layer.
 * Every screen talks to `lib/mock/api.ts`, never to the JSON files directly.
 */

export type ISODate = string; // "YYYY-MM-DD" (calendar date, no time)
export type ISODateTime = string; // "YYYY-MM-DDTHH:mm:ssZ"

export type ProjectStatus = "active" | "planning" | "on-hold" | "completed";

export interface Project {
  id: string;
  code: string; // short project code, e.g. "ALD"
  name: string;
  description: string;
  address: string;
  client: string;
  status: ProjectStatus;
  phase: string; // e.g. "Superstructure & envelope"
  startDate: ISODate;
  plannedCompletion: ISODate;
  /** Hex-free colour key used for the project avatar. Maps to a token, never a raw colour. */
  accent: "primary" | "accent" | "info" | "neutral";
}

export interface ProjectSummary extends Project {
  documentCount: number;
  lastActivityAt: ISODateTime | null;
}

export const DOCUMENT_TYPES = [
  "specification",
  "site-diary",
  "meeting-minutes",
  "change-order",
  "rfi",
  "data-sheet",
  "inspection-report",
  "schedule",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const TRADES = [
  "general",
  "groundworks",
  "concrete",
  "structure",
  "facade",
  "windows",
  "mep",
  "roofing",
  "finishes",
] as const;
export type Trade = (typeof TRADES)[number];

export interface DocumentPage {
  number: number; // 1-based
  text: string;
}

export interface ProjectDocument {
  id: string; // e.g. "doc-ald-001"
  projectId: string;
  code: string; // document number, e.g. "ALD-SPEC-0310"
  title: string;
  type: DocumentType;
  trade: Trade;
  date: ISODate;
  author: string; // "Name (Company)"
  pages: DocumentPage[];
}

/** What list views receive: everything except the page text. */
export interface DocumentSummary extends Omit<ProjectDocument, "pages"> {
  pageCount: number;
}

export type DocumentSortKey = "title" | "type" | "trade" | "date" | "author";
export type SortDirection = "asc" | "desc";
export interface DocumentSort {
  key: DocumentSortKey;
  direction: SortDirection;
}

export interface Citation {
  documentId: string;
  page: number;
  /** Exact substring of that page's text. The source viewer highlights it. */
  quote: string;
}

export interface KnownAnswer {
  id: string;
  projectId: string;
  question: string;
  /** Lower-case keywords used to match free-text questions to this answer. */
  keywords: string[];
  /** Short markdown answer. */
  answer: string;
  citations: Citation[];
  followUps: string[];
  /** false when the documents don't contain the answer. */
  found: boolean;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string; // markdown for assistant messages
  citations: Citation[];
  createdAt: ISODateTime;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  messages: ChatMessage[];
}

export type ConversationSummary = Omit<Conversation, "messages"> & {
  messageCount: number;
  lastMessagePreview: string;
};

export const MEMORY_CATEGORIES = ["decision", "deadline", "contact", "change"] as const;
export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];

export interface MemoryFact {
  id: string;
  projectId: string;
  text: string;
  category: MemoryCategory;
  pinned: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  sourceConversationId: string | null;
}

export type MemoryFactInput = Pick<MemoryFact, "text" | "category"> &
  Partial<Pick<MemoryFact, "pinned" | "sourceConversationId">>;

export type MemoryFactPatch = Partial<Pick<MemoryFact, "text" | "category" | "pinned">>;

/** Events yielded by `ask()`: tokens first, then citations, then done. */
export type AskEvent =
  | { type: "token"; value: string }
  | { type: "citations"; citations: Citation[] }
  | { type: "done"; messageId: string; found: boolean; followUps: string[] };

export interface User {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
}
