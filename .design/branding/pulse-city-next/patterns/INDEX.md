# pulse-city-next -- patterns manifest
> Phase: guidelines (Phase 4) -- Pass 1 of 2 -- core artifacts only
> Brand: pulse-city-next | Mode: evolve | Generated: 2026-04-15
> Style base: terminal (structural inheritance; rejects phosphor glow, scanlines, ASCII chrome, green-on-black, JetBrains Mono body)

## Compass
> **the place is awake, and it remembers you were here.**

Every artifact in this directory exists to earn that sentence. If a decision does not earn it, cut the decision.

---

## Core artifacts (Pass 1)

### 1. `pulse-city.yml` -- source of truth
Machine-readable brand definition. Inherits structure from terminal, specializes tokens, intensity, patterns, constraints, effects, and per-surface flavor for pulse.city.

- **Tokens:** 14 semantic colors (base + 3 surfaces + 3 text + creator/listener/agent trio + signal-warn + destructive + border + scrim), 4 font families, 12-step type scale, spacing, motion durations, icon sizes, dither texture.
- **Intensity:** `variance: 3`, `motion: 4`, `density: 7`.
- **Patterns:** bracketed buttons, uppercase tracked-widest chrome (surface-specific), punchcard logomark, ASCII fallbacks, static dither, strudel-draw imagery.
- **Constraints:** no gradients, no pastel tints, no shadows, single border value, 14px floor on text-dim, max 1 signal firing per screen.
- **Effects:** pulse-dot (1.5s loop) + evolve-glow (600ms one-shot). Exactly two motion shapes.
- **Per-surface flavor:** /studio (loud creator), /radio (quiet listener), /p (editorial), /embed (minimal), /marketing (balanced).

If this file and anything else in the repo disagree, `pulse-city.yml` wins.

### 2. `STYLE.md` -- agent contract
Human- and LLM-readable translation of `pulse-city.yml` plus brand philosophy. Builder agents consume this directly. Key sections:
- Creator x Sage archetype and why it forbids almost everything
- Why terminal and why not terminal (selective inheritance)
- Component composition patterns (card, button x4, input, badge, nav, dialog, layout)
- Constraints (20 never, 13 always)
- Effects (interaction vocabulary, state tables, keyframes)
- Five bold bets
- Implementation notes (Tailwind 4 `@theme inline` target, `next/font/local` setup, rebuilt `evolve-glow`)

### 3. `guidelines.html` -- visual brand guide
Single-file self-rendering visual guide. Open in any browser. Dark-only, no external CSS/JS beyond Google Fonts CDN (noted as preview-only -- production uses `next/font/local`). Sections:
1. Hero -- wordmark + heartbeat + tagline + metric strip (4 surfaces, 14 tokens, 4 typefaces, 2 motions)
2. Logo -- inline SVG 3x7 punchcard at 3 sizes + ASCII fallback + wordmark + horizontal lockup
3. Positioning -- 2x2 map (opaque/transparent x track/station), whitespace claims
4. Color -- full 14-token swatch grid with hex, OKLCH, WCAG contrast, role, per-surface application table
5. Typography -- 4 family cards + 12 type scale steps rendered at actual size with correct identity spec
6. Visual elements -- dither swatch, live pulse-dot demo, interactive evolve-glow trigger, Lucide note
7. Components -- bracketed buttons (all variants), badges, input, surface cards, dialog, code block
8. Personas -- Lia Moreira primary card + Creator/Listener/Agent/Host secondary cards
9. Voice -- three words, seven rules, tone spectrum per surface, locked examples, forbidden phrases
10. Applications -- per-surface intensity table (studio/radio/p/embed/marketing/mcp)
11. Colophon -- brand meta footer

Includes scroll-spy JS for fixed sidebar navigation. Live motion: pulse-dot loops, evolve-glow fires on button click.

### 4. `INDEX.md` -- this file
Patterns manifest. Points to the three core artifacts.

---

## What is NOT in Pass 1

Component-level artifacts come in **Pass 2**, after the user reviews the core visuals in `guidelines.html` and approves the token system, type scale, logomark, and motion vocabulary. Pass 2 will add:

- `token-mapping.md` -- migration from current `@theme inline` to semantic tokens
- Component specs for new primitives: Button, Badge, Card, Dialog, Logomark, Wordmark, PulseDot, EvolveGlow, Punchcard, cn() utility
- `overrides.md` -- per-component behavior deltas for the 11 existing components

---

## Read order for builder agents

1. `INDEX.md` -- orientation (this file)
2. `pulse-city.yml` -- tokens, constraints, patterns
3. `STYLE.md` -- philosophy + implementation notes
4. `guidelines.html` -- sanity-check the visuals in a browser

## Read order for a human reviewer

1. `guidelines.html` -- open in browser first. If the hero, color grid, type scale, logomark, or motion feels wrong, stop and rework before Pass 2.
2. `STYLE.md` -- read philosophy + constraints. Confirm the bold bets are acceptable.
3. `pulse-city.yml` -- scan tokens and patterns for anything that should be changed before Pass 2 locks component specs.

---

## Pipeline status

| Phase | State |
|---|---|
| 1 - audit | complete |
| 2 - discover | complete |
| 3 - strategy + identity | complete |
| 4 - guidelines -- Pass 1 (core) | **complete** |
| 4 - guidelines -- Pass 2 (components) | pending |

Next action: user reviews `guidelines.html` in a browser and approves core visuals before Pass 2 component specs.
