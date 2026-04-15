# Logo Directions
> Phase: identity | Brand: pulse-city-next | Generated: 2026-04-15

---

The logo is two objects: a wordmark that already exists and needs formalizing, and a logomark that does not exist yet and needs committing to. Both are built on a monospace grid so they sit next to JetBrains Mono without fighting it. Neither ever renders in a gradient, a circle badge, or a color outside the semantic trio.

## Wordmark

**Display form:** `PULSE·CITY`
**Prose form:** `pulse.city` (lowercase, dot, never hyphen, never camel)

The display form is a mark. The prose form is a string. They are not interchangeable.

### Spec

- **Family:** Chakra Petch
- **Weight:** 700 (Bold). No other weight renders the wordmark.
- **Case:** Display-caps, as set. Prose form stays lowercase in body copy and metadata.
- **Letterspacing:** Tight. The audit's disconnect was Chakra Petch being used as a utility label at 0.55rem — at display size, Chakra Petch wants to sit tight, not tracked. Aim so the crossbar of `E` in `PULSE` visually touches the middot's left gutter and the `C` of `CITY` touches the middot's right gutter. The middot is a kerning anchor, not a gap.
- **Kerning the clusters:** `LSE` and `CIT` are the two tightening zones. `L→S` and `I→T` are Chakra Petch's natural loose pairs; nudge them in by hand so the wordmark reads as two four-character blocks kissing the middot, not as nine drifting glyphs.
- **Middot:** The `·` character between `PULSE` and `CITY` is always rendered in `listener` sky `#3aa5ff`. This is the wordmark's only color accent. The rest of the mark is `text` `#e2e8f0` on `base` `#0a0e17`. Rationale: sky is the color of the shared room, and the middot is the only element of the mark that belongs to both halves at once — it is where studio and city touch. The dot holds the compass in miniature.
- **Vertical alignment of the middot:** Optical center, not geometric center. Chakra Petch's uppercase has a high optical middle; the middot sits at roughly the x-height of a hypothetical lowercase `x`, not halfway up the cap.

### Case rule (locked)

| Context | Form |
|---|---|
| Wordmark in marks, titles, posters, footer lockup | `PULSE·CITY` |
| Body prose, docs, metadata, voice copy, `<title>` | `pulse.city` |
| URL, domain, code | `pulse.city` |
| Shouting in /studio | never. Not even on error. |

### What the wordmark must never do

1. Never render in a weight other than Chakra Petch 700.
2. Never use a middot color other than `listener` sky.
3. Never get tracked wide for effect. (The wide-tracking move belongs to Space Mono micro-labels, not to the wordmark. Reserving it there is what keeps the mark quiet.)
4. Never get rotated, skewed, arched, or wrapped around a shape.
5. Never appear below 14px. Below 14px, use the logomark alone.

## Logomark

**Committed construction: the three-row punchcard.**

A 3-row × 7-column grid of dots. The middle row is the only row rendered at full opacity — the top and bottom rows are rendered dim (`text-dim` `#64748b`), the middle row is rendered in `text` `#e2e8f0`. The logomark is a single frozen frame of a pulse: the middle row is *now*, the dim rows are the cycles above and below that the player will arrive at next. Exactly one dot in the middle row — the fourth, dead center — carries the `listener` sky color. That dot is the heartbeat.

### Why this and not something else

The audit already said imagery is the product drawing itself. The punchcard is Strudel's own pattern visualization — the most load-bearing imagery primitive pulse.city has. Making the logomark a frozen punchcard row means the mark *is* the product's output at rest. It says Creator (the punchcard is craft, visible) and it says Sage (the mark is a diagram of what is happening, not a decoration of it). No other construction gets to both archetypes in one shape. An orb would fail Sage. A waveform would fail Creator (the waveform is audio, not authorship). A bracket monogram would fail the compass (brackets are chrome, not heartbeat). The three-row punchcard is the only mark where `the place is awake` and `remembers you were here` are both visible at once — awake is the lit middle row, remembers is the two dim rows flanking it.

### Construction

