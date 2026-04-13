# Spec: State Persistence

## Summary

Save and restore user state so the experience survives page reload.

## What gets saved

| Key | Value | When saved |
|-----|-------|------------|
| `pc.code` | Editor code (string) | On every code change (debounced 2s) |
| `pc.mode` | `'autopilot'` or `'manual'` | On mode toggle |
| `pc.chat` | Last 20 messages (JSON array) | On each message |
| `pc.title` | Current track title | On compose/evolve |
| `pc.backend` | AI backend name | On settings save (already done) |
| `pc.key` | API key | On settings save (already done) |
| `pc.url` | Ollama URL | On settings save (already done) |

## Restore behavior

On page load (before boot overlay):
1. Read `pc.code` → if exists, use as initial code instead of INITIAL_CODE
2. Read `pc.mode` → restore mode
3. Read `pc.chat` → populate chat history
4. Read `pc.title` → show in header

After boot:
- If mode was autopilot → resume autopilot from saved code
- If mode was manual → load saved code, don't auto-play

## Storage

**POC**: `localStorage` (per browser, no auth)
**Production**: Supabase (per user, with auth)

## Clear state

Settings overlay gets a "RESET" button:
- Clears all `pc.*` keys from localStorage
- Reloads page to fresh state

## Size limits

- localStorage limit: ~5MB per origin
- Code: typically < 2KB
- Chat history (20 messages): typically < 10KB
- No concern for POC
