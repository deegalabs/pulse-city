# Evolution Map
> Phase: audit | Brand: pulse-city-next | Generated: 2026-04-15

---

## Element-by-element decisions

| Element | Current state | Decision | Rationale |
|---------|--------------|----------|-----------|
| Tagline "the city is playing" | metadata title only | **PRESERVE** | It's the five-word articulation of the compass and the one line Lia would screenshot — non-negotiable per BRIEF.md. |
| Product name casing | mixed: `pulse.city` (meta), `PULSE·CITY` (wordmark), `pulse-city-next` (config) | **EVOLVE** | Canonicalize `pulse.city` for prose and `PULSE·CITY` for display mark; forbid `pulse-city`. Lia copy-pastes the URL into a group chat — the dot has to survive that trip. |
| Dark base `#0a0e17` | page bg, theme-color | **PRESERVE** | Load-bearing for CodeMirror legibility and the "projector in a dark kitchen" mood; replacing it would break the anti-Endel positioning. |
| Surface ramp `#111827` / `#1e293b` | pills, hovers | **PRESERVE** | Works. Consider adding one more step for /radio's softer feel, but don't touch what ships. |
| Lime `#a2d729` | wordmark, caret, PLAYING, MANUAL | **EVOLVE** | Promote to explicit semantic: *creator / live / now*. On /studio it stays loud; on /radio it softens or disappears. Gives Lia a color that means "this is you writing." |
| Sky `#3aa5ff` | middot, SAVE/LOAD hover | **EVOLVE** | Promote to *listener / shared / persistent*. Should dominate /p/[id] and /embed — the surfaces built for people who just want to hear, which is most of Ipê Village's passers-by. |
| Violet `#6b46ff` | AUTOPILOT toggle | **EVOLVE** | Promote to *agent / autopilot / MCP*. Currently reads cool-and-machine-generated, which fits the agent role but fights the compass' warmth — must be warmed (higher luminance / slight magenta pull) so the autopilot doesn't feel like Suno-in-disguise. |
| Red `#ef4444` | OUT hover | **PRESERVE** | Semantic destructive only. Standard and non-negotiable for accessibility. |
| Text ramp `#e2e8f0` / `#64748b` | body / dim | **PRESERVE** | Contrast-safe on `#0a0e17`, no change needed. |
| Border `rgba(255,255,255,0.08)` | all separators | **PRESERVE** | The subtle glass-line that does a lot of work for the terminal-warm feel. |
| Chakra Petch (heading) | wordmark + all micro-labels | **EVOLVE** | Preserve per brief, but constrain to display/mark-only usage. Stop using it as a utility label font — the industrial weight at 0.55rem is the single biggest disconnect from "remembers you were here." Replace in micro-labels with a mono or a softer grotesk. |
| DM Sans (body) | body fallback | **EVOLVE** | Keep, but actually *use* it — today almost no body copy exists. The /radio and marketing surfaces will need a real body voice; DM Sans is fine for that role. |
| JetBrains Mono (code) | CodeMirror | **PRESERVE** | The anti-Suno signal. The one font in the system that is genuinely load-bearing and must not move. |
| Typography scale | ad-hoc `text-[0.55rem]` / `0.58rem` / `0.5rem` | **REPLACE** | No documented scale exists — rewrite as a proper 5–7 step scale with named roles (display / heading / body / micro / mono). Lia will need this the moment she builds the fourth component on a new surface. |
| Uppercase tracked-widest micro-label voice | universal | **EVOLVE** | Ration by surface: keep loud on /studio (it *is* the terminal greeting), soften on /p and /radio (listener should not be shouted at), mix on marketing. Surface-aware voice is the single biggest thing missing. |
| `pulse-dot` animation | PLAYING indicator | **PRESERVE** | The name, the idea, and the 1.5s cadence all match the compass heartbeat. Keep. |
| `evolve-glow` animation | defined, unwired | **EVOLVE** | Rebuild as a *different kind* of motion (not another opacity pulse) — something that reads as "something changed" vs. pulse-dot's "still alive." Agent/autopilot mutation moments should be visually distinct from steady playback. |
| Logomark | **does not exist** | **REPLACE** (create) | Listeners on /p, hosts embedding `<pulse-widget>`, and the projector-at-10-feet test all require a mark that is not a text string. Lia needs something she can put on a flyer in 48 hours. |
| Iconography system | **does not exist** | **REPLACE** (create) | Needed for transport, mode, surfaces, chat. Keep minimal, stroke-based, aligned with JetBrains Mono's weight so it lives next to code without visual fighting. |
| Imagery / illustration direction | **does not exist** | **REPLACE** (create) | Brief forbids stock and gradients. Propose: generative scope visuals (Strudel's own `draw` output) + subtle dithered texture. The product *makes its own imagery* — lean into that. |
| Surface-level voice differentiation (/studio vs /radio vs marketing) | **does not exist** | **REPLACE** (create) | The brief explicitly names three voice flavors; the product has one. This is the single largest gap between aspiration and code. |
| Voice / tone documentation | **does not exist** | **REPLACE** (create) | Voice currently lives only in string literals inside components. Extract into a real doc so an agent (or a future collaborator) can write new surfaces in the same hand. |
| Favicon / app icon / OG image | **does not exist** | **REPLACE** (create) | Basic hygiene; blocks shareability (currently `/p/[id]` links unfurl without an image). |
| Font self-hosting | Google Fonts `<link>` | **EVOLVE** | BRIEF.md lists self-hostable as a must-have; move to `next/font` local loading. Matches the "runs itself, no surprise dependency" posture Lia scans for. |

## Summary

**PRESERVE: ~35% · EVOLVE: ~40% · REPLACE: ~25%**

The short version: keep the bones (dark base, mono code, the tagline, the seed colors) and throw out almost nothing — but add the half of the brand that does not yet exist on disk. Today pulse.city is a coherent *studio look* with a compass written next to it; the evolution's job is to make the compass visible on surfaces that do not exist yet (/radio, /p, /embed) and to give the three accent colors, the two motion primitives, and the voice pattern explicit roles so a second contributor — human or agent — can build a new surface without guessing.

Said another way: nothing in the current system is wrong, but most of it is unfinished. The audit is not a renovation — it's a promotion.

---

## Related
- [brand-inventory.md](./brand-inventory.md)
- [coherence-assessment.md](./coherence-assessment.md)
- [market-fit.md](./market-fit.md)
- [equity-analysis.md](./equity-analysis.md)
