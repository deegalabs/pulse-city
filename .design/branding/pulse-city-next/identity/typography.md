# Typography
> Phase: identity | Brand: pulse-city-next | Generated: 2026-04-15

---

Four families, four jobs, and a hard ceiling. No fifth family enters the system. Every family has exactly one role and is forbidden from the other three. This is the part of the identity that Lia reads first — if the type is wrong, nothing else matters.

## The four families

### Chakra Petch — display

- **Role:** wordmark, hero headline, compass poster, station-ident text on /radio, nothing else.
- **Weight in use:** 700 for the wordmark, 600 for H1/hero headlines.
- **Allowed sizes:** display tier only.
- **Forbidden below 1.25rem.** This is the hard rule that the audit's biggest disconnect points at. Chakra Petch was being used as a 0.55rem utility label, and at 0.55rem its display angles turn into noise. Below 1.25rem, Chakra Petch does not appear in this system. Ever. Including in marketing prose, including in small-caps tricks, including in "just this once."
- **Case:** as set. The wordmark is display-caps because it is a mark; every other Chakra Petch string is sentence case or as-authored. Never all-caps except inside the wordmark.

### Space Mono — micro-label

- **Role:** the tracked-widest uppercase micro-labels that name state. `PLAYING`, `MANUAL`, `AUTOPILOT`, `SAVE`, `OUT`, `[LIVE]`, `[AGENT]`, `[OK]`, `[ERR]`, `PATTERNS`, `AGENTS`.
- **Weight in use:** 400. No bold Space Mono.
- **Case:** ALWAYS UPPERCASE. Tracked wide (the enrich pass will commit the exact tracking; the creative direction is "as wide as the eye reads before the letters start drifting apart").
- **Why this family:** Space Mono is a warmer monospace than JetBrains Mono. Its terminals round just enough to feel like campfire rather than colder server-room JetBrains. At small sizes, that warmth is what keeps the micro-labels from reading hostile. The `nothing` preset already proved the pattern — tracked uppercase Space Mono as the sole label family for an entire system.
- **Forbidden:** body copy, code, headings, anything lowercase, anything below 0.6875rem (the labels are supposed to be readable at projector distance, not precious).

### JetBrains Mono — code and data

- **Role:** CodeMirror editor, inline `code` strings, every numeric data display in the UI (`247`, `04:11`, `3`, `12s`, cycle counters, BPM), every filename and pattern ID, any string that *is* code or that represents machine state.
- **Weight in use:** 400 for code, 500 for emphasized numerals in data displays (e.g. the big "247 patterns" count on the home state).
- **Numerals:** always digits, always tabular figures. A column of times or counts lines up.
- **Case:** as set. Code is as-typed.
- **Forbidden:** headlines, display text, body prose, micro-labels (Space Mono owns that).
- **Why non-negotiable:** JetBrains Mono is the anti-Suno signal. It is the single string the live-code lineage reads as "this is real code, not a cosplay of real code." Removing it would remove the Sage.

### DM Sans — body

- **Role:** body copy, paragraph prose, /radio chrome narration, marketing long-form, tooltips over 8 words, /p share description, docs.
- **Weight in use:** 400 for body, 500 for emphasis inside body, 600 for a body-tier heading when Chakra Petch would be too loud (Chakra Petch at 1.25rem is already loud; DM Sans 600 at the same size is the quieter alternative).
- **Case:** sentence case, lowercase-first permitted and encouraged.
- **Activate it.** The audit flagged DM Sans as currently underused. Every place the old design set body in JetBrains Mono "because it looked more live-code" is a DM Sans place now. JetBrains Mono is for strings that *are* code; DM Sans is for strings *about* code.
- **Forbidden:** numeric displays (JetBrains Mono), state labels (Space Mono), the wordmark (Chakra Petch).

## Scale roles (six named steps)

Six roles, named not sized. The enrich pass commits the math. The mood board's starting hints are carried forward as targets, not commitments.

| Role | Family | Starting hint | Case | Used for |
|---|---|---|---|---|
| `display` | Chakra Petch 700 | 2.5–4rem | as set | wordmark, hero, compass poster, 10-feet projector text |
| `heading` | Chakra Petch 600 or DM Sans 600 | 1.25–1.75rem | as set | section headers, /radio station-name, /p title |
| `body` | DM Sans 400 | 1rem (0.9rem alt) | sentence | prose, tooltips, empty-state copy, marketing paragraphs |
| `micro` | Space Mono 400 | ~0.6875rem | UPPER | state labels, status codes, bracketed buttons |
| `mono` | JetBrains Mono 400/500 | ~0.75rem | as set | data displays, numerals, filenames, metadata rows |
| `code` | JetBrains Mono 400 | ~0.875rem | as set | CodeMirror editor, inline code strings, the pattern code on /p |

Note: `micro` moved from `0.55rem` to roughly `0.6875rem` — the audit's "biggest disconnect" was really a legibility complaint, and the fix is size, not family. The enrich pass confirms the number; the creative commitment is "never below what Lia can read at laptop distance, never above what reads as a label instead of a ornament."

