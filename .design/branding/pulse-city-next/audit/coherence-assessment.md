# Coherence Assessment
> Phase: audit | Brand: pulse-city-next | Generated: 2026-04-15

---

## Scores

| Dimension | Score | One-line reasoning |
|-----------|:---:|--------------------|
| Strategy coherence | 3 / 5 | Compass + manifesto + personality are internally consistent, but the four-surface / four-persona ambition isn't yet reflected in a single strategic artifact — the brief is the first time they sit on the same page. |
| Strategy ↔ visual alignment | 2 / 5 | Terminal-dark + JetBrains Mono delivers "live-code legibility" but nothing in the current palette or type says "awake and remembering" — the warmth half of the compass is missing from the pixels. |
| Internal consistency | 4 / 5 | Across the 11 components the micro-label recipe (`font-heading text-[0.55rem] tracking-widest text-text-dim`) is repeated with near-zero drift. Tokens are applied cleanly; what's inconsistent is the *meaning* of each accent, not its usage. |

## Specific disconnects

- **The accent trio has no assigned meaning yet.** lime appears on the wordmark, the caret, the PLAYING dot, and the MANUAL toggle; sky only separates the middot and colors SAVE/LOAD hover; violet only lights up AUTOPILOT. The brief proposes lime=creator, sky=listener, violet=agent — in code these three colors currently mean "creator thing, accent thing, and robot thing" at best. A first-time reader cannot infer the system.

- **Chakra Petch is industrial; the compass is warm.** The heartbeat is "the place is awake, and it remembers you were here" — a sentence that belongs in a notebook. Chakra Petch at 600/700 reads closer to esports scoreboard than to a communal kitchen at 2am. It nails "precise" and "cypherpunk" for /studio but actively fights the /radio and marketing voice flavors described in the brief.

- **There is no logomark to carry the brand off-studio.** The only mark is the text string `PULSE·CITY` baked into `<h1>` inside header.tsx. Lia's aspiration — "leave it running on a projector and watch strangers remix it" — requires something that survives at 10px in a favicon, in a radio station tile, and in a `<pulse-widget>` collapsed state. The wordmark alone won't.

- **Voice is uniform where the brief says it shouldn't be.** The brief names three voice flavors (cypherpunk/luminous/precise for /studio, ambient/warm/patient for /radio, living/open/collective for marketing). The codebase has exactly one voice: terse uppercase micro-labels. A listener landing on `/p/[id]` today meets the same hostile button language as a creator — `OUT`, `SAVE AS` — with no softening.

- **The two motion primitives are both opacity pulses.** `pulse-dot` and `evolve-glow` are functionally the same animation at different durations. The compass promises two modes of aliveness (steady heartbeat vs. act-of-change) but the motion language can't currently tell them apart.

- **Fonts load from Google, not self-hosted.** The brief's constraints list includes "AGPL-compatible, no proprietary fonts that can't be self-hosted" — the current layout.tsx uses `<link href="https://fonts.googleapis.com/...">`. Technically fine for an AGPL project (the fonts are OFL), but it contradicts the "runs itself, open, no surprise dependency" posture Lia would scan for.

---

## Related
- [brand-inventory.md](./brand-inventory.md)
- [market-fit.md](./market-fit.md)
- [evolution-map.md](./evolution-map.md)
