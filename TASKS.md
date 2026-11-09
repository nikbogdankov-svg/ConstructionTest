# TASKS — finish Plumb

You are continuing work on **Plumb**, an AI assistant for construction projects made by **Plinthwork**. Site managers, project managers and foremen ask questions about their project, get answers with citations to the project documents, and Plumb remembers key project facts.

The project is **frontend only**. There is no backend, no LLM, no API keys and no environment variables. All data comes from the mock layer in `lib/mock`.

What already exists:

- the brand (`BRAND.md`) and the complete design system: tokens in `styles/tokens.css`, components in `components/ui`, and a live reference at **`/design-system`**
- the app shell (sidebar, top bar, project switcher, user menu, theme toggle, mobile drawer)
- the **Projects** page and the **Documents** library (the reference screen)
- placeholder pages for **Chat**, **Search** and **Memory**
- the typed mock API with streaming answers, citations, conversations and memory

Your job is the five tasks below, plus one backlog bug.

---

## Ground rules (apply to every task)

1. **Use only the design system.** Build every screen from `components/ui` and the tokens. If a pattern is missing, compose it from existing components inside your feature folder.
2. **Don't modify `components/ui/*` or anything in `styles/`** (tokens, fonts). No new colours, font sizes, radii or shadows; no hex values, `rgb()`, or arbitrary Tailwind values like `bg-[#…]` / `text-[17px]`. (Tailwind's default palette and type scale are disabled on purpose, so `bg-blue-500` or `text-sm` won't work.)
3. **Follow the Documents library pattern** (`features/documents/*`, route `app/(app)/projects/[projectId]/documents/page.tsx`):
   - thin route file → feature component in `features/<feature>/`
   - data through `lib/mock/api.ts` using `useMockQuery` (or the async iterator for `ask`)
   - every async view has **loading (skeleton) · error (with retry) · empty · content**
   - separate small components for desktop and mobile layouts where they differ
   - UI state that should survive a reload or be shareable lives in the URL
4. **Use only the mock API.** Never import the JSON in `lib/mock/data` from screens. You may **add** functions to `lib/mock/api.ts` (e.g. a search function) as long as they follow its conventions: simulated latency, `?mock=` modes, `AbortSignal`, `MockApiError`. Don't change existing signatures or the mock data.
5. **Follow the brand** (`BRAND.md`): tone of voice, do's and don'ts, both themes, 48px touch targets, visible focus, AA contrast.
6. **Accessibility:** semantic HTML, labelled controls, keyboard operable, `aria-live` for streaming and async updates, focus managed when panels open and close.
7. **Quality bar:** `npm run typecheck` and `npm run lint` pass with zero errors. Everything works at 375px wide and on desktop, in light and dark mode.
8. Don't write tests for these features unless asked.

### Testing states

Append these to any URL (the mode sticks for the browser tab until `?mock=off`):

| Switch | Effect |
|---|---|
| `?mock=slow` | every call takes 3–5 s, and streaming is slower |
| `?mock=error` | every call fails with `MockApiError` (`code: "server"`) |
| `?mock=empty` | list calls return `[]` |
| `?mock=stream-error` | `ask()` streams part of the answer, then throws (`code: "network"`) |
| `?mock=off` | back to normal |

Other useful cases: **Harbour Yard Offices** (`/projects/prj-harbour/…`) is an empty project. `/projects/does-not-exist/chat` hits project not found. "Reset demo data" in the user menu restores the memory facts.

---

## Task 1: Chat screen

**Route:** `/projects/[projectId]/chat` (new conversation) and `/projects/[projectId]/chat/[conversationId]` (past conversation).

> **Design note:** the exact visual design for the chat screen will be provided separately. Until then, build it from the design system and BRAND.md. Structure the code so the visual layer can be swapped without touching data and state logic.

Acceptance criteria:

