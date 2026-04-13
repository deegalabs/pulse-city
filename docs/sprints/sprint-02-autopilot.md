# Sprint 02 — Autopilot Mode

**Goal**: AI generates music automatically on entry, user can take control
**Period**: 2026-04-12 → TBD
**Status**: done

## Tasks

- [x] Auto-play on boot (autopilot composes first track after samples load)
- [x] Autopilot loop: AI generates first track on boot, evolves every 30s
- [x] Code visibly changes in editor during autopilot (setCode + evaluate)
- [x] "TAKE CONTROL" button: stops autopilot, enables manual editing
- [x] "AUTOPILOT" button: resumes AI generation
- [x] Mode indicator in header (AUTOPILOT / MANUAL badge with color coding)
- [x] Chat behavior changes based on mode:
  - Autopilot: messages steer AI direction ("Steering: ...")
  - Manual: chat as copilot with intent detection (apply/aplica/sim/do it)
- [x] Smooth transition between modes (no audio gap, timers managed)
- [x] Scrollable chat history with user/assistant/system message types
- [x] Tool buttons mode-aware (steer in autopilot, compose in manual)

## Acceptance criteria

- Open site → boot → music plays automatically within 5s
- Code changes visibly every 30s
- Click "TAKE CONTROL" → code stops changing, editor is editable
- Click "AUTOPILOT" → AI resumes evolving
- In manual mode, chat never touches the editor
- In manual mode, user can type in editor and Ctrl+Enter to evaluate

## Dependencies

- Sprint 01 complete (done)
- Working AI backend configured by user

## Technical notes

- Add `mode` state: `'autopilot' | 'manual'`
- Autopilot reuses existing evolve loop but starts on boot
- Chat `sendPrompt()` checks mode before applying code
- Editor readonly toggle via CodeMirror extension (or just don't setCode in manual)
