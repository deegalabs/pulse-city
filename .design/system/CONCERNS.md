# Concerns
> Design System Analysis | Generated: 2026-04-15

## Design Debt

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| Color tokens named literally (`lime`, `sky`, `violet`) instead of semantically (`creator`, `listener`, `agent`) — identity phase committed the semantic rename | `src/app/globals.css` | **high** | Rename tokens in `@theme inline`. Search/replace callers (likely ~10 sites). Add compatibility alias if any Strudel editor CSS references the old names directly. |
| Violet hex is the cold `#6b46ff`, identity committed warmed `#8a66ff` | `src/app/globals.css` | high | One-line change in `@theme inline`. |
| `--color-surface-3`, `--color-text-muted`, `--color-signal-warn`, `--color-scrim` missing from token set | `src/app/globals.css` | high | Extend `@theme inline` with the four tokens per `palettes.json`. |
| Typography tokens reference `--font-chakra-petch` / `--font-dm-sans` / `--font-jetbrains-mono` which are **never set** — layout uses Google Fonts `<link>` instead, so Tailwind classes like `font-heading` silently fall back to `system-ui` | `src/app/globals.css`, `src/app/layout.tsx` | **high** | Create `src/app/fonts.ts` with `next/font/local` declarations (+ vendor WOFF2 files to `src/app/fonts/`). Import into root layout, apply `variable` class to `<html>`. Delete Google Fonts `<link>`. |
| Space Mono family not yet declared — identity needs it for all micro-labels | `src/app/layout.tsx` | high | Add to `fonts.ts`, add `--color-micro` font var, add `--font-micro` to `@theme inline`. |
| `evolve-glow` keyframe is a second opacity loop, not the identity-committed mutation-moment motion | `src/app/globals.css` | medium | Rebuild as 600ms one-shot `box-shadow` radial with brief blur-to-sharp. Change from `infinite` to single-run class. |
| `pulse-dot` trough is 0.35 — identity committed 0.55 | `src/app/globals.css` | low | One-line change. |

## Component Fragility

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| Three separate modal/overlay components (`SettingsOverlay`, `LoginModal`, `PatternsModal`) with hand-rolled open/close instead of a shared `Dialog` primitive | `src/components/settings-overlay.tsx`, `src/components/auth/login-modal.tsx`, `src/components/patterns/patterns-modal.tsx` | medium | Introduce `src/components/ui/dialog.tsx` (Radix UI Dialog under the hood for focus trap + escape handling). Migrate the three existing modals in a later pass — not part of Phase 4 guidelines output. |
| No `cn()` class-merging utility — Phase 4 components will need one | (missing) | medium | Add `src/lib/utils.ts` with `cn()` using `clsx` + `tailwind-merge`. Standard shadcn helper. |
| No bracketed-button primitive yet, so `[ SAVE ]` / `[ LIVE ]` / `[ AGENT ]` are currently inline literals wherever they appear | (scattered) | low | Phase 4 delivers `Button` primitive with `variant="bracket"` that wraps the label in `[ … ]` with Space Mono uppercase tracking. |

## Accessibility Gaps

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| No aria audit performed — icon buttons in `TransportBar`, `UserMenu`, `ToolsPanel` likely lack `aria-label` | `src/components/transport-bar.tsx`, `src/components/auth/user-menu.tsx`, `src/components/tools-panel.tsx` | medium | Add labels during Phase 4 component pass. Not Phase 4's primary job — flagged for Phase 5 (project build) review. |
| Focus management across modals not verified | three modals above | medium | Adopting Radix Dialog fixes focus trap + return-focus automatically. |
| Color contrast on `text-dim` `#64748b` at default sizes is **AA Large only** (4.1:1) — any body-tier usage of `text-dim` is a contrast failure | any `.text-text-dim` usage | medium | Enforce the "14px floor" rule from identity's typography chunk. Phase 4 `STYLE.md` must state the rule explicitly. |

## Token Coverage Gaps

| Category | Status | Details |
|----------|--------|---------|
| Colors | **partial → must become complete** | 10 tokens now; 14 needed per identity. Rename 3, warm 1, add 4. |
| Typography | **broken → must become complete** | Font vars reference unset sources. Full `next/font/local` setup required. Scale tokens (`--text-display`, `--text-heading`, etc.) need to be added from typography.md enrichment. |
| Spacing | **untouched — keep Tailwind defaults** | No brand-specific spacing scale needed. Identity did not commit one. |
| Radii | **untouched** | Identity forbids decorative radii. Default Tailwind radii are fine. |
| Shadows | **forbidden** | Identity bans shadows in chrome. Nothing to tokenize. |
| Dark mode | **n/a** | Dark-only system. No toggle, no light counterpart. |

## Dark Mode Gaps

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| None — dark is the only mode | — | — | Identity committed dark-only. No concern exists. |

## Responsive Gaps

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| `body { overflow: hidden }` in `globals.css` — locks the viewport, which works for /studio (editor-first, desktop/projector) but will break /radio and /p where long-form content scrolls | `src/app/globals.css` | medium | Move the `overflow: hidden` rule from `body` to a `/studio`-scoped class. Phase 4 can flag this in `STYLE.md` as a per-surface application rule. |
| `/studio/page.tsx` has no breakpoint consideration — it is desktop-only today | `src/app/studio/page.tsx` | low | Out of scope for Phase 4 guidelines. Will be addressed during project brief + design phases when /studio gets formalized. |

## Naming Inconsistencies

| Issue | File(s) | Severity | Fix Approach |
|-------|---------|----------|--------------|
| Mixed flat / feature-grouped in `src/components/` (flat: `header`, `transport-bar`; grouped: `auth/`, `chat/`, `editor/`, `patterns/`, `spectrum/`) | `src/components/` | low | Leave alone — refactoring file locations is outside the brand-guidelines phase. Phase 4 adds `ui/` and `brand/` folders; existing layout stays. |
| Token names use legacy literal color words | `src/app/globals.css` | high | Covered above under "Design Debt". |

## Summary

- **High severity:** 6 (color rename, violet warm, missing tokens, broken font vars, missing Space Mono, `evolve-glow` keyframe)
- **Medium severity:** 7
- **Low severity:** 3
- **Overall health:** **needs-attention** — the brand identity committed in Phase 3 has not yet landed in code. Phase 4's job is to produce the artifacts (tokens, STYLE.md, component specs) that unblock the code migration. Phase 5 (project build) executes the migration.
