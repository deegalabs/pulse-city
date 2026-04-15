# Imagery Style
> Phase: identity | Brand: pulse-city-next | Generated: 2026-04-15

---

The product draws its own imagery. pulse.city ships `@strudel/draw`; every pattern can emit a punchcard, a scope, and a pitch-wheel. That output is the entire imagery system. Everything else — stock, illustration, gradient blob, AI orb, device mockup — is forbidden by default and stays forbidden. This is the Creator archetype's single strongest expression: the work decorates itself.

## The three imagery primitives

### 1. Punchcard — the hero primitive

**What it is.** Strudel's pattern visualization rendered as a grain-textured horizontal strip. Every beat, every note, every rest is visible on a single row. It is simultaneously (a) the punchcard the live-code lineage inherits from the Jacquard loom and (b) the readout a terminal operator would expect from a running process.

**The rule:** every `/p/[id]` share image *is* the punchcard for that pattern. No exceptions. If a share card exists, it is a punchcard render. The pattern title in Chakra Petch and the wordmark sit on top; the punchcard is the backdrop. This is not decoration — this is the page making its own portrait.

**Where it lives:**
- **OG images** for every `/p/[id]`. Generated at pattern save time, cached, served.
- **Marketing hero** on `/`. A canonical "signature pattern" punchcard fills the hero slot. When the signature pattern evolves, the hero evolves with it — the landing page breathes.
- **Inside the /studio editor.** The punchcard appears as an inline visual below the CodeMirror range, updating as the pattern runs. This is where it was born; it still lives there.
- **/radio chrome.** The currently-playing pattern's punchcard is the ambient texture strip at the top of the station page.

**Color behavior.** The punchcard renders on `base`, with the active cells in the accent that matches authorship role — `creator` lime for human-authored, `listener` sky for room-curated, `agent` violet for agent-authored. A punchcard's color *is* its authorship signal. If the pattern had multiple authors, the punchcard segments accordingly, cell by cell. The audit's whole `code-visible AI` point shows up here as "authorship is readable at glance, at poster size."

### 2. Oscilloscope / waveform — the live primitive

**What it is.** Actual live audio output, rendered by the existing `spectrum-analyzer.tsx` component. Never a synthesized "soundwave" illustration. Never a stylized curve. Never decorative. If there is no audio playing, there is no oscilloscope.

**Where it lives:**
- **`/radio` chrome.** A slow-scrolling scope line across the top of the station view. Sky. Low amplitude. The "the room is still playing" visual cue.
- **`/embed` idle glyph.** The collapsed embed state shows a 12×12 dot that is actually a tiny oscilloscope. When the audio is playing, it breathes; when it is muted, it is a flat line.
- **Wall-mode display.** The oscilloscope is the 10-feet-visible "something is happening" confirmation on the projector. Full-bleed, sky, no labels.
- **Never inside /studio as chrome** — /studio has the editor and the punchcard; adding a scope there is noise.

**Color behavior.** The scope is `listener` sky by default, because the scope represents the room hearing the sound. It shifts to `agent` violet during autopilot, to carry the handoff. It never renders in lime — the scope is not a creator surface, it is the room's ear.

### 3. Dithered texture — the floor primitive

**What it is.** A 1-bit or 2-bit dither pattern at 2–4% opacity, applied statically to dark surfaces to break up the flat `#0a0e17` field. Mac Classic lineage. Demoscene lineage. The same texture Winamp skins used to paint into their backgrounds. Static — it does not animate, it does not shimmer, it does not "breathe." The texture is a floor condition, not a motion.

**Where it lives:**
- **Every `base` surface** carries the dither at 2% opacity. The `surface-1`, `surface-2`, `surface-3` tiers each carry slightly less dither (the brighter the tier, the more the dither fades) so the eye reads them as progressively more "polished" panes on top of a slightly rough ground.
- **The hero strip** of `/` gets the dither at 4% opacity — louder there, deliberately.

**Color behavior.** Dither is `text-dim` specks on `base`. Monochrome only. Never trio-colored. The dither is the grain of the room; it does not announce anything.

## Anti-rules (the REPLACE list made explicit)

Everything in this list is forbidden from appearing in any pulse.city surface, marketing asset, social card, docs page, or README. Not as hero, not as thumbnail, not as background.

1. **No human face. No hand. No body. No silhouette.** Not Lia. Not a stock creator. Not an illustrated avatar. Faces are an Endel move and a Suno move and pulse.city is neither.
2. **No device mockup.** No iPhone frame, no Apple Watch lockup, no MacBook hero, no "shown on iPad" splash. The compass is the opposite of the Endel/Suno deck — a device mockup is a product pitch, and pulse.city does not pitch.
3. **No photography of venues.** No Florianópolis sunsets. No Ipê Village kitchen. No festival dance floor. No "community in action" photo. The imagery is the *sound*, not the *place*. The place is in the compass, not on the page.
4. **No generic soundwave illustration.** Only real audio output from the player. If the oscilloscope is not wired to actual audio, it is not on screen.
5. **No AI orb, magic sparkle, particle glow, or "presence blob."** The `agent` violet is chrome, not a character. Agents do not get mascots.
6. **No stock imagery. Ever.** Not from Unsplash, not from Pexels, not from an AI generator. The work decorates itself or nothing decorates it.
7. **No SaaS gradient blob.** The Linear/Vercel/Framer ambient-blob hero is exactly what pulse.city is positioned against — a "cinematic" backdrop doing the emotional work the product should be doing. The punchcard does the work.
8. **No illustration at all.** Not cute, not technical, not editorial. If a concept needs an illustration, the concept is wrong for pulse.city and the copy carries it instead.

