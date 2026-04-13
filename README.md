# pulse.city

A living soundtrack for cities. AI-powered music that evolves in real-time, visible as code.

Built with [Strudel](https://strudel.cc) (live-coded algorithmic music) + AI composition. Watch code write itself, or take control and compose your own.

## Modes

- **Autopilot** — AI generates and evolves music continuously. Code changes visibly in the editor. You steer via chat.
- **Manual** — You write Strudel code directly. AI assists through chat when you ask.

## Features

- Real-time code editor with StrudelMirror (CodeMirror 6 + inline visuals)
- AI composition and evolution via Vercel AI SDK (Anthropic, Groq)
- Spectrum analyzer with frequency bars, waveform overlay, spectrogram, and beat detection
- Tool palette for quick AI-assisted edits (drums, bass, chords, lead, FX)
- Save, load, and share patterns via public URLs
- Google OAuth + magic link authentication

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 + React 19 |
| Audio | Strudel (core, codemirror, webaudio, mini, tonal, transpiler) |
| AI | Vercel AI SDK v6 (Anthropic Claude, Groq Llama) |
| Auth + DB | Supabase (Auth, Postgres, RLS) |
| State | Zustand with localStorage persistence |
| Styling | Tailwind CSS 4 |
| Deploy | Vercel |

## Getting started

```bash
pnpm install
cp .env.example .env.local
# Fill in your keys in .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `ANTHROPIC_API_KEY` | Anthropic API key (pro/creator tier) |
| `GROQ_API_KEY` | Groq API key (free tier) |

### Database setup

Run the SQL in [`src/lib/supabase/schema.sql`](src/lib/supabase/schema.sql) in your Supabase SQL Editor to create the `profiles` and `patterns` tables with RLS policies.

## Project structure

```
src/
  app/
    page.tsx                    # Boot page (audio init)
    studio/page.tsx             # Main studio
    api/chat/                   # AI chat endpoint
    api/compose/                # AI composition endpoint
    api/evolve/                 # AI evolution endpoint
    api/patterns/               # Pattern CRUD + sharing
    auth/callback/              # OAuth callback
    p/[id]/                     # Public shared pattern page
  components/
    editor/                     # StrudelMirror wrapper
    chat/                       # AI chat panel
    spectrum/                   # Spectrum analyzer
    auth/                       # Login modal, user menu
    patterns/                   # Patterns modal
    header.tsx                  # App header + mode toggle
    transport-bar.tsx           # Play/pause/stop/evolve
    tools-panel.tsx             # Quick AI tools
    settings-overlay.tsx        # Settings
  lib/
    ai/                         # Model router, prompts
    strudel/                    # Audio init, constants
    supabase/                   # Client, server, types, schema
    store.ts                    # Zustand store
docs/                           # Architecture, specs, ADRs, roadmap
```

## Important notes

- **Audio requires user gesture** — the boot page handles `initAudio()` on click before entering studio
- **webpack required** — Turbopack is incompatible with `@strudel/core`, so `--webpack` flag is mandatory
- **`resolve.dedupe`** — Strudel requires a single `@strudel/core` instance; handled via Next.js config

## Roadmap

See [docs/roadmap.md](docs/roadmap.md) for the full plan.

- **Phase 1 (POC)** — Core editor + AI compose + spectrum analyzer
- **Phase 2 (Alpha)** — Next.js migration, auth, patterns, sharing (current)
- **Phase 3 (Beta)** — Marketplace, collab, creator profiles
- **Phase 4 (Launch)** — Ipe Village 2026 pop-up city deployment

## License

AGPL-3.0-or-later
