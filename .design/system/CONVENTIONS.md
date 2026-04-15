# Conventions
> Design System Analysis | Generated: 2026-04-15

## Naming Patterns

| Convention | Value |
|------------|-------|
| Components | **kebab-case filenames** (`chat-panel.tsx`, `transport-bar.tsx`, `strudel-editor-inner.tsx`), **PascalCase exports** (`ChatPanel`, `TransportBar`). Next.js App Router files follow `page.tsx` / `layout.tsx` / `route.ts` convention. |
| Files | kebab-case across the board, including `lib/` utilities (`model-router.ts`, `user-menu.tsx`) |
| Utilities | camelCase exports, kebab-case files. Example: `src/lib/ai/model-router.ts` exports `routeModel` / similar |
| CSS classes | Tailwind utility classes. Occasional CodeMirror overrides (`.cm-editor`, `.cm-gutters`) in `globals.css`. No BEM, no CSS Modules. |

## Export Style

| Pattern | Usage |
|---------|-------|
| Default exports | **Page files only** — `app/**/page.tsx`, `app/layout.tsx`. This is an App Router requirement, not a stylistic choice. |
| Named exports | **Everything else** — components, hooks, utilities, store. `export function ChatPanel()`, `export const useStore = ...` |
| Barrel files | **none** — no `index.ts` in `src/components/` or subfolders. Imports reference full paths via `@/` alias. |

## Styling Approach

| Aspect | Value |
|--------|-------|
| Primary method | Tailwind 4 utility classes, with token access via `text-lime`, `bg-surface`, etc. (mapped from `@theme inline` custom properties) |
| Class merging | **none detected** — no `cn()` utility, no `clsx`, no `tailwind-merge`. Likely plain template literals or string concatenation. Phase 4 will introduce `cn()` via the utils file convention. |
| Component styling | `className` prop on JSX. No CSS-in-JS. |
| Responsive approach | Mobile-first Tailwind breakpoints. Not yet stress-tested because /studio is projector-first, not phone-first. |

## Import Aliases

| Alias | Maps to |
|-------|---------|
| `@/*` | `./src/*` (from `tsconfig.json` `paths`) |

Only one alias. Simple and consistent.

## File Organization

**Pattern:** mixed flat + feature-grouped

Top-level `src/components/` holds both flat files (`header.tsx`, `transport-bar.tsx`, `tools-panel.tsx`, `settings-overlay.tsx`) and feature folders (`auth/`, `chat/`, `editor/`, `patterns/`, `spectrum/`). The split is inconsistent — `header.tsx` is as feature-shaped as `chat/chat-panel.tsx`, but one is flat and the other is grouped.

**Recommendation for Phase 4:** introduce `src/components/ui/` for primitives (the shadcn pattern) and `src/components/brand/` for the identity primitives (logomark, wordmark, punchcard, scope). Leave existing feature folders alone. Do not move the flat top-level files unless you also rewrite their imports — that is out of scope for guidelines phase.

## Where to Add

| Type | Location | Naming | Example |
|------|----------|--------|---------|
| UI primitive | `src/components/ui/` | kebab-case file | `src/components/ui/button.tsx` |
| Brand surface | `src/components/brand/` | kebab-case file | `src/components/brand/logomark.tsx` |
| Feature component | `src/components/{feature}/` | kebab-case file, grouped by feature | `src/components/chat/chat-message.tsx` |
| Page | `src/app/{route}/` | `page.tsx` (App Router) | `src/app/radio/[name]/page.tsx` |
| API route | `src/app/api/{route}/` | `route.ts` (App Router) | `src/app/api/agents/route.ts` |
| Hook | `src/lib/hooks/` | `use-{name}.ts` | `src/lib/hooks/use-audio-context.ts` |
| Utility | `src/lib/{category}/` | kebab-case file, camelCase exports | `src/lib/ai/model-router.ts` |
| Token / Theme | `src/app/globals.css` (single file) | inside `@theme inline { … }` | `--color-creator: #a2d729;` |
| Font | `src/app/fonts/` + `src/app/fonts.ts` (to be created) | `{family}-{weight}.woff2` + `next/font/local` declaration | `src/app/fonts/chakra-petch-700.woff2` |
