# Brand Roadmap

## Brand: pulse.city
**Created:** 2026-04-15

---

## Phase 0: Audit
**Status:** pending (next)
**Command:** `/gsp-brand-audit`
**Input:** Existing brand assets (globals.css, layout.tsx, 11 components) + BRIEF.md
**Output:** `audit/`
**Goal:** Audit the existing pulse.city visual identity. Assess coherence, market fit, equity. Produce an evolution map that tells discovery/strategy/identity what to preserve, evolve, and replace.

## Phase 1: Research
**Status:** pending
**Command:** `/gsp-brand-research`
**Input:** BRIEF.md + audit/
**Output:** `discover/`
**Goal:** Research the live-coding / ambient / generative-music landscape. Competitive audit of IPÊ.FM, Strudel, SomaFM, Suno, Endel. Trend analysis for terminal-dark and demoscene-adjacent aesthetics. Mood board direction.

## Phase 2: Strategy
**Status:** pending
**Command:** `/gsp-brand-strategy`
**Input:** BRIEF.md + discover/
**Output:** `strategy/`
**Goal:** Define archetype, positioning, voice rules per surface, messaging matrix, naming rules for patterns and radios.

## Phase 3: Identity
**Status:** pending
**Command:** `/gsp-brand-identity`
**Input:** BRIEF.md + strategy/
**Output:** `identity/` + `palettes.json`
**Goal:** Create the missing visual identity pieces — logomark, iconography, formal color ramps (semantic roles for lime/sky/violet), type scale, motion rules, imagery direction.

## Phase 4: Guidelines
**Status:** pending
**Command:** `/gsp-brand-guidelines`
**Input:** Identity + Strategy + BRIEF.md
**Output:** `patterns/pulse-city.yml` + `STYLE.md` + `guidelines.html` + `components/`
**Goal:** Operationalize the brand — assemble tokens into YAML consumable by the Next.js app + the future `packages/pulse-player` UMD widget. Render a public guidelines page.
