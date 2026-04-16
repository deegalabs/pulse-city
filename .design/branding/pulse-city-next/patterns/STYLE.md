# STYLE.md -- pulse.city agent contract
> Phase: guidelines | Brand: pulse-city-next | Generated: 2026-04-15
> System strategy: **extend** | Tech: Next.js 16 (webpack) + Tailwind 4 + React 19 + @strudel/*
> Style base: **terminal** (structural inheritance only -- rejected: phosphor glow, scanlines, ASCII chrome, green-on-black, JetBrains Mono body, cursor-blink ambient)

This is the single document designer and builder agents consume for pulse.city. It is rendered from `pulse-city.yml` and the Phase 3 identity chunks. If this file and `pulse-city.yml` disagree, `pulse-city.yml` wins.

---

## Intensity dials

| Dial | Value | What it means |
|---|---|---|
| **variance** | 3 | Tight monospace-aware grid, dense /studio vs. breathable /radio. Softer than terminal's 3-with-dashes because we reject ASCII chrome. Panes are glass-line bordered, not drawn with dashes. |
| **motion** | 4 | Two committed motion shapes exist in the entire system. `pulse-dot` (1.5s loop) says "the room is still playing." `evolve-glow` (600ms one-shot) says "something just changed." No third shape. No hover bounces, no page fades, no parallax. |
| **density** | 7 | Inherited from terminal. /studio is information-dense -- CodeMirror plus tool chrome plus micro-label status bars. /radio relaxes density via `surface-3` and long line-heights, but the token system stays dense. |

---

## Philosophy

### Creator x Sage, and why that forbids almost everything

The archetype is Creator with Sage as the tension. Creator wants to make things; Sage insists the making be visible. Together they say: *the truth is in the code, the code is on the screen, and anyone can pick up the loop*. This is why the brand has no mascot, no sparkle, no onboarding tour, no "AI-powered" framing, no wellness posture, no gamification, no pricing page, and no hero gradient. Each one is a move the archetype forbids.

The voice set is **Present, Legible, Understated**. Present tense, real numbers, no futures and no pasts. Legible means plain and technically exact -- a string either names a specific thing or says nothing. Understated means the copy is one step quieter than where most product copy lives. If a line tempts you to add an exclamation, cut the line.

### The compass (brand heartbeat)

> **the place is awake, and it remembers you were here.**

Every design decision is tested against this sentence. "Awake" is why there is no fade-in and no loading spinner cosplay. "Remembers you were here" is why authorship is first-class -- every pattern carries the name of the hand (human or agent) that wrote it.

### Why terminal, and why not terminal

The style base is terminal because pulse.city is code-literate and monospace-aware by nature. We inherit:

- the dark floor (`#0a0e17`, never brightened)
- bracketed-button grammar: `[ SAVE ]` `[ LIVE ]` `[ AGENT ]`
- status-code badges: `PLAYING`, `AUTOPILOT`, `[ERR]`, `[OK]`
- density: 7 information-dense layouts in /studio
- the respect-the-engineer posture

We reject terminal's maximalism -- the signals that drift into cosplay:

- **No phosphor glow.** `text-shadow: 0 0 5px rgba(green, 0.5)` is forbidden. The glow is a nostalgia move; pulse.city is present-tense.
- **No CRT scanlines.** No repeating 3-4px overlay. The screen is not pretending to be a tube.
- **No green-on-black primary.** Our `creator` accent is lime `#a2d729`, a warmer chartreuse, and it shares the stage with sky and warmed-violet -- not alone.
- **No ASCII decorative borders.** `+--- TITLE ---+` frames are terminal cosplay. Our borders are a 1px glass-line, `rgba(255,255,255,0.08)`. Brackets live inside labels, never around frames.
- **No JetBrains Mono body.** JetBrains Mono is code. DM Sans is body. The audit flagged DM Sans as currently underused; this system activates it.
- **No cursor-blink ambient.** The CodeMirror caret blinks because CodeMirror blinks a caret. Nothing else blinks in this system. `cursor-blink` as a global motion shape is removed.
- **No shell-prompt prefixes.** No `> ` on links. No `$ ` on inputs. We are not a CLI -- we are a music studio that respects engineers.
- **No type-reveal on hero strings.** The hero renders already-awake. Typewriter effects tell the user to wait; the compass says the room is already playing.

The word for what remains is **restrained cypherpunk**. Dark, dense, code-literate, warmed. Not maximal.

---

## Patterns (component composition)

### Card

| Property | Value |
|---|---|
| background | `surface-1` (default) or `surface-2` (elevated) |
| border | `1px solid var(--color-border)` -- the glass-line |
| shadow | **none** -- elevation is a surface tier, never a blur |
| radius | `4px` (border-radius-md) |
| header | optional border-b glass-line. **NO** `+--- TITLE ---+` framing |
| texture | inherits the dither fade of its surface tier |

### Button -- primary (`[ SAVE ]`)

The bracketed button is a **bold bet**. The brackets are part of the label grammar, not a frame around it.

| Property | Value |
|---|---|
| background | transparent |
| border | `1px solid var(--color-creator)` |
| color | `var(--color-creator)` |
| font | Space Mono 400, `0.6875rem`, `letter-spacing: 0.12em`, UPPERCASE |
| padding | `0.5rem 0.875rem` |
| label format | `[ {LABEL} ]` (literal brackets, with spaces) |
| radius | `2px` |
| hover | background fills `creator`, text becomes `base` (bracket-fill) |
| active | `translate-y-[1px]`, 100ms |
| focus | 1px outline in `listener` (sky), no glow |

### Button -- secondary

| Property | Value |
|---|---|
| background | transparent |
| border | `1px solid var(--color-border)` |
| color | `var(--color-text)` |
| label | `[ {LABEL} ]` |
| hover | border brightens `text-dim -> text`; no tier lift |

### Button -- agent (`[ AUTOPILOT ]`)

Renders **only on `base`** -- never on `surface-1`. Agent on surface-1 is 3.6:1, AA Large only, and bracket text at 11px would fail. Hard rule.

| Property | Value |
|---|---|
| background | transparent |
| border | `1px solid var(--color-agent)` |
| color | `var(--color-agent)` |
| label | `[ {LABEL} ]` |
| hover | bracket-fill -> `color.base` on `color.agent` |

### Button -- destructive (`[ DELETE ]`)

Icon + bracketed label. Never a default state. Never on /radio. Never as a background.

### Input

| Property | Value |
|---|---|
| background | transparent |
| border | `1px solid var(--color-border)` |
| radius | `2px` |
| font | DM Sans 400 |
| placeholder | `text-dim` |
| focus | border-color -> `listener`, no glow, no ring blur |
| **forbidden** | shell-prompt prefix (`>` / `$` / `~`). This is not a CLI. |

### Badge (`PLAYING` / `[ERR]`)

| Property | Value |
|---|---|
| shape | `2px` radius, 1px border currentColor |
| background | transparent |
| font | Space Mono 400 uppercase tracked `+0.12em` |
| size | `0.6875rem` (11px) |
| color | role-based -- `creator` for `PLAYING`/`LIVE`, `agent` for `AGENT`, `destructive` for `[ERR]`, `text-dim` for `[OK]` |

### Nav

| Property | Value |
|---|---|
| background | `base` |
| divider | `border-b 1px var(--color-border)` |
| link font | DM Sans (body) |
| link states | rest `text-dim`, hover `text`, active `listener` (sky) |
| **forbidden** | `>` prefix reveal on hover, underline, tab-pane indicators |

### Dialog

| Property | Value |
|---|---|
| backdrop | `scrim` (`rgba(10,14,23,0.72)`) |
| background | `surface-1` |
| border | `1px solid var(--color-border)` |
| entrance | 120ms opacity only. **NO** slide, scale, spring, or bounce |
| focus trap | required (Radix UI Dialog recommended) |

### Layout

- Archetype: **surface-tiered panes**, not tmux pane-splits. No pane-tab indicators.
- Max width: `max-w-6xl` for marketing; full-bleed for /studio and /radio.
- Section spacing: `py-16` marketing, `py-8` /studio dense.
- Dividers: border glass-line or middot in metadata rows. **Never** `===` or `---` ASCII rules.
- CodeMirror host: `base` bg, `surface-1` gutter, `creator` caret.

---

## Constraints (rendered from .yml)

### Never

1. Never phosphor glow, CRT scanlines, type-reveal, cursor-blink ambient, or shell prompts. The terminal inheritance is structural -- those are cosplay.
2. Never ASCII decorative borders as HTML chrome (`+---+`, `===`, `---`). Brackets live inside labels, never around frames.
3. Never JetBrains Mono as body face. Code only.
4. Never Chakra Petch below `1.25rem` (`heading-sm`). Display face only. This resolves the audit's biggest disconnect.
5. Never a fifth font family. Four and done.
6. Never a gradient anywhere -- background, button, border, logo, middot. Flat fills only.
7. Never brighten the page background above `#0a0e17`.
8. Never pastel tints of the trio. One hex per accent.
9. Never `creator` lime on /radio. The compass asks for slowness; lime shouts.
10. Never two signal-warn firings on one screen. Amber is one-per-screen-max.
11. Never agent violet as long-form body text on `surface-1` (3.6:1). Chrome only.
12. Never drop shadows in chrome. Elevation is a surface tier.
13. Never hover scale / bounce / rotation. Hover changes color or surface tier, nothing else.
14. Never fade-in on page load. Never parallax. Never scroll-jacking.
15. Never an AI sparkle, wand, brain, orb, or mascot. Agent is chrome, not a character.
16. Never an exclamation mark in product copy.
17. Never "AI-powered," "revolutionary," "seamless," "unlock," or "launch" as product verbs.
18. Never a second border color.
19. Never stock photography, device mockups, hero blobs, or illustration.
20. Never a light mode.

### Always

1. Always DM Sans as the body face. The audit flagged it as underused -- it ends here.
2. Always JetBrains Mono for code, filenames, and numeric data (tabular figures).
3. Always Space Mono -- tracked `+0.12em`, UPPERCASE -- for micro-labels and bracketed buttons.
4. Always Chakra Petch 700 for the wordmark. No other weight renders the mark.
5. Always the bracketed-label grammar on interactive micro-labels.
6. Always the semantic trio -- `creator` / `listener` / `agent` -- only with their committed meanings.
7. Always the static dither tile on base surfaces. `image-rendering: pixelated` is mandatory.
8. Always the sky middot in the wordmark -- the mark's only color accent.
9. Always present-tense, lowercase-friendly, understated product copy.
10. Always name the actor when an agent did something.
11. Always credit the author. `pc_` key prefix on agent keys.
12. Always the two-motion vocabulary: `pulse-dot` (loop) + `evolve-glow` (one-shot).
13. Always a 14px floor for `text-dim`. Below that, it fails WCAG AA Large.

---

## Effects

### Interaction vocabulary

- `surface-tier-lift` -- hover raises a control `surface-1 -> surface-2` via 120ms ease-out
- `border-brighten` -- hover walks the glass-line `text-dim -> text`
- `bracket-fill` -- bracketed button hover fills background with its accent, color flips to `base`
- `pulse-dot` -- ambient, 1.5s loop, opacity `1 -> 0.55 -> 1`. Applied to anything that says "the room is still playing"
- `evolve-glow` -- one-shot, 600ms, fires at the exact point of a state change

### State tables

| State | Applied to | Treatment |
|---|---|---|
| hover (card) | `.card` | background `surface-1 -> surface-2`, 120ms ease-out |
| hover (primary btn) | `.btn-primary` | bracket-fill to `creator` |
| hover (secondary btn) | `.btn-secondary` | border-brighten `text-dim -> text` |
| hover (agent btn) | `.btn-agent` | bracket-fill to `agent` (only on `base`) |
| hover (link) | `a` | color `text-dim -> text`. No `>` prefix reveal. No underline. |
| active (button) | any `button` | `translate-y-[1px]` for 100ms |
| focus (any) | `:focus-visible` | 1px outline `listener`, no glow |
| focus (CodeMirror caret) | `.cm-cursor` | blinks (only caret in the system that blinks) |
| transition (default) | `all` | 120ms `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| motion-reduce | `@media (prefers-reduced-motion)` | zero every transition and animation |

### Ambient

- `pulse-dot` at 1.5s / 0.55 trough -- applied to the `PLAYING` pill, the station dot on /radio, the embed idle glyph, the MCP-connected badge.
- **NO** scanline hum. **NO** cursor-blink outside CodeMirror.

### One-shot

- `evolve-glow` (600ms) -- fires on pattern mutation, autopilot handoff, first-frame agent connection. Never chained. Never looped.

### Keyframes (canonical)

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}

@keyframes evolve-glow {
  0%   { box-shadow: 0 0 0 0 var(--color-signal-warn); filter: blur(1px); }
  20%  { box-shadow: 0 0 16px 2px var(--color-signal-warn); filter: blur(0); }
  100% { box-shadow: 0 0 0 0 transparent; filter: blur(0); }
}

.pulse-dot  { animation: pulse-dot 1.5s ease-in-out infinite; }
.evolve-glow { animation: evolve-glow 600ms ease-out 1; }

@media (prefers-reduced-motion: reduce) {
  .pulse-dot, .evolve-glow { animation: none; }
}
```

---

## Bold bets (5)

These are the distinctive moves that make pulse.city legible as itself. A design agent reaching for one of these should reach with intent.

### 1. The 3x7 punchcard logomark

21 circles on a monospace grid. The top and bottom rows are `text-dim`; the middle row is `text` with the fourth (dead-center) dot in `listener` sky. The mark *is* a frozen Strudel punchcard -- the product's own output rendered at rest. Creator (craft is visible) and Sage (the mark is a diagram of what's happening) in one shape. Flat fills, no strokes, no gradient. ASCII fallback: `[...o...]`.

**Why this and not an orb or monogram:** an orb fails Sage (magic). A waveform fails Creator (sound, not authorship). A bracket monogram fails the compass (brackets are chrome, not heartbeat). Only the punchcard says *awake* (lit middle row) and *remembers* (dim rows flanking) at once.

### 2. Bracketed-button grammar

`[ SAVE ]` `[ LIVE ]` `[ AGENT ]` `[ DELETE ]`. The brackets are part of the label, not a frame around it. Space Mono 400 uppercase tracked `+0.12em`. The grammar is inherited from the terminal preset but survives the anti-cosplay filter because brackets are *text*, not chrome.

**Why it's load-bearing:** this is the single strongest brand signal at the UI layer. A bracketed label tells Lia "real code lives here, and the UI is written in the same tone as the code." It is the fastest way to distinguish pulse.city from Suno / Endel / Brain.fm on sight.

### 3. The warmed agent violet (`#8a66ff`)

The previous cold violet `#6b46ff` read as machine-other, which fought the archetype move of "agents are collaborators, not tools." The warmed hex lifts luminance into compass territory -- close enough to feel like a second hand in the room, far enough from magenta to stay unmistakably violet against lime and sky. Committed ceiling: any warmer starts competing with `signal-warn` amber.

### 4. The two-motion vocabulary

`pulse-dot` (loop, 1.5s, 0.55 trough) means "still playing." `evolve-glow` (one-shot, 600ms amber radial + blur-to-sharpen) means "something just changed." Nothing else moves. If a designer wants a third motion, the answer is no, and the follow-up is "which of the two existing shapes is closest, and why isn't that enough."

### 5. Authorship-colored imagery

Every punchcard cell is colored by the hand that wrote that beat -- `creator` for human, `listener` for room-curated, `agent` for agent-composed. A pattern's OG image is literally its punchcard. When a listener lands on `/p/[id]`, the colors tell them who wrote what before they read a single label. This is the Sage + Creator pairing made visual: the work decorates itself, and the authorship is readable at glance.

---

## Implementation (extend, not replace)

**System strategy is `extend`.** The slate is not clean. The current state of `src/app/globals.css` is:

```css
@theme inline {
  --color-bg: #0a0e17;
  --color-surface: #111827;
  --color-surface-2: #1e293b;
  --color-lime: #a2d729;
  --color-sky: #3aa5ff;
  --color-violet: #6b46ff;   /* cold */
  --color-red: #ef4444;
  --color-text: #e2e8f0;
  --color-text-dim: #64748b;
  --color-border: rgba(255, 255, 255, 0.08);

  --font-heading: var(--font-chakra-petch);  /* broken -- source unset */
  --font-body: var(--font-dm-sans);          /* broken -- source unset */
  --font-mono: var(--font-jetbrains-mono);   /* broken -- source unset */
}
```

There are 10 color tokens. 14 are needed. Three are literal-named and must become semantic. One is the wrong hex. Four are missing entirely. Three font variables reference custom properties that are **never set**. The `evolve-glow` keyframe is a second opacity loop, not the mutation-moment motion. The `pulse-dot` trough is `0.35` (too deep). `src/app/layout.tsx` loads fonts via a Google Fonts `<link>` -- a runtime fetch that violates the "nothing in the type stack reaches over the network" commitment.

### How Phase 4 resolves the 6 HIGH-severity concerns from CONCERNS.md

| # | Concern | Resolution in this phase |
|---|---|---|
| 1 | Literal token names (`--color-lime` / `--color-sky` / `--color-violet`) | `pulse-city.yml` commits semantic tokens `--color-creator` / `--color-listener` / `--color-agent`. STYLE.md's never-list bans the literal names. Phase 5 executes the rename in globals.css. |
| 2 | Violet is `#6b46ff` cold | `pulse-city.yml` commits warmed `#8a66ff`. Bold Bet #3 explains the ceiling. |
| 3 | Missing `--color-surface-3` / `--color-text-muted` / `--color-signal-warn` / `--color-scrim` | All four tokens are committed in `pulse-city.yml` with OKLCH + contrast computed. |
| 4 | Font vars reference unset sources -> `font-heading` silently falls back to `system-ui` | STYLE.md's implementation section mandates `src/app/fonts.ts` via `next/font/local`, with the full TS declaration (see Typography below). Google Fonts `<link>` must be deleted from `src/app/layout.tsx`. |
| 5 | Space Mono family not declared | `pulse-city.yml` commits a fourth family `--font-micro` bound to Space Mono, with `preload: false` to avoid CLS. |
| 6 | `evolve-glow` keyframe is a second opacity loop | STYLE.md's effects section ships the canonical keyframe (600ms `box-shadow` radial + blur-to-sharp, one-shot). Phase 5 swaps the existing keyframe. |