## Case and tracking rules

- **Micro labels are always UPPERCASE, tracked wide.** This is the single tracked-wide call in the system. Nothing else gets wide tracking. The wordmark does not get wide tracking. Headings do not get wide tracking. Code does not. Only `micro`.
- **Body is sentence case by default, lowercase-first encouraged in product strings.** `pattern saved.`, not `Pattern Saved.`, never `Pattern saved!`. The compass is lowercase by nature; body copy follows.
- **Display is as-set.** Chakra Petch headlines are not all-caps (the wordmark is the only all-caps Chakra Petch in the system). Hero strings read as a sentence, not a slogan.
- **Code is as-typed.** Case in code follows the language, never the design.
- **Data values are as-typed digits.** `247`, not `two hundred and forty-seven`. `3 agents`, not `three agents`.

## Numerals

Always digits in UI, always tabular in data displays (columns of times, counts, BPM, durations align on the decimal), always JetBrains Mono. Spelled-out numbers are permitted only in the manifesto and long-form marketing prose, and only below ten, per the voice rules — and those strings are DM Sans, not JetBrains Mono. If a numeral is in UI, it is JetBrains Mono. If a numeral is in a sentence of prose, it is DM Sans. This is the one place the family split is decided by context, not by role.

## Punctuation

- **No exclamation marks in product strings, ever.** Not on success toasts, not on errors, not in marketing, not in onboarding, not in the compass.
- **Oxford comma: yes.** `open, autonomous, and collective.`
- **Em-dash for prose asides and compass-style sentences.** Unspaced in prose (`place is awake—it remembers you were here`) per the voice rules, but may be spaced in UI microcopy for readability at small sizes.
- **En-dash for numeric ranges only.** `20:00–22:00`, never a hyphen there.
- **The middot `·`** is reserved for two contexts: the wordmark's color accent, and the "dot-delimited metadata row" pattern on /radio and /p (e.g. `"slow kitchen" · by lia · 04:11`). The middot is never decorative.
- **Brackets `[ ... ]`** are type, not punctuation. They are the bracketed-button voice from the terminal preset and render as Space Mono uppercase. `[ SAVE ]`, `[ LIVE ]`, `[ AGENT ]`. Spaces inside the brackets are part of the grammar.

## Loading strategy

- **`next/font` local, self-hosted.** All four families are declared through `next/font` with local font files vendored into the repo. No Google Fonts `<link>` at runtime. No CDN. No runtime fetch.
- **AGPL-compatible licenses only.** Chakra Petch (OFL), DM Sans (OFL), JetBrains Mono (OFL), Space Mono (OFL) all satisfy. The enrich pass verifies versions and vendors the files; the creative commitment is "nothing in the type stack reaches over the network while Lia is reading."
- **Max four families ever.** No fallback family gets promoted into a fifth slot. System fonts are the font-face fallback during FOUT, not a design family.

## Per-surface type flavor

| Surface | Reads loudest | Reads softest | Dominant family | What's missing |
|---|---|---|---|---|
| **/studio** | `mono` + `code` (JetBrains Mono) — the editor is the focal point. `micro` (Space Mono) shouts the state badges. | `body` (DM Sans) appears rarely, only in tooltips and empty-state copy. | JetBrains Mono, then Space Mono | Chakra Petch appears only in the wordmark at the nav — no display tier inside the studio |
| **/radio** | `heading` (Chakra Petch or DM Sans 600) for the station name. `display` for the "now playing" title when wall-mode is active. | `body` (DM Sans) for the narration strip, `text-muted` for metadata. `micro` labels are whispered here — present but rare. | DM Sans + Chakra Petch | JetBrains Mono appears only in the small timer/count strip, never as primary |
| **/p/[id]** | `display` (Chakra Petch) for the pattern title once. Everything else is quieter. | `body` (DM Sans) for description + share copy. `code` (JetBrains Mono) for the visible pattern code, which is present but not loud. | Chakra Petch (title) + DM Sans (prose) + JetBrains Mono (code) | No Space Mono micro-labels — `/p` does not shout |
| **/embed** | `micro` (Space Mono) for the one status label, tiny. | `body` (DM Sans) for the pattern title. | DM Sans + Space Mono | No Chakra Petch — the wordmark shrinks to the mark only; the embed has no display tier |

## Scale (committed math)

**Ratio:** `1.25` (Major Third). Base `1rem = 16px`. Root font size stays at browser default so `rem` scales with user preferences.

| Role | rem | px | Ratio step | Line-height | Tracking |
|---|---|---|---|---|---|
| `display-lg` | `3.815rem` | 61 | base × 1.25⁶ | 1.05 | -0.02em |
| `display` | `3.052rem` | 49 | base × 1.25⁵ | 1.08 | -0.015em |
| `display-sm` | `2.441rem` | 39 | base × 1.25⁴ | 1.1 | -0.01em |
| `heading-lg` | `1.953rem` | 31 | base × 1.25³ | 1.2 | -0.005em |
| `heading` | `1.563rem` | 25 | base × 1.25² | 1.25 | 0 |
| `heading-sm` | `1.25rem` | 20 | base × 1.25¹ | 1.3 | 0 |
| `body-lg` | `1.125rem` | 18 | — | 1.55 | 0 |
| `body` | `1rem` | 16 | base × 1 | 1.6 | 0 |
| `body-sm` | `0.875rem` | 14 | — | 1.55 | 0 |
| `code` | `0.875rem` | 14 | — | 1.5 | 0 |
| `mono` | `0.75rem` | 12 | — | 1.4 | 0 |
| `micro` | `0.6875rem` | 11 | — | 1.3 | **+0.12em** (tracked wide) |

