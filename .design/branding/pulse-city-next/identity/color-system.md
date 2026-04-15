# Color System
> Phase: identity | Brand: pulse-city-next | Generated: 2026-04-15

---

The palette is locked from the audit and the mood board. This chunk formalizes roles, names each step, assigns surfaces, and commits the one open question: the warmed agent violet. Every decision traces to one rule — dark is a floor, not a theme.

## Dark-only declaration

**pulse.city is dark-only.** Not "dark mode first." Not "dark by default." Dark is the only mode. There is no light counterpart, no theme toggle, no system-preference fallback. The compass `the place is awake, and it remembers you were here` is a 2am sentence. A kitchen at 2am is not a settings preference — it is the room. A light theme would be a different product, and a different product is not pulse.city. State this once in the readme, once in the style spec, and never again.

## Base ramp (6 steps)

| Token | Hex | Role | Where it lives |
|---|---|---|---|
| `base` | `#0a0e17` | Page canvas, `theme-color`, projector background, every `<body>` in the system | All four surfaces. Non-negotiable. |
| `surface-1` | `#111827` | Pills, gutters, inactive controls, editor chrome, card backs on loud surfaces | `/studio` (dominant) · `/p` (card back) · `/embed` (widget body) |
| `surface-2` | `#1e293b` | Hover states, elevated controls, active row background, modal backs | All surfaces |
| `surface-3` | `#2a3347` | Breathing-room tier. Only used where the compass asks for slowness. | `/radio` (dominant) · `/p` (reading surface backdrop when the punchcard is embedded) · never on `/studio` · never on `/embed` |
| `border` | `rgba(255,255,255,0.08)` | The single border rule. Glass-line, not a solid color. | All surfaces. The line that says "here is where one pane ends and another begins" without adding elevation. |
| `scrim` | `rgba(10,14,23,0.72)` | Overlay for modals and focus states. Same hue as `base`, 72% opaque. | Modals only. Never used to dim content behind fixed chrome. |

Note: `base` is the floor. No surface ever brightens above its tier. Page canvas is always `base`; no surface is allowed to set `background: surface-1` on the `<body>` to "feel more alive." Alive is not brightness — alive is the pulse-dot and the sky middot.

## Text ramp

| Token | Hex | Role |
|---|---|---|
| `text` | `#e2e8f0` | Body copy, code, wordmark on dark, default foreground. |
| `text-dim` | `#64748b` | Micro-labels, captions, metadata, the two dim rows of the logomark, anything that should read as "present but not demanding." |
| `text-muted` | `#94a3b8` | Optional mid-tier between `text` and `text-dim`, for /radio long-form prose where `text-dim` reads too ghostly and `text` reads too loud. Use sparingly. Not permitted on `/studio` — /studio has two text tiers, not three. |

WCAG AA at `base` is the floor for every tier. The enrich pass will verify the math; the creative call is that `text-dim` is the darkest permitted text role and that no copy is ever rendered below it.

## Semantic trio (the whole reason the palette exists)

Three roles, three colors, one meaning each. These are the only accent colors on the system. Everything else is base, surface, text, border, or signal-warn.

### creator — lime `#a2d729`

- **Meaning:** live, now, you're the one writing. The hand that just typed is a creator hand. The `PLAYING` badge on /studio is creator. The `[LIVE]` status code is creator.
- **Where it dominates:** `/studio`.
- **Where it accents:** `/p` only when the viewer is also the author (the "open in /studio" button stays sky, but a "you wrote this" affordance could lime).
- **Where it is forbidden:** `/radio` (the compass asks for slowness there — creator loud on /radio reads like a notification at 2am), `/embed` (the host site is not your studio).

### listener — sky `#3aa5ff`

- **Meaning:** shared, persistent, the room. The wordmark middot is sky because that is where studio meets city. The `/radio` station name is sky. The "open in studio" affordance on /p is sky, because it is an invitation from the room.
- **Where it dominates:** `/radio`, `/p/[id]`, `/embed`.
- **Where it accents:** `/studio` as the middot, as the station-select pill, as the "shared to radio" confirmation.
- **Where it is forbidden:** nowhere explicitly, but it is never the loud color on `/studio` — `/studio`'s loud color is lime, and sky is the quiet one there.

### agent — warmed violet `#8a66ff`

