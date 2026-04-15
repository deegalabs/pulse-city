# Components
> Design System Analysis | Generated: 2026-04-15

## UI Kit Detection

**UI Kit:** none (hand-rolled)
**Source:** `package.json` lists no `@radix-ui/*`, no `@shadcn/*`, no `@mui/*`, no `@headlessui/*`, no `react-aria-components`. No `components/ui/` directory exists. Every component in `src/components/` is custom code.

**Implication:** the brand engineer can pick a component-library target for the guidelines phase without worrying about conflicts. Proposal: adopt **shadcn/ui** selectively — only install primitives for things that benefit from accessibility heavy-lifting (Dialog, Popover, Tooltip, DropdownMenu). Keep Strudel-specific surfaces hand-rolled.

## Existing Components

| Component | Path | Props / Variants | Reusable? | Notes |
|-----------|------|------------------|-----------|-------|
| Header | `src/components/header.tsx` | none visible — hardcoded layout | partially | Houses wordmark + user menu. Will need /studio vs /radio vs /p surface variants. |
| TransportBar | `src/components/transport-bar.tsx` | none — store-driven | no | Play/pause/autopilot controls. Tightly coupled to Zustand store. |
| ToolsPanel | `src/components/tools-panel.tsx` | none — store-driven | no | Right-side panel. Pattern list + chat trigger. |
| SettingsOverlay | `src/components/settings-overlay.tsx` | `open`, `onClose` | yes | Modal/overlay for settings. Candidate to become Dialog primitive. |
| LoginModal | `src/components/auth/login-modal.tsx` | `open`, `onClose` | yes | Supabase auth entry. Same Dialog candidacy. |
| UserMenu | `src/components/auth/user-menu.tsx` | user object | yes | DropdownMenu candidate. |
| PatternsModal | `src/components/patterns/patterns-modal.tsx` | `open`, `onClose` | yes | Dialog candidate. Lists saved patterns. |
| ChatPanel | `src/components/chat/chat-panel.tsx` | messages, onSend | yes | Vercel AI SDK `useChat` integration. |
| SpectrumAnalyzer | `src/components/spectrum/spectrum-analyzer.tsx` | audio context ref | no (canvas-bound) | Real audio output visualization. Will be reused as /radio and /embed oscilloscope per identity. |
| StrudelEditor | `src/components/editor/strudel-editor.tsx` | code, onChange | no (lazy-loaded) | Dynamic-import wrapper around CodeMirror+Strudel. |
| StrudelEditorInner | `src/components/editor/strudel-editor-inner.tsx` | inherited | no (inner) | The actual CodeMirror view. `.cm-editor` lives here. |

**Total: 11 components.** Well under the 30 cap — no summary tier needed.

### Missing — to be built during Phase 4 and downstream

- `Brand/Logomark` — 3×7 punchcard SVG component (identity phase committed it; not yet implemented)
- `Brand/Wordmark` — Chakra Petch 700 `PULSE·CITY` with sky middot
- `Button` (primitives) — `[ SAVE ]`, `[ LIVE ]`, `[ AGENT ]` bracketed style
- `Badge` — `PLAYING`, `AUTOPILOT`, `[ERR]` Space Mono micro-labels
- `Card` — `surface-1` / `surface-2` tiered container with `border` glass-line
- `Dialog` — shared modal primitive (consolidate SettingsOverlay / LoginModal / PatternsModal)
- `Punchcard` — imagery primitive from `@strudel/draw` output, used in OG images + /p hero
- `Scope` — oscilloscope chrome strip for /radio + /embed idle glyph
- Future-phase (not this one): `/radio/[name]/page.tsx`, `/embed/[id]/page.tsx`

## Where to Add

| Type | Location | Pattern |
|------|----------|---------|
| UI primitive | `src/components/ui/{name}.tsx` | kebab-case file, named export, one component per file |
| Feature component | `src/components/{feature}/{name}.tsx` | grouped by feature, same naming |
| Brand surface | `src/components/brand/{name}.tsx` | new folder — `logomark.tsx`, `wordmark.tsx`, `punchcard.tsx`, `scope.tsx` |
| Page | `src/app/{route}/page.tsx` | App Router convention |
| API route | `src/app/api/{route}/route.ts` | App Router route handler |
| Hook | `src/lib/hooks/use-{name}.ts` | `use-` prefix, named export |
| Utility | `src/lib/{category}/{name}.ts` | grouped by category (`ai/`, `supabase/`, `strudel/`) |
