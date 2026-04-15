# token-mapping.md

> Pass 2 · Phase 4 guidelines · pulse-city-next
> Target: Tailwind 4 `@theme inline` in `src/app/globals.css`
> Strategy: **EXTEND** — rename + add + fix; no rewrite, no `tailwind.config.ts`.

This file is the contract between `pulse-city.yml` and the code the builder writes. Every token in the yml maps to a CSS variable inside a single `@theme inline { ... }` block. No JS theme. No config file. All utilities are emitted by `@tailwindcss/postcss` from the tokens below.

---

## 1. Migration table — token renames

The current `@theme inline` block uses 10 literal-named color tokens. All move to semantic names. Three of them also change value (violet is warmed).

| Current (literal) | New (semantic) | Value before | Value after | Reason |
|---|---|---|---|---|
| `--color-bg` | `--color-base` | `#0a0e17` | `#0a0e17` | match yml root surface name |
| `--color-surface` | `--color-surface-1` | `#111827` | `#111827` | tiered surface ramp |
| `--color-surface-2` | `--color-surface-2` | `#1e293b` | `#1e293b` | kept |
| `--color-lime` | `--color-creator` | `#a2d729` | `#a2d729` | role, not hue |
| `--color-sky` | `--color-listener` | `#3aa5ff` | `#3aa5ff` | role, not hue |
| `--color-violet` | `--color-agent` | `#6b46ff` | **`#8a66ff`** | warm — 3.6:1 on surface-1, chrome-only |
| `--color-red` | `--color-destructive` | `#ef4444` | `#ef4444` | role, not hue |
| `--color-text` | `--color-text` | `#e2e8f0` | `#e2e8f0` | kept — 15.5:1 AAA |
| `--color-text-dim` | `--color-text-dim` | `#64748b` | `#64748b` | kept — 14px floor |
| `--color-border` | `--color-border` | (existing) | (existing) | kept — single border value |

## 2. New tokens to add

Four tokens do not exist yet and must be added.

| New token | Value | Purpose |
|---|---|---|
| `--color-surface-3` | `#2a3347` | /radio quiet tier — no dither allowed on this surface |
| `--color-text-muted` | `#94a3b8` | 7.5:1 AAA — between text and text-dim, no 14px floor |
| `--color-signal-warn` | `#f2b84a` | amber, one firing per screen max (evolve-glow anchor) |
| `--color-scrim` | `rgba(10, 14, 23, 0.72)` | dialog backdrop — derived from `--color-base` |

## 3. Final `@theme inline` block — write this exactly

Replace the current `@theme inline` block in `src/app/globals.css` with the following. The builder should search for the opening `@theme inline {` and the matching close brace, then substitute.

```css
@theme inline {
  /* ---------- color ramp (14 tokens) ---------- */
  --color-base: #0a0e17;
  --color-surface-1: #111827;
  --color-surface-2: #1e293b;
  --color-surface-3: #2a3347;

  --color-text: #e2e8f0;        /* 15.5:1 AAA on base */
  --color-text-muted: #94a3b8;  /*  7.5:1 AAA on base */
  --color-text-dim: #64748b;    /*  4.1:1 AA Large — 14px floor */

  --color-creator: #a2d729;     /* lime — human action */
  --color-listener: #3aa5ff;    /* sky  — room presence */
  --color-agent: #8a66ff;       /* warmed violet — agent chrome only, 3.6:1 on surface-1, never body text on surface-1 */
  --color-signal-warn: #f2b84a; /* amber — one signal per screen */
  --color-destructive: #ef4444;

  --color-border: rgba(226, 232, 240, 0.08);
  --color-scrim: rgba(10, 14, 23, 0.72);

  /* ---------- fonts (rebind — next/font/local sets the CSS vars) ---------- */
  --font-display: var(--font-chakra-petch);   /* ≥1.25rem only */
  --font-body:    var(--font-dm-sans);
  --font-mono:    var(--font-jetbrains-mono);
  --font-micro:   var(--font-space-mono);     /* +0.12em uppercase */

  /* ---------- type scale (12 steps) ----------
     display + heading are fluid clamp();
     body/ui/caption are fixed rem for predictable chrome. */
  --text-display-lg: clamp(2.75rem, 5vw + 1rem, 4.5rem);  /* 44 → 72 */
  --text-display:    clamp(2.25rem, 4vw + 0.75rem, 3.5rem); /* 36 → 56 */
  --text-heading-lg: clamp(1.75rem, 2.5vw + 0.75rem, 2.25rem); /* 28 → 36 */
  --text-heading:    clamp(1.375rem, 1.5vw + 0.75rem, 1.75rem); /* 22 → 28 */
  --text-subheading: 1.25rem;   /* 20 — Chakra Petch floor */
  --text-body-lg:    1.125rem;  /* 18 — DM Sans */
  --text-body:       1rem;      /* 16 — DM Sans */
  --text-body-sm:    0.875rem;  /* 14 — text-dim floor */
  --text-code:       0.9375rem; /* 15 — JetBrains Mono */
  --text-caption:    0.8125rem; /* 13 — DM Sans only, never text-dim */
  --text-micro-sm:   0.75rem;   /* 12 — Space Mono tracked */
  --text-micro:      0.6875rem; /* 11 — Space Mono tracked */

  /* ---------- radius ---------- */
  --radius-sm: 2px;
  --radius-md: 4px;   /* max — per yml constraint */

  /* ---------- motion — exactly two shapes ---------- */
  --ease-pulse: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-evolve: cubic-bezier(0.2, 0, 0, 1);

  --animate-pulse-dot: pulse-dot 1.5s var(--ease-pulse) infinite;
  --animate-evolve-glow: evolve-glow 600ms var(--ease-evolve) 1;

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.55; }   /* identity trough — corrected from 0.35 */
  }

  @keyframes evolve-glow {
    0% {
      box-shadow: 0 0 0 0 rgba(242, 184, 74, 0);
      filter: blur(1.5px);
    }
    30% {
      box-shadow: 0 0 0 4px rgba(242, 184, 74, 0.45);
      filter: blur(0.5px);
    }
    100% {
      box-shadow: 0 0 0 8px rgba(242, 184, 74, 0);
      filter: blur(0);
    }
  }
}
```

