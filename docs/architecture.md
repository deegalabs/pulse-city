# Architecture — pulse.city

## System overview

```
[Browser]
  ├── StrudelMirror (CodeMirror 6 + Strudel engine)
  │   ├── Editor with syntax highlighting
  │   ├── $: block syntax → per-pattern inline visuals
  │   ├── ._scope() waveform, ._punchcard() rhythm blocks
  │   └── .analyze(1) → feeds spectrum analyzer
  │
  ├── Autopilot controller
  │   ├── Evolve loop (30s cycle)
  │   ├── AI call → new code → setCode → evaluate
  │   └── Toggle: autopilot ↔ manual
  │
  ├── Chat system
  │   ├── Mode-aware behavior (autopilot vs manual)
  │   ├── Context accumulation per session
  │   └── Autonomy rules (never touch code in manual unless asked)
  │
  ├── Spectrum analyzer
  │   ├── getAnalyzerData('frequency') → bars + peaks
  │   ├── getAnalyzerData('time') → waveform
  │   ├── Spectrogram (scrolling history)
  │   └── Beat detection (bass energy threshold)
  │
  └── State persistence (localStorage)
      ├── Editor code
      ├── Chat history
      ├── Mode (autopilot/manual)
      └── Settings (AI backend, key)
```

## Data flow

```
User opens site
  → Boot overlay → click "TUNE IN"
  → initAudio() (user gesture)
  → evalScope() loads pattern functions (s, note, etc.)
  → registerSynthSounds() + samples() load sounds
  → StrudelMirror mounts CodeMirror into #editor-container
  → Autopilot starts: AI generates first track
  → Code appears in editor, evaluate(), music plays
  → Every 30s: AI evolves → setCode → evaluate
  → User can "TAKE CONTROL" → manual mode
```

## Key constraints

1. **Audio context requires user gesture** — initAudio() must be called inside a click handler
2. **Single @strudel/core instance** — resolve.dedupe in Vite prevents duplicate Pattern classes
3. **$: block syntax required** — enables per-pattern inline visualizations in StrudelMirror
4. **.analyze(1) required** — patterns must call this to feed the spectrum analyzer
5. **AI response must be JSON** — `{ message, code, title }` format for parsing reliability
