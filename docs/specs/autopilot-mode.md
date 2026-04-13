# Spec: Autopilot Mode

## Summary

AI generates and evolves music continuously when user opens the site. Code changes visibly in the editor. The user is a spectator watching code become sound.

## User story

As a visitor, I want to open pulse.city and immediately hear AI-generated music with code visibly changing, so I feel the "living radio" experience without needing to do anything.

## Behavior

### On entry
1. User clicks "TUNE IN" (boot)
2. Audio initializes, samples load
3. AI generates first track (compose prompt)
4. Code appears in editor with typing effect (optional) or instant
5. Auto-evaluate → music plays
6. Header shows "AUTOPILOT" badge
7. Every 30s: AI evolves the track → new code → evaluate

### Controls
- **TAKE CONTROL**: stops autopilot, enters manual mode, editor becomes user-owned
- **AUTOPILOT**: resumes AI generation from current code state
- Transport buttons (PLAY/PAUSE/STOP) work in both modes

### Evolve behavior in autopilot
- Uses existing evolve prompt
- If user sent chat messages, uses them as direction
- Picks 1-2 mutations per cycle: filter shift, rhythm change, sound swap, add/remove layer
- Never loses the core vibe — evolution, not replacement

## Edge cases

- AI backend not configured → autopilot uses INITIAL_CODE, evolve is disabled, prompt user to configure in settings
- AI call fails → keep current code playing, retry next cycle, show error in chat
- User clicks TAKE CONTROL mid-evolve → cancel pending AI call, keep current code
- Page reload during autopilot → restore code from localStorage, resume autopilot

## UI changes

- Replace EVOLVE button with TAKE CONTROL / AUTOPILOT toggle
- Add mode badge in header: "AUTOPILOT" (violet) or "MANUAL" (lime)
- In autopilot: editor has subtle animated border (code is alive)
- In manual: editor border becomes static (user is in control)
