#!/usr/bin/env node
// Validates the Plumb mock data in lib/mock/data against the rules in lib/mock/types.ts.
// Usage: node scripts/validate-mock.mjs   (exits 1 on any error)
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "lib", "mock", "data");

// Copied from lib/mock/types.ts — keep in sync.
const PROJECT_STATUSES = ["active", "planning", "on-hold", "completed"];
const ACCENTS = ["primary", "accent", "info", "neutral"];
const DOCUMENT_TYPES = ["specification", "site-diary", "meeting-minutes", "change-order", "rfi", "data-sheet", "inspection-report", "schedule"];
const TRADES = ["general", "groundworks", "concrete", "structure", "facade", "windows", "mep", "roofing", "finishes"];
const MEMORY_CATEGORIES = ["decision", "deadline", "contact", "change"];
const ROLES = ["user", "assistant"];
const NOT_FOUND = "I couldn't find this in your documents.";

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

function load(name) {
  try {
    const data = JSON.parse(readFileSync(join(DATA, name), "utf8"));
    if (!Array.isArray(data)) err(`${name}: top level must be an array`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    err(`${name}: cannot load (${e.message})`);
    return [];
  }
}

const projects = load("projects.json");
const documents = load("documents.json");
const answers = load("answers.json");
const conversations = load("conversations.json");
const memory = load("memory.json");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const isDate = (s) => typeof s === "string" && DATE_RE.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z")) && new Date(s + "T00:00:00Z").toISOString().startsWith(s);
const isDateTime = (s) => typeof s === "string" && DATETIME_RE.test(s) && !Number.isNaN(Date.parse(s));

function checkKeys(label, obj, required) {
  if (obj === null || typeof obj !== "object") return err(`${label}: not an object`);
  for (const [key, type] of Object.entries(required)) {
    const v = obj[key];
    if (type === "string|null") {
      if (v !== null && typeof v !== "string") err(`${label}: "${key}" must be string or null`);
    } else if (type === "array") {
      if (!Array.isArray(v)) err(`${label}: "${key}" must be an array`);
    } else if (typeof v !== type) {
      err(`${label}: "${key}" must be ${type}`);
    }
  }
  for (const key of Object.keys(obj)) if (!(key in required)) err(`${label}: unexpected field "${key}"`);
}

function checkUnique(label, items, getId = (x) => x.id) {
  const seen = new Set();
  for (const it of items) {
    const id = getId(it);
    if (seen.has(id)) err(`${label}: duplicate id "${id}"`);
    seen.add(id);
  }
}

// ---------- projects ----------
checkUnique("projects", projects);
const projectIds = new Set(projects.map((p) => p.id));
for (const p of projects) {
  const l = `project ${p.id}`;
  checkKeys(l, p, { id: "string", code: "string", name: "string", description: "string", address: "string", client: "string", status: "string", phase: "string", startDate: "string", plannedCompletion: "string", accent: "string" });
  if (!PROJECT_STATUSES.includes(p.status)) err(`${l}: invalid status "${p.status}"`);
  if (!ACCENTS.includes(p.accent)) err(`${l}: invalid accent "${p.accent}"`);
  if (!isDate(p.startDate)) err(`${l}: invalid startDate`);
  if (!isDate(p.plannedCompletion)) err(`${l}: invalid plannedCompletion`);
  if (p.startDate > p.plannedCompletion) err(`${l}: startDate after plannedCompletion`);
}
checkUnique("project codes", projects, (p) => p.code);

// ---------- documents ----------
checkUnique("documents", documents);
checkUnique("document codes", documents, (d) => d.code);
const docById = new Map(documents.map((d) => [d.id, d]));
for (const d of documents) {
  const l = `document ${d.id}`;
  checkKeys(l, d, { id: "string", projectId: "string", code: "string", title: "string", type: "string", trade: "string", date: "string", author: "string", pages: "array" });
  if (!projectIds.has(d.projectId)) err(`${l}: unknown projectId "${d.projectId}"`);
  if (!DOCUMENT_TYPES.includes(d.type)) err(`${l}: invalid type "${d.type}"`);
  if (!TRADES.includes(d.trade)) err(`${l}: invalid trade "${d.trade}"`);
  if (!isDate(d.date)) err(`${l}: invalid date "${d.date}"`);
  if (!/^.+ \(.+\)$/.test(d.author ?? "")) err(`${l}: author must look like "Name (Company)"`);
  if (!Array.isArray(d.pages) || d.pages.length === 0) {
    err(`${l}: must have at least one page`);
    continue;
  }
  d.pages.forEach((pg, i) => {
    checkKeys(`${l} page[${i}]`, pg, { number: "number", text: "string" });
    if (pg.number !== i + 1) err(`${l}: page numbers must be 1..n consecutive (index ${i} has number ${pg.number})`);
    if (typeof pg.text === "string" && pg.text.trim().length === 0) err(`${l}: page ${pg.number} is empty`);
  });
}

// ---------- citations ----------
function checkCitation(label, c, projectId) {
  checkKeys(label, c, { documentId: "string", page: "number", quote: "string" });
  const doc = docById.get(c.documentId);
  if (!doc) return err(`${label}: unknown documentId "${c.documentId}"`);
  if (doc.projectId !== projectId) err(`${label}: document ${doc.id} belongs to ${doc.projectId}, not ${projectId}`);
  const page = doc.pages.find((p) => p.number === c.page);
  if (!page) return err(`${label}: document ${doc.id} has no page ${c.page}`);
  if (!c.quote || !page.text.includes(c.quote)) {
    return err(`${label}: quote not found verbatim in ${doc.id} p${c.page}: "${c.quote}"`);
  }
  if (c.quote.includes("\n\n")) err(`${label}: quote spans paragraphs`);
  const words = c.quote.trim().split(/\s+/).length;
  if (words < 8 || words > 40) warn(`${label}: quote has ${words} words (expected 8–40)`);
}

// ---------- answers ----------
checkUnique("answers", answers);
const questions = new Set();
for (const a of answers) {
  const l = `answer ${a.id}`;
  checkKeys(l, a, { id: "string", projectId: "string", question: "string", keywords: "array", answer: "string", citations: "array", followUps: "array", found: "boolean" });
  if (!projectIds.has(a.projectId)) err(`${l}: unknown projectId "${a.projectId}"`);
  const qKey = `${a.projectId}::${a.question}`;
  if (questions.has(qKey)) err(`${l}: duplicate question "${a.question}"`);
  questions.add(qKey);
  if (!Array.isArray(a.keywords) || a.keywords.length === 0) err(`${l}: needs keywords`);
  for (const k of a.keywords ?? []) if (typeof k !== "string" || k !== k.toLowerCase()) err(`${l}: keyword "${k}" must be a lower-case string`);
  for (const f of a.followUps ?? []) if (typeof f !== "string" || !f.trim()) err(`${l}: followUps must be non-empty strings`);
  if (a.found === false) {
    if ((a.citations ?? []).length) err(`${l}: found=false must have no citations`);
    if (a.answer !== NOT_FOUND) err(`${l}: found=false answer must be exactly "${NOT_FOUND}"`);
  } else if (a.found === true && (a.citations ?? []).length === 0) {
    err(`${l}: found=true must have at least one citation`);
  }
  (a.citations ?? []).forEach((c, i) => checkCitation(`${l} citation[${i}]`, c, a.projectId));
}

// ---------- conversations ----------
checkUnique("conversations", conversations);
checkUnique("messages", conversations.flatMap((c) => c.messages ?? []));
const convIds = new Set(conversations.map((c) => c.id));
const convById = new Map(conversations.map((c) => [c.id, c]));
for (const cv of conversations) {
  const l = `conversation ${cv.id}`;
  checkKeys(l, cv, { id: "string", projectId: "string", title: "string", createdAt: "string", updatedAt: "string", messages: "array" });
  if (!projectIds.has(cv.projectId)) err(`${l}: unknown projectId "${cv.projectId}"`);
  if (!isDateTime(cv.createdAt)) err(`${l}: invalid createdAt`);
  if (!isDateTime(cv.updatedAt)) err(`${l}: invalid updatedAt`);
  if (cv.createdAt > cv.updatedAt) err(`${l}: createdAt after updatedAt`);
  const msgs = cv.messages ?? [];
  if (msgs.length === 0) err(`${l}: has no messages`);
  let prev = null;
  msgs.forEach((m, i) => {
    const ml = `${l} message ${m.id ?? i}`;
    checkKeys(ml, m, { id: "string", role: "string", content: "string", citations: "array", createdAt: "string" });
    if (!ROLES.includes(m.role)) err(`${ml}: invalid role "${m.role}"`);
    if (!isDateTime(m.createdAt)) err(`${ml}: invalid createdAt`);
    if (prev && m.createdAt < prev) err(`${ml}: messages not in chronological order`);
    prev = m.createdAt;
    if (m.role === "user" && (m.citations ?? []).length) err(`${ml}: user messages must not have citations`);
    (m.citations ?? []).forEach((c, j) => checkCitation(`${ml} citation[${j}]`, c, cv.projectId));
  });
  if (msgs.length) {
    if (msgs[0].createdAt < cv.createdAt) err(`${l}: first message precedes createdAt`);
    if (msgs[msgs.length - 1].createdAt > cv.updatedAt) err(`${l}: last message after updatedAt`);
  }
}

// ---------- memory ----------
checkUnique("memory", memory);
for (const m of memory) {
  const l = `memory ${m.id}`;
  checkKeys(l, m, { id: "string", projectId: "string", text: "string", category: "string", pinned: "boolean", createdAt: "string", updatedAt: "string", sourceConversationId: "string|null" });
  if (!projectIds.has(m.projectId)) err(`${l}: unknown projectId "${m.projectId}"`);
  if (!MEMORY_CATEGORIES.includes(m.category)) err(`${l}: invalid category "${m.category}"`);
  if (!isDateTime(m.createdAt)) err(`${l}: invalid createdAt`);
  if (!isDateTime(m.updatedAt)) err(`${l}: invalid updatedAt`);
  if (m.createdAt > m.updatedAt) err(`${l}: createdAt after updatedAt`);
  if (m.sourceConversationId !== null) {
    if (!convIds.has(m.sourceConversationId)) err(`${l}: unknown sourceConversationId "${m.sourceConversationId}"`);
    else if (convById.get(m.sourceConversationId).projectId !== m.projectId) err(`${l}: source conversation belongs to another project`);
  }
}

// ---------- summary ----------
const perProject = (arr) => {
  const out = {};
  for (const p of projects) out[p.code] = arr.filter((x) => x.projectId === p.id).length;
  return out;
};
const citationCount = answers.reduce((n, a) => n + a.citations.length, 0) + conversations.reduce((n, c) => n + c.messages.reduce((k, m) => k + (m.citations?.length ?? 0), 0), 0);

console.log("Plumb mock data validation");
console.log("  projects:      ", projects.length);
console.log("  documents:     ", documents.length, perProject(documents), `(${documents.reduce((n, d) => n + d.pages.length, 0)} pages)`);
console.log("  answers:       ", answers.length, perProject(answers), `(${answers.filter((a) => !a.found).length} not found)`);
console.log("  conversations: ", conversations.length, perProject(conversations), `(${conversations.reduce((n, c) => n + c.messages.length, 0)} messages)`);
console.log("  memory:        ", memory.length, perProject(memory));
console.log("  citations checked:", citationCount);
console.log("  document types:", [...new Set(documents.map((d) => d.type))].length, "of", DOCUMENT_TYPES.length);
console.log("  trades:        ", [...new Set(documents.map((d) => d.trade))].length, "of", TRADES.length);

for (const w of warnings) console.log("WARN  " + w);
for (const e of errors) console.log("ERROR " + e);
if (errors.length) {
  console.log(`\nFAILED: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\nOK: 0 errors, ${warnings.length} warning(s)`);
