# Use Cases & Personas — pulse.city

Defines the audiences and surfaces the product needs to serve, beyond the current single-page studio.

## Personas

1. **Creator** (human, logged in) — composes, experiments, publishes patterns
2. **Listener** (human, no login) — wants to hear, not to code
3. **Agent** (AI, external) — autonomous or on-demand, composes via MCP
4. **Host** (site/product) — wants to embed pulse.city sound in their own experience

## Flows per persona

### Creator
- Opens studio → Autopilot generates → likes it → `SAVE` → private collection
- Manual mode: writes Strudel from scratch or remixes a public pattern
- `SHARE` generates public URL `/p/[id]`
- **Future:** fork, remix, publish to marketplace

### Listener (no login, lightweight)
- Opens `pulse.city/live` → minimal player (sound + visualization, no editor)
- Opens shared URL `/p/[id]` → sees code + play button (current behavior)
- **Needs:** dedicated route without editor, just transport bar + spectrum. Possibly PWA-installable for ambient use

### Agent (external AI via MCP)
Core MCP server tools:
- `compose(brief)` → generates pattern, returns Strudel code + id
- `evolve(patternId)` → mutates and returns new version
- `play(patternId)` → marks as "now playing" on a given radio
- `list_trending()` → discovery, so the agent can pick existing work
- `save(code, title)` → persists under agent identity (service account or per-user API key)

**Enables:** an agent from another product (NPC, chat bot, community bot) can ask "create an ambient track for this moment" and receive something playable.

### Host (embed on partner sites)
- **iframe:** `<iframe src="pulse.city/embed/[id]">` — lightweight player, no editor
- **JS SDK:** `<script src="pulse.city/player.js"></script>` + `<pulse-player pattern="id">`
- **Radio IPÊ 24/7:** `pulse.city/radio/ipe` as continuous stream (eternal autopilot)

## Surface matrix

| Surface | Audience | Has editor? | Needs login? |
|---------|----------|-------------|--------------|
| `/studio` | Creator | yes | optional |
| `/p/[id]` | Listener + share | no (preview) | no |
| `/embed/[id]` | Host (iframe) | no | no |
| `/radio/[name]` | Listener (ambient) | no | no |
| MCP server | Agent | N/A | API key |

## Architectural implication

Today there is **one interface** (full studio). The proposal introduces **four surfaces**, all sharing a common primitive: a **pattern runtime** separated from the studio — something that only receives Strudel code and plays it, no editing UI.

### Suggested package layout (future)

```
packages/
  pulse-player/     # React component: <PulsePlayer code={...} />
                    # Uses @strudel/* directly, no CodeMirror
  pulse-mcp/        # MCP server (stdio + HTTP)
                    # Tools: compose, evolve, play, list, save
                    # Reuses API routes /api/compose, /api/evolve

apps/
  web/              # studio + listener pages + embed routes
```

The player becomes the **shared primitive** between `/studio`, `/p/[id]`, `/embed`, `/radio`, and any external host.

## Decisions

### 1. Radio IPÊ — shared code + wall-clock sync

All listeners hear "the same thing" conceptually, but the implementation is **not** a server-side audio stream.

- Server broadcasts current Strudel code + reference timestamp `T0` + BPM via WebSocket
- Each client runs Strudel locally in browser, starting from `T0` relative to wall-clock
- Since Strudel is cycle-based, clients starting from the same `T0` stay phase-locked (minor drift from clock skew, acceptable for ambient listening)
- Preserves the "code changing live" visual, zero streaming infra cost

**Rejected alternatives:**
- Per-listener autopilot (breaks the "radio" metaphor — everyone hears different music)
- Server-side audio stream (expensive compute + CDN, loses live-code visibility)

### 2. MCP auth — per-user API key

Each creator generates a personal API key in settings (`pc_...`, GitHub PAT-style). MCP server acts on behalf of the user via `Authorization: Bearer pc_...`. Revokable anytime.

**Why:** attribution matters for the marketplace phase — patterns need a clear creator. Per-user keys also give us per-user rate limiting and scoped leak containment. Service account auth breaks attribution and concentrates risk.

### 3. Embed — unified floating widget, mode via props

Single web component, two data sources:

```html
<script src="https://pulse.city/widget.js"></script>

<!-- Fixed pattern -->
<pulse-widget pattern="abc123"></pulse-widget>

<!-- Radio stream -->
<pulse-widget radio="ipe"></pulse-widget>

<!-- Future: user-scoped stream -->
<pulse-widget radio="user:handle"></pulse-widget>
```

Default presentation: floating, `position: fixed` bottom-right, minimizable, always overlay. Host sites drop one script tag + one element.

### 4. Player — separate package in monorepo, not published to npm

`packages/pulse-player` via pnpm workspaces.

- **Next.js studio** imports source directly: `import { PulsePlayer } from "@pulse-city/player"`
- **Embed widget** builds a standalone UMD bundle, served at `https://pulse.city/widget.js`
- No npm publish flow — versioning stays internal, evolution happens alongside the app
- Shared primitive between `/studio`, `/p/[id]`, `/embed/[id]`, `/radio/[name]`

**Rejected alternatives:**
- Code-split inside Next.js (can't distribute to external host sites as `<script>`)
- Publish to npm (premature — no external consumers yet, adds release overhead)

## Related work

- [marketplace.md](marketplace.md) — future marketplace for patterns
- [integrations.md](integrations.md) — existing integration thoughts
- [autopilot-mode.md](autopilot-mode.md) — autopilot behavior spec
