# Brand Brief

## Brand
- **Name:** pulse.city
- **Date:** 2026-04-15

## Company
- **Company name:** pulse.city (deega labs)
- **Industry:** Live-coded music / generative audio / ambient infrastructure
- **Founded:** 2026
- **Size:** solo + collaborators
- **Stage:** mvp (POC shipping for Ipê Village 2026)
- **Existing brand?** yes — tokens, fonts, and aesthetic already live in `src/app/globals.css`

## Brand Mode
- **Mode:** evolve
- **Reason:** Visual identity already exists (dark terminal palette + Chakra Petch/DM Sans/JetBrains Mono). Codebase shipped with a voice; we're formalizing it into a real system, not starting over.

### Existing Brand State
- **Current brand age:** <1 year, organic
- **Existing guidelines?** no — tokens live in code only (globals.css `@theme inline` block)
- **Brand equity:** the tagline "the city is playing" already resonates; the lime/sky/violet-on-dark palette is distinctive vs. competitors; JetBrains Mono + Chakra Petch pairing feels correct for live-code aesthetic
- **Pain points:** no documented voice, no iconography beyond type, no guidance on when to use which accent, no rules for surface differentiation (studio vs. radio vs. embed), no logomark

### Evolution Scope
- **Preserve:**
  - Tagline: "the city is playing"
  - Dark base (#0a0e17) and surface ramp (#111827 / #1e293b)
  - Type pairing: Chakra Petch (heading) / DM Sans (body) / JetBrains Mono (code)
  - Overall terminal-dark aesthetic
- **Evolve:**
  - Accent palette (lime/sky/violet) — keep the trio but define semantic roles (lime=live/creator, sky=listener, violet=agent/autopilot)
  - Typography scale and usage rules
  - Motion and pulse language (the ambient dot animation in globals.css is the seed)
- **Replace:**
  - Missing logomark — none exists yet
  - Missing voice documentation — infer from codebase, formalize
  - Missing iconography system

## Business
- **Problem:** Places that want a living soundtrack are stuck choosing between static playlists (Spotify), opaque generators (Suno, Endel), or gatekept live-coding tools (TidalCycles, Sonic Pi). Nothing is both *alive* and *open*.
- **Solution:** A living soundtrack primitive — Strudel under the hood, AI copilot on top, four surfaces (studio / share / embed / radio) sharing one player. Humans and agents both compose. Code stays visible. Runs 24/7.
- **Business model:** free & open collective, AGPL-3.0-or-later. No monetization for the POC. Attribution-first (per-user API keys for MCP) preserves the option of a future creator marketplace.
- **Defensibility:** open-source depth (four surfaces from one primitive), the Ipê Village moment (real venue, real listeners, real stakes), MCP agent interface (no other live-code environment has this).

## Personas

### Primary: Lia Moreira
- **Role:** Multidisciplinary creator / resident at Ipê Village 2026 (codes, designs, organizes)
- **Age range:** 28–34
- **Day-in-the-life:** Morning standup in a shared kitchen, afternoon workshop on a projector, evening co-working with headphones. Lives in Figma, VS Code, and a Telegram group. Chooses tools by vibe as much as by feature set.
- **Frustration:** Spotify playlists don't match the moment. TidalCycles is too technical to pick up casually. Suno feels like a slot machine — no authorship, no visible craft.
- **Aspiration:** Leave pulse.city running on a projector in the communal kitchen and watch strangers remix it. Feel like the place has a pulse of its own.
- **Discovery:** Twitter/X, Are.na, friends dropping links in group chats, demoscene and Lainchan-adjacent corners of the internet
- **Trust signals:** Open source, visible code, understated voice, a real credit list, a real venue. Distrusts: marketing speak, "AI-powered" slapped on things, dark patterns, pricing pages that hide the product.

### Secondary: Creator / Listener / Agent / Host (all four surfaces)
pulse.city is explicitly multi-audience (see [docs/specs/use-cases.md](../../../docs/specs/use-cases.md)). The persona gravity is Lia, but the brand must legibly speak to:
- **Creator** (logged-in humans composing via /studio)
- **Listener** (non-logged humans on /p/[id], /radio, or embedded widgets)
- **Agent** (external AI via MCP — composes, evolves, plays)
- **Host** (partner sites dropping a `<pulse-widget>` on their page)

## Brand Essence

### Emotional Compass
- **brand_heartbeat:** *the place is awake, and it remembers you were here.*

### Promise
- **Core promise:** when someone interacts with pulse.city, they should feel that the space they're in is *alive and listening*
- **Functional promise:** a living soundtrack that runs itself, that anyone can shape, that stays visible and remixable
- **Emotional promise:** belonging without obligation — contribute if you want, just listen if you don't, the pulse doesn't stop either way

### Point of View
- **Category disagreement:** generative music shouldn't be a black box. if a human can't read it, fork it, or walk away and come back to find it still running, it's not alive — it's just a product.
- **Underestimated truth:** ambient listening and live coding are the same activity at different tempos. the radio *is* the studio, paused.
- **Manifesto line:** the city is playing. step in, shape it, step out — it keeps going.

### Personality
- **Personality:** living · open · collective
- **Personality reference:** SomaFM's curatorial warmth meets TidalCycles' technical legibility meets Are.na's quiet infrastructure vibe
- **Not us:** corporate, try-hard
- **Never be:** hype-driven, black-boxed, gatekept, ephemeral, "AI-branded"
- **Tone:** present tense, lowercase-friendly, understated. describes what's happening rather than marketing it. never exclaims. technical without gatekeeping.

### Voice per surface (secondary flavors)
- **/studio** — cypherpunk · luminous · precise. Code-forward, JetBrains Mono, lime-on-dark. Reads like a terminal greeting.
- **/radio, /p, /embed** — ambient · warm · patient. Slower cadence, softer contrast, violet-leaning, listener-first.
- **Marketing surfaces (/, landing, docs)** — living · open · collective. The core compass.

## Competitive Landscape
- **Direct competitors:** IPÊ.FM (sibling project, closest reference — same venue, different approach: PWA radio + AI DJ vs. full studio + autopilot)
- **Adjacent reference points:** Strudel / TidalCycles / Sonic Pi (technical lineage), SomaFM / Radio Garden (listener experience), Suno / Udio (AI-native framing, but opposite philosophy: pulse.city is code-visible), Endel / Brain.fm (ambient-for-place framing)
- **What sets you apart?**
  - Four surfaces sharing one primitive (studio / share / embed / radio)
  - Code stays visible — every pattern is forkable, auditable, real
  - MCP-native — agents are first-class composers, not gimmicks
  - Real venue context (Ipê Village 2026) — not a demo
- **Brands admired:** SomaFM, Are.na, Obsidian, TidalCycles, Lainchan radios, Sonic Pi docs

## Visual Direction
- **Mood / aesthetic:** terminal-dark · luminous · ambient · slightly-cyberpunk-but-warm. live-coding aesthetic without the hostility. a projector in a dark kitchen at 2am. a waveform pulsing on a wall. a command prompt that feels like a campfire.
- **Reference links:** Lainchan radio, SomaFM.com, TidalCycles website, Strudel REPL, demoscene capture pages, Ipê Village creative comms
- **Texture / atmosphere:** subtle grain on deep blacks, glowing lime/sky accents, mono type at rest, geometric heading type, inline canvas visuals (punchcard + scope) from Strudel draw
- **Anti-patterns:** never stock photos, never gradient SaaS hero blobs, never pastel friendliness, never "Bold · Innovative · Dynamic" startup voice, never dark-mode-as-afterthought (dark is the *only* mode), never a launch countdown

## Inspiration
- **Styles liked:** terminal aesthetics, demoscene posters, SomaFM album art, Are.na-style restraint, generative art books (Bruno Munari, Karsten Schmidt), TidalCycles visualization
- **Styles to avoid:** "AI startup" dashboards, Y Combinator hero gradients, Spotify Wrapped confetti, Apple Music glass morphism
- **Existing assets:**
  - Tokens in `src/app/globals.css` (`@theme inline` block — lime/sky/violet/dark)
  - Fonts via Google Fonts `<link>` in `src/app/layout.tsx` (Chakra Petch / DM Sans / JetBrains Mono)
  - Metadata: title "pulse.city — the city is playing", description "A living soundtrack for Ipê Village 2026. Open. Autonomous. Collective."
  - Theme color: #0a0e17 (viewport meta)
  - CSS animations: `pulse-dot`, `evolve-glow`
  - 11 React components using the existing look (editor, transport, chat, header, patterns modal, spectrum visualizer)

## Constraints
- **Timeline:** Ipê Village 2026 (primary launch moment, date TBD)
- **Budget:** zero — open-source, deega labs self-funded
- **Must-haves:**
  - Works on the four planned surfaces (/studio, /p/[id], /embed/[id], /radio/[name])
  - Legible on projectors and phones
  - Accessible without JavaScript? — no, full client-side (Strudel requires browser audio)
  - AGPL-compatible (no proprietary fonts that can't be self-hosted)
- **Non-negotiables:**
  - Dark is the only mode
  - Code must remain visible on share / embed pages (the whole point)
  - Never remove "the city is playing" tagline
  - Never add hype language to the product surface

## Goals
- **Business goal:** ship a production-ready living soundtrack for Ipê Village 2026 and seed the agent-composed audio pattern
- **Brand goal:** make pulse.city legibly *one thing* across four surfaces, so a listener hitting /p/[id] and a creator hitting /studio feel the same hand
- **Success metrics:**
  - Lia (or someone like her) leaves it running on a projector for an evening
  - An external agent composes and plays a pattern via MCP
  - A third-party site embeds the widget without asking us for help
  - The brand guidelines file is used by a human or an agent to build a new surface

## Deliverables
- [ ] Discovery & research
- [ ] Brand strategy & voice
- [ ] Visual identity
- [ ] Design system (pattern tokens, component specs, guidelines.html)

## Notes
- Sibling project IPÊ.FM (`radio-ipe/`) is the closest real reference — same team, same venue, different approach. Coordinate, don't compete.
- Monorepo plan (see [docs/specs/use-cases.md](../../../docs/specs/use-cases.md)): `packages/pulse-player` + `packages/pulse-mcp` + `apps/web`. The design system must produce tokens consumable by both the Next.js app and a standalone UMD widget.
- Architectural decisions already resolved: radio wall-clock sync, per-user MCP API keys, unified floating embed widget, player as internal monorepo package. See use-cases.md §Decisions.
