# Arthasphere Analysis — Feature Mapping for pulse.city

> Reviewed 2026-04-13. Single-file live coding environment (~1750 lines) built by a colleague. Zero external dependencies — 100% WebAudio synthesis + vanilla JS.

---

## 1. Architecture Overview

```
arthasphere.html (single file)
├── CSS (~300 lines)
│   └── Matrix/terminal green theme, grid layout, inline sliders
├── HTML (~150 lines)
│   └── Header, tabbed editor, sidebar (viz + sequencer + scales), footer
└── JavaScript (~1300 lines)
    ├── Background: particles + sacred geometry (canvas)
    ├── Audio Engine: 10 instruments via WebAudio oscillators
    ├── Scale System: 15 scales + root parsing ("c:minor:pentatonic")
    ├── Mini-notation: rhythm("x - x ~", fn, beat) parser
    ├── Probability: often(), rarely(), sometimes(), almostNever()
    ├── Scheduler: setInterval-based, onBeat(beat) callback
    ├── Inline Sliders: drag-to-change values in code (filter, vol, BPM, slider)
    ├── Tab System: multiple tabs, rename, close, presets
    ├── Sequencer Grid: clickable pads (kick/snare/hihat/bass)
    ├── Visualizer: mandala-style radial frequency bars
    └── Export/Import: JSON project + TXT format
```

---

## 2. Feature-by-Feature Comparison

### 2.1 Inline Sliders

| Aspect | Arthasphere | Strudel (native) |
|---|---|---|
| Implementation | Manual DOM overlays on textarea | CodeMirror 6 `WidgetType` extension |
| File | arthasphere.html (inline) | `@strudel/codemirror/slider.mjs` |
| Syntax | `filter(2000)`, `vol(0.8)`, `slider(val, min, max)` | `slider(value, min, max, step)` — transpiler-aware |
| Positioning | Pixel-calculated (char width * column) | Native CM6 inline decoration |
| Live update | Modifies textarea value + calls fn directly | Dispatches CM6 change + postMessage to transpiler |
| Sync model | Regex replace in code string | CM6 transaction with range tracking |
| Block-aware | No | Yes — preserves sliders outside eval range |

**Verdict: Strudel already has this, and it's better.** The CM6 implementation is more robust (range-based IDs, proper transaction handling, block-aware updates). We get this for free with StrudelMirror.

**Action: No custom implementation needed.** `slider()` works out of the box in pulse.city via `@strudel/codemirror`.

---

### 2.2 Visualizations

| Mode | Arthasphere | Strudel |
|---|---|---|
| **Radial/Mandala** | Custom radial frequency bars with center orb | No direct equivalent |
| **Spectrum** | No | `._spectrum()` — scrolling spectrogram |
| **Oscilloscope** | No | `._scope()` / `.tscope()` — time-domain waveform |
| **Freq Bars** | No | `.fscope()` — frequency-domain bars |
| **Pianoroll** | No | `._pianoroll()` — scrolling note display |
| **Punchcard** | No | `._punchcard()` — grid note display |
| **Wordfall** | No | `._wordfall()` — vertical labeled events |
| **Spiral** | No | `._spiral()` — polar coordinate events |
| **Pitch Wheel** | No | `._pitchwheel()` — circular pitch display (flake/polygon modes) |
| **Animate** | No | `.animate()` — programmable canvas (rects, ellipses, rotation) |
| **Hydra (WebGL)** | No | `@strudel/hydra` — shader-based generative graphics |
| **Active Highlight** | No | `@strudel/codemirror/highlight.mjs` — live pattern highlighting |
| **Sequencer Grid** | Clickable 8-step pads | No visual grid (patterns are code-driven) |

#### Full Strudel Visualization Catalog

1. **`._spectrum()`** — Scrolling spectrogram (frequency over time). Options: `thickness`, `speed`, `min`/`max` dB.
2. **`._scope()` / `.tscope()`** — Time-domain oscilloscope. Options: `align`, `color`, `thickness`, `scale`, `trigger`.
3. **`.fscope()`** — Frequency-domain bars (like EQ display). Options: `color`, `scale`, `pos`, `lean`, `min`/`max`.
4. **`._pianoroll()`** — Scrolling piano roll (pitch vs time). Horizontal/vertical. Shows note timing and pitch.
5. **`._punchcard()`** — Grid-based note view using painter system.
6. **`._wordfall()`** — Vertical pianoroll with event labels.
7. **`._spiral()`** — Events rendered on expanding spiral. Options: `stretch`, `size`, `thickness`, `steady`, `fade`.
8. **`._pitchwheel()`** — Circular pitch visualization within one octave. Modes: `flake` (radial lines) and `polygon` (connected dots). Supports custom EDO (microtonal).
9. **`.animate()`** — Programmable canvas animation. Draw rects/ellipses with position, rotation, scaling, smear.
10. **Hydra** (`@strudel/hydra`) — WebGL shader-based generative visuals.
11. **Active Highlighting** — Mini-notation parts light up as they play in the editor.

