# pulse-city-next — patterns manifest
> Phase: guidelines (Phase 4) · Pass 1 of 2 — core artifacts only
> Brand: pulse-city-next · Mode: evolve · Generated: 2026-04-15
> Style base: terminal (structural inheritance; rejects phosphor glow, scanlines, ASCII chrome, green-on-black, JetBrains Mono body)

## Compass
> **the place is awake, and it remembers you were here.**

Every artifact in this directory exists to earn that sentence. If a decision does not earn it, cut the decision.

---

## Core artifacts (Pass 1)

### 1. `pulse-city.yml` — source of truth
Machine-readable brand definition. Inherits structure from terminal, specializes tokens, intensity, patterns, constraints, effects, and per-surface flavor for pulse.city.

- **Tokens:** 14 semantic colors (base + 3 surfaces + 3 text + creator/listener/agent trio + signal-warn + destructive + border + scrim), 4 font families, 12-step type scale, spacing, motion durations, icon sizes, dither texture.
- **Intensity:** `variance: 3`, `motion: 4`, `density: 7`.
- **Patterns:** bracketed buttons, uppercase tracked-widest chrome (surface-specific), punchcard logomark, ASCII fallbacks, static dither, strudel-draw imagery.
- **Constraints:** no gradients, no pastel tints, no shadows, max 4px radius, single border value, 14px floor on text-dim, max 1 signal firing per screen.
- **Effects:** pulse-dot (1.5s loop) + evolve-glow (600ms one-shot). Exactly two motion shapes.
- **Per-surface flavor:** /studio (loud creator), /radio (quiet listener), /p (editorial), /embed (minimal), /marketing (balanced), MCP (sage-dominant).

If this file and anything else in the repo disagree, `pulse-city.yml` wins.

### 2. `STYLE.md` — agent contract
Human- and LLM-readable translation of `pulse-city.yml` plus brand philosophy. Structure: heartbeat → philosophy → intensity dials → patterns in/out → constraints → effects → tokens → typography → per-surface volume → bold bets → implementation notes. Builder agents consume this directly.

