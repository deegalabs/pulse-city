# Brand State

## Brand: pulse.city
**Started:** 2026-04-15
**Mode:** evolve
**Current Phase:** complete (all 4 phases done)
**Prettiness Level:** 100%

---

## Phase Progress

| # | Phase | Status | Started | Completed |
|---|-------|--------|---------|-----------|
| 0 | Audit | complete | 2026-04-15 | 2026-04-15 |
| 1 | Discover | complete | 2026-04-15 | 2026-04-15 |
| 2 | Strategy | complete | 2026-04-15 | 2026-04-15 |
| 3 | Identity | complete | 2026-04-15 | 2026-04-15 |
| 4 | Patterns | complete | 2026-04-15 | 2026-04-15 |

## Status Values
<!-- pending | in-progress | complete | needs-revision | skipped -->

## Decisions
- **Brand mode:** evolve (existing tokens in `src/app/globals.css`, not a clean slate)
- **Core compass:** Living · Open · Collective — "the place is awake, and it remembers you were here"
- **Surface voice split:** /studio = cypherpunk precise · /radio, /p, /embed = ambient warm · marketing = core compass
- **Primary persona:** Lia Moreira (multidisciplinary creator at Ipê Village 2026)
- **Business model:** free & open collective, AGPL-3.0-or-later
- **Closest reference:** IPÊ.FM (sibling project), not Strudel or Suno
- **Audit split:** PRESERVE 35% · EVOLVE 40% · REPLACE 25% — "not a renovation, a promotion"
- **Semantic color roles:** lime = creator/live · sky = listener · violet (warmed) = agent/autopilot
- **Violet warming:** confirmed — agent surface must feel like another hand in the room, not an alien process
- **Whitespace claim:** (1) "the studio is the radio, paused" (2) "visible craft at ambient tempo" (3) "shared soundtrack for a pop-up room" — no other competitor stands at this intersection; sibling IPÊ.FM is the only other resident of the top-right visible-craft + shared-room quadrant
- **Style affinity:** primary `terminal` (skeleton) · discipline `nothing` · warmth `minimal-dark` — rejected `cyberpunk` / `modern-dark` / `web3` as positioning-opposed
- **Archetype:** Creator × Sage — Creator carries craft, Sage keeps it honest and legible; MCP agents are *collaborators* (Sage), not *magic* (Magician)
- **Positioning (bold):** "pulse.city is the living soundtrack primitive for places that want their music as readable as their code — one URL scheme where the studio is the radio, paused, and any hand (human or agent) can pick it back up."
- **Voice:** Present · Legible · Understated — lowercase-friendly, present tense, never exclaims, describes what's happening
- **Message pillars:** (1) one primitive, two tempos · (2) readable is alive · (3) shared, not personalized
- **Style base:** `terminal` — structural skeleton; Identity borrowed discipline from `nothing` and warmth from `minimal-dark`
- **Dark-only declaration:** locked in color-system.md — no light theme, no toggle, no fallback. The compass is a 2am sentence.
- **Warmed agent violet:** committed at `#8a66ff` — furthest warm before it competes with signal amber
- **Logomark committed:** 3-row × 7-column punchcard, center dot at column 4 in listener sky, ASCII fallback `[...o...]` as first-class deliverable
- **Type scale committed:** 1.25 Major Third ratio, six named roles (`display`/`heading`/`body`/`code`/`mono`/`micro`), `next/font/local` self-hosted, FOUT via `display: swap`
- **Icon library:** Lucide (1.5px stroke on 24px canvas, outline only, no filled variants)
- **WCAG:** all trio colors AA+ on `#0a0e17`; `text-dim` `#64748b` is AA Large only — hard floor at 14px for that role
- **Motion vocabulary:** exactly two shapes — `pulse-dot` (1.5s loop) + `evolve-glow` (600ms one-shot). No third.

## Notes
- Brief written 2026-04-15 via `/gsp-brand-brief`.
- User answered "all" on several questions — interpreted as *trust the recommendation and blend where it fits*, not *all options literally apply*.
- Existing visual tokens in globals.css should be audited for coherence, then formalized into `patterns/pulse-city.yml`.
