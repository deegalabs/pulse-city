# Tokens
> Design System Analysis | Generated: 2026-04-15

## Token Source

**Token source:** `src/app/globals.css` (Tailwind 4 `@theme inline` block)
**Format:** CSS custom properties consumed by Tailwind 4's `@theme` directive. No `tailwind.config.ts`, no JS theme object, no `tokens.json`.

## Token Coverage

| Category | Defined? | Details |
|----------|----------|---------|
| Colors | **partial** | 10 hexes defined (`bg`, `surface`, `surface-2`, `lime`, `sky`, `violet`, `red`, `text`, `text-dim`, `border`). Names are **literal** (lime/sky/violet), not semantic (creator/listener/agent). Identity phase commits rename + adds `surface-3`, `text-muted`, `signal-warn`, `scrim`, and warms `violet` from `#6b46ff` → `#8a66ff`. |
| Typography | **partial** | Three font-family custom properties reference CSS variables injected by `next/font`, but **those variables are never set** — the layout uses a raw Google Fonts `<link>` instead, so `var(--font-chakra-petch)` resolves to the fallback. This is a real bug, not just cleanup. |
| Spacing | **no** | Uses default Tailwind 4 spacing scale. No custom extensions. |
| Radii | **no** | Defaults only. |
| Shadows | **no** | Defaults — which is actually on-brand (identity forbids shadows in chrome). |
| Dark mode | **n/a** | `colorScheme: "dark"` is declared in `layout.tsx` viewport config. `themeColor: "#0a0e17"` matches `base`. **pulse.city is dark-only by declaration** — no light counterpart exists or is planned. |

## Theme Configuration

**Current `@theme inline` block (verbatim from `src/app/globals.css`):**

```css
@theme inline {
  --color-bg: #0a0e17;
  --color-surface: #111827;
  --color-surface-2: #1e293b;
  --color-lime: #a2d729;
  --color-sky: #3aa5ff;
  --color-violet: #6b46ff;   /* to warm to #8a66ff */
  --color-red: #ef4444;
  --color-text: #e2e8f0;
  --color-text-dim: #64748b;
  --color-border: rgba(255, 255, 255, 0.08);

  --font-heading: var(--font-chakra-petch);  /* broken — source var unset */
  --font-body: var(--font-dm-sans);          /* broken — source var unset */
  --font-mono: var(--font-jetbrains-mono);    /* broken — source var unset */
}
```

**Animations present:**

```css
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes evolve-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
```

`pulse-dot` is usable (identity wants `0.55` trough; current `0.35` is too deep). `evolve-glow` is not the mutation motion identity calls for — it is a second opacity loop. Identity commits a replacement: 600ms one-shot amber radial `box-shadow` + brief blur-to-sharp transition. The current keyframe must be rebuilt.

## Prior GSP Tokens

**`.design/branding/pulse-city-next/identity/palettes.json`** — the committed OKLCH + contrast-verified palette from Phase 3 Identity. This file is the source of truth for Phase 4 Guidelines.

Prior GSP patterns: none (Phase 4 has not run yet — this scan runs immediately before it).
