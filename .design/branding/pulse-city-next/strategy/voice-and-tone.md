# Voice & Tone
> Phase: strategy | Brand: pulse-city-next | Generated: 2026-04-15

---

## Voice set: Present · Legible · Understated

### Present
**Definition.** Describes what is happening right now, in present-tense verbs, with real numbers. Avoids future promises, past accomplishments, and subjunctive pitches. The copy is the status of the system, not a brochure about it.

**Why it fits Lia + compass.** Lia reads tools by scanning for realness. Present-tense copy is the fastest realness signal: if the string tells her what is playing, how many patterns are in rotation, and how many agents are connected, she trusts that the product is actually running. The compass says "the place is awake" — awake is a present-tense word.

### Legible
**Definition.** Plain, technically exact, no metaphor-cost. A string either names a specific thing (a pattern, a station, an agent, a cycle) or it says nothing. Technical accuracy is treated as a form of hospitality — Lia does not have to guess what a word means, and neither does an agent parsing the UI.

**Why it fits Lia + compass.** Lia respects TidalCycles' lineage and distrusts SaaS varnish. Legible voice borrows the live-code scene's precision without its gatekeeping. The compass says "remembers you were here" — remembering requires naming things accurately.

### Understated
**Definition.** Never exclaims, never sells, never decorates. The emotional volume of the copy is one step below where most product copy lives. If a line tempts you to add an emoji, cut the line.

**Why it fits Lia + compass.** Lia bounces off hype on sight. Understatement is the voice equivalent of the dark base — a low floor that makes the accent colors (and the single moment of warmth) hit harder. The compass works because it is quiet.

## Core voice rules

### Rule 1 — Describe the state, don't sell the feature.
- ✓ `the city is playing. 247 patterns in rotation. 3 agents connected.`
- ✗ `Experience the magic of AI-powered collective composition!`

### Rule 2 — Present tense, no futures and no pasts in UI.
- ✓ `pattern is loading.`
- ✗ `your pattern will be ready shortly — thanks for your patience!`

### Rule 3 — Use real numbers or say nothing.
- ✓ `3 agents connected.` · `station restarts in 04:11.`
- ✗ `several agents connected.` · `station restarts soon.`

### Rule 4 — Lowercase by default. Reserve uppercase for /studio micro-labels only.
- ✓ on /p: `now playing — "slow kitchen" by lia.`
- ✓ on /studio: `PLAYING · AUTOPILOT · OUT`
- ✗ on /p: `NOW PLAYING — "SLOW KITCHEN"`

### Rule 5 — Never exclaim. Not once. Not even on success.
- ✓ `pattern saved.`
- ✗ `pattern saved!` · `Saved! ✨`

### Rule 6 — Name the actor. If a string happens because of an agent, say so.
- ✓ `autopilot rewrote the bassline 12s ago. open diff.`
- ✗ `something changed in your pattern.`

### Rule 7 — If an error is ours, say so plainly. If it's the user's, offer a next step without scolding.
- ✓ `pattern did not load. try again or open a different one.`
- ✗ `Oops! Something went wrong. Please contact support.`

## Tone spectrum by surface

| Surface | Tone flavor | Tempo | Case | Example string |
|---|---|---|---|---|
| **/studio** | cypherpunk · precise · loud terminal | fast, taut | UPPERCASE micro-labels + lowercase body | `PLAYING · 247 PATTERNS · 3 AGENTS — autopilot is writing. open diff.` |
| **/radio/[name]** | ambient · patient · warm | slow, long sentences OK | all lowercase | `radio/ipe is playing "slow kitchen". 04:11 until the next pattern.` |
| **/p/[id]** | listener-first · hospitable · quiet | medium | all lowercase | `"slow kitchen" by lia. open in studio, or just listen.` |
| **/embed/[id]** | host-considerate · small · unobtrusive | tight | sentence case, short | `pulse.city · "slow kitchen" by lia · open` |
| **Marketing (/, docs)** | living · open · collective | medium, quotable | all lowercase | `a living soundtrack primitive. open. autonomous. collective.` |

Rule of thumb: /studio can shout (it is a terminal, and the user asked for it). Every other surface should read like Lia walked in and is already listening.

## Tone modulations

### When things go wrong (error)
Understate the failure. Offer the next move. No apology theater.
- `pattern did not load. try again or open a different one.`
- `radio/ipe lost sync. reconnecting.`
- `agent disconnected. autopilot is off.`

### When an agent is composing (autopilot)
Name the agent, name the change, show the diff.
- `autopilot is writing. 3s since last change.`
- `agent "ember" rewrote the bassline. open diff.`
- `autopilot is idle. waiting for a cue.`

### When the room is empty (idle)
Invite without begging. The empty state is a valid state.
- `nothing playing. start a pattern or wait for one.`
- `radio/ipe is quiet tonight. the station resumes at 20:00.`
- `/studio is empty. fork a pattern from /radio/ipe or start a new one.`

## Round-trip check (locked examples)

These three strings are non-negotiable. Every voice decision must produce copy that sits comfortably next to them.

- **home:** `the city is playing. 247 patterns in rotation. 3 agents connected.`
- **empty state:** `nothing playing. start a pattern or wait for one.`
- **error:** `pattern did not load. try again or open a different one.`

## Forbidden phrases

Never. Not in copy, not in docs, not in metadata, not in a tweet.

1. "AI-powered" / "powered by AI" / "powered by GPT-anything"
2. "revolutionary" / "game-changing" / "next-gen"
3. "seamless" / "frictionless" / "effortless"
4. "unlock your creativity" / "your creative potential"
5. "launch" as a verb applied to pulse.city (also: no rocket emoji, no countdown)

Bonus forbidden: "we believe," "our mission is," "welcome to the future of."

## Grammar & mechanics

- **Sentence case is the default.** Lowercase-first is acceptable and encouraged in product strings. Title Case is forbidden except inside quoted proper nouns and pattern/station titles.
- **No exclamation marks.** Ever. Not in success toasts, not in marketing, not in onboarding.
- **Numerals are digits in UI.** `3 agents connected`, not `three agents connected`. Spelled-out numbers are permitted only in the manifesto and long-form marketing prose, and only below ten.
- **Oxford comma: yes.** `open, autonomous, and collective.`
- **Em-dash (—) for asides and compass-style sentences.** `the place is awake — and it remembers you were here.` Em-dash is unspaced in prose per Strudel/MDN convention but may be spaced in UI microcopy for readability at small sizes.
- **En-dash (–) for numeric ranges only.** `20:00–22:00`.
- **Product name in prose: `pulse.city`** (lowercase, dot, never hyphen, never camel). Wordmark display form: `PULSE·CITY` (Chakra Petch, sky middot), used in marks only.
- **Pattern and station titles in quotes, lowercase:** `"slow kitchen"`, not `"Slow Kitchen"` or `Slow Kitchen`.
- **Agent names in quotes, lowercase, no prefix:** `agent "ember" connected`, not `Agent Ember` or `@ember`.

---

## Related
- [archetype.md](./archetype.md)
- [messaging.md](./messaging.md)
- [brand-platform.md](./brand-platform.md)
