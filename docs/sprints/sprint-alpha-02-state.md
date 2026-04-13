# Sprint Alpha-02 — Zustand + Mode + Transport

**Goal**: State management, mode switching, transport controls
**Status**: planned

## Tasks

- [ ] Zustand store with persist middleware (mode, code, playing, trackTitle)
- [ ] Header component (brand, mode badge, mode toggle button, presence)
- [ ] Transport bar component (Play, Stop, Evolve, Re-run, City, Live)
- [ ] Mode switching logic (autopilot ↔ manual)
- [ ] Autopilot loop (compose on boot, evolve every 30s)
- [ ] Manual mode (editor editable, no auto-code changes)
- [ ] Spectrum analyzer component (client-only canvas)
- [ ] Tools panel component (8 tool buttons)

## Acceptance criteria

- Mode badge shows AUTOPILOT/MANUAL with correct colors
- Click TAKE CONTROL → manual mode, editor editable
- Click AUTOPILOT → resumes AI evolution
- State persists on page reload (mode, code, trackTitle)
- Transport buttons work (play/pause/stop/evolve)
- Spectrum shows frequency data when playing

## Technical notes

- Zustand persist uses localStorage (same key `pc.store`)
- Spectrum and StrudelEditor are both `"use client"` components
- Transport controls interact with StrudelMirror via ref or store