## Two real-brand references doing something similar

- **fxhash** — the minting UI treats the generated canvas as the product photo, not as a secondary asset. The artwork *is* the card. pulse.city does the same move: the pattern *is* the OG. Relevance: proves that "output as imagery" reads as serious, not as lazy, when the output is strong enough.
- **Strudel itself** — strudel.cc uses the pattern-highlight spiral and punchcard as its de-facto imagery. pulse.city is inheriting the lineage literally, not metaphorically. Relevance: the audience already reads punchcards as "real code was here," so we are borrowing legibility, not inventing it.

## OG image treatment

Every `/p/[id]` pattern gets a punchcard OG image. This is not a template — it is a render of the pattern itself, made at save time and cached to the pattern record.

- **Aspect ratio:** 1200×630 (Open Graph standard).
- **Background:** `base` `#0a0e17` with the 2% dither.
- **Foreground:** the punchcard render for the pattern, filling roughly the center 70% of the frame. Cells colored by authorship (lime / sky / violet). No stroke, no glow.
- **Text overlay (bottom band):** pattern title in Chakra Petch 700 `display` tier, author name in Space Mono uppercase `micro` tier beneath, both left-aligned. The wordmark sits bottom-right in the horizontal lockup.
- **No exclamation, no "now playing," no "listen here" CTA.** The image states what is there.
- **Color exception:** if the pattern was agent-composed, the OG's title color also picks up `agent` violet as a tint on the middot between title and author. This is the only context where authorship hue leaks into the text overlay.

The marketing hero on `/` uses the same layout with a curated signature pattern instead of a per-share one. Swap the pattern, swap the hero. The landing page has no separate hero asset that needs design attention — it regenerates itself from the pattern of the week.

## Motion vocabulary (visual, not technical)

Exactly two motion shapes. The identity has no third. No parallax, no scroll-jacking, no cinematic blob drift, no spring bounce, no hover shake, no "flourish on load." Motion is percussive — it either pulses or it fires once.

### pulse-dot — the brand heartbeat

A 1.5-second soft opacity pulse on anything that represents "the room is still playing." Used on: the `PLAYING` pill on /studio, the station dot on /radio, the embed idle glyph, the MCP-connected badge, the scope's leading edge on wall-mode. One shape, one job. If an element on screen should tell Lia "this is still alive," it gets the pulse-dot. If it should tell her "this is static," it does not. There is no third option.

The pulse-dot is the only motion a user sees at rest. Everything else on the screen is still. That stillness is what makes the amber evolve-glow land.

### evolve-glow — the change-of-state firing

A one-shot 600ms warm-amber radial that expands outward from the exact point of change, with a brief `signal-warn` border flash on the container and a subtle blur-to-sharpen transition on the affected element. Fires on: pattern mutation (the mutated range in CodeMirror), autopilot handoff (the autopilot toggle), agent connection (the MCP badge, first frame only). Does not fire on: success toasts, hover, focus, load, scroll, or anything the user already expected.

evolve-glow is the "something just changed" motion. It has no label, no sound, no caption. It is the visible equivalent of a heartbeat skip — you notice, and then you look at what changed, and the state of the screen explains the rest.

**Two shapes. No third.** If a designer wants a third motion, the answer is no, and the follow-up is "which of the two existing shapes is the closest match, and why isn't that enough." Usually it is enough.

## Iconography system

### Library

**Lucide Icons.** One library. No mixing sets. No custom-drawn one-offs except the logomark itself (which is not an icon — it is a mark).

**Why Lucide and not Heroicons or Phosphor:**
- Lucide's line-weight (1.5px on a 24px canvas) matches the `border` glass-line aesthetic better than Heroicons' heavier 2px.
- Lucide is ISC-licensed, which is AGPL-compatible (Phosphor is MIT, also compatible; Heroicons is MIT). License does not decide it; stroke weight does.
- Lucide is shipped as individual tree-shakeable ESM imports (`lucide-react`), which matches the Tailwind 4 + Next.js 16 stack with zero configuration.

### Icon tokens

| Size | Usage | Stroke | Container |
|---|---|---|---|
| `icon-sm` 16px | inline in body/nav/list items | 1.5 | `0.5rem` padding when in a button |
| `icon` 20px | default UI icon size | 1.5 | default |
| `icon-lg` 24px | prominent toolbar, primary action | 1.5 | default |
| `icon-xl` 32px | `/embed` play affordance, large CTAs | 2 | only size where stroke steps up |