**Chakra Petch rule holds:** `display-*` and `heading-lg` use Chakra Petch 700/600. `heading` and `heading-sm` may use DM Sans 600 as the quieter alternative (per the creative rule above). Below `heading-sm` (`1.25rem`), Chakra Petch is forbidden.

## Fluid clamp() formulas

Fluid only applies to display/heading tiers. Body, code, mono, and micro are fixed — fluid body copy is a Linear/Vercel move and pulse.city is explicitly not.

Viewport window: `375px` (min) → `1440px` (max). Formula: `clamp(min, calc(min + (max - min) * ((100vw - 375px) / (1440 - 375))), max)`, simplified:

| Role | clamp() |
|---|---|
| `display-lg` | `clamp(2.441rem, 1.957rem + 2.066vw, 3.815rem)` |
| `display` | `clamp(2.068rem, 1.707rem + 1.538vw, 3.052rem)` |
| `display-sm` | `clamp(1.769rem, 1.495rem + 1.167vw, 2.441rem)` |
| `heading-lg` | `clamp(1.563rem, 1.367rem + 0.836vw, 1.953rem)` |
| `heading` | `clamp(1.25rem, 1.147rem + 0.438vw, 1.563rem)` |
| `heading-sm` | `clamp(1.125rem, 1.094rem + 0.125vw, 1.25rem)` |

At `≥ 1440px`, max pins. At `≤ 375px`, min pins. No fluid below `heading-sm`.

## Vertical rhythm

Body line-height `1.6` against an `8px` spacing grid: `16px × 1.6 = 25.6px` — which does not land on 8. Committed: **snap body line-height to `1.5` (24px)** in contexts where rhythm matters (prose long-form on `/radio`, docs), keep `1.6` for tooltip and short-copy contexts where the looser leading reads friendlier. Two line-heights only. No third.

## next/font local loading

All four families are loaded via `next/font/local` with self-hosted WOFF2 files vendored into `src/app/fonts/`. No `next/font/google` — the audit flagged external font requests as a posture issue; `next/font/local` eliminates the DNS round-trip and the runtime fetch at once.

```ts
// src/app/fonts.ts
import localFont from "next/font/local";

export const chakraPetch = localFont({
  src: [
    { path: "./fonts/chakra-petch-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/chakra-petch-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/dm-sans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const spaceMono = localFont({
  src: [{ path: "./fonts/space-mono-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-micro",
  display: "swap",
  preload: false, // micro-labels are everywhere but small — second-priority preload
});
```

- **FOUT, not FOIT.** `display: "swap"` lets system fonts render first and re-layout when custom families land. The alternative (`block` / FOIT) makes /studio feel dead for 200ms on cold load, which violates the "the room is awake" compass.
- **Preload trio.** Chakra Petch, DM Sans, JetBrains Mono preload. Space Mono does not — it is used at tiny sizes everywhere but the CLS cost of preloading a fourth family exceeds the benefit.
- **AGPL / OFL verified.** All four families are SIL Open Font License, compatible with pulse.city's AGPL-3.0-or-later. Vendor the OFL.txt alongside each family in `src/app/fonts/`.
- **System fallback stack:**
  - display: `"Chakra Petch", ui-sans-serif, system-ui, sans-serif`
  - body: `"DM Sans", ui-sans-serif, system-ui, sans-serif`
  - mono/code: `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`
  - micro: `"Space Mono", ui-monospace, "SF Mono", Menlo, monospace`

## Tailwind v4 `@theme` mapping

```css
@theme inline {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --font-micro: var(--font-micro);

  --text-display-lg: clamp(2.441rem, 1.957rem + 2.066vw, 3.815rem);
  --text-display: clamp(2.068rem, 1.707rem + 1.538vw, 3.052rem);
  --text-display-sm: clamp(1.769rem, 1.495rem + 1.167vw, 2.441rem);
  --text-heading-lg: clamp(1.563rem, 1.367rem + 0.836vw, 1.953rem);
  --text-heading: clamp(1.25rem, 1.147rem + 0.438vw, 1.563rem);
  --text-heading-sm: clamp(1.125rem, 1.094rem + 0.125vw, 1.25rem);
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-code: 0.875rem;
  --text-mono: 0.75rem;
  --text-micro: 0.6875rem;
}
```

---

## Related
- [logo-directions.md](./logo-directions.md)
- [color-system.md](./color-system.md)
- [imagery-style.md](./imagery-style.md)
- [brand-applications.md](./brand-applications.md)