### Target `@theme inline` block (extends the current one)

Paste into `src/app/globals.css`, replacing the existing `@theme inline` block. This is the extension, not a rewrite -- the unchanged tokens keep their values, the renames alias semantically, the four new tokens land, and the font vars point at real sources.

```css
@theme inline {
  /* --- Color: base ramp --- */
  --color-base: #0a0e17;
  --color-surface-1: #111827;
  --color-surface-2: #1e293b;
  --color-surface-3: #2a3347;          /* NEW */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-scrim: rgba(10, 14, 23, 0.72); /* NEW */

  /* --- Color: text ramp --- */
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;         /* NEW */
  --color-text-dim: #64748b;           /* 14px floor -- AA Large only */

  /* --- Color: semantic trio --- */
  --color-creator: #a2d729;            /* was --color-lime */
  --color-listener: #3aa5ff;           /* was --color-sky */
  --color-agent: #8a66ff;              /* was --color-violet #6b46ff */

  /* --- Color: signal & destructive --- */
  --color-signal-warn: #f2b84a;        /* NEW */
  --color-destructive: #ef4444;        /* was --color-red */

  /* --- Compatibility aliases (remove after migration) --- */
  --color-bg: var(--color-base);
  --color-surface: var(--color-surface-1);
  --color-lime: var(--color-creator);
  --color-sky: var(--color-listener);
  --color-violet: var(--color-agent);
  --color-red: var(--color-destructive);

  /* --- Typography: families (set by next/font/local) --- */
  --font-display: var(--font-chakra-petch);   /* Chakra Petch */
  --font-body:    var(--font-dm-sans);        /* DM Sans */
  --font-mono:    var(--font-jetbrains-mono); /* JetBrains Mono */
  --font-micro:   var(--font-space-mono);     /* Space Mono (NEW) */

  /* --- Typography: scale (1.25 Major Third) --- */
  --text-display-lg:  clamp(2.441rem, 1.957rem + 2.066vw, 3.815rem);
  --text-display:     clamp(2.068rem, 1.707rem + 1.538vw, 3.052rem);
  --text-display-sm:  clamp(1.769rem, 1.495rem + 1.167vw, 2.441rem);
  --text-heading-lg:  clamp(1.563rem, 1.367rem + 0.836vw, 1.953rem);
  --text-heading:     clamp(1.25rem, 1.147rem + 0.438vw, 1.563rem);
  --text-heading-sm:  1.25rem;
  --text-body-lg:     1.125rem;
  --text-body:        1rem;
  --text-body-sm:     0.875rem;
  --text-code:        0.875rem;
  --text-mono:        0.75rem;
  --text-micro:       0.6875rem;
}
```

