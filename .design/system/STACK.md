# Stack
> App: pulse-city-next/ | Repo type: single (standalone sibling of strudel/ and radio-ipe/)
> Design System Analysis | Generated: 2026-04-15

## Classification

**Codebase type:** `existing`
**Rationale:** ~12 custom components, real business logic (Strudel editor integration, AI chat routes, Supabase auth, pattern CRUD), custom Tailwind 4 `@theme` tokens in globals.css, and live API routes for `/api/chat`, `/api/compose`, `/api/evolve`, `/api/patterns`. Not a scaffold — production POC.

## Tech Stack

| Layer | Value |
|-------|-------|
| Framework | Next.js 16.2.3 (App Router, **webpack** — not Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 via `@tailwindcss/postcss` + CSS custom properties in `@theme inline` |
| UI Kit | **none** — no shadcn, no Radix, no MUI. Components are hand-rolled. |
| Package Manager | pnpm (workspace-free) |
| Build Tool | Next.js built-in (webpack) |

## Architecture Patterns

| Pattern | Value |
|---------|-------|
| Component style | Functional components, client-side (`"use client"`). No forwardRef. No compound components. |
| State management | **Zustand** (`src/lib/store.ts`) for global app state |
| Data fetching | Server Components for reads + API route handlers (`src/app/api/*/route.ts`) for writes. Vercel AI SDK v6 (`@ai-sdk/react`) for streaming chat. |
| Routing | Next.js 16 App Router. Public: `/`, `/p/[id]`. Authed: `/studio`. Auth callback: `/auth/callback`. |
| File organization | Feature-ish — components grouped by feature (`chat/`, `editor/`, `patterns/`, `auth/`, `spectrum/`) with top-level components (`header.tsx`, `transport-bar.tsx`, `tools-panel.tsx`, `settings-overlay.tsx`) not yet moved into folders. |
| Auth | Supabase SSR via `@supabase/ssr` with middleware at `src/middleware.ts` |
| AI | Vercel AI SDK v6 with `@ai-sdk/anthropic` + `@ai-sdk/groq` (multi-provider via `src/lib/ai/model-router.ts`) |
| Music engine | `@strudel/*` packages consumed directly (not the `@strudel/web` barrel) |

## Key Paths

| Path | Purpose |
|------|---------|
| Components | `src/components/` (mixed flat + folder-grouped) |
| Layouts | `src/app/layout.tsx` (root) |
| Pages / Screens | `src/app/page.tsx`, `src/app/studio/page.tsx`, `src/app/p/[id]/page.tsx` |
| API Routes | `src/app/api/{chat,compose,evolve,patterns}/route.ts` |
| Tokens / Theme | `src/app/globals.css` (Tailwind 4 `@theme inline` block) |
| State | `src/lib/store.ts` (Zustand) |
| AI / LLM | `src/lib/ai/prompts.ts`, `src/lib/ai/model-router.ts` |
| Strudel glue | `src/lib/strudel/{init,constants}.ts`, `src/types/strudel.d.ts` |
| Supabase | `src/lib/supabase/{client,server,types}.ts` + `src/middleware.ts` |
| Config | `next.config.*`, `tsconfig.json`, `eslint.config.*` |
| Public / Assets | `public/` (empty of brand assets — no logo, no fonts yet) |

## Caveats worth flagging up-front

- **Not a Next.js you know.** `pulse-city-next/AGENTS.md` declares this is Next.js 16 with breaking changes from the 14/15 era. Before editing framework-touching code, read `node_modules/next/dist/docs/` for the relevant guide.
- **Webpack, not Turbopack.** Strudel's audio worklet + CodeMirror combo was incompatible with Turbopack at the time of writing. Do not flip `--webpack` off.
- **Tailwind 4 `@theme inline` block, not `tailwind.config.ts`.** Token edits happen in `src/app/globals.css`. There is no JS config file.