### What changed vs. the current block
- 3 literal color tokens renamed to semantic names (`lime`/`sky`/`violet` → `creator`/`listener`/`agent`).
- `--color-violet` hex warmed from `#6b46ff` to `#8a66ff`.
- Added: `surface-3`, `text-muted`, `signal-warn`, `scrim`.
- Font vars switched from broken literal bindings to the `next/font/local` CSS variables (`var(--font-chakra-petch)` etc.) that `fonts.ts` now actually sets.
- Space Mono family added as `--font-micro`.
- 12-step type scale introduced (only display + heading are `clamp()`).
- `pulse-dot` trough corrected from `0.35` → `0.55`.
- `evolve-glow` rebuilt: was a looping opacity keyframe; now a 600ms one-shot amber `box-shadow` spread + `blur` → `sharp` pulse. Does not loop.

---

## 4. `src/app/fonts.ts` — create this file

```ts
// src/app/fonts.ts
// next/font/local — vendor WOFF2 under src/app/fonts/*
// All four families declared here; globals.css @theme inline consumes the CSS vars.

import localFont from "next/font/local";

export const chakraPetch = localFont({
  src: [
    { path: "./fonts/ChakraPetch-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ChakraPetch-Medium.woff2",  weight: "500", style: "normal" },
    { path: "./fonts/ChakraPetch-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ChakraPetch-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-chakra-petch",
  display: "swap",
  preload: true,
});

export const dmSans = localFont({
  src: [
    { path: "./fonts/DMSans-Regular.woff2",  weight: "400", style: "normal" },
    { path: "./fonts/DMSans-Medium.woff2",   weight: "500", style: "normal" },
    { path: "./fonts/DMSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/DMSans-Bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Medium.woff2",  weight: "500", style: "normal" },
    { path: "./fonts/JetBrainsMono-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const spaceMono = localFont({
  src: [
    { path: "./fonts/SpaceMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SpaceMono-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
  preload: false, // micro-label only — ok to defer
});
```

### Fonts to vendor under `src/app/fonts/`
WOFF2, self-hosted, AGPL-compatible licenses:
- Chakra Petch — OFL 1.1
- DM Sans — OFL 1.1
- JetBrains Mono — OFL 1.1
- Space Mono — OFL 1.1

## 5. `src/app/layout.tsx` — diff notes

1. **Delete** the `<link href="https://fonts.googleapis.com/..." />` tag(s) in the `<head>`. The Google Fonts CDN is a real bug today: it loads the faces but never wires them to the `--font-*` CSS variables the theme expects.
2. **Import** the four font objects from `./fonts`:
   ```ts
   import { chakraPetch, dmSans, jetbrainsMono, spaceMono } from "./fonts";
   ```
