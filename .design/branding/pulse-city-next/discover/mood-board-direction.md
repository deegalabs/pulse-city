# Mood Board Direction
> Phase: discover | Brand: pulse-city-next | Generated: 2026-04-15

---

Actionable spec grounded in the audit's preserve list. Starts from what already ships in `globals.css` and proposes only what the audit flagged as `EVOLVE` or `REPLACE`.

## Color direction

**Preserved base (non-negotiable, already shipping).**
- `--color-bg` **#0a0e17** — page, theme-color, projector-at-10-feet legibility
- `--color-surface` **#111827** — pill / gutter tier
- `--color-surface-2` **#1e293b** — hover / elevated tier
- `--color-text` **#e2e8f0** / `--color-text-dim` **#64748b**
- `--color-border` **rgba(255,255,255,0.08)**
- `--color-red` **#ef4444** — destructive only

**Evolved accent trio (semantic roles per audit).**
- **creator / live / now** — `--color-creator` **#a2d729** (existing lime, preserved hex). Loud on /studio. Softened or absent on /radio.
- **listener / shared / persistent** — `--color-listener` **#3aa5ff** (existing sky, preserved hex). Dominant on /p/[id], /embed, /radio.
- **agent / autopilot / MCP** — `--color-agent` **#8a66ff** *(warmed candidate, up from existing #6b46ff)*. The rationale: the audit's instruction is "higher luminance + slight magenta pull" so the autopilot does not read as a cool-blue machine. `#8a66ff` lifts luminance ~10% and nudges hue from 252° toward 258°, which is enough to feel like a warm violet rather than a corporate-blue-purple, without losing trio coherence with the existing sky.

**Supporting additions (new, minimal).**
- `--color-surface-3` **#2a3347** — one additional step above `#1e293b` for /radio's softer, slower chrome. Optional on /studio.
- `--color-signal-warn` **#f2b84a** — a single warm amber for *change-of-state* moments (a pattern just mutated, an agent just took over). Used **once per screen**, never decoratively. This is a direct steal from the "nothing"-style "red signal accent" pattern — one color that means "look."

**Anti-rules.** No gradients in UI chrome. No pastel tint layers. Never brighten the page background above `#0a0e17` on any surface. Never introduce a second neutral family (stay on slate-blue neutrals, avoid warm grays).

## Typography direction

**Preserved.**
- **JetBrains Mono** — CodeMirror editor, inline code, any numeric data display. The single most load-bearing type decision in the system and the anti-Suno signal per audit. Must self-host via `next/font` (the audit flagged Google Fonts `<link>` as a posture issue).
- **DM Sans** — body copy (currently underused; activate for /radio and marketing prose).
- **Chakra Petch** — preserved *but constrained to display/mark usage only.* Wordmark, hero headline, station-ident text. **Stop using it at 0.55rem micro-labels** — the audit called this the single biggest disconnect.

**Proposed for the micro-label role** (the gap the audit flagged).

- **Space Mono** for the tracked-widest uppercase micro-labels (`PLAYING`, `MANUAL`, `AUTOPILOT`, `SAVE`, `OUT`). Rationale: it's a *softer* monospace than JetBrains Mono, with slightly rounded terminals that read warm at 0.55rem — the "campfire terminal" posture the compass is asking for. It also appears as the default display type in the `nothing` preset (which the audit's anti-wellness posture rhymes with), so the affinity is validated.
- Alternative fallback: **IBM Plex Mono** if Space Mono feels too decorative at small sizes. Both are AGPL-compatible and self-hostable.

**Scale (replace the ad-hoc `text-[0.55rem]` mess with 6 named steps).**
| Role | Size | Family | Case |
|------|------|--------|------|
| `display` | 2.5–4rem | Chakra Petch 700 | as-set |
| `heading` | 1.25–1.75rem | Chakra Petch 600 or DM Sans 600 | as-set |
| `body` | 1rem / 0.9rem | DM Sans 400 | sentence |
| `micro` | 0.6875rem (11px), tracking-wider | Space Mono 400 | UPPER |
| `mono` | 0.75rem | JetBrains Mono 400 | as-set |
| `code` | 0.875rem (editor) | JetBrains Mono 400 | as-set |

The micro step moves from `0.55rem` to `0.6875rem` (11px). 0.55rem / ~8.8px was illegible at Lia's laptop distance and hostile at projector distance — the audit's "biggest disconnect" line is really a legibility complaint.

## Imagery direction

**The product draws its own imagery.** pulse.city ships with `@strudel/draw`; every pattern can emit a punchcard, a scope, or a pitch-wheel. That output is the imagery system. **Zero stock photos, zero illustration, zero SaaS gradient blobs** — per brief and per audit.

**Three imagery primitives.**
1. **Punchcard** — Strudel's pattern visualization as a grain-textured horizontal strip. Used as OG images, hero backdrops, share-card artwork. Every `/p/[id]` share image is the punchcard for that pattern.
2. **Oscilloscope / waveform** — live audio visualization (already present in `spectrum-analyzer.tsx`). Used as /radio surface chrome, wall-mode display, embed widget idle state.
3. **Dithered texture** — a subtle 1-bit or 2-bit dither overlay (2–4% opacity) on dark surfaces to break up flat `#0a0e17` and give the "grain on deep blacks" the brief asked for. Mac Classic / demoscene lineage.