Note on font variables: The `--font-display`, `--font-body`, `--font-mono`, and `--font-micro` vars in the `@theme inline` block reference CSS custom properties that will be injected by `next/font/local` declarations in `src/app/fonts.ts`. The `variable` option in each `localFont()` call sets the source custom property (e.g., `--font-chakra-petch`), and the `@theme inline` block aliases them to semantic names. Currently the source vars are unset because fonts load via Google Fonts `<link>` -- Phase 5 fixes this.

### Typography: `src/app/fonts.ts` (new file)

Create this file. Vendor the WOFF2 binaries to `src/app/fonts/`. Delete the Google Fonts `<link>` from `src/app/layout.tsx` in the same commit.

```ts
// src/app/fonts.ts
import localFont from "next/font/local";

export const chakraPetch = localFont({
  src: [
    { path: "./fonts/chakra-petch-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/chakra-petch-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-chakra-petch",
  display: "swap",
  preload: true,
});

export const dmSans = localFont({
  src: [
    { path: "./fonts/dm-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/dm-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/dm-sans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

export const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const spaceMono = localFont({
  src: [{ path: "./fonts/space-mono-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-space-mono",
  display: "swap",
  preload: false, // avoid CLS -- micro-labels are everywhere but small
});
```

### Root layout (evolved, not replaced)