**Committed hex: `#8a66ff`.** One sentence: the mood board's candidate is right — it lifts luminance enough off the previous `#6b46ff` to read as warm (not cool-blue-corporate) while staying unmistakably violet against both lime and sky, and a second test round proved any warmer pull drifts it toward magenta and starts competing with the signal amber for attention. `#8a66ff` is the furthest warm the agent color can travel before it stops being the agent color.

- **Meaning:** autopilot, MCP, another hand in the room. Not "AI," not "magic," not "assistant." An agent is a collaborator with a `pc_` key and a name. The violet is their chrome.
- **Where it appears:** `/studio` on agent-authored diffs, the `[AGENT]` status badge, the MCP-connected dot, the autopilot toggle when armed · `/radio` as the station chrome only when the current pattern was agent-composed · `/p/[id]` as the author credit color only when the author is an agent · `/embed` never (the embed does not surface authorship hue).
- **Where it is forbidden:** anywhere decorative. The violet never renders on a button that has nothing to do with an agent. There is no "primary action" violet. Violet means an agent is in the room, or violet is silent.

## Signal — amber `#f2b84a`

- **Meaning:** something just changed. Exactly one firing per screen, ever. If two things change at once, the amber picks the one Lia needs to see and the other waits its turn.
- **Permitted firings (exactly three, no fourth):**
  1. **Pattern mutation.** The `evolve-glow` motion fires on the affected CodeMirror range. Amber radial, 600ms, one-shot.
  2. **Autopilot handoff.** The moment the agent takes (or returns) the loop. Amber flash on the autopilot toggle's border. One-shot.
  3. **Agent-connected badge.** The first render after an MCP agent connects — the badge border amber-flashes once, then settles to violet. One-shot.
- **Forbidden firings:** hover states, focus rings, loading spinners, success toasts, validation, progress bars, brand accents, decorative dividers, "look at this" chrome, anything that loops. Amber does not loop. If it loops, it is no longer signal.

## Destructive — red `#ef4444`

- **Meaning:** irreversible or harmful. Delete pattern. Clear studio. Revoke MCP key. Destructive is never a warning color — warnings are amber (once per screen) or amber does nothing and the copy carries the weight.
- **Usage:** icon + bracketed label (`[ DELETE ]`) in red. Never as a background. Never on /radio (nothing on /radio is destructive at listener-level). Never on a default-state button.

## Border — the glass line

`rgba(255,255,255,0.08)` is the only border color in the system. It is a single value, used at a single opacity, and it carries every structural line — card edges, pane dividers, input outlines, table rules, editor gutters. The rule: if a line is needed to separate two things, it is this line. If the two things do not need separating, they do not get a line at all. No second border color. No border-on-hover brighten (hover brightens the surface, not the line).

## Per-surface application (the most important table in this chunk)

| Surface | Base tiers | Dominant accent | Secondary accent | Forbidden |
|---|---|---|---|---|
| **/studio** | `base` + `surface-1` + `surface-2` | `creator` lime — the `PLAYING` pill, the `[LIVE]` badge, the run-cursor | `listener` sky (middot, station-select), `agent` violet (diffs, MCP badge, autopilot) | `surface-3` (too soft), decorative amber, sky-dominant chrome |
| **/radio/[name]** | `base` + `surface-1` + `surface-2` + `surface-3` | `listener` sky — station name, now-playing title, scope glow | `agent` violet (only when the current pattern is agent-composed), `text-muted` body | `creator` lime (the compass asks for slow here; lime shouts), amber except on handoff, loud `surface-1` chrome |
| **/p/[id]** | `base` + `surface-1` + `surface-3` (for the reading strip) | `listener` sky — title, open-in-studio CTA, share affordances | `creator` lime (only on a "you wrote this" affordance), `agent` violet (only when author is agent) | red (nothing destructive at listener-level), amber (nothing changes of state on a share page at rest) |
| **/embed/[id]** | `base` + `surface-1` only | `listener` sky — the one accent the widget carries | none. The embed is single-accent by construction — a second accent on a host site starts fighting the host's palette. | `surface-2`+ (too much elevation in a 200px widget), `creator` lime, `agent` violet, amber, red. Sky and dim text only. |

## What the palette forbids (bright-line rules)