- [ ] A question input (multi-line, `Enter` sends, `Shift+Enter` adds a new line) with a send button. It is disabled while empty and shows a stop control while an answer is streaming.
- [ ] Sending calls `ask(projectId, question, { signal })`. The user message appears immediately; the answer **streams token by token** and renders as markdown (`Markdown` component).
- [ ] After streaming, the answer shows **citation chips**: one per citation, showing the document (title or code) and page. They are keyboard accessible, and clicking one opens the source viewer (Task 2).
- [ ] When `done.found === false`, the answer ("I couldn't find this in your documents.") is shown as a clear no-answer state, not as an error.
- [ ] **Suggested follow-ups** from `done.followUps` appear under the latest answer; clicking one asks it.
- [ ] Sending states: thinking (before the first token), streaming (with a visible indicator, announced politely to screen readers), stopped by the user (keep the partial answer and mark it as stopped), and failed (`?mock=error`, `?mock=stream-error`): keep the question, show what happened, offer **Retry**.
- [ ] An empty conversation shows a welcome state with 3–6 example questions (`listSuggestedQuestions`).
- [ ] Past conversations (`listConversations`, `getConversation`) are listed (e.g. in a side list or a sheet on mobile) and open at `/chat/[conversationId]`. An unknown id shows a not-found state.
- [ ] Auto-scroll follows the stream unless the user has scrolled up; a "jump to latest" control appears in that case.
- [ ] It works at 375px wide: the input stays reachable above the keyboard and the conversation list is a sheet.

## Task 2: Source viewer

Acceptance criteria:

- [ ] Clicking a citation chip opens the cited document in a **side panel** (`Sheet`, right, on desktop; full-screen on mobile) **at the cited page**.
- [ ] The cited `quote` is **highlighted** in the page text (`bg-highlight text-highlight-foreground`) and scrolled into view. Quotes are exact substrings of the page text.
- [ ] The header shows the document title, code, type, trade, date and author. You can move between pages (previous/next, "Page 2 of 4") and the highlight is only on the cited page.
- [ ] Several citations from the same answer can be stepped through without closing the panel.
- [ ] Loading, error (with retry) and not-found (`getDocument` throws `code: "not-found"`) states.
- [ ] Focus moves into the panel on open and returns to the chip on close; `Esc` closes it.
- [ ] The open document and page are reflected in the URL (e.g. `?doc=doc-ald-001&page=2`) so a reload reopens it.

## Task 3: Memory panel

**Route:** `/projects/[projectId]/memory`.

Acceptance criteria:

- [ ] Lists the project's facts (`listMemory`) **grouped by category**: Decisions, Deadlines, Contacts, Changes. Each group has a heading, a count and an icon; pinned facts come first within each group.
- [ ] **Edit:** change the text and category (dialog or inline), with validation (text required) and saving/error states.
- [ ] **Delete:** confirm with an `AlertDialog`; after deleting, show a toast. Undo is a bonus.
- [ ] **Pin / unpin:** an optimistic update that rolls back with an error toast if the call fails.
- [ ] Each fact **links to the conversation it came from** (`sourceConversationId` → `/projects/[projectId]/chat/[conversationId]`). Facts with `null` show "Added manually".
- [ ] Shows created/updated dates.
- [ ] Empty state for a project with no facts (Harbour Yard), a loading skeleton, and an error state with retry.
- [ ] Changes survive a reload (the API persists to localStorage).

## Task 4: Document search with filters

**Route:** `/projects/[projectId]/search`.

Acceptance criteria:

- [ ] A search box that matches document **title, code, author and page text**, case-insensitive. Results show the document and, for text matches, a short snippet with the match highlighted, plus the page number.
- [ ] Filters: **type** (multi-select), **trade** (multi-select) and a **date range** (from/to; invalid ranges show an inline error). Active filters are shown as removable `Tag`s, with "Clear all".
- [ ] The query, filters and sort are stored in the URL; a reload or a shared link restores them.
- [ ] Results update as you type (debounced), show a result count announced to screen readers, and can be sorted.
- [ ] States: initial (before searching), loading, no results (with a way to clear filters), error with retry, and an empty project.
- [ ] Clicking a result opens the document in the source viewer from Task 2 (at the matching page if it was a text match).
- [ ] On mobile, filters are in a `Sheet` with an "Apply" button and an active-filter count on the trigger.