**Verdict: Strudel has 10+ visualization modes vs Arthasphere's 1.** The mandala radial view is the only thing Arthasphere has that Strudel doesn't — but `.fscope()` is similar (frequency bars), and `.animate()` could replicate it.

**Action for pulse.city:**
- **Phase 1 (Alpha):** Use `._spectrum()` as default (already planned). Add mode switcher.
- **Phase 2:** Expose `._pianoroll()`, `._scope()`, `._spiral()`, `._pitchwheel()` as selectable modes.
- **Phase 3:** Consider a custom radial/mandala mode inspired by Arthasphere, using `.animate()` or a custom `onPaint()`.

---

### 2.3 Scale/Note System

| Aspect | Arthasphere | Strudel |
|---|---|---|
| Syntax | `n(index, "c:minor:pentatonic", octave)` | `n("0 1 2").scale("C:minor:pentatonic")` |
| Scales | 15 hardcoded | 100+ via TonalJS |
| Root support | `"c#:phrygian"` parsed inline | `"C#:phrygian"` |
| Octave wrap | Manual `Math.floor(index/len)` | Automatic via `scaleStep()` |
| Chords | Manual MIDI arrays | `.chord()`, `.voicing()` |

**Verdict: Strudel's system is far more powerful.** It has 100+ scales, chord voicings, transposition within scales (`.scaleOffset()`), and integrates directly with the pattern system.

**Action: Use Strudel's native `.scale()`.** No need to port Arthasphere's `n()` function.

---

### 2.4 Probability & Randomness

| Function | Arthasphere | Strudel |
|---|---|---|
| `sometimes` | `sometimes(prob, fn)` — imperative | `.sometimes(fn)` — pattern method (50%) |
| `often` | `often(fn)` — 75% | `.often(fn)` — 75% |
| `rarely` | `rarely(fn)` — 25% | `.rarely(fn)` — 25% |
| `almostNever` | `almostNever(fn)` — 5% | `.almostNever(fn)` — 10% |
| `almostAlways` | `almostAlways(fn)` — 90% | `.almostAlways(fn)` — 90% |
| `sometimesBy` | `withProb(p, fn)` | `.sometimesBy(p, fn)` |
| `every` | `every(n, fn)` — beat counter | `.every(n, fn)` — cycle-based |
| `cycle` | `cycle([a,b,c])` — round-robin | `"<a b c>"` — slowcat |

**Verdict: Feature parity.** Strudel's versions are pattern-aware (operate on cycles, not beats), making them more musically precise.

**Action: Use Strudel's native methods.** They're already available.

---

### 2.5 Mini-Notation / Rhythm

| Aspect | Arthasphere | Strudel |
|---|---|---|
| Syntax | `rhythm("x - x ~", fn, beat)` | `"x ~ x ~"` (inline mini-notation) |
| Parser | Custom `parseMini()` (~50 lines) | Peggy grammar `krill.pegjs` (full parser) |
| Features | `x`=hit, `-`=rest, `*`=repeat, `!`=accent | `x`=hit, `~`=rest, `*`=fast, `/`=slow, `@`=weight, `(p,s)`=euclidean, `?`=degrade, `<>`=alternate, `\|`=random, `{}`=polymeter |
| Sub-groups | `[a b c]` | `[a b c]` |
| Stacking | No | `[a,b,c]` — parallel layers |

**Verdict: Strudel's mini-notation is a superset.** It includes euclidean rhythms, polymeter, alternation, random choice, and nested patterns — the full TidalCycles mini-notation spec.

**Action: Use Strudel's native mini-notation.**

---

### 2.6 Audio Engine

| Aspect | Arthasphere | Strudel |
|---|---|---|
| Engine | Custom WebAudio oscillators | superdough (full sampler + synth) |
| Instruments | 10 synthesized (kick, snare, hihat, clap, rim, note, bass, synth, pad, marimba, epiano) | 30+ synth types + unlimited samples |
| Samples | None | `samples()` loads from URLs (FLAC/WAV) |
| Effects | Master filter + gain | Per-voice: lpf, hpf, reverb, delay, distortion, phaser, chorus, compressor, etc. |
| Worklets | No | AudioWorklet-based DSP |

**Verdict: Strudel is vastly more capable.** But Arthasphere's custom synth designs (especially the trip-hop bass, warm synth, pad) are musically interesting and could inspire Strudel patterns.

**Action:** Document Arthasphere's synth recipes as reference for AI-generated Strudel patterns. The AI can produce similar timbres using Strudel's `s("sawtooth").lpf().lpenv()` etc.

---

### 2.7 Tab System / Presets

| Aspect | Arthasphere | Strudel |
|---|---|---|
| Tabs | Dynamic: create, close, rename, reorder | No tabs (single editor) |
| Presets | 6 built-in (Ecstatic Dance, Melodic Techno, Ceremony, Teardrop, Strobe, One More Time) | Community patterns via DB |
| Export | JSON project + TXT format | Share via URL hash |