3. **Apply** all four `.variable` class names to the `<html>` element (not `<body>`):
   ```tsx
   <html
     lang="en"
     className={`${chakraPetch.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${spaceMono.variable}`}
   >
   ```
4. Set the default body font to `--font-body` in a base layer of `globals.css`:
   ```css
   body { font-family: var(--font-body); background: var(--color-base); color: var(--color-text); }
   ```

---

## 6. `src/lib/utils.ts` — create this file

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Install** (once, before Phase 5):
```sh
pnpm add clsx tailwind-merge
```

---

## 7. Tailwind 4 utility class conventions

Tailwind 4 auto-generates utilities from `@theme inline`. The builder uses these classes at call sites:

### Color (background / text / border)
| Token | Utility examples |
|---|---|
| `--color-base` | `bg-base` |
| `--color-surface-1` | `bg-surface-1` |
| `--color-surface-2` | `bg-surface-2` |
| `--color-surface-3` | `bg-surface-3` |
| `--color-text` | `text-text`, `fill-text` |
| `--color-text-muted` | `text-text-muted` |
| `--color-text-dim` | `text-text-dim` (only at ≥14px) |
| `--color-creator` | `bg-creator`, `text-creator`, `border-creator` |
| `--color-listener` | `bg-listener`, `text-listener`, `border-listener` |
| `--color-agent` | `bg-agent`, `text-agent` (chrome only; forbidden as body on `surface-1`) |
| `--color-signal-warn` | `bg-signal-warn`, `text-signal-warn` |
| `--color-destructive` | `bg-destructive`, `text-destructive` |
| `--color-border` | `border-border` |
| `--color-scrim` | `bg-scrim` |

### Font family
- `font-display` — Chakra Petch (≥1.25rem only)
- `font-body` — DM Sans
- `font-mono` — JetBrains Mono
- `font-micro` — Space Mono (always uppercase, `tracking-[0.12em]`)

### Type scale
- `text-display-lg`, `text-display`, `text-heading-lg`, `text-heading`, `text-subheading`
- `text-body-lg`, `text-body`, `text-body-sm`
- `text-code`, `text-caption`
- `text-micro-sm`, `text-micro`

### Motion
- `animate-pulse-dot` — ambient 1.5s loop
- `animate-evolve-glow` — one-shot amber pulse, 600ms

If a named animate utility does not auto-generate, fall back to Tailwind 4 arbitrary values: `animate-[pulse-dot_1.5s_ease-in-out_infinite]` / `animate-[evolve-glow_600ms_cubic-bezier(0.2,0,0,1)_1]`.

---

## 8. Call-site search/replace list

After the `@theme inline` block is updated, do the following global renames across `src/`:

| Search | Replace | Notes |
|---|---|---|
| `bg-bg` | `bg-base` | |
| `bg-surface` (word-bounded) | `bg-surface-1` | do not match `bg-surface-2` |
| `text-lime` | `text-creator` | |
| `bg-lime` | `bg-creator` | |
| `border-lime` | `border-creator` | |
| `text-sky` | `text-listener` | |
| `bg-sky` | `bg-listener` | |
| `border-sky` | `border-listener` | |
| `text-violet` | `text-agent` | audit call site — forbid on surface-1 body text |
| `bg-violet` | `bg-agent` | |
| `border-violet` | `border-agent` | |
| `text-red` (word-bounded) | `text-destructive` | |
| `bg-red` (word-bounded) | `bg-destructive` | |
| `border-red` (word-bounded) | `border-destructive` | |

Use a word-bounded regex (e.g. ripgrep `-w`) for `red`, `sky`, `lime`, `violet` so Tailwind variants like `text-red-500` in unrelated strings (none should exist in this codebase, but verify) are not touched.

---

## 9. Migration order (phased rollout)

The builder executes these in sequence. Each step is a clean commit.

1. **Vendor fonts + create `src/app/fonts.ts`.** WOFF2 files in `src/app/fonts/`. Build must still pass (nothing consumes fonts yet).
2. **Add `cn()` helper.** `pnpm add clsx tailwind-merge`; create `src/lib/utils.ts`.
3. **Update `@theme inline` in `src/app/globals.css`.** Replace the block per section 3. Keep call sites broken for one commit — easier to review.
4. **Delete Google Fonts `<link>` from `src/app/layout.tsx`.**
5. **Apply font `.variable` classes to `<html>` in `src/app/layout.tsx`.**
6. **Rebuild `pulse-dot` + `evolve-glow` keyframes** (already in step 3 — verify in DevTools).
7. **Rename Tailwind classes at call sites** per section 8. Visual diff after this commit.
8. **Verify.** `pnpm build` passes. All four fonts load from `/fonts/*.woff2`. `pulse-dot` visible on live badge. `evolve-glow` fires once on trigger. No `--color-lime` / `--color-sky` / `--color-violet` / `--color-red` / `--color-bg` / `--color-surface` (word-bounded) references remain.

---

## 10. What this does NOT touch

- No existing component is rewritten in Phase 4. Header, TransportBar, ToolsPanel, SettingsOverlay, LoginModal, UserMenu, PatternsModal, ChatPanel, SpectrumAnalyzer, StrudelEditor, StrudelEditorInner all stay in place.
- No folder restructure. Phase 4 only **adds**:
  - `src/app/fonts.ts` + `src/app/fonts/*.woff2`
  - `src/lib/utils.ts`
  - `src/components/ui/` (empty — specs in `components/ui/*.md`)
  - `src/components/brand/` (empty — specs in `components/brand/*.md`)
- No `tailwind.config.ts` file is introduced. Tailwind 4 in this project is CSS-first.
- SettingsOverlay / LoginModal / PatternsModal are **not** migrated to the new `Dialog` primitive in this phase. That is a Phase 5 concern.