## Task 5: States and mobile, everywhere

For **every screen you build** (chat, source viewer, memory, search):

- [ ] **Empty project:** Harbour Yard shows helpful empty states, never a blank screen.
- [ ] **Loading:** skeletons that match the final layout; `?mock=slow` looks intentional.
- [ ] **Streaming:** progress is visible and announced; the user can stop it.
- [ ] **Not found:** unknown project, conversation or document ids show a not-found state with a way back.
- [ ] **Error:** `?mock=error` / `?mock=stream-error` show a recoverable error with Retry; nothing the user typed is lost.
- [ ] **Mobile:** every screen works at 375×812 with 48px touch targets, no horizontal scrolling, and panels as full-screen sheets.
- [ ] Light and dark mode both look right.

---

## Backlog

### BUG-01: Document dates are shown one day early

**Reported by:** Dana Whitlock (site manager) · **Severity:** medium · **Area:** Documents library (and every other place that shows a date)

> "The site diary for 5 November shows up as 4 Nov in the documents list. Same for the completion date on the projects page."

- **Steps to reproduce:** set your computer or browser time zone to one **east of UTC** (e.g. Europe/Berlin or Asia/Tokyo; in Chrome DevTools use **Sensors → Location** to override the time zone). Open `/projects/prj-aldermoor/documents`.
- **Expected:** "Site Diary – 5 November 2026" (`ALD-SD-2026-11-05`, date `2026-11-05`) shows **5 Nov 2026**.
- **Actual:** it shows **4 Nov 2026**. Aldermoor Court's planned completion (`2027-06-30`) shows as 29 Jun 2027 on the Projects page.
- In UTC (and west of UTC) the dates look correct, which is why it slipped through.
- **Acceptance:** calendar dates (`YYYY-MM-DD`) display as the same calendar day in every time zone; the mock data is unchanged; date-times still display correctly.

---

## Mock API reference (`lib/mock/api.ts`)

Every function takes an optional last argument `{ signal?: AbortSignal }`, waits 300–1200 ms, and throws `MockApiError` (`code: "not-found" | "server" | "network" | "validation"`).

| Function | Returns |
|---|---|
| `getCurrentUser()` | `User` |
| `listProjects()` | `ProjectSummary[]` (adds `documentCount`, `lastActivityAt`) |
| `getProject(projectId)` | `Project` |
| `listDocuments(projectId, { sort? })` | `DocumentSummary[]` (no page text; `pageCount`) |
| `getDocument(documentId)` | `ProjectDocument` with `pages: { number, text }[]` |
| `listConversations(projectId)` | `ConversationSummary[]` |
| `getConversation(conversationId)` | `Conversation` with `messages` (assistant messages include `citations`) |
| `ask(projectId, question)` | `AsyncGenerator<AskEvent>`: `token`… → `citations` → `done { messageId, found, followUps }` |
| `listSuggestedQuestions(projectId)` | `string[]` |
| `listMemory(projectId)` | `MemoryFact[]` (pinned first) |
| `createMemory(projectId, { text, category, pinned?, sourceConversationId? })` | `MemoryFact` |
| `updateMemory(id, { text?, category?, pinned? })` | `MemoryFact` |
| `deleteMemory(id)` | `void` |
| `pinMemory(id, pinned)` | `MemoryFact` |

```ts
for await (const event of ask(projectId, question, { signal })) {
  if (event.type === "token") answer += event.value;
  else if (event.type === "citations") citations = event.citations; // [{ documentId, page, quote }]
  else if (event.type === "done") followUps = event.followUps;
}
```

Types are in `lib/mock/types.ts`. Display labels and icons for document types and trades are in `features/documents/document-meta.ts`; reuse them.
