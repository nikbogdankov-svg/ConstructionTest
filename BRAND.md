# Plinthwork Brandbook

> Plinthwork · **Plumb**, the project assistant · Version 1.0 · November 2026
> The source of truth for code is `styles/tokens.css` (tokens) and `components/ui` (components). The live reference is `/design-system`. This document is written so it can be pasted into any design or coding tool.

---

## 1. Who we are

| | |
|---|---|
| **Company** | **Plinthwork**: software for the people who build buildings. |
| **Mission** | Give everyone on site the right answer from the project's own documents, in seconds, with the page it came from. |
| **Product** | **Plumb**: an AI assistant for construction projects. Site managers, project managers and foremen ask a question ("What concrete class is specified for the basement walls?"), get a short answer with citations to the project documents, and Plumb remembers key facts: decisions, deadlines, contacts and changes. |
| **Personality** | **Precise · Calm · Dependable · Practical** |
| **Name logic** | A *plinth* is the solid base a structure stands on. A *plumb* line is how you prove something is true and vertical. The product checks answers against the documents. |

**Brand direction:** precise, calm and trustworthy, built for the outdoors. High contrast that stays readable in sunlight, and large touch targets for people wearing gloves. It looks like a well-made measuring tool, not a SaaS dashboard. No hazard stripes, no yellow-and-black, no generic SaaS blue.

What makes it recognisable at a glance:

1. **Spruce green + hi-vis lime** on warm **concrete** neutrals (not grey-blue, not black-and-white).
2. **Condensed headings** (Barlow Condensed), like site signage and drawing title blocks.
3. **Crisp 4px corners and 2px borders** instead of soft 8–12px rounded cards.
4. **The hi-vis focus ring**: a dark 2px line inside a 3px lime halo.
5. **The measuring-tape rule**: a row of tick marks under page titles (`rule-ticks`).
6. **48px controls** everywhere by default.

---

## 2. Logo

Files are in `/public/brand` (text converted to outlines, so no fonts needed):

| File | Use |
|---|---|
| `plinthwork-mark.svg` / `plinthwork-mark-dark.svg` | Square mark, 64×64. App icon, favicon (`app/icon.svg`), avatars. |
| `plinthwork-wordmark.svg` / `plinthwork-wordmark-dark.svg` | Company lockup: mark + PLINTHWORK. Marketing, documents. |
| `plumb-wordmark.svg` / `plumb-wordmark-dark.svg` | Product lockup: mark + "Plumb" + BY PLINTHWORK. Product UI header. |

In the app, use `<LogoMark />` / `<ProductLogo />` from `components/brand/logo.tsx`. They draw with tokens, so they switch theme automatically.

**The mark** is a spruce tile with a stepped plinth (the base), a plumb line, and a lime plumb bob that just touches the plinth: *true, checked, grounded.*

- Clear space: at least ¼ of the mark's height on every side.
- Minimum size: mark 16px (favicon), wordmarks 24px tall.
- Light backgrounds use the light files; dark backgrounds (`--background` dark, photos) use `-dark`.
- Never recolour, rotate, outline, add shadows or put the mark on lime.

---

## 3. Colour

All colours are CSS variables in `styles/tokens.css`, mapped to Tailwind utilities (`bg-primary`, `text-foreground-muted`, `border-border-strong`, …). **Tailwind's default palette is switched off**, so `bg-blue-500` or `text-black` do nothing in this project.

### 3.1 Primitive palette

