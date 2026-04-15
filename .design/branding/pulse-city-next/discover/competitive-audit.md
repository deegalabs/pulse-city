# Competitive Audit
> Phase: discover | Brand: pulse-city-next | Generated: 2026-04-15

---

## Competitor table

| Name | Positioning | Strengths | Weaknesses | Visual language |
|------|-------------|-----------|------------|-----------------|
| **IPÊ.FM** (sibling, `radio-ipe/`) | "A live-coded radio for a pop-up city" — PWA radio + AI DJ with BYOM (Groq/Anthropic/Ollama) keys, audio-reactive LED pixel canvas, stadium light-show mode | Same venue, same Strudel core, shipping; pocket-sized (phone-first); BYOM key pattern; real "the radio is the pocket" posture | Single-purpose (radio only, no studio); no logomark system beyond `[ INITIATE ]` bracket text; no /share or /embed surfaces; not yet public at `ipe.fm` (ECONNREFUSED on fetch) | Dark CRT palette, pixelated canvas marquee (`image-rendering: pixelated`), bracket button text `[ INITIATE ]`, stadium-mode color slabs, strong cyberpunk boot-screen tone |
| **Strudel** | "Live coding music in the browser" — REPL-first, open-source port of TidalCycles, 15+ packages | Technical legitimacy; CodeMirror REPL with pattern-highlight visual feedback; spiral visualization; big package depth (`@strudel/core`, `draw`, `webaudio`…) | Reads as a toolchain, not a product; no listener surface; documentation-heavy; no distinct wordmark beyond `strudel` lowercase | Light-default website with dark-theme REPL, spiral visuals, mono code front-and-center; no real logomark; imagery is screen-captures of the REPL itself |
| **TidalCycles** | "Live coding music with Algorithmic patterns" — Haskell original, "Pattern everything" | Cultural root; "open source family" framing; circular geometric logo | Functional but dated web presence; light background + dark text reads as "research project"; minimal visual direction | Clean light-background layout, modernist circular logo, sans-serif headings, community photography and abstract algorithmic visuals |
| **Sonic Pi** | "Experience the sound of code" — powerful, expressive, accessible, simple | Accessibility-first (explicit "blind and partially sighted" homepage line); teaching posture; real-world venue photography | Dated interface screenshots; feels like an educational project, not a contemporary brand | Dark backgrounds with bright cyan/teal accents, minimalist music-note and code-symbol icons, product screenshots + performance photography |
| **SomaFM** | "Commercial-free, Listener-supported Radio" — 40+ curated stations since 2000 | Curatorial warmth; real donation language ("Can't afford to donate right now? We understand"); real-time listener counts; channel art as mood navigation | Legacy web shell; no single strong wordmark; reads as 2005 internet in 2026 | Neutral text-forward UI, channel logos as the only color, atmospheric per-station album art (nebulae, geometric fields); functional-over-flashy |
| **Radio Garden** | "Explore live radio by rotating the globe" | Single-gesture interface (rotate globe, tap dot); green station dots on a dark globe; Dutch Design Award-winning | Discovery-only — no composition, no community layer; the globe *is* the product | Dark 3D globe (Cesium WebGL), **Atlas Grotesk** typeface, green station dots, minimal chrome, "everything could be left out" philosophy |
| **Suno** | "AI Music Generator" — v5.5 (March 2026) adds Voices, Custom Models, My Taste; full DAW-style Studio | Metalab-designed; mainstream reach; DAW-ification of AI generation | Opaque generation model; "slot machine" feel per Lia; the code of a song is never visible | Polished contemporary SaaS: near-white backgrounds, purple/magenta accents, illustrated glyphs, Inter-family type, studio-style waveform chrome |
| **Udio** | "AI Music Generator" — revamped 2026 interface, three-tab Generate / Custom / Instrumental flow | Vocals-first, lyric-centric; faster workflow than Suno for song-shape output | Same opacity critique as Suno; less brand distinction than Suno | Clean light UI, rounded cards, Inter-family sans, brand accent in a cool blue/purple range, prompt-first hero |
| **Endel** | "Personalized soundscapes to help you focus, relax, and sleep. Backed by neuroscience." | Award polish; device-mockup imagery across iPhone/Watch/Mac; "generative visuals" positioning; brand trust in the wellness adjacency | Subscription wellness app tone; completely opposite philosophy from "open collective"; the generation is a black box | Blue/purple gradient atmospheres, generative flowing patterns, minimal sans headlines, device-mockup hero, motion treated as signature |
| **Brain.fm** | "Music made for Deep Work, Creativity, Learning, Motivation" | Mode-coded color system (purple sleep / blue relax / green meditate); brain-scan imagery as science trust signal | Data-viz-heavy chrome; reads as clinical tool, not a place | Clean sans-serif, aura-blur mode colors, lifestyle + brain-scan imagery, white/gray base |
| **pulse.city** (us) | "the city is playing" — living soundtrack primitive, four surfaces (studio / share / embed / radio), Strudel core, MCP agents, code visible | Lineage credibility; real venue; anti-Suno by construction; multi-surface architecture | <1yr old, no public recognition, zero brand equity, no logomark, no radio surface yet, studio-only on screen today | Terminal-dark (`#0a0e17`), Chakra Petch wordmark (`PULSE·CITY` with sky middot), lime/sky/violet accents, JetBrains Mono editor, uppercase tracked-widest micro-labels |

