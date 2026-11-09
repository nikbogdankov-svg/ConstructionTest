/**
 * Typed mock API — the ONLY way screens get data.
 *
 * Every call:
 *  - waits 300–1200 ms (3–5 s with ?mock=slow),
 *  - rejects with MockApiError when ?mock=error is set,
 *  - accepts an optional AbortSignal.
 *
 * See lib/mock/config.ts for all URL switches.
 */
import { getMockMode, latency, sleep, tokenDelay, type MockMode } from "./config";
import { MockApiError } from "./errors";
import { readMemory, writeMemory } from "./memory-store";
import type {
  AskEvent,
  Citation,
  Conversation,
  ConversationSummary,
  DocumentSort,
  DocumentSummary,
  KnownAnswer,
  MemoryFact,
  MemoryFactInput,
  MemoryFactPatch,
  Project,
  ProjectDocument,
  ProjectSummary,
  User,
} from "./types";
import projectsData from "./data/projects.json";
import documentsData from "./data/documents.json";
import answersData from "./data/answers.json";
import conversationsData from "./data/conversations.json";

const projects = projectsData as Project[];
const documents = documentsData as ProjectDocument[];
const answers = answersData as KnownAnswer[];
const conversations = conversationsData as Conversation[];

export interface RequestOptions {
  signal?: AbortSignal;
}

export const NOT_FOUND_ANSWER = "I couldn't find this in your documents.";

// ---------------------------------------------------------------- helpers

async function simulate(options?: RequestOptions): Promise<MockMode> {
  const mode = getMockMode();
  await sleep(latency(mode), options?.signal);
  if (mode === "error") {
    throw new MockApiError("server", "The server didn't respond. Simulated with ?mock=error.");
  }
  return mode;
}

function assertProject(projectId: string): Project {
  const project = projects.find((p) => p.id === projectId);
  if (!project) throw new MockApiError("not-found", `Project "${projectId}" doesn't exist.`);
  return project;
}

const clone = <T,>(value: T): T => structuredClone(value);

function toSummary(doc: ProjectDocument): DocumentSummary {
  const { pages, ...rest } = doc;
  return { ...rest, pageCount: pages.length };
}

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function compareDocuments(a: DocumentSummary, b: DocumentSummary, sort: DocumentSort) {
  const dir = sort.direction === "asc" ? 1 : -1;
  const primary = sort.key === "date" ? a.date.localeCompare(b.date) : collator.compare(a[sort.key], b[sort.key]);
  // Stable tie-breaker: newest first, then title.
  return primary * dir || b.date.localeCompare(a.date) || collator.compare(a.title, b.title);
}

// ---------------------------------------------------------------- user

const currentUser: User = {
  id: "usr-dana",
  name: "Dana Whitlock",
  initials: "DW",
  role: "Site manager · Halvern Build",
  email: "d.whitlock@halvern-build.example",
};

export async function getCurrentUser(options?: RequestOptions): Promise<User> {
  await simulate(options);
  return clone(currentUser);
}

// ---------------------------------------------------------------- projects

export async function listProjects(options?: RequestOptions): Promise<ProjectSummary[]> {
  const mode = await simulate(options);
  if (mode === "empty") return [];
  return projects.map((project) => {
    const docs = documents.filter((d) => d.projectId === project.id);
    const convs = conversations.filter((c) => c.projectId === project.id);
    const last = [...convs.map((c) => c.updatedAt), ...docs.map((d) => `${d.date}T12:00:00Z`)].sort().at(-1) ?? null;
    return { ...clone(project), documentCount: docs.length, lastActivityAt: last };
  });
}

export async function getProject(projectId: string, options?: RequestOptions): Promise<Project> {
  await simulate(options);
  return clone(assertProject(projectId));
}

// ---------------------------------------------------------------- documents

export const DEFAULT_DOCUMENT_SORT: DocumentSort = { key: "date", direction: "desc" };

export async function listDocuments(
  projectId: string,
  params: { sort?: DocumentSort } = {},
  options?: RequestOptions,
): Promise<DocumentSummary[]> {
  const mode = await simulate(options);
  assertProject(projectId);
  if (mode === "empty") return [];
  const sort = params.sort ?? DEFAULT_DOCUMENT_SORT;
  return documents
    .filter((d) => d.projectId === projectId)
    .map(toSummary)
    .sort((a, b) => compareDocuments(a, b, sort));
}

export async function getDocument(documentId: string, options?: RequestOptions): Promise<ProjectDocument> {
  const mode = await simulate(options);
  const doc = documents.find((d) => d.id === documentId);
  if (!doc) throw new MockApiError("not-found", `Document "${documentId}" doesn't exist.`);
  if (mode === "corrupt") {
    throw new MockApiError("corrupted", `"${doc.code}" can't be read. Simulated with ?mock=corrupt.`);
  }
  return clone(doc);
}

// ---------------------------------------------------------------- conversations