| Family | Token | Hex | Notes |
|---|---|---|---|
| Spruce (primary) | `--spruce-950` | `#0B2620` | |
| | `--spruce-900` | `#113A31` | |
| | `--spruce-800` | `#164B3F` | primary hover |
| | **`--spruce-700`** | **`#1B5E4F`** | **brand primary** |
| | `--spruce-600` | `#237361` | |
| | `--spruce-500` | `#2E8C76` | |
| | `--spruce-400` | `#5BAE98` | |
| | `--spruce-300` | `#8FCBB9` | primary in dark mode |
| | `--spruce-200` | `#BFE3D7` | |
| | `--spruce-100` | `#DDF0E9` | primary-subtle |
| | `--spruce-50` | `#EEF7F3` | |
| Lime (accent) | `--lime-700` | `#4A6300` | lime *text* on light |
| | `--lime-600` | `#6F8F0A` | |
| | `--lime-500` | `#A3CC1A` | |
| | `--lime-400` | `#BFE635` | accent hover |
| | **`--lime-300`** | **`#CDEF52`** | **brand accent / focus halo / highlight** |
| | `--lime-100` | `#F0FBCB` | |
| Concrete (neutrals) | `--concrete-0` | `#FFFFFF` | cards (light) |
| | `--concrete-25` | `#F7F5F0` | page background (light) |
| | `--concrete-50` | `#EFECE5` | sunken / hover |
| | `--concrete-100` | `#E6E2D9` | |
| | `--concrete-200` | `#D6D2C8` | borders |
| | `--concrete-300` | `#B9B4A8` | |
| | `--concrete-400` | `#8A867C` | input borders |
| | `--concrete-500` | `#6B6862` | subtle text |
| | `--concrete-600` | `#4F4D48` | muted text |
| | `--concrete-700…900` | `#3A3935` `#262624` `#1A1B19` | |
| Night (dark surfaces) | `--night-950…100` | `#0A0F0D` `#0E1513` `#151E1B` `#1C2723` `#2B3833` `#5E6C66` `#8E9993` `#B2BCB6` `#EDF1EC` | |
| Ink | `--ink` | `#141A17` | darkest text. **Never pure black.** |

### 3.2 Semantic tokens (what components use)

| Token (Tailwind) | Light | Dark | Use |
|---|---|---|---|
| `background` | `#F7F5F0` | `#0E1513` | Page |
| `surface` | `#FFFFFF` | `#151E1B` | Cards, tables, inputs |
| `surface-raised` | `#FFFFFF` | `#1C2723` | Menus, dialogs, sheets |
| `surface-sunken` | `#EFECE5` | `#0A0F0D` | Table headers, wells, code |
| `surface-hover` / `surface-active` | `#EFECE5` / `#E6E2D9` | `#1C2723` / `#2B3833` | Hover / pressed rows and ghost buttons |
| `overlay` | ink @ 56% | `#050807` @ 72% | Behind dialogs and sheets |
| `foreground` | `#141A17` | `#EDF1EC` | Body text, headings |
| `foreground-muted` | `#4F4D48` | `#B2BCB6` | Secondary text |
| `foreground-subtle` | `#6B6862` | `#8E9993` | Meta, placeholders, captions |
| `foreground-disabled` | `#8A867C` | `#5E6C66` | Disabled text (exempt from AA) |
| `border` / `border-strong` | `#D6D2C8` / `#8A867C` | `#2B3833` / `#5E6C66` | Dividers / emphasised edges |
| `input-border` | `#8A867C` | `#5E6C66` | Form control borders (≥3:1) |
| `primary` | `#1B5E4F` | `#8FCBB9` | Primary buttons, links, active nav |
| `primary-hover` / `-active` | `#164B3F` / `#113A31` | `#BFE3D7` / `#DDF0E9` | |
| `primary-foreground` | `#FFFFFF` | `#0B2620` | Text on primary |
| `primary-subtle` / `-foreground` | `#DDF0E9` / `#113A31` | `#173229` / `#BFE3D7` | Selected rows, active nav, tinted badges |
| `accent` | `#CDEF52` | `#CDEF52` | The one hi-vis action, highlights |
| `accent-foreground` | `#141A17` | `#141A17` | Text on lime (always dark) |
| `accent-subtle` / `-foreground` | `#F0FBCB` / `#4A6300` | `#27310D` / `#CDEF52` | |
| `success` / `-subtle` / `-subtle-foreground` | `#2E7D32` / `#E3F3E1` / `#1E5A22` | `#7CC97F` / `#16301A` / `#A7DFA9` | Passed inspections, saved |
| `warning` / `-subtle` / `-subtle-foreground` | `#E8A317` / `#FDF0D5` / `#6E3F00` | `#F2B544` / `#33260B` / `#F7D08A` | Superseded info, delays (amber, not hazard yellow) |
| `danger` / `-subtle` / `-subtle-foreground` | `#B42318` / `#FDE7E4` / `#8A1A12` | `#FF8A7A` / `#3A1512` / `#FFB4A9` | Errors, destructive actions |
| `info` / `-subtle` / `-subtle-foreground` | `#2B5C8A` / `#E2ECF6` / `#1D4268` | `#8DB8E8` / `#132538` / `#B5D2F2` | Neutral notices (muted steel, not SaaS blue) |
| `ring-inner` + `ring` | `#141A17` + `#CDEF52` | `#0E1513` + `#CDEF52` | Focus ring (inner line + halo) |
| `highlight` / `-foreground` | `#CDEF52` / `#141A17` | same | Highlighted text, e.g. a quote in a source |
| `skeleton` | `#E6E2D9` | `#1C2723` | Loading placeholders |