**Anti-stock rules (explicit).**
- Never a human face. Never a hand. Never a device mockup (Endel/Suno move; forbidden).
- Never a generic "soundwave illustration" — only *actual audio output* from the player.
- Never a photo of Florianópolis, Ipê Village, or the venue. The imagery is the *sound*, not the *place*.
- Never a synthesized "AI orb" — the `--color-agent` violet appears as chrome, not as a character.

**Reference brand doing something similar.** **Strudel itself** uses its spiral and pattern-highlight visualizer as de-facto imagery on strudel.cc. **Winamp skins and demoscene capture sites** (Pouet) have decades of "the output *is* the poster" precedent. Closer to 2026: **fxhash**'s minting UI treats the generated canvas as the product photo, not as a secondary asset — same move, different medium.

## Motion direction

Two motion shapes, each with one job. Do not add a third.

- **pulse-dot** (preserved, existing `globals.css` keyframe) — *steady-alive.* A 1.5s ease-in-out opacity pulse on anything that represents "the player is still running": PLAYING pill, /radio station dot, /embed idle glyph, MCP-connected badge. Lia's brand heartbeat.
- **evolve-glow** (rebuild per audit) — *something just changed.* A one-shot motion that fires once on pattern mutation / autopilot handoff / agent edit. Proposed shape: a 600ms warm-amber glow expanding outward from the point of change with a brief `--color-signal-warn` border flash and a subtle blur-to-sharp transition on the affected CodeMirror range. Unlike pulse-dot, it does not loop; unlike a toast, it does not have a label. It is a visible heartbeat skip.

No other motion. No parallax, no scroll-jacking, no cinematic blob drift (Linear/Vercel move, not ours), no spring bouncing. Motion is **percussive** — it either pulses or it fires once.

## Overall feel

**the place is awake, and it remembers you were here.** Terminal-dark with campfire warmth — the palette is `#0a0e17` plus a warmed violet, the imagery is the product's own punchcard output under a 2% dither, and the type pairs Chakra Petch for the mark, JetBrains Mono for the code, and Space Mono for the soft tracked-widest labels that used to shout. Motion is two heartbeats: one that proves the room is still playing, one that marks the moment something changed. A listener who opens /p/[id] at 2am on a phone and a creator who opens /studio on a projector at the shared kitchen see the same hand — dark, quiet, present tense, awake.

---

### Style Affinity

Three presets validated against the research. Be honest: none is a perfect fit, because pulse.city's compass asks for a specific warmth that none of the presets alone supplies. The recommendation is **`terminal` as the skeleton, `nothing` as the discipline, `minimal-dark` as the warmth.**

1. **`terminal`** — tag match: *developer · monospace · dark · minimal · technical* — rationale: This is the skeleton Lia's world already runs on. JetBrains Mono primary, near-black canvas, status-code badges (`[OK]`, `[ERR]`, `[LIVE]`), bracketed buttons, ASCII dividers, `>` prompt prefixes. Use as the base grammar for /studio and for all editor-adjacent chrome. **Caveat:** the preset's mandatory CRT scanline and phosphor glow should be *refused* — the 2026 move per trend analysis is restrained cypherpunk, not maximal cypherpunk.
2. **`nothing`** — tag match: *monochrome · industrial · dark · minimal · technical · instrument · mechanical* — rationale: Provides the discipline the audit is asking for — "one moment of deliberate pattern-break per screen," "data as beauty," Space Mono ALL CAPS at wide letter-spacing, red/amber as *signal* not decoration, zero shadows, zero gradients. This is the posture the audit's "promotion not renovation" demand maps onto almost exactly. Use its constraint list (never shadows, never gradients, max 2 font families per screen, max 3 sizes per screen) as pulse.city's enforcement rules.
3. **`minimal-dark`** — tag match: *minimal · dark · atmospheric · layered* — rationale: The only preset that explicitly layers three dark tones and treats darkspace as breathing room, which is what the /radio and /p/[id] surfaces need in order to feel like "campfire" rather than "debugger." Borrow the three-layer ramp pattern (`deep → base → elevated`) and the "ambient darkspace as breathing room" principle. **Caveat:** refuse its amber-only single-accent rule — pulse.city needs the semantic creator/listener/agent trio, not one amber. Borrow structure, not palette.

**Explicitly rejected:**
- **`cyberpunk`** — too loud. Orbitron headlines, neon glows, chromatic aberration, clip-path chamfers, cold-only palette. Lia would bounce. The compass asks for warmth; this preset forbids warm color temperatures by rule.
- **`modern-dark`** — the Linear / Vercel move. Ambient blobs, mouse-tracking spotlights, gradient text, cinematic 8-second blob drifts. This is the SaaS aesthetic pulse.city is positioned against.
- **`web3`** — adjacent to the pop-up city community but too coded to crypto branding; the compass is community, not speculation.

---

## Related
- [market-landscape.md](./market-landscape.md)
- [competitive-audit.md](./competitive-audit.md)
- [trend-analysis.md](./trend-analysis.md)
