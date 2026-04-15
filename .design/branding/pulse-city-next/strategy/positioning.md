# Positioning
> Phase: strategy | Brand: pulse-city-next | Generated: 2026-04-15

---

## Positioning statement

> **pulse.city is the living soundtrack primitive for places that want their music as readable as their code — one URL scheme where the studio is the radio, paused, and any hand (human or agent) can pick it back up.**

Substitution test: Suno cannot say "as readable as their code" (its code is sealed). Endel cannot say "any hand can pick it back up" (its model is private). Strudel cannot say "the studio is the radio" (it has no radio surface). IPÊ.FM cannot say "one URL scheme" or "studio" (it is radio-only, by design). The sentence is false for every neighbor.

## Category creation claim

**Living soundtrack primitive.** Not a DAW, not a radio, not a generator — a single pattern object with four surfaces (/studio, /radio, /p, /embed) that any human or agent can compose on and any listener can walk into mid-play.

## Target audience line

- **For:** Lia Moreira — the 28–34 multidisciplinary creator at a pop-up city or co-living month who trusts a tool she can read, and who wants to leave a projector running in the kitchen and have strangers remix what's on it.
- **Not for:** anyone who wants a slot machine. If the visible code is a bug to you, you are not the user.

## Frame of reference (the 2x2, reprinted)

**Axes:** X = Black box → Visible craft · Y = One listener → Shared room

```
                       SHARED ROOM
                            |
              SomaFM        |        IPÊ.FM
          Radio Garden      |      [pulse.city]
                            |    visible craft at
                            |     ambient tempo
   BLACK BOX ----------------+---------------- VISIBLE CRAFT
              Suno           |    Strudel
              Udio           |    TidalCycles
              Endel          |    Sonic Pi
              Brain.fm       |
           LoFi Girl         |
                            |
                       ONE LISTENER
```

pulse.city stands in the **top-right quadrant** — visible craft at shared-room volume — and is, today, the only project in that quadrant that spans four surfaces from a single primitive. IPÊ.FM, the sibling, occupies the same quadrant but is radio-only; it is an ally, not a competitor. No black-box product can cross the X axis without rebuilding itself; no solo live-code tool can cross the Y axis without adding a listener surface. The corner is structurally defensible.

### Whitespace phrases pulse.city owns in this corner

1. "the studio is the radio, paused"
2. "visible craft at ambient tempo"
3. "shared soundtrack for a pop-up room"

## Points of parity (what we share with the live-code lineage)

| Dimension | Inherited from |
|---|---|
| Browser-native, no install | Strudel, Sonic Pi |
| Patterns as source-readable code | TidalCycles, Strudel |
| CodeMirror REPL + inline visuals (punchcard, scope) | Strudel |
| AGPL / open-source family posture | TidalCycles, Strudel |
| JetBrains Mono as the "this is real code" signal | the live-code scene generally |

## Points of difference (what nothing else has)

| Difference | Why it is ours alone |
|---|---|
| **One primitive, four surfaces** — /studio /radio /p /embed share one pattern object | Strudel has /studio only; SomaFM has /radio only; no one ships the set |
| **MCP-native agents as first-class composers** | No live-code environment exposes an agent interface; no AI-music product exposes its patterns |
| **Code-visible AI** — when an agent writes, Lia reads the diff | Suno, Udio, Endel, Brain.fm are all black boxes by design |
| **Wall-clock radio sync** — /radio is the same song for everyone in the room, not a personalized stream | Endel and Brain.fm are personalized-by-construction |
| **Free, open, AGPL-3.0-or-later, no pricing page** | Suno/Udio/Endel are subscription; Strudel has no venue layer |
| **Venue-anchored** (Ipê Village 2026) | A real kitchen, a real projector, a real month — not a demo reel |

## Reason to believe

Three proofs Lia can verify in 60 seconds, from a laptop:

1. **The repo is public.** Clone it, read the pattern, fork it. AGPL-3.0-or-later, no CLA, no gated packages.
2. **The MCP keys are per-user.** `pc_` prefix, GitHub-PAT style, issued to the composer. Attribution stays attached to the hand that wrote the pattern — not to pulse.city, not to the model vendor.
3. **The tagline is in the metadata.** `<title>pulse.city — the city is playing</title>` is already in `layout.tsx`. The compass is not marketing varnish; it is the first string the product speaks.

---

## Related
- [archetype.md](./archetype.md)
- [brand-platform.md](./brand-platform.md)
- [messaging.md](./messaging.md)