Each semantic colour has a matching `*-foreground` meant to sit on it. Always pair them: `bg-danger text-danger-foreground`, `bg-info-subtle text-info-subtle-foreground`.

### 3.3 Accessibility: WCAG AA contrast

Every text/background pair below is checked automatically by `npm run contrast` (`scripts/check-contrast.mjs`, which reads `tokens.css` directly). **All 54 pairs pass WCAG 2.2 AA** in both modes: at least 4.5:1 for text, and 3:1 for UI boundaries and the focus ring. Most body text pairs exceed AAA (7:1) for sunlight readability.

| Mode | Pair | Colours | Ratio | Needs | Result |
|---|---|---|---|---|---|
| light | `foreground on background` | #141a17 / #f7f5f0 | 16.20:1 | 4.5:1 | PASS |
| light | `foreground on surface` | #141a17 / #ffffff | 17.65:1 | 4.5:1 | PASS |
| light | `foreground on surface-sunken` | #141a17 / #efece5 | 14.96:1 | 4.5:1 | PASS |
| light | `foreground-muted on background` | #4f4d48 / #f7f5f0 | 7.75:1 | 4.5:1 | PASS |
| light | `foreground-muted on surface` | #4f4d48 / #ffffff | 8.44:1 | 4.5:1 | PASS |
| light | `foreground-subtle on surface` | #6b6862 / #ffffff | 5.55:1 | 4.5:1 | PASS |
| light | `foreground-subtle on background` | #6b6862 / #f7f5f0 | 5.10:1 | 4.5:1 | PASS |
| light | `primary-foreground on primary` | #ffffff / #1b5e4f | 7.61:1 | 4.5:1 | PASS |
| light | `primary-foreground on primary-hover` | #ffffff / #164b3f | 9.94:1 | 4.5:1 | PASS |
| light | `primary on surface` | #1b5e4f / #ffffff | 7.61:1 | 4.5:1 | PASS |
| light | `primary on background` | #1b5e4f / #f7f5f0 | 6.98:1 | 4.5:1 | PASS |
| light | `primary-subtle-foreground on primary-subtle` | #113a31 / #ddf0e9 | 10.59:1 | 4.5:1 | PASS |
| light | `accent-foreground on accent` | #141a17 / #cdef52 | 13.50:1 | 4.5:1 | PASS |
| light | `accent-foreground on accent-hover` | #141a17 / #bfe635 | 12.26:1 | 4.5:1 | PASS |
| light | `accent-subtle-foreground on accent-subtle` | #4a6300 / #f0fbcb | 6.30:1 | 4.5:1 | PASS |
| light | `success-foreground on success` | #ffffff / #2e7d32 | 5.13:1 | 4.5:1 | PASS |
| light | `success-subtle-foreground on success-subtle` | #1e5a22 / #e3f3e1 | 7.15:1 | 4.5:1 | PASS |
| light | `warning-foreground on warning` | #141a17 / #e8a317 | 8.14:1 | 4.5:1 | PASS |
| light | `warning-subtle-foreground on warning-subtle` | #6e3f00 / #fdf0d5 | 7.84:1 | 4.5:1 | PASS |
| light | `danger-foreground on danger` | #ffffff / #b42318 | 6.57:1 | 4.5:1 | PASS |
| light | `danger on surface` | #b42318 / #ffffff | 6.57:1 | 4.5:1 | PASS |
| light | `danger-subtle-foreground on danger-subtle` | #8a1a12 / #fde7e4 | 7.92:1 | 4.5:1 | PASS |
| light | `info-foreground on info` | #ffffff / #2b5c8a | 7.00:1 | 4.5:1 | PASS |
| light | `info-subtle-foreground on info-subtle` | #1d4268 / #e2ecf6 | 8.65:1 | 4.5:1 | PASS |
| light | `highlight-foreground on highlight` | #141a17 / #cdef52 | 13.50:1 | 4.5:1 | PASS |
| light | `input-border on surface` | #8a867c / #ffffff | 3.63:1 | 3:1 | PASS |
| light | `ring-inner on background` | #141a17 / #f7f5f0 | 16.20:1 | 3:1 | PASS |
| dark | `foreground on background` | #edf1ec / #0e1513 | 16.20:1 | 4.5:1 | PASS |
| dark | `foreground on surface` | #edf1ec / #151e1b | 14.91:1 | 4.5:1 | PASS |
| dark | `foreground on surface-sunken` | #edf1ec / #0a0f0d | 16.92:1 | 4.5:1 | PASS |
| dark | `foreground-muted on background` | #b2bcb6 / #0e1513 | 9.48:1 | 4.5:1 | PASS |
| dark | `foreground-muted on surface` | #b2bcb6 / #151e1b | 8.73:1 | 4.5:1 | PASS |
| dark | `foreground-subtle on surface` | #8e9993 / #151e1b | 5.78:1 | 4.5:1 | PASS |
| dark | `foreground-subtle on background` | #8e9993 / #0e1513 | 6.28:1 | 4.5:1 | PASS |
| dark | `primary-foreground on primary` | #0b2620 / #8fcbb9 | 8.70:1 | 4.5:1 | PASS |
| dark | `primary-foreground on primary-hover` | #0b2620 / #bfe3d7 | 11.57:1 | 4.5:1 | PASS |
| dark | `primary on surface` | #8fcbb9 / #151e1b | 9.25:1 | 4.5:1 | PASS |
| dark | `primary on background` | #8fcbb9 / #0e1513 | 10.05:1 | 4.5:1 | PASS |
| dark | `primary-subtle-foreground on primary-subtle` | #bfe3d7 / #173229 | 9.96:1 | 4.5:1 | PASS |
| dark | `accent-foreground on accent` | #141a17 / #cdef52 | 13.50:1 | 4.5:1 | PASS |
| dark | `accent-foreground on accent-hover` | #141a17 / #bfe635 | 12.26:1 | 4.5:1 | PASS |
| dark | `accent-subtle-foreground on accent-subtle` | #cdef52 / #27310d | 10.49:1 | 4.5:1 | PASS |
| dark | `success-foreground on success` | #141a17 / #7cc97f | 8.84:1 | 4.5:1 | PASS |
| dark | `success-subtle-foreground on success-subtle` | #a7dfa9 / #16301a | 9.36:1 | 4.5:1 | PASS |
| dark | `warning-foreground on warning` | #141a17 / #f2b544 | 9.64:1 | 4.5:1 | PASS |
| dark | `warning-subtle-foreground on warning-subtle` | #f7d08a / #33260b | 10.08:1 | 4.5:1 | PASS |
| dark | `danger-foreground on danger` | #141a17 / #ff8a7a | 7.71:1 | 4.5:1 | PASS |
| dark | `danger on surface` | #ff8a7a / #151e1b | 7.43:1 | 4.5:1 | PASS |
| dark | `danger-subtle-foreground on danger-subtle` | #ffb4a9 / #3a1512 | 9.53:1 | 4.5:1 | PASS |
| dark | `info-foreground on info` | #141a17 / #8db8e8 | 8.53:1 | 4.5:1 | PASS |
| dark | `info-subtle-foreground on info-subtle` | #b5d2f2 / #132538 | 9.98:1 | 4.5:1 | PASS |
| dark | `highlight-foreground on highlight` | #141a17 / #cdef52 | 13.50:1 | 4.5:1 | PASS |
| dark | `input-border on surface` | #5e6c66 / #151e1b | 3.09:1 | 3:1 | PASS |
| dark | `ring on background` | #cdef52 / #0e1513 | 14.15:1 | 3:1 | PASS |

