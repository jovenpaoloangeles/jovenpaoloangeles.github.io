# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal academic/portfolio website for Joven Paolo D. Angeles — a React + TypeScript SPA deployed to GitHub Pages at https://jovenpaoloangeles.github.io.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build → ./dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm test          # Run Vitest frontend tests (ChatbotWidget, FullscreenViewer, TechStack family, content pipeline, RecentActivities, Awards, useTheme, and utils suites)
npm run test:edge # Run Deno edge function tests (requires Deno installed)
```

Deployment is automatic via GitHub Actions on push to `main` (see `.github/workflows/deploy.yml`).

## Architecture

### Tab-Based Navigation

`App.tsx` drives the entire layout with 8 tab sections (`#about`, `#recent-activities`, `#research`, `#tech-stack`, `#projects`, `#creative-coding`, `#photography`, `#awards`). URL hash and active tab are kept in sync bidirectionally. Keyboard navigation (arrow keys, Home, End) is wired via ARIA `tablist`/`tabpanel`.

### Content Layer

Content is split between:
- **`src/content/`** — JSON files for data-heavy sections (`activities.json` for the timeline, `research.json` for publications/conferences). Loaded via Promise-based utilities in `src/lib/content.ts`.
- **Component-level data** — Simpler sections (Projects, Photography) define their data inline within their component files. TechStack data lives in `src/content/techstack/` (`data.ts`, `icons.ts`, `links.ts` with an `index.ts` barrel); `TechStack.tsx` only composes views.

TypeScript interfaces for content shapes live in `src/components/types.ts` and `src/lib/content.ts`.

### Component Structure

- `src/components/ui/` — shadcn-ui primitives (Button, Card, Badge, Input, Accordion, etc.)
- `src/components/` — Feature components, one per portfolio section
- `src/lib/utils.ts` — `cn()` helper for Tailwind class merging (`clsx` + `tailwind-merge`)

### TechStack Graph

The force-directed graph uses D3.js with a persistent simulation architecture. Configuration is centralized in `techstack-graph-config.ts`. The simulation persists across resizes via imperative updates (no teardown/rebuild). D3 owns the SVG; React owns the popover and zoom buttons.

Key implementation details:
- **Persistent simulation**: Created once in `useEffect`, updated imperatively on resize
- **Selection**: React state `selectedId` (mirrored in `selectedIdRef` for d3 handlers), written only by `setSelection()`. Invariant: the selected node is pinned (`fx/fy`); the center is always pinned
- **Popover**: React `<Popover role="dialog">` absolutely positioned over the SVG. `placePopover()` (config file, unit-tested) computes placement in unzoomed viewport coords; the tick/zoom handlers reposition it via `positionPopoverRef`, no polling
- **Drag gesture**: `idle → pressed → dragging` union; only a real drag (≥ `CLICK_THRESHOLD`) reheats the simulation, so clicks don't jitter the graph
- **Zoom**: Ctrl/⌘+wheel, pinch, two-finger touch, or the +/− buttons. A plain wheel / one-finger swipe scrolls the page (`touch-action: pan-y`)
- **Semantic zooming**: tools hide below `showOnlyDomains`; tool labels show at ≥ `showToolLabels`, counter-scaled via the `--ts-k` CSS var to a constant on-screen size
- **Accessibility**: nodes are focusable buttons with `aria-label` + `<title>`; Enter/Space selects, Escape closes
- **Reduced motion**: `reheat()` runs the simulation to rest synchronously under `prefers-reduced-motion`
- **Spotlight dimming**: CSS-based opacity transitions on `.ts-node.dimmed` and `.ts-link.dimmed`

### AI Chatbot

`ChatbotWidget.tsx` sends messages to a Supabase Edge Function (`supabase/functions/gemini-chat/`) which proxies to Gemini. No API key is stored client-side. Chat history persists in `localStorage`. The edge function uses Deno KV for IP-based rate limiting (5 req / 15 min; in-memory Map fallback used by tests only) and the Gemini File Search Store API for CV-based RAG.

Edge function is split into `handler.ts` (exported `createHandler(config)` factory, fully testable) and `index.ts` (thin Deno.serve wrapper). Tests live in `handler_test.ts` and run with `deno task test`.

### UI State

Multi-step UI state is modelled as a single discriminated union, never as parallel booleans/nullables. Each one has a diagram comment at its definition:
- `ChatStatus` in `ChatbotWidget.tsx` — `idle → sending → streaming → idle | error`
- `ViewerState` in `FullscreenViewer.tsx` — `null` (closed) or `{ images, index }`
- `AsyncState<T>` / `useAsync` in `src/hooks/useAsync.ts` — `loading → success(data) | error` for content loaders
- `TABS` in `App.tsx` — tab states (with their `Panel`) and transitions, typed as `TabValue`
- `Gesture` and the selection machine in `TechStackGraph.tsx` — see the TechStack Graph section

### Styling

- Tailwind CSS with CSS variable–based theming (HSL values in `index.css` under `:root` / `.dark`)
- Dark mode via `class` strategy on `<html>`
- Path alias `@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- shadcn-style ui primitives are styled with Tailwind classes composed via `cn()`

### SEO

`index.html` contains Schema.org `Person` structured data and Open Graph meta tags. There is also hidden static HTML content (crawlable by search engines but not visible to users) and `public/robots.txt` + `public/sitemap.xml`.
