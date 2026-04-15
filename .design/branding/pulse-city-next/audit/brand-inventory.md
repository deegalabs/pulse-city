# Brand Inventory
> Phase: audit | Brand: pulse-city-next | Generated: 2026-04-15

---

## Product identity

| Field | Value | Source |
|-------|-------|--------|
| Name | pulse.city | README.md, metadata title |
| Display casing | `PULSE·CITY` (uppercase, lime with sky middot) | header.tsx line 22 |
| Tagline | the city is playing | layout.tsx title |
| Description | A living soundtrack for Ipê Village 2026. Open. Autonomous. Collective. | layout.tsx metadata |
| One-liner | A living soundtrack for cities. AI-powered music that evolves in real-time, visible as code. | README.md |
| Parent | deega labs | BRIEF.md |
| License | AGPL-3.0-or-later | README.md |

## Color tokens (globals.css `@theme inline`)

| Token | Hex | Current role | Semantic assignment |
|-------|-----|--------------|---------------------|
| `--color-bg` | #0a0e17 | page background, theme-color meta | none (base) |
| `--color-surface` | #111827 | pills, gutters | none |
| `--color-surface-2` | #1e293b | hover states | none |
| `--color-lime` | #a2d729 | wordmark, PLAYING dot, MANUAL button, caret, selection | none assigned — used ad hoc |
| `--color-sky` | #3aa5ff | middot separator, SAVE/LOAD hover | none assigned |
| `--color-violet` | #6b46ff | AUTOPILOT button | none assigned |
| `--color-red` | #ef4444 | OUT hover (sign out) | destructive only |
| `--color-text` | #e2e8f0 | body text | — |
| `--color-text-dim` | #64748b | micro-labels, idle states | — |
| `--color-border` | rgba(255,255,255,0.08) | all separators | — |

No semantic role assignment exists in code today. The brief proposes lime=creator, sky=listener, violet=agent but this is not yet implemented.

## Typography

| Family | Weights loaded | CSS var | Role in code | Usage observed |
|--------|---------------|---------|--------------|----------------|
| Chakra Petch | 600, 700 | `--font-heading` | heading / micro-labels | wordmark, all uppercase button labels, status pills |
| DM Sans | 400, 500 | `--font-body` | body | fallback body text |
| JetBrains Mono | 400 | `--font-mono` | code | CodeMirror editor content |

Fonts load via Google Fonts `<link>` in layout.tsx — no `next/font`, no self-hosting despite AGPL "self-hostable" must-have in BRIEF.md.

## Type scale in the wild

| Token | Context |
|-------|---------|
| `text-xl` bold | wordmark only |
| `text-[0.58rem]` tracking-widest | status pill (PLAYING/READY) |
| `text-[0.55rem]` tracking-widest | header buttons (SAVE, LOAD, SETTINGS, MANUAL, SIGN IN) |
| `text-[0.5rem]` tracking-widest | OUT (sign-out micro-button) |
| `text-[0.75rem]` mono | editor content |

No documented scale — spot sizes in rem fractions.

## Motion primitives

| Keyframe | Duration observed | Use |
|----------|-------------------|-----|
| `pulse-dot` | 1.5s ease-in-out infinite | PLAYING status dot (opacity 1 → 0.35) |
| `evolve-glow` | undefined in code | defined but not wired to a component in the 11 sampled |

Both are opacity-only. No transform, no color cycle, no easing variants.

## Voice samples (verbatim from components)

| String | Surface | Casing | Tone |
|--------|---------|--------|------|
| `PULSE·CITY` | wordmark | uppercase, middot | terminal |
| `PLAYING` / `READY` | status pill | uppercase | present-tense, binary |
| `SIGN IN` | user-menu | uppercase | terse, imperative |
| `OUT` | user-menu | uppercase | almost hostile-short |
| `SAVE` / `SAVE AS` / `LOAD` | header | uppercase | verb-only, no "Your Pattern" |
| `SETTINGS` | header | uppercase | flat |
| `MANUAL` / `AUTOPILOT` | mode toggle | uppercase | state label, not action |
| `the city is playing` | metadata | lowercase | the one warm line in the whole product |
| `A living soundtrack for Ipê Village 2026. Open. Autonomous. Collective.` | metadata | sentence-case | manifesto fragment |

## Surface inventory

Currently **one surface**: `/studio`. The four-surface architecture (`/studio`, `/p/[id]`, `/embed/[id]`, `/radio/[name]`) exists only in docs/specs/use-cases.md. No visual differentiation between them has been designed.

## Component count

11 React components in `src/components/`:

- editor/strudel-editor.tsx, editor/strudel-editor-inner.tsx
- chat/chat-panel.tsx
- spectrum/spectrum-analyzer.tsx
- tools-panel.tsx
- settings-overlay.tsx
- transport-bar.tsx
- auth/login-modal.tsx, auth/user-menu.tsx
- patterns/patterns-modal.tsx
- header.tsx

## Missing assets (explicit inventory of nothing)

| Asset | State |
|-------|-------|
| Logomark | does not exist — wordmark `PULSE·CITY` is the only mark |
| Icon system | does not exist — no SVG set, no lucide/tabler import |
| Illustration style | does not exist |
| Photography direction | does not exist (and brief forbids stock) |
| Favicon / app icon | not inventoried in layout.tsx |
| Social / OG image | not set in metadata |
| Voice / tone doc | does not exist — voice lives only in string literals |
| Brand guidelines | does not exist (this audit is the seed) |
| Surface-level voice rules | does not exist |
| Color-to-meaning map | does not exist |

---

## Related
- [coherence-assessment.md](./coherence-assessment.md)
- [evolution-map.md](./evolution-map.md)