---

## 4. Typography

Google Fonts only, loaded with `next/font` in `styles/fonts.ts` (self-hosted at build time, no runtime calls to Google).

| Role | Font | Why |
|---|---|---|
| Display & headings | **Barlow Condensed** 500/600/700 | Narrow, engineered, like site signage and drawing title blocks. Fits long titles on phones. |
| Body & UI | **Atkinson Hyperlegible Next** (variable) | Designed by the Braille Institute for maximum character distinction (`Il1`, `0O`): readable in glare and at arm's length. |
| Mono | **Atkinson Hyperlegible Mono** | Document numbers (`ALD-SPEC-0310`), quantities, codes. Same family, same legibility. |

### Type scale (Tailwind class → spec)

| Name | Class | Size / line-height · weight | Font |
|---|---|---|---|
| Display | `font-display text-display` | 56/60 · 600, −0.01em | Barlow Condensed |
| Heading 1 | `font-display text-h1` | 40/44 · 600 | Barlow Condensed |
| Heading 2 | `font-display text-h2` | 32/36 · 600 | Barlow Condensed |
| Heading 3 | `font-display text-h3` | 24/30 · 600 | Barlow Condensed |
| Heading 4 | `text-h4` | 20/28 · 700 | Atkinson Hyperlegible Next |
| Body large | `text-body-lg` | 18/28 · 400 | Atkinson Hyperlegible Next |
| Body | `text-body` | 16/24 · 400 | Atkinson Hyperlegible Next |
| Body small | `text-body-sm` | 14/20 · 400 | Atkinson Hyperlegible Next |
| Label | `text-label` | 15/20 · 700 | Atkinson Hyperlegible Next |
| Caption | `text-caption` | 13/18 · 400 | Atkinson Hyperlegible Next |
| Overline | `text-overline uppercase` | 12/16 · 700, +0.08em | Atkinson Hyperlegible Next |
| Code | `font-mono text-code` | 14/20 · 400 | Atkinson Hyperlegible Mono |