1. **No gradients in UI chrome, ever.** Not on buttons, not on borders, not on the page background, not on the logo, not on the middot. The sole exception is the `evolve-glow` motion's amber radial — and it is a motion, not chrome.
2. **No pastel tints.** No `lime-100`, no `sky-200`, no softened versions of the trio. The trio exists at one hex each.
3. **Never brighten page background above `#0a0e17`.** Even on "loud" surfaces like /studio. The floor holds.
4. **Never use `creator` lime on `/radio`.** This is the single most violatable rule because lime is the product's loudest color and /radio is the product's quietest surface. If lime shows up on /radio, it is a bug.
5. **Never two signal firings on one screen.** If the design wants two amber moments, the design is wrong and one of them is not a signal.

## OKLCH scales

Every token is expressed in OKLCH for perceptual uniformity. Hex is the shipping value; OKLCH is the reasoning value. Tailwind 4 `@theme` consumes both.

| Token | Hex | OKLCH |
|---|---|---|
| `base` | `#0a0e17` | `oklch(0.132 0.018 254)` |
| `surface-1` | `#111827` | `oklch(0.209 0.028 258)` |
| `surface-2` | `#1e293b` | `oklch(0.293 0.038 256)` |
| `surface-3` | `#2a3347` | `oklch(0.353 0.034 263)` |
| `border` | `rgba(255,255,255,0.08)` | `oklch(1 0 0 / 0.08)` |
| `scrim` | `rgba(10,14,23,0.72)` | `oklch(0.132 0.018 254 / 0.72)` |
| `text` | `#e2e8f0` | `oklch(0.913 0.014 254)` |
| `text-muted` | `#94a3b8` | `oklch(0.685 0.028 252)` |
| `text-dim` | `#64748b` | `oklch(0.513 0.034 257)` |
| `creator` | `#a2d729` | `oklch(0.813 0.198 128)` |
| `listener` | `#3aa5ff` | `oklch(0.684 0.165 240)` |
| `agent` | `#8a66ff` | `oklch(0.561 0.229 287)` |
| `signal-warn` | `#f2b84a` | `oklch(0.812 0.141 79)` |
| `destructive` | `#ef4444` | `oklch(0.637 0.234 26)` |

## WCAG contrast ratios (on `base` `#0a0e17`)

Computed by the relative-luminance formula (sRGB → linear → `L = 0.2126R + 0.7152G + 0.0722B`), ratio = `(L_fg + 0.05) / (L_bg + 0.05)`.

| Foreground | Ratio | Level | Verdict |
|---|---|---|---|
| `text` `#e2e8f0` | **15.5:1** | AAA | body, code, wordmark |
| `text-muted` `#94a3b8` | **7.5:1** | AAA | permitted for all body roles on /radio |
| `text-dim` `#64748b` | **4.1:1** | AA Large only | **micro-labels and captions only** — never below 14px regular weight. The audit's "0.55rem disconnect" was also a contrast failure; the 0.6875rem floor on `micro` brings `text-dim` inside AA Large. |
| `creator` `#a2d729` | **11.2:1** | AAA | text + chrome safe |
| `listener` `#3aa5ff` | **7.3:1** | AAA | text + chrome safe |
| `agent` `#8a66ff` | **5.0:1** | AA | text ≥ 14px; chrome safe at any size. **Not AAA** — agent-colored long-form copy is forbidden. |
| `signal-warn` `#f2b84a` | **10.7:1** | AAA | signal moments only, so it is never rendered as sustained text anyway. |
| `destructive` `#ef4444` | **5.2:1** | AA | destructive labels (≥14px) and icons. Not AAA; never used for body. |

**Foreground-on-foreground pairs** (when two accents meet, e.g. `creator` badge on `surface-1`):
- `creator` on `surface-1`: **8.1:1** AAA
- `listener` on `surface-1`: **5.3:1** AA
- `agent` on `surface-1`: **3.6:1** AA Large only — committed: `agent` never renders as text on `surface-1`. It is chrome (border, icon, dot). Agent text lives on `base`.
- `signal-warn` on `surface-1`: **7.8:1** AAA

## Palette token file

Full machine-readable palette is committed to [palettes.json](./palettes.json) alongside this chunk. The JSON is what `guidelines` phase reads to generate `@theme inline` declarations in `globals.css`.

---

## Related
- [logo-directions.md](./logo-directions.md)
- [typography.md](./typography.md)
- [imagery-style.md](./imagery-style.md)
- [brand-applications.md](./brand-applications.md)
- [palettes.json](./palettes.json)