- **Grid:** 3 rows × 7 columns of circular dots. Dots are on-grid, evenly spaced, no offset, no stagger.
- **Dot-unit (`u`):** The diameter of one dot. Every measurement in the mark is expressed in `u`.
- **Dot spacing:** `2u` center-to-center horizontally and vertically. Gutter between dots is `1u`.
- **Total bounding box:** 13u wide × 5u tall. (7 dots × 2u center pitch, minus 1u, plus 1u of half-dot overhang on each end → 13u. 3 dots × 2u − 1u + 1u = 5u.)
- **Row 1 (top):** 7 dots, `text-dim` `#64748b`, 100% opacity.
- **Row 2 (middle):** 6 dots in `text` `#e2e8f0` + 1 dot in `listener` sky `#3aa5ff` at column 4 (dead center). 100% opacity. This row reads first.
- **Row 3 (bottom):** 7 dots, `text-dim` `#64748b`, 100% opacity.
- **No stroke.** No outline on any dot. Fill only.
- **No gradient.** The sky dot is flat `#3aa5ff`. Not a glow.
- **Single SVG, no textures, no blend modes.**

### Clear space

`1u` of clear space on all sides. One dot-unit — the mark's own heartbeat — is the minimum breathing room between the mark and any adjacent element.

### Minimum sizes

| Role | Minimum | Notes |
|---|---|---|
| Display (hero, posters, projector) | 64px bounding height | Full 3-row punchcard visible. |
| Compact (nav, card header) | 20px bounding height | Still 3 rows. The dots become pixel-sized but the row hierarchy holds. |
| Icon (favicon, embed idle glyph) | 16px bounding | Collapses: the 3 rows become a 3-pixel stack with one lit pixel center. Cropped to square aspect if needed — drop columns 1 and 7 so it fits 5×3 in a 16×16 bounding. |

### Lockups

1. **Mark-only.** Favicon, embed widget minimized, /studio nav when space is tight, ASCII fallback contexts.
2. **Wordmark-only.** Marketing hero, `<title>` tag's visual equivalent in rendered H1, footer, compass poster. When the compass is speaking, the mark is silent.
3. **Horizontal (mark + wordmark):** The mark sits to the left of `PULSE·CITY` with `3u` of gap between the mark's right edge and the `P` of `PULSE`. The mark's vertical center aligns to the optical center of the wordmark caps. This is the default app-chrome lockup — /studio nav, /p header, /radio top-left, embed max state.
4. **Stacked (mark above wordmark):** Used only for square format assets: OG image's bottom-left signature, projector splash, sticker. Mark centered above wordmark, `2u` of vertical gap between the mark's bottom edge and the wordmark's cap-line.

Only four lockups. Never a circle-badge lockup, never a stamp lockup, never a tagline-underneath lockup (the compass is not a tagline underneath — it is a sentence that stands alone on a page).

## Bright-line rules (what the logo must never do)

1. **Never gradient.** Not the wordmark, not the mark, not the middot, not the sky dot. Flat fills only.
2. **Never rotated or skewed.** 0° always. No jaunty tilt, no perspective, no 3D.
3. **Never inside a circle badge, a square stamp, a shield, or a wax seal.** The mark is a grid of dots; wrapping a grid in a circle is a category error.
4. **Never below 16px.** At 16px it is already collapsing — below that it is no longer the mark, it is noise.
5. **Never recolored outside the trio.** The sky middot and sky center-dot can shift to `creator` lime or `agent` violet only when the context is explicitly about that role (e.g. `agent`-authored pattern OG card). Never any other hue. No amber mark. No red mark. No white-only mark (the dim rows are non-negotiable — they are half the compass).

## ASCII fallback

Per terminal-preset grammar, the mark must survive in plain ASCII — for `<head>` console brags, 404 bodies, `curl` output, empty-state code blocks, and anywhere the browser is not rendering SVG. The ASCII form of the mark is:

```
 . . . . . . .
 . . . o . . .
 . . . . . . .
```

Three rows, seven dots each, the center a literal `o`. The `o` is always the heartbeat — it is the sky dot's ASCII stand-in. In contexts that allow a second line, the wordmark sits under it:

```
 . . . . . . .
 . . . o . . .
 . . . . . . .
    PULSE·CITY
```

In contexts that allow only one line, the mark compresses to `[...o...]` — seven characters in brackets, center `o`. This is the form used in terminal tooltips, MCP response headers, and the embed widget's collapsed state label. The brackets are not decoration — they are the bracketed-button voice from the terminal preset showing up in the mark.

## Technical construction (logomark SVG)

