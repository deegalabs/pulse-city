# Sprint 03 — Chat Autonomy + State Persistence

**Goal**: Chat respects user intent, state survives page reload
**Period**: 2026-04-13
**Status**: done

## Tasks

- [x] Chat autonomy model (implemented in Sprint 02):
  - Autopilot: messages steer direction, AI applies code
  - Manual: chat suggests only, applies on explicit "apply/sim/do it"
  - Intent detection with APPLY_WORDS list
- [x] Chat context accumulation (chatHistory array, last 20 persisted)
- [x] localStorage persistence (debounced 2s):
  - Last editor code
  - Chat history (last 20 messages)
  - Mode (autopilot/manual)
  - AI settings (backend, key — already existed)
  - Track title
- [x] Restore state on page reload (code, mode, chat, title)
- [x] Sticky scroll (no auto-scroll when user reads history)
- [x] Clear state button in settings ("CLEAR ALL DATA")

## Acceptance criteria

- [x] Close browser, reopen → same code, same mode, same chat
- [x] In manual mode: messages → chat suggests, does NOT apply
- [x] In manual mode: "apply it" → applies last suggestion
- [x] In autopilot mode: messages → steer AI direction
- [x] Settings survive reload
- [x] Clear all data button wipes localStorage

## Technical notes

- `saveState()` debounces writes to `pc.state` key (2s timeout)
- `loadState()` on boot restores code, mode, chatHistory, trackTitle
- Chat messages rendered to UI on restore (last 20, truncated to 200 chars)
- `setMode(mode, silent)` — silent=true skips chat message on restore
- `userScrolledUp` flag tracks scroll position for sticky behavior