**Verdict: Arthasphere's tab system is more ergonomic for multi-scene workflows.** Strudel's REPL is single-pattern focused.

**Action for pulse.city:** Consider a lightweight "scenes" system in Phase 2 — store multiple patterns the AI can crossfade between. The tab concept maps well to autopilot scene rotation.

---

### 2.8 Sequencer Grid (visual)

Arthasphere has a clickable 8-step grid for kick/snare/hihat/bass. Strudel has no equivalent — patterns are code-only.

**Action:** Low priority for pulse.city. The AI-driven model + code editor is our core differentiator. A visual sequencer could be a future community feature.

---

## 3. What pulse.city Should Adopt

### Immediate (Alpha)

| Feature | Source | Implementation |
|---|---|---|
| **Inline sliders** | Strudel native | Already available via `@strudel/codemirror` — `slider(val, min, max)` |
| **Visualization switcher** | Strudel native | UI selector for `._spectrum()`, `._scope()`, `._pianoroll()` etc. |
| **Active highlighting** | Strudel native | Already included in StrudelMirror |

### Near-term (Beta)

| Feature | Source | Implementation |
|---|---|---|
| **Scene system** | Arthasphere tabs concept | Zustand store with multiple named patterns + AI-driven transitions |
| **Preset library** | Arthasphere presets | Curated starting patterns for different moods/genres |
| **Extended viz modes** | Strudel native | `._spiral()`, `._pitchwheel()`, `.fscope()` as selectable modes |

### Future (Launch)

| Feature | Source | Implementation |
|---|---|---|
| **Radial/mandala viz** | Arthasphere custom | Custom `onPaint()` or `.animate()` mandala mode |
| **Visual sequencer** | Arthasphere grid | Optional grid overlay for click-to-add patterns |

---

## 4. Visualization Modes — Recommended UX for pulse.city

```
┌──────────────────────────────────┐
│  VIZ MODE SELECTOR (top of panel)│
├──────────────────────────────────┤
│  [SPECTRUM] [SCOPE] [PIANOROLL]  │
│  [SPIRAL]  [PITCH]  [FREQ]      │
└──────────────────────────────────┘
```

Each mode maps to a Strudel pattern method appended to the active pattern:

| Button | Strudel Method | Description |
|---|---|---|
| SPECTRUM | `._spectrum()` | Scrolling spectrogram — frequency over time |
| SCOPE | `._scope()` | Oscilloscope — real-time waveform |
| PIANOROLL | `._pianoroll()` | Note display — pitch vs time |
| SPIRAL | `._spiral()` | Events on expanding spiral |
| PITCH | `._pitchwheel()` | Circular pitch in one octave |
| FREQ | `.fscope()` | Frequency bars — EQ-style |

The visualization method is appended dynamically by the runtime, not written in the user's code. This keeps the code clean and lets the user switch modes without editing.

---

## 5. Synth Recipes from Arthasphere (AI Reference)

These timbres from Arthasphere can guide the AI when composing in Strudel:

| Arthasphere Sound | Strudel Equivalent |
|---|---|
| Trip-hop bass (sine sub + triangle click) | `note("e1").s("sine").gain(0.9).lpf(200)` + transient layer |
| Warm synth lead (saw + waveshaper + vibrato) | `note("a4").s("sawtooth").lpf(1200).lpq(2).vib(4.5).vibmod(0.008)` |
| Atmospheric pad (5 detuned saws/triangles) | `note("c3").s("sawtooth").detune(14).lpf(800).attack(1.2).release(3)` |
| Marimba (3 sine harmonics, fast decay) | `note("c4").s("sine").decay(0.3).sustain(0)` — or use `s("marimba")` sample |
| E-piano / Rhodes (4 sine harmonics) | `note("c4").s("sine").decay(1.2)` — or use `s("rhodes")` sample |

---

## 6. Summary

| Category | Arthasphere Custom | Strudel Native | pulse.city Action |
|---|---|---|---|
| Sliders | Manual DOM overlay | CM6 WidgetType | **Use Strudel** |
| Visualization | 1 mode (mandala) | 10+ modes | **Use Strudel** + mode switcher |
| Scales | 15 hardcoded | 100+ via TonalJS | **Use Strudel** |
| Probability | Imperative functions | Pattern methods | **Use Strudel** |
| Mini-notation | Basic parser | Full TidalCycles spec | **Use Strudel** |
| Audio | 10 synth instruments | Sampler + synth + FX | **Use Strudel** |
| Tabs/Scenes | Dynamic tab system | None | **Adapt concept** for scene rotation |
| Sequencer Grid | 8-step clickable | None | **Defer** — low priority |
| Presets | 6 genre presets | Community DB | **Adapt concept** for starter library |

**Bottom line:** Strudel already provides nearly everything Arthasphere does, and more. The main ideas to adopt from Arthasphere are the **scene/tab concept** (for autopilot rotation) and the **curated preset library** (for instant start). The visualization switcher is our biggest UX win — Strudel has 10+ modes we can expose with a simple selector.