Tailwind's default sizes (`text-sm`, `text-lg`, …) are switched off. `h1`–`h3` get `font-display` by default. Use the `Heading` and `Text` components for consistency. Body text never goes below 14px; 13px is only for captions and metadata.

---

## 5. Space, shape, depth, layout

**Spacing.** A 4px grid using Tailwind's numeric steps (`p-4` = 16px).

| Step | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| px | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80 |

Typical use: 8 inside controls, 12–16 between related items, 24 between groups, 32–56 between page sections.

**Control & layout sizes.**

| Token | Value | Use |
|---|---|---|
| `control-sm` | 40px | Dense desktop UI only (table toolbars, pagination) |
| `control-md` | **48px** | **Default** for buttons, inputs, nav items and menu rows. Glove-friendly. |
| `control-lg` | 56px | Primary on-site actions on mobile (Ask, Save) |
| `icon-xs/sm/md/lg/xl` | 14 / 16 / 20 / 24 / 32px | Icon sizes |
| `sidebar` | 272px | App sidebar |
| `topbar` | 64px | Top bar |
| `sheet` / `sheet-lg` | 480 / 720px | Side panels |
| `content` | 1280px | Max content width |

**Radius.** Crisp, measured corners: `rounded-xs` 2px (checkbox, kbd) · `rounded-sm` **4px** (buttons, inputs, badges) · `rounded-md` 6px (cards, menus) · `rounded-lg` 10px (dialogs, sheets) · `rounded-full` (avatars, switches, chips). Nothing above 10px except pills.

**Borders.** 2px is the standard (cards, inputs, menus); 1px only for table row dividers.

**Elevation.** Warm, low shadows. Hierarchy comes mostly from borders and surface colour.

| Token | Use |
|---|---|
| `shadow-xs` | Cards at rest |
| `shadow-sm` | Hovered interactive cards, toasts |
| `shadow-md` | Menus, popovers, selects |
| `shadow-lg` | Dialogs, sheets |

**Breakpoints.** `sm` 640 · `md` 768 (tables replace card lists) · `lg` 1024 (sidebar becomes fixed; below it is a drawer) · `xl` 1280 · `2xl` 1536. Design mobile-first.

**Motion.** 140ms with `cubic-bezier(0.2, 0, 0, 1)` for state changes, 220ms for sheets sliding in. No bouncing. Everything respects `prefers-reduced-motion`.

---

## 6. Iconography

- Library: **lucide-react**, stroke width **2** (default). Never mix in other icon sets.
- Sizes: 16px inline with small text, **20px default** in buttons, inputs and nav, 24px in large buttons, 32px in empty states.
- Icons inherit `currentColor`. Use `text-foreground-subtle` for decorative icons.
- Decorative icons get `aria-hidden`. Icon-only buttons must use `IconButton`, which requires a `label` (used as the aria-label and tooltip).
- Typical icons: documents `FileText`, chat `MessageSquareText`, search `Search`, memory `Brain`, pin `Pin`, decision `CircleCheck`, deadline `CalendarClock`, contact `UserRound`, change `FilePen`.

---

## 7. Tone of voice

Plumb talks like a sharp, experienced site engineer: it gives the answer first, names the source, and doesn't waste anyone's time.

**Principles**

