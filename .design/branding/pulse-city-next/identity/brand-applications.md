# Brand Applications
> Phase: identity | Brand: pulse-city-next | Generated: 2026-04-15

---

How the identity bends across each real surface. The system is one brand, four volumes — /studio is loud, /radio is slow, /p is hospitable, /embed is considerate, marketing is quotable, the agent is bracketed. One compass, four postures. If Lia opens any two of these in adjacent tabs, they must read as the same hand without reading as the same screen.

## /studio — terminal loud

The live-coder's home. The compass is `awake`; the studio is the most awake of the four surfaces.

- **Base + surface-1 + surface-2.** No `surface-3`. The editor sits on `surface-1`, the page on `base`, hover and active states elevate to `surface-2`.
- **Creator lime dominates.** The `PLAYING` pill, the run cursor in the editor, the `[LIVE]` status code, the creator's own diff indicators. Sky appears at the nav (wordmark middot, station selector), violet appears on agent diffs and the MCP-connected badge, and amber fires once per mutation.
- **Space Mono micro-labels shout state.** `PLAYING`, `MANUAL`, `AUTOPILOT`, `SAVE`, `OUT`, `PATTERNS`, `AGENTS`. Uppercase, tracked wide, 0.6875rem. These are the top-bar of the surface.
- **JetBrains Mono is the body.** The CodeMirror editor is the focal point — more than half the screen, no decoration around it, gutters in `text-dim`.
- **Bracketed buttons.** `[ INITIATE ]`, `[ SAVE ]`, `[ FORK ]`, `[ PATTERNS ]`, `[ DELETE ]`. The brackets are part of the label, not a frame around it.
- **Status-code badges.** `[OK]`, `[ERR]`, `[LIVE]`, `[AGENT]`. Color follows role — `[LIVE]` is lime, `[AGENT]` is violet, `[ERR]` is red, `[OK]` is dim text.
- **Punchcard appears inline.** Below the CodeMirror editable range, small, updating as the pattern runs. Not as hero imagery — as a gauge.
- **ASCII dividers.** `────────` between panes where a border line would be redundant. Terminal preset grammar, Sage posture — it reads as "here is a separator I could have typed."

## /radio/[name] — terminal soft

The ambient listener surface. The compass is `remembers`; radio is where the room keeps time between visits. Slow, patient, wall-legible.

- **Base + surface-1 + surface-2 + surface-3.** This is the only surface that activates surface-3. The extra tier is the breathing room. Wide margins. Long vertical rhythm. Sections are tall.
- **Listener sky dominates.** The station name in sky, the now-playing title in sky, the scope line in sky. Creator lime is forbidden on /radio — the compass asks for slowness, and lime shouts.
- **Warmed violet appears only when the current pattern was agent-composed.** The station chrome picks up a subtle violet tint on the author credit and on the scope line's leading dot. When a human-authored pattern comes on next, the violet fades back to sky. This is the single most important semantic shift on /radio — the hand in the room changes color, and Lia knows without reading.
- **No shouting micro-labels.** Space Mono is whispered here — a single small `LIVE` indicator at the top, and that is the only uppercase on the page. Everything else is lowercase DM Sans body or Chakra Petch heading.
- **DM Sans body carries the narration.** The strip that reads `"slow kitchen" is playing. 04:11 until the next pattern.` is DM Sans 400, lowercase, `text` or `text-muted`. No exclamation, no decoration.
- **Oscilloscope as chrome.** Slow, low-amplitude, top of the frame, full width.
- **Wall-mode / 10-feet legibility.** A minimal projector view — station name in Chakra Petch `display`, oscilloscope, pulse-dot. Nothing else on screen.

## /p/[id] — listener-first

The share surface. Someone sent Lia a link; Lia has maybe 4 seconds to decide whether to stay.

- **Base + surface-1 + surface-3 (for the reading strip).** The punchcard is the page. The pattern code sits on `surface-1`, the reading strip around it uses `surface-3` as breathing room so the code does not feel cornered.
- **The punchcard is the hero.** Full-width, top of the page, rendering the actual pattern in authorship colors. The OG image is the same render — the share card and the first thing Lia sees are identical by design.
- **Listener sky is the dominant accent.** Title, CTAs, affordances.
- **Code is visible but not loud.** The pattern code sits in a JetBrains Mono block below the punchcard. Readable. Small. Lowercase label `code` (DM Sans) above it. This is the Sage move — Lia can read what she is listening to without opening the studio, and if she wants to open it, the `[ OPEN IN STUDIO ]` button is sky and obvious.
- **Share + embed actions are bracketed.** `[ SHARE ]`, `[ EMBED ]`, `[ OPEN IN STUDIO ]`. Space Mono, sky.
- **No sign-in gate visible.** /p never asks for auth. A listener is a creator who has not started yet; gating the page is the one thing that guarantees they never will.
- **No red.** Nothing on /p is destructive at listener-level. A listener cannot delete a pattern from the share page, so the destructive color does not appear.
- **No amber.** Nothing changes of state on /p — the pattern is a static record. Amber does not fire on a page at rest.