- **Canvas:** 52 × 20 (unitless). One dot-unit `u = 4`. Dot radius `r = 2`. Grid origin is the top-left of the `52×20` box inset by `1u` of clear space.
- **Dot centers** (row, col → cx, cy), expressed in absolute px at `u = 4`:
  - Row 1 (dim): `cy = 4`, `cx ∈ {4, 12, 20, 28, 36, 44, 52}` — wait, re-derived below.
  - At 7 columns × `2u` pitch starting from `u`, centers are at `cx = 2, 6, 10, 14, 18, 22, 26` in `u`-units, i.e. `8, 24, 40, 56, 72, 88, 104` at `u=4`. Bounding box becomes `112 × 20` px.
- **Canonical SVG viewBox:** `0 0 112 20`. Width:height ratio locked at `5.6:1`.
- **Dot fill matrix:**

| col | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| row 1 | dim | dim | dim | dim | dim | dim | dim |
| row 2 | text | text | text | **sky** | text | text | text |
| row 3 | dim | dim | dim | dim | dim | dim | dim |

Where `dim = #64748b`, `text = #e2e8f0`, `sky = #3aa5ff`. Radius `r = 8` px on the `112 × 20` viewBox.

- **Stroke:** `none` on every dot. Fill only.
- **Rounded corners:** N/A — dots are geometric circles, not squircles.
- **No `<defs>`, no `<filter>`, no `<mask>`, no `<linearGradient>`.** The SVG is 21 `<circle>` elements and nothing else.

## Variation matrix (complete)

| Variant | Form | Colors | Min size | Use |
|---|---|---|---|---|
| `mark-full` | 3×7 punchcard | dim + text + sky | 20px height | default logomark |
| `mark-mono` | 3×7 punchcard | text only (no dim, no sky) | 20px height | single-color contexts: OG fallback, debug UI |
| `mark-inverted` | 3×7 punchcard | base dot on `text` bg | 20px height | never. Reserved and unused — dark-only system. |
| `mark-16px` | 5×3 cropped (cols 2–6) | dim + text + sky | 16px × 10px | favicon, embed idle glyph |
| `mark-ascii-block` | `. . . . . . .` / `. . . o . . .` / `. . . . . . .` | plain text | n/a | `<head>` console, 404 bodies, README |
| `mark-ascii-inline` | `[...o...]` | plain text | n/a | MCP response headers, terminal tooltips, embed collapsed label |
| `wordmark-only` | `PULSE·CITY` | text + sky middot | 14px cap-height | hero, footer, title tier |
| `lockup-horizontal` | mark + `3u` gap + wordmark | text + sky | 20px mark height | app chrome (default) |
| `lockup-stacked` | mark over wordmark (`2u` gap) | text + sky | 32px mark height | square assets, OG signature |

## Clear space (committed)

- **Logomark:** `1u` (one dot-unit = ~`r` of the mark itself) on all four sides. At canonical 112×20, that's 4px of padding.
- **Wordmark:** `0.5×` cap-height on all four sides. At 14px cap-height, that's 7px.
- **Horizontal lockup:** `1u` around the full lockup bounding box. Never let another element enter that margin — not a nav link, not a border line, not a cursor.

## Minimum size derivation

The mark breaks when a single dot drops below 1 physical pixel. With 7 columns and `2u` pitch + `1u` clear space on each side = `15u` total width. For every dot to be ≥ 1px, `u ≥ 1px`, so full mark minimum width is `15px`. **Committed floor: 16px** (one pixel of headroom). Below 16px, the cropped 5×3 favicon variant takes over and surrenders columns 1 and 7.

## Don'ts (non-negotiable)

- No stroke on any dot.
- No gradient on the sky center dot — flat `#3aa5ff`.
- No replacing the sky dot with lime or violet **outside** the two authorized contexts (agent-authored content, creator-authored affordance).
- No rearranging the dot count. 3 rows, 7 columns, 21 dots, ever.
- No alternating opacity patterns in the dim rows. Both dim rows are 100% opaque on `#64748b`.
- No emoji substitution of the ASCII `o` (`○`, `●`, `•`). The literal `o` character is the mark.

---

## Related
- [color-system.md](./color-system.md)
- [typography.md](./typography.md)
- [imagery-style.md](./imagery-style.md)
- [brand-applications.md](./brand-applications.md)