- **Color:** icons inherit `text` or `text-dim` by default. Accent-colored icons use the semantic trio only (creator/listener/agent) and only in contexts where the role is explicit.
- **No filled icons.** Lucide's outline style is the only style. No `lucide-react/filled` ever.
- **No icon ornamentation.** Icons do not get gradient strokes, shadows, or rotation-on-hover. The icon is a diagram, not a character.

### Forbidden icons

- **No emoji as icons.** Not in buttons, not in empty states, not in copy. Emoji are a Suno move.
- **No brand logos as icons.** No GitHub octocat, no Discord logomark, no X/Twitter bird. Social links use labeled Space Mono micro-links (`[ GITHUB ]`, `[ DISCORD ]`) instead.
- **No "AI" icons.** No sparkles, no wands, no brains, no robots. An MCP agent connection is represented by the `agent` violet dot only — no icon needed.

## CSS texture recipes

### The dither floor (committed implementation)

Static 1-bit dither at 2% opacity on every `base` surface. Implemented as a 4×4 pixel SVG tile, inlined as a data-URI, applied via `background-image`. No image fetch.

```css
/* src/app/globals.css — @theme is separate; this lives in the base layer */
@layer base {
  body {
    background-color: var(--color-base);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' x='0' y='0' fill='%23ffffff' fill-opacity='0.02'/%3E%3Crect width='1' height='1' x='2' y='2' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E");
    background-repeat: repeat;
    image-rendering: pixelated;
  }
}
```

- **Tile size:** 4×4 px. Two pixels lit, two dark — a diagonal 50% dither pattern.
- **Pixel color:** white at 2% opacity → resolves to ~`#141821` on `base`, one step above base luminance without ever reaching `surface-1`.
- **`image-rendering: pixelated`** is mandatory. Without it, browsers bilinear-smooth the tile and the dither becomes a blur.
- **Hero variant (4% opacity):** same tile with `fill-opacity='0.04'`. Applied as an additional `background-image` layer on the `/` hero strip only.

### Surface tier dither fade

The brighter the surface, the less dither. This is the "polished panes on a rough ground" posture.

```css
.surface-1 { background-image: /* 1.5% tile */; }
.surface-2 { background-image: /* 1% tile */; }
.surface-3 { background-image: none; } /* /radio's breathing-room tier is clean */
```

`surface-3` gets zero dither because `/radio` asks for slowness and stillness. Grain there reads as noise, not as texture.

### Punchcard cell treatment

The punchcard render (from `@strudel/draw`) is a flat color grid by default. To land the "grain-textured" look the mood board asked for, overlay the same dither texture **inside** punchcard cells at the exact same opacity as the surface they're drawn on. The cells read as "colored-in ground," not as "stickers on top of ground."

```css
.punchcard-cell {
  background-color: var(--cell-color); /* creator / listener / agent per authorship */
  background-image: /* same dither tile */;
  background-blend-mode: overlay;
}
```

### Oscilloscope / scope treatment

The `spectrum-analyzer.tsx` canvas renders strokes. The treatment is additive: a single `filter: blur(0.5px)` on the canvas (not on its content, on the canvas element) so the line feels slightly CRT without introducing a phosphor-glow preset. **No bloom, no afterglow, no trailing.** The scope is immediate; it is not nostalgic.

### The `evolve-glow` motion (technical sketch)

```css
@keyframes evolve-glow {
  0%   { box-shadow: 0 0 0 0 var(--color-signal-warn); filter: blur(1px); }
  20%  { box-shadow: 0 0 16px 2px var(--color-signal-warn); filter: blur(0); }
  100% { box-shadow: 0 0 0 0 transparent; filter: blur(0); }
}
.evolve-glow {
  animation: evolve-glow 600ms ease-out 1;
}
```

Single keyframe, 600ms, fires once. Applied to the affected container by adding the class, removed after `animationend`. Never chained. Never looped.

### The `pulse-dot` motion (preserved, formalized)

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.55; }
}
.pulse-dot {
  animation: pulse-dot 1.5s ease-in-out infinite;
}
```

Cadence of `1.5s` is the existing `globals.css` value — preserved. `0.55` trough is the committed low (deeper than `0.6`, shallower than `0.5`) to match the brand heartbeat without flicker.

## OG image generation

The `/p/[id]` OG render is produced by the app's `ImageResponse` (Vercel OG / Satori) path, reading the pattern's saved punchcard data. Two technical specifics:

- **Punchcard layer:** rendered by drawing the pattern cells onto a `1200 × 630` canvas at cell-size `16 × 16`, with cells colored by authorship. The dither is NOT applied to the OG (Satori does not support SVG pattern fills cleanly) — the OG ships with a flat background and the dither is a browser-only treatment.
- **Font binaries:** `next/font/local` weights for Chakra Petch 700 and Space Mono 400 are imported explicitly into the OG route at build time. No runtime font fetch.

---

## Related
- [logo-directions.md](./logo-directions.md)
- [color-system.md](./color-system.md)
- [typography.md](./typography.md)
- [brand-applications.md](./brand-applications.md)