## 2×2 positioning map

**Axes:** X = **Black box ←→ Visible craft** · Y = **One listener at a time ←→ Shared room**

```
                       SHARED ROOM
                            |
              SomaFM        |        IPÊ.FM
          Radio Garden      |      (pulse.city)
                            |    TidalCycles · Sonic Pi
                            |         Strudel
   BLACK BOX ────────────────┼──────────────── VISIBLE CRAFT
              Suno           |
              Udio           |
              Endel          |
              Brain.fm       |
           (LoFi Girl)       |
                            |
                       ONE LISTENER
```

**Reading the map.**
- **Bottom-left** (black box + one listener) is crowded — Suno, Udio, Endel, Brain.fm, LoFi Girl's private headphones audience. This is the mass-market quadrant and the aesthetic pulse.city is deliberately walking away from.
- **Top-left** (black box + shared room) is nearly empty — ambient-as-infrastructure broadcast that is still opaque. A venue playing Endel on a speaker drifts here, uncomfortably.
- **Bottom-right** (visible craft + one listener) is the live-code lineage: Strudel, Sonic Pi, TidalCycles. You sit alone at a laptop and write patterns. Shared rooms happen at algoraves but the default surface is solo.
- **Top-right** (visible craft + shared room) is where **IPÊ.FM and pulse.city cluster** — and right now IPÊ.FM is the only shipped occupant. Radio Garden and SomaFM sit directly left of this corner (shared room, medium craft visibility). The top-right is the whitespace, and the only other resident is the sibling project that already coordinated the boundary.

## Whitespace pulse.city should own

- **"The studio is the radio, paused."** No competitor collapses composition and listening into one primitive. Strudel has the studio; SomaFM has the radio; nobody has both surfaces on one URL scheme. Owning this phrase means making /studio and /radio feel like two rooms in one building, not two products.
- **"Visible craft at ambient tempo."** Endel is the ambient-for-place incumbent and it is a black box. pulse.city can claim the specific posture of "ambient music you can read" — which nobody is currently selling because the live-code scene is positioned as performance, not as background.
- **"Shared soundtrack for a pop-up room."** The pop-up city / co-living / festival space has no default audio tool. Ipê Village is the beachhead. Edge City / PopOut Club / Cabin are the next rooms. This is infrastructure-shaped whitespace, not product-shaped whitespace, and pulse.city's four-surface architecture is the only one designed for it.

---

## Related
- [market-landscape.md](./market-landscape.md)
- [trend-analysis.md](./trend-analysis.md)
- [mood-board-direction.md](./mood-board-direction.md)