```tsx
// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { chakraPetch, dmSans, jetbrainsMono, spaceMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "pulse.city -- the city is playing",
  description:
    "a living soundtrack primitive. open, autonomous, collective. for Ipe Village 2026.",
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontVars = [
    chakraPetch.variable,
    dmSans.variable,
    jetbrainsMono.variable,
    spaceMono.variable,
  ].join(" ");

  return (
    <html lang="en" className={`h-full ${fontVars}`}>
      <body className="h-dvh flex flex-col">{children}</body>
    </html>
  );
}
```

Delete the Google Fonts `<link>`. It is the single largest violation in the current layout -- a runtime network fetch in the path of first paint, using broken variable references.

### Base layer additions (dither + motion)

```css
@layer base {
  body {
    background-color: var(--color-base);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23ffffff' fill-opacity='0.02'/%3E%3Crect width='1' height='1' x='2' y='2' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E");
    background-repeat: repeat;
    image-rendering: pixelated;
    color: var(--color-text);
    font-family: var(--font-body), ui-sans-serif, system-ui, sans-serif;
    /* overflow: hidden was here -- remove it from body and scope it to /studio */
  }

  /* scope editor-first lock to /studio only */
  body.studio { overflow: hidden; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }   /* was 0.35 */
}

@keyframes evolve-glow {
  0%   { box-shadow: 0 0 0 0 var(--color-signal-warn); filter: blur(1px); }
  20%  { box-shadow: 0 0 16px 2px var(--color-signal-warn); filter: blur(0); }
  100% { box-shadow: 0 0 0 0 transparent; filter: blur(0); }
}

.pulse-dot  { animation: pulse-dot 1.5s ease-in-out infinite; }
.evolve-glow { animation: evolve-glow 600ms ease-out 1; }

@media (prefers-reduced-motion: reduce) {
  .pulse-dot, .evolve-glow { animation: none; }
}
```