1. **Answer first.** Lead with the fact, then the detail. "C32/40, XD3." not "Great question! Based on my analysis…"
2. **Show the source.** Every claim points to a document and page. If it isn't in the documents, say so plainly.
3. **Plain site language.** Use the trade's words (pour, RFI, change order, snag), not tech words (query, entity, sync).
4. **Calm, never alarming.** State problems and the next step. No exclamation marks, no blame.
5. **Short.** Buttons are verbs (2–3 words). Messages are one sentence where possible. Use sentence case everywhere.
6. **Respect the expert.** Never patronise, never over-explain, and never pretend to be sure when it isn't.

**Before → after**

| Where | Before | After |
|---|---|---|
| Primary button | Submit | **Ask Plumb** |
| Destructive button | OK | **Delete memory** |
| Empty state (documents) | No data found. | **No documents yet.** When specs, diaries and reports are added to this project, they'll be listed here. |
| Empty state (memory) | You have no items. | **Nothing remembered yet.** Pin a fact from any answer and it shows up here. |
| No answer | Sorry, an error occurred while processing your request. | **I couldn't find this in your documents.** |
| Load error | Error 500: Request failed. | **Couldn't load documents.** Check your connection and try again. |
| Streaming interrupted | Something went wrong!!! | **The connection dropped mid-answer.** Try again; your question is still here. |
| Delete confirmation | Are you sure? This action cannot be undone. | **Delete this memory?** Plumb will stop using it in answers. You can't undo this. |
| Success toast | Operation completed successfully! | **Memory pinned.** |
| Loading | Please wait while we fetch your data… | **Reading 32 documents…** |
| Superseded source | Note: conflicting information detected. | **This spec was changed by CO-004 on 14 Mar 2026.** |

---

## 8. Do's and don'ts

1. **Do** use only semantic tokens (`bg-primary`, `text-foreground-muted`). **Don't** write hex values, `rgb()`, Tailwind palette colours or arbitrary values like `bg-[#1b5e4f]` in components.
2. **Never use pure black (`#000`) or pure-black text.** The darkest colour is Ink `#141A17`.
3. **Primary buttons are always Spruce with white text** (light mode). Use one per screen at most.
4. **Lime is a signal, not a theme.** Use it for the single most important on-site action (e.g. "Ask Plumb"), highlights and the focus ring. **Never put lime text on a light background**, never use lime for large areas, and always put dark text on lime.
5. **Don't** use yellow-and-black hazard stripes, traffic cones, or any construction clichés. **Don't** use SaaS blue for primary actions or links.
6. **Headings are Barlow Condensed; everything you read is Atkinson Hyperlegible Next.** Never set paragraphs, buttons or labels in the condensed face.
7. **Every control is at least 48px tall** on touch layouts (40px only in dense desktop tables). Keep 8px or more between adjacent tap targets.
8. **Corners are 4px on controls and 6px on cards.** Don't use large soft radii (12px+) or pill-shaped buttons.
9. **Borders are 2px.** Use borders and surfaces for hierarchy; keep shadows low and warm.
10. **Never rely on colour alone.** Status always has an icon or text label too (badges, alerts, errors).
11. **Every async view has four states**: loading skeleton, error with a retry, an empty state with a next step, and content. Never a blank screen or a bare spinner for a whole page.
12. **Focus is always visible.** Use the hi-vis `focus-visible:focus-ring`. Never `outline: none` without a replacement.
13. **Write sentence case**, with verbs on buttons and no exclamation marks. Dates read like `14 Mar 2026`; document codes are set in mono.
14. **Use `/components/ui` first.** Don't restyle a component inline to make a variant; add the variant to the component (with design-system approval).
15. **Dark mode is designed, not inverted.** In dark mode, primary becomes light spruce with dark text. Test both.

---

## 9. Implementation quick reference

```tsx
// Buttons
<Button>Save changes</Button>                       // primary
<Button variant="accent" size="lg">Ask Plumb</Button> // the one hi-vis action
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete memory</Button>
<IconButton label="Pin fact"><Pin /></IconButton>

// Text
<Heading size="h2">Documents</Heading>
<Text tone="muted" size="sm">Updated 3 days ago</Text>

// Colour utilities
bg-surface border-2 border-border rounded-md shadow-xs text-foreground
bg-primary-subtle text-primary-subtle-foreground
bg-highlight text-highlight-foreground   // highlighted quote
focus-visible:focus-ring
```

Fonts: `font-display`, `font-sans` (default), `font-mono`. Sizes: `text-display, text-h1…h4, text-body-lg, text-body, text-body-sm, text-label, text-caption, text-overline, text-code`. Heights: `h-control-sm|md|lg`. Icons: `size-icon-sm|md|lg`.
