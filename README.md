# Plumb by Plinthwork — starter project

**Plumb** is an AI assistant for construction projects, made by the fictional company **Plinthwork**. Site managers, project managers and foremen ask questions about their project ("What concrete class is specified for the basement walls?"), get answers with citations to the project documents, and Plumb remembers key project facts.

This repository is a **deliberately unfinished starting point**, used to compare AI design and coding tools. It contains:

- a brandbook: [`BRAND.md`](BRAND.md) (and [`BRAND.pdf`](BRAND.pdf))
- a complete, brand-styled design system (tokens in `styles/tokens.css`, components in `components/ui`)
- the beginning of the product: app shell, Projects, and the **Documents library** (the reference screen)
- a typed mock data layer with simulated latency, streaming answers and forced error/slow modes
- the remaining work, with acceptance criteria: [`TASKS.md`](TASKS.md)

It is **frontend only**: no backend, no LLM, no API keys, no environment variables, no external services. Everything is fictional.

## Run it

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to `/projects`.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | Generates Next route types, then `tsc --noEmit` (strict) |
| `npm run lint` | ESLint (Next + TypeScript rules) |
| `npm run mock:check` | Validates the mock data: ids, links, and that every citation quote is an exact substring of its page |
| `npm run contrast` | Checks WCAG AA contrast for all token pairs in light and dark |
| `npm run check` | All four checks above |
| `npm run brand:pdf` | Rebuilds `BRAND.pdf` from `BRAND.md` (needs local Chrome, plus network once for fonts) |

## Pages

| URL | Status |
|---|---|
| `/projects` | ✅ Projects list |
| `/projects/[projectId]/documents` | ✅ Documents library (reference screen: table on desktop, cards on mobile, sortable) |
| `/projects/[projectId]/chat` | 🚧 Placeholder (Task 1) |
| `/projects/[projectId]/search` | 🚧 Placeholder (Task 4) |
| `/projects/[projectId]/memory` | 🚧 Placeholder (Task 3) |

Project ids: `prj-aldermoor` (main project, 32 documents), `prj-kestrel` (small, 6 documents), `prj-harbour` (empty).

### Forcing states

Add `?mock=slow`, `?mock=error`, `?mock=empty` or `?mock=stream-error` to any URL. The mode sticks for the browser tab, and a badge in the sidebar shows it. `?mock=off` resets it. Details are in `lib/mock/config.ts`.

## Folder structure

```
app/                              Next.js App Router (route files stay thin)
  layout.tsx                      Root: fonts, theme, tooltip provider, toaster
  globals.css                     Tailwind v4 + token import + base styles
  (app)/                          Routes inside the app shell
    layout.tsx                    <AppShell>
    projects/page.tsx             Projects list
    projects/[projectId]/
      layout.tsx                  Loads the project (ProjectProvider) + not-found gate
      documents/page.tsx          Documents library (reference screen)
      chat|search|memory/page.tsx Placeholders ("Not built yet")
components/
  ui/                             DESIGN SYSTEM: generic, brand-styled (shadcn/Radix based)
  shell/                          App shell: sidebar, top bar, project switcher, user menu, theme toggle
  patterns/                       Small app-level compositions (QueryErrorState, NotBuiltYet)
  brand/logo.tsx                  Logo mark + product lockup (token-coloured)
  theme-provider.tsx              next-themes (class-based dark mode)
features/                         Product features, one folder each
  documents/                      ← the pattern to copy: library, table, card list, loading, sort, meta
  projects/                       Projects list, project context, status meta
lib/
  mock/                           MOCK DATA LAYER (the only data source)
    api.ts                        Typed async API (+ streaming ask)
    types.ts                      Domain types
    config.ts                     Latency + ?mock= switches
    errors.ts                     MockApiError
    memory-store.ts               localStorage persistence for memory facts
    data/*.json                   Projects, documents (+ page text), answers, conversations, memory
  hooks/use-mock-query.ts         Data-fetching hook (loading/error/success, abort, refetch)
  hooks/use-media-query.ts
  format.ts                       Date/number formatting helpers
  utils.ts                        cn() (clsx + tailwind-merge configured for the token scale)
styles/
  tokens.css                      ALL design tokens (light + dark) mapped into the Tailwind theme
  fonts.ts                        next/font: Barlow Condensed, Atkinson Hyperlegible Next + Mono
  theme-color.ts                  Browser theme-color values (must be literals)
public/brand/                     Logo SVGs (light + dark)
scripts/                          Mock data validator, contrast checker, brand PDF builder
BRAND.md / BRAND.pdf              Brandbook
TASKS.md                          The brief for the remaining work
```

## Design system in one minute

- **Tokens** live only in `styles/tokens.css`. Tailwind's default colours, font sizes, radii and shadows are **reset**, so only brand utilities exist: `bg-primary`, `text-foreground-muted`, `text-h2`, `rounded-sm`, `shadow-md`, `h-control-md`, `size-icon-md`, `focus-visible:focus-ring`, …
- **Components** are in `components/ui` (import from `@/components/ui/<name>` or the `@/components/ui` barrel): Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumbs, Button, Card, Checkbox, Combobox, Command, Dialog, DropdownMenu, EmptyState, FormField, IconButton, Input, Kbd, Label, Markdown, PageHeader, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select, Separator, Sheet, Skeleton, Spinner, Switch, Table (+ SortableTableHead), Tabs, Tag, Textarea, Toast, Tooltip, Typography (Heading, Text, Code).
- **Dark mode** is class-based (`.dark` on `<html>`, via next-themes). `.light` / `.dark` can also be put on any element to force a theme for that subtree.

## Mock data & API

- Data: `lib/mock/data/*.json`. Aldermoor Court is a 6-storey, 48-apartment residential building with an underground car park. It has 32 documents (specifications, site diaries, meeting minutes, change orders, RFIs, data sheets, inspection reports and schedules) across 9 trades. There are 18 known questions (3 deliberately unanswerable), 3 past conversations and 8 memory facts.
- API: `lib/mock/api.ts`. The full reference table is at the end of `TASKS.md`. Every call has 300–1200 ms of latency and accepts an `AbortSignal`. `ask()` is an async generator that streams tokens, then citations, then `done` with follow-up suggestions.
- Memory facts persist in `localStorage` (`plumb.mock.memory.v1`). Use "Reset demo data" in the user menu to restore them.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Radix UI (`radix-ui`) · shadcn/ui patterns · cmdk · sonner · next-themes · lucide-react · react-markdown + remark-gfm.
