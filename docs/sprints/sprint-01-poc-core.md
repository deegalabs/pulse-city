# Sprint 01 — POC Core

**Goal**: Editor funcional + AI compose + spectrum analyzer
**Period**: 2026-04-10 → 2026-04-12
**Status**: done

## Tasks

- [x] Project setup (Vite, @strudel/* packages)
- [x] Split layout: left (editor+chat), right (spectrum+tools)
- [x] StrudelMirror integration (CodeMirror 6 + inline visuals)
- [x] evalScope setup (s, note, etc. available in eval)
- [x] Audio init on boot click (initAudio)
- [x] AI compose via prompt (Groq/Anthropic/Ollama)
- [x] AI evolve loop (18s mutation cycle)
- [x] Spectrum analyzer (bars, waveform, spectrogram, beat detection)
- [x] Tools panel (DRUMS, BASS, CHORDS, LEAD, FX, FILTER, TEMPO, DROP)
- [x] Transport bar (PLAY, STOP, EVOLVE, RE-RUN, +CITY, LIVE)
- [x] Settings overlay (AI backend selector)
- [x] Boot overlay
- [x] Fix play/pause/play cycle (initAudio vs initAudioOnFirstClick)
- [x] Fix spectrum .analyze(1) on patterns
- [x] CLAUDE.md + VISION.md documentation

## Decisions made

- **StrudelMirror over textarea**: Native Strudel REPL experience with inline scope/punchcard visuals, syntax highlighting tied to mini-notation, Ctrl+Enter eval (see decisions/001)
- **Individual @strudel/* packages + resolve.dedupe**: Prevents duplicate Pattern class across bundled packages (see decisions/002)
- **initAudio() on boot click**: initAudioOnFirstClick() uses deferred mousedown listener that can race. Direct initAudio() in boot handler is reliable (see decisions/003)
- **$: block syntax**: Each `$:` creates a named pattern with its own inline visualization, better than stack()
- **BYOM (Bring Your Own Model)**: No backend needed for POC, user controls AI cost

## Bugs fixed

- `chord-voicings` broken ESM default export → switched from @strudel/web barrel to individual packages
- `.p is not a function` → resolve.dedupe to share single @strudel/core
- Play hangs after pause → replaced initAudioOnFirstClick with direct initAudio on boot
- Spectrum shows "NO SIGNAL" → added .analyze(1) to patterns

## Next

→ Sprint 02: Autopilot mode + manual toggle