### CodeMirror overrides (keep + retune)

The existing `.cm-editor` / `.cm-gutters` / `.cm-cursor` rules stay, with two tokens renamed:

```css
.cm-editor { background: var(--color-base) !important; font-family: var(--font-mono), monospace !important; }
.cm-editor .cm-content { caret-color: var(--color-creator); }
.cm-editor .cm-gutters { background: var(--color-surface-1); border-right: 1px solid var(--color-border); color: var(--color-text-dim); }
.cm-editor .cm-activeLine { background: rgba(162, 215, 41, 0.04); }
.cm-editor .cm-selectionBackground, .cm-editor .cm-content ::selection { background: rgba(162, 215, 41, 0.2) !important; }
.cm-editor .cm-cursor { border-left-color: var(--color-creator); }
```

### Per-surface body rules

Move `overflow: hidden` off the body. Apply it via a route-scoped class on `<body>` only for `/studio`. /radio and /p scroll.

---

## Related
- [pulse-city.yml](./pulse-city.yml) -- the source of truth
- [guidelines.html](./guidelines.html) -- visual brand guide
- [INDEX.md](./INDEX.md) -- file index
- [../identity/color-system.md](../identity/color-system.md)
- [../identity/typography.md](../identity/typography.md)
- [../identity/logo-directions.md](../identity/logo-directions.md)
- [../identity/imagery-style.md](../identity/imagery-style.md)
- [../identity/brand-applications.md](../identity/brand-applications.md)
- [../../system/CONCERNS.md](../../system/CONCERNS.md) -- the delta map