## /embed/[id] — host-considerate

The embed widget lives on someone else's page. The brand is a guest. Guests bring the compass but leave the loud clothes at home.

- **Base + surface-1 only.** Two tiers maximum. No `surface-2`, no `surface-3`. The widget has no room for elevation and no right to it on a host site.
- **Compact floating widget, bottom-right default.** Minimizable to a single dot. The dot is the oscilloscope-glyph — a 12×12 sky circle that breathes when audio is playing.
- **Single accent: listener sky.** No lime, no violet, no amber, no red. One color. The widget is the embed's entire personality and the personality is "I am the room you opened."
- **Wordmark shrinks to the monogram only.** The 3-row punchcard mark, at 20px compact size, sits at the left edge of the max-state widget. No `PULSE·CITY` wordmark — the space is too tight and the host site is not a surface for the wordmark to shout on.
- **Respects host site background — but never lightens its own canvas.** Even if the host page is white, the embed stays `base` `#0a0e17`. The dark canvas is the brand's ground, and the guest posture does not compromise the ground. The widget has a `border` glass-line to separate itself from the host; nothing else mediates the contrast.
- **One micro-label maximum.** `PLAYING` or `PAUSED`. Space Mono, sky, uppercase, small. That is the entire state vocabulary on /embed.
- **No sign-in, no share, no fork from /embed.** The widget's sole CTA is `[ OPEN ]`, which opens the pattern in a new tab to `/p/[id]`. The embed is a door, not a destination.

## Marketing (`/` and docs)

Marketing is quotable. The compass sits at the top of the page and the product sits beneath it. No decks, no scrolling hero, no feature grid.

- **Chakra Petch display for the compass.** `the place is awake, and it remembers you were here.` as the visual anchor of the home page. Lowercase, as-set, left-aligned. Sized so it reads from the couch, not from the desk.
- **DM Sans for everything else.** Body paragraphs, feature descriptions, docs prose. Long sentences allowed. Lowercase-first encouraged.
- **Punchcard of a signature pattern as hero imagery.** The same `/p/[id]` OG treatment, full-bleed across the hero slot. When the signature pattern evolves, the home page evolves with it — there is no static hero asset in the repo.
- **`the city is playing` as the H1 when the compass is taking a turn off-stage.** A shorter, quotable line that still reads from the compass family. Both lines are locked; nothing else gets promoted to H1 at `/`.
- **No pricing page, no testimonials, no logo wall.** The reasons-to-believe (open repo, MCP keys, tagline in metadata) sit as three plain bullet blocks in DM Sans. Docs link in JetBrains Mono at the bottom.
- **No feature icons.** If a feature needs an icon, the feature needs a better name.

## Agent surface (MCP)

There is no visual surface for an agent's output — the agent reads and writes strings over an MCP connection. But the brand still shows up in those strings. The response format is the agent's UI.

- **Bracketed status codes in every response header.** `[OK]`, `[ERR]`, `[LIVE]`, `[AGENT]`. Same vocabulary as /studio, same grammar as the terminal preset.
- **Present-tense, legible, understated voice.** `autopilot is writing. 3s since last change.` is both a /studio microcopy line and a valid MCP response body. The two surfaces share the same voice or the brand is broken.
- **`pc_` key prefix.** Every agent key is `pc_` + a short identifier. This is brand chrome disguised as a naming convention, and it sticks to every agent response by construction.
- **Middot-delimited metadata rows.** `"slow kitchen" · by "ember" · 12s ago · 247 cycles`. The middot is the agent's copy of the wordmark accent — wherever the brand shows up in text, the middot shows up too.
- **No emoji, no sparkle characters, no ASCII flourishes beyond `> ` prompts and `[...] ` status codes.** The agent surface is the cleanest surface in the system because it has the least chrome to hide behind.

## Social, OG, favicon

- **Favicon.** The 3-row punchcard logomark on `base` `#0a0e17`. 16×16 and 32×32 both ship. The center dot is sky. The favicon is the only place the dim rows may collapse if pixel budget is tight — 16×16 drops to 5×3 and the dim rows render as a single dim pixel each.
- **Twitter/X card and OG.** Every `/p/[id]` share uses its punchcard OG (see imagery-style.md). The `/` marketing card uses the signature-pattern OG. No other card templates exist.
- **No lifestyle photography.** Not on LinkedIn, not on Instagram, not on Mastodon, not in a newsletter. The only social asset pulse.city produces is a punchcard OG.
- **Theme-color meta tag is `#0a0e17`.** Every surface sets it. Mobile browser chrome inherits the base. The compass is dark on mobile because the compass is dark everywhere.

---

## Related
- [logo-directions.md](./logo-directions.md)
- [color-system.md](./color-system.md)
- [typography.md](./typography.md)
- [imagery-style.md](./imagery-style.md)