Key sections:
- Creator × Sage archetype and why it forbids almost everything
- Why terminal and why not terminal (selective inheritance)
- The four bold bets: "the studio is the radio paused," "the code is the voice," "ration the loud," "still except when something happened"
- Tailwind 4 `@theme inline` implementation notes (no `tailwind.config.ts`, extend don't replace, `next/font/local`, rebuild `evolve-glow`, rename 3 literal color tokens to semantic, warm violet, add missing tokens, fix font variables)

### 3. `guidelines.html` — visual brand guide
Single-file self-rendering visual guide. Open in any browser. Dark-only, no external CSS/JS beyond Google Fonts CDN (noted as preview-only — production uses `next/font/local`). Sections:

1. Hero — wordmark + manifesto line + tagline + meta
2. Brand — purpose, vision, mission, values, manifesto
3. Voice — three words, seven rules, locked examples, forbidden phrases
4. Positioning — 2×2 map (opaque/transparent × track/station), whitespace claims
5. Logo — inline SVG 3×7 punchcard at 3 sizes + ASCII fallback + wordmark
6. Color — full 14-token swatch grid with hex, OKLCH, WCAG contrast, role
7. Typography — 4 family cards + 12 type scale steps rendered at actual size
8. Visual elements — dither swatch, live `pulse-dot` demo, interactive `evolve-glow` trigger, Lucide note
9. Components — bracketed buttons (all variants), uppercase badges, surface cards, dialog placeholder, code block
10. Personas — Lia, Oscar, the drifter
11. Applications — per-surface intensity table (studio/radio/p/embed/marketing/mcp)
12. Colophon — brand meta footer

Live motion: `pulse-dot` loops continuously; `evolve-glow` fires on button click. All rendered inline — no images fetched.

### 4. `INDEX.md` — this file
Patterns manifest. Points to everything.

---

## Components

Specs for component artifacts. These describe _intent_ — implementation happens in the project build phase.

### Token mapping
- [components/token-mapping.md](components/token-mapping.md) — migration guide from current `@theme inline` to semantic tokens

### Brand primitives (src/components/brand/)
- [components/brand/logomark.md](components/brand/logomark.md) — 3×7 punchcard SVG
- [components/brand/wordmark.md](components/brand/wordmark.md) — PULSE·CITY display + pulse.city prose
- [components/brand/punchcard.md](components/brand/punchcard.md) — @strudel/draw imagery wrapper
- [components/brand/scope.md](components/brand/scope.md) — oscilloscope chrome strip

### UI primitives (src/components/ui/)
- [components/ui/button.md](components/ui/button.md) — bracketed `[ SAVE ]` with 4 variants
- [components/ui/badge.md](components/ui/badge.md) — status chip, Space Mono uppercase
- [components/ui/card.md](components/ui/card.md) — surface-tier elevation
- [components/ui/dialog.md](components/ui/dialog.md) — Radix-based modal primitive

---

## What is NOT in Pass 1

Component-level artifacts come in **Pass 2**, after the user reviews the core visuals in `guidelines.html` and approves the token system, type scale, logomark, and motion vocabulary. Pass 2 will add:

- `token-mapping.md` — maps `pulse-city.yml` tokens to the existing `@theme inline` block in `src/app/globals.css`. Specifies: the 3 literal color token renames (lime → creator, sky → listener, violet → agent), the warmed violet (`#6b46ff` → `#8a66ff`), the 4 new tokens to add (surface-3, text-muted, scrim, signal-warn), the font variable rebinds (fix the broken `--font-chakra-petch` → `--font-display` et al.), the `pulse-dot` trough correction (0.35 → 0.55), and the rebuilt `evolve-glow` keyframe.
- `overrides.md` — per-component behavior deltas for the 11 existing components (Header, TransportBar, ToolsPanel, SettingsOverlay, LoginModal, UserMenu, PatternsModal, ChatPanel, SpectrumAnalyzer, StrudelEditor, StrudelEditorInner). What changes in each: surface tiers, accent rebinds, bracketed-button retrofits, micro-label Space Mono upgrades.
- `custom-specs/` — specs for the new primitives this brand needs:
  - `ui/Button.tsx` (bracketed grammar, 4 intent variants)
  - `ui/Badge.tsx` (uppercase tracked-widest, 7 states)
  - `ui/Card.tsx` (surface-tier elevation)
  - `ui/Dialog.tsx` (scrim backdrop, 120ms opacity-only entry)
  - `brand/Logomark.tsx` (inline SVG 3×7 punchcard with variants)
  - `brand/Wordmark.tsx` (PULSE·CITY + prose pulse.city)
  - `brand/PulseDot.tsx` (the ambient primitive)
  - `brand/EvolveGlow.tsx` (the one-shot primitive)
  - `brand/Punchcard.tsx` (strudel-draw host)
  - `cn.ts` utility (the Phase 4 addition noted in CONVENTIONS.md)

---

## Read order for builder agents

1. `INDEX.md` — orientation (this file)
2. `pulse-city.yml` — tokens, constraints, patterns
3. `STYLE.md` — philosophy + implementation notes
4. `guidelines.html` — sanity-check the visuals in a browser
5. Pass 2 artifacts — once produced

## Read order for a human reviewer

1. `guidelines.html` — open in browser first. If the hero, color grid, type scale, logomark, or motion feels wrong, stop and rework before Pass 2.
2. `STYLE.md` — read philosophy + constraints. Confirm the bold bets are acceptable.
3. `pulse-city.yml` — scan tokens and patterns for anything that should be changed before Pass 2 locks component specs.

---

## Pipeline status

| Phase | State |
|---|---|
| 1 · audit | complete |
| 2 · discover | complete |
| 3 · strategy + identity | complete |
| 4 · guidelines — Pass 1 (core) | complete |
| 4 · guidelines — Pass 2 (components) | **complete** |

Next action: user reviews component specs in `components/` and greenlights Phase 5 (builder implementation).
