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
npm test          # Run Vitest frontend tests (ChatbotWidget + TechStack + useTheme suites)
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

The force-directed graph uses D3.js with a persistent simulation architecture. Configuration is centralized in `techstack-graph-config.ts`. The simulation persists across resizes via imperative updates (no teardown/rebuild). Popover uses foreignObject to stay in SVG coordinate space (no polling). Visual effects (spotlight, semantic zoom) use CSS transitions.

Key implementation details:
- **Persistent simulation**: Created once in `useEffect`, updated imperatively on resize
- **No polling**: Popover position updates on simulation tick, foreignObject embeds HTML directly in SVG
- **Single release function**: `releaseSelectedNode()` unpins nodes and clears selection
- **Centralized config**: All magic numbers (radii, forces, timings) live in `techstack-graph-config.ts`
- **Progressive cooling**: Animation phases with alpha decay transitions for smooth stabilization
- **Spotlight dimming**: CSS-based opacity transitions on `.ts-node.dimmed` and `.ts-link.dimmed`
- **Semantic zooming**: Text visibility thresholds based on zoom scale

### AI Chatbot

`ChatbotWidget.tsx` sends messages to a Supabase Edge Function (`supabase/functions/gemini-chat/`) which proxies to Gemini. No API key is stored client-side. Chat history persists in `localStorage`. The edge function uses Deno KV for IP-based rate limiting (5 req / 15 min) and the Gemini File Search Store API for CV-based RAG.

Edge function is split into `handler.ts` (exported `createHandler(config)` factory, fully testable) and `index.ts` (thin Deno.serve wrapper). Tests live in `handler_test.ts` and run with `deno task test`.

### Styling

- Tailwind CSS with CSS variable–based theming (HSL values in `index.css` under `:root` / `.dark`)
- Dark mode via `class` strategy on `<html>`
- Path alias `@` maps to `./src` (configured in both `vite.config.ts` and `tsconfig.app.json`)
- shadcn components are styled with `class-variance-authority` variants

### SEO

`index.html` contains Schema.org `Person` structured data and Open Graph meta tags. There is also hidden static HTML content (crawlable by search engines but not visible to users) and `public/robots.txt` + `public/sitemap.xml`.