export async function listConversations(projectId: string, options?: RequestOptions): Promise<ConversationSummary[]> {
  const mode = await simulate(options);
  assertProject(projectId);
  if (mode === "empty") return [];
  return conversations
    .filter((c) => c.projectId === projectId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(({ messages, ...rest }) => ({
      ...clone(rest),
      messageCount: messages.length,
      lastMessagePreview: (messages.at(-1)?.content ?? "").replace(/[*_#>`]/g, "").slice(0, 140),
    }));
}

export async function getConversation(conversationId: string, options?: RequestOptions): Promise<Conversation> {
  await simulate(options);
  const conv = conversations.find((c) => c.id === conversationId);
  if (!conv) throw new MockApiError("not-found", `Conversation "${conversationId}" doesn't exist.`);
  return clone(conv);
}

// ---------------------------------------------------------------- ask (streaming)

const STOP_WORDS = new Set(
  "a an and are as at be by did do does for from has have how i in is it its of on or our the this to was we what when where which who why will with".split(" "),
);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9/.\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/** Finds the known answer that best matches a free-text question (or null). */
export function matchKnownAnswer(projectId: string, question: string): KnownAnswer | null {
  const q = question.trim().toLowerCase();
  const words = new Set(tokenize(question));
  let best: { answer: KnownAnswer; score: number } | null = null;
  for (const answer of answers) {
    if (answer.projectId !== projectId) continue;
    if (answer.question.trim().toLowerCase() === q) return answer;
    let score = 0;
    for (const kw of answer.keywords) {
      const k = kw.toLowerCase();
      if (k.includes(" ") ? q.includes(k) : words.has(k)) score += k.includes(" ") ? 3 : 2;
    }
    for (const w of tokenize(answer.question)) if (words.has(w)) score += 1;
    if (!best || score > best.score) best = { answer, score };
  }
  return best && best.score >= 3 ? best.answer : null;
}

/** Splits markdown into small chunks (words + whitespace) to stream like an LLM would. */
function toTokens(markdown: string): string[] {
  return markdown.match(/\s+|[^\s]{1,6}/g) ?? [];
}

let messageCounter = 0;

/**
 * Ask a question about a project. Streams the answer token by token, then the
 * citations, then a `done` event with follow-up suggestions.
 *
 *   for await (const event of ask(projectId, "What concrete class…?", { signal })) {
 *     if (event.type === "token") text += event.value;
 *     if (event.type === "citations") citations = event.citations;
 *     if (event.type === "done") followUps = event.followUps;
 *   }
 *
 * Unknown questions answer "I couldn't find this in your documents." with no citations.
 * Throws MockApiError with ?mock=error (before the first token) or ?mock=stream-error (midway).
 */
export async function* ask(projectId: string, question: string, options?: RequestOptions): AsyncGenerator<AskEvent> {
  if (!question.trim()) throw new MockApiError("validation", "Ask a question first.");
  const mode = await simulate(options); // "thinking" time before the first token
  assertProject(projectId);

  const match = matchKnownAnswer(projectId, question);
  const text = match?.answer ?? NOT_FOUND_ANSWER;
  const citations: Citation[] = match ? clone(match.citations) : [];
  const followUps = match ? [...match.followUps] : [];

  const tokens = toTokens(text);
  const failAt = mode === "stream-error" ? Math.floor(tokens.length * 0.4) : -1;
  for (let i = 0; i < tokens.length; i++) {
    if (i === failAt) throw new MockApiError("network", "The connection dropped while answering. Simulated with ?mock=stream-error.");
    await sleep(tokenDelay(mode), options?.signal);
    yield { type: "token", value: tokens[i] };
  }
  await sleep(150, options?.signal);
  yield { type: "citations", citations };
  messageCounter += 1;
  yield { type: "done", messageId: `msg-live-${Date.now()}-${messageCounter}`, found: match?.found ?? false, followUps };
}

/** Questions the assistant can answer for a project — handy for suggestions/empty states. */
export async function listSuggestedQuestions(projectId: string, options?: RequestOptions): Promise<string[]> {
  const mode = await simulate(options);
  assertProject(projectId);
  if (mode === "empty") return [];
  return answers.filter((a) => a.projectId === projectId && a.found).slice(0, 6).map((a) => a.question);
}

// ---------------------------------------------------------------- memory (localStorage)

export async function listMemory(projectId: string, options?: RequestOptions): Promise<MemoryFact[]> {
  const mode = await simulate(options);
  assertProject(projectId);
  if (mode === "empty") return [];
  return readMemory()
    .filter((m) => m.projectId === projectId)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt));
}

export async function createMemory(projectId: string, input: MemoryFactInput, options?: RequestOptions): Promise<MemoryFact> {
  await simulate(options);
  assertProject(projectId);
  const text = input.text.trim();
  if (!text) throw new MockApiError("validation", "A memory needs some text.");
  const now = new Date().toISOString();
  const fact: MemoryFact = {
    id: `mem-${Date.now().toString(36)}`,
    projectId,
    text,
    category: input.category,
    pinned: input.pinned ?? false,
    createdAt: now,
    updatedAt: now,
    sourceConversationId: input.sourceConversationId ?? null,
  };
  writeMemory([...readMemory(), fact]);
  return clone(fact);
}

export async function updateMemory(id: string, patch: MemoryFactPatch, options?: RequestOptions): Promise<MemoryFact> {
  await simulate(options);
  const all = readMemory();
  const index = all.findIndex((m) => m.id === id);
  if (index === -1) throw new MockApiError("not-found", `Memory "${id}" doesn't exist.`);
  if (patch.text !== undefined && !patch.text.trim()) throw new MockApiError("validation", "A memory needs some text.");
  const updated: MemoryFact = {
    ...all[index],
    ...patch,
    text: patch.text?.trim() ?? all[index].text,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  writeMemory(all);
  return clone(updated);
}

export async function deleteMemory(id: string, options?: RequestOptions): Promise<void> {
  await simulate(options);
  const all = readMemory();
  if (!all.some((m) => m.id === id)) throw new MockApiError("not-found", `Memory "${id}" doesn't exist.`);
  writeMemory(all.filter((m) => m.id !== id));
}

export async function pinMemory(id: string, pinned: boolean, options?: RequestOptions): Promise<MemoryFact> {
  return updateMemory(id, { pinned }, options);
}

export { resetMemoryStore } from "./memory-store";
export { MockApiError, isMockApiError, isAbortError } from "./errors";
export { getMockMode } from "./config";
