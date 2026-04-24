# Roadmap — pulse.city

## Phase 1 — POC (Apr 2026) *done*

**Goal**: Validate core experience — AI composes music in real-time, code visible in editor.

- Sprint 01: Core editor + AI compose + spectrum *(done)*
- Sprint 02: Autopilot mode + manual toggle *(done)*
- Sprint 03: Chat autonomy + state persistence *(done)*

## Phase 2 — Alpha (May 2026)

**Goal**: Next.js migration, multi-user, persistent state, shareable.

- Sprint Alpha-01: Scaffold + Editor + Audio (Next.js + StrudelMirror)
- Sprint Alpha-02: Zustand + Mode + Transport (state, autopilot/manual)
- Sprint Alpha-03: AI Chat + Server Routes (Vercel AI SDK, streaming, model router)
- Sprint Alpha-04: UI Polish + Responsive (Tailwind, shadcn/ui, mobile)
- Sprint Alpha-05: Auth + DB (Supabase, patterns, sharing)
- Sprint Alpha-06: Studio DX *(shipped)* — autocomplete/tooltips/multi-cursor on by default, keybindings (codemirror/vscode/vim/emacs), snippets palette (Cmd+K), command palette (Cmd+Shift+P), shortcuts overlay (`?`), DJ deck (Cmd+J) with genre presets + energy/space/brightness sliders, radio→studio broadcast sync with live-from-radio badge
- Sprint Alpha-07: Chat as pair-programmer *(shipped)* — diff view with +/-/context lines, Listen (preview audio without committing) / Keep / Reject actions on AI-proposed code changes
- Sprint Alpha-08: Single-mode studio *(shipped)* — removed autopilot/manual toggle inside studio. Studio is now a single livecoding surface; radio is the AI-broadcast surface. Opt-in AUTO toggle in the transport bar lets AI evolve code every 30s without forcing a read-only mode. Sidebar dashboard (composition / signal / listeners / mutations) always visible on lg+.
- Sprint Alpha-09: Cue routing *(shipped, restructured)* — **not a popup anymore**. Moved to Settings → Audio Output (Main + Cue device pickers) + a per-example **CUE toggle** in the Docs drawer. Listen now plays inline (bypasses editor document) so the user's code is untouched. When CUE is enabled on an example, its Listen is routed to the cue device via `AudioContext.setSinkId()`. The previous cue popup + `[ CUE ]` header button + `Cmd+U` shortcut were removed. Cue Agent chat UX archived with the Chat Copilot work below.
- Sprint Alpha-10: Pad Grid *(shipped)* — 4×4 MPC-style pad grid with keyboard bindings (Q/W/E/R/A/S/D/F/Z/X/C/V/1/2/3/4) replaces the old ToolsPanel. Each pad inserts a ready-to-run Strudel track line at cursor. Legacy AI quick-prompts (DRUMS/BASS/CHORDS/LEAD/FX/FILTER/TEMPO/DROP) migrated to the command palette under "AI · Quick prompts".
- Sprint Alpha-11: Studio simplification *(shipped)* — hidden the chat panel, the CueAgent popup, and the transport ticker marquee. Studio now focuses on editor + pad grid + spectrum. Transport bar has play/stop/re-run/evolve/AUTO. Focus-mode toggle hides sidebar + right column. Chat returns in a refined form in Phase 2.5.

## Phase 2.6 — Returning features (after 2.5 docs)

**Goal**: bring back the best of what we hid, refined and integrated.

- **Chat Copilot v2** — reborn as a proper side panel (not wedged into the right column). Focused on pair-programming + diff view with Listen/Keep/Reject. The pattern is solid; the hiding is temporary so the layout stabilises first.
- **Live Dashboard v2** — NOW / TRACKS / HISTORY / SESSION panels (already built but hidden). Returns as an opt-in panel or a "studio pro" mode. Everything is wired to real values: BPM editable via `setCps`, error box, eval auto-history, track mute/solo/delete, snapshot, copy share link. Hidden temporarily so the core loop (editor + pads + docs) gets focus.
- **API Reference (auto-generated)** — strudel.cc has a full searchable function reference pulled from JSDoc `doc.json`. Our autocomplete already uses the JSDoc data but the file isn't bundled/CDN'd publicly. Vendor `doc.json` from upstream at build time (or copy into `public/`) and add a tab to the docs drawer that lists every function + params + examples.
- **Persistent user sounds (IndexedDB)** — current import-sounds uses blob URLs, which are lost on page refresh. Strudel has `registerSamplesFromDB` — adopt that so uploaded folders survive between sessions.
- **Cue Agent v2** — reborn as a dedicated "suggestion stream" surface. Takes the best of the old popup (preset suggestions, streaming AI, diff) and plugs it into the simpler routing now living in Settings. Independent of the main chat.
- **Parallel cue audio** — second `AudioContext` with own `setSinkId()`, parallel Strudel scheduler sharing the global sample cache. Lets main speakers keep playing while DJ auditions on headphones simultaneously (today's implementation silences main during cue preview).

## Phase 2.5 — DX polish (after Alpha)

**Goal**: Lower the barrier for non-coders to explore Strudel.

- Docs modal inside Studio *(shipped)* — 6 groups / 14 sections (Getting Started, Strudel basics, Pattern library, Presets, AI agent, Reference), with in-place **Listen** (preview audio without committing), **Insert**, and **Copy** on every example. F1 opens it, inline search across all sections.
- Standalone /docs site *(in progress)* — SpendGuard-style layout at `/docs/introduction` + `/docs/quick-start` + `/docs/agent-skills`. Remaining sections: Editor deep-dive, Strudel mini-notation reference, Effects catalog, Continuous signals.
- Agent skills system *(spec shipped)* — formal catalog of discrete AI capabilities (compose-genre, evolve, add-layer, edit-filter, explain-function, etc.) with status tracking. See `/docs/agent-skills`. Next: route each skill to a dedicated system prompt + Haiku/Sonnet model choice.
- Copilot-style inline AI suggestions *(planned)* — ghost text via Haiku, Tab to accept, debounced 400ms after typing stops.
- Saveable user snippets *(planned)* — promote editor selection to named snippet, searchable alongside built-ins.
- Pattern version history *(planned)* — auto-snapshot on every eval, rewind to any past state.
- Quick-jump pattern labels *(planned)* — click sidebar → jump to `// section` comment in code.

## Phase 3 — Beta (Jun 2026)

**Goal**: Marketplace foundation, collab.

- Marketplace: browse, publish, fork, remix patterns
- Sample pack uploads (Cloudflare R2 storage)
- Real-time collab with Liveblocks (shared cursors, live editing)
- Creator profiles and analytics (plays, forks, revenue)
- Stripe integration (freemium: free tier + Pro subscription)
- Rate limiting with Upstash
- E2E tests with Playwright

## Phase 4 — Launch at Ipe Village (Jul 2026)

**Goal**: Full experience for the pop-up city.

- Marketplace economy (Stripe + optional USDC on Base)
- Creator fund (% of Pro revenue goes to top creators)
- On-site experience:
  - Raspberry Pi running headless Chrome → PA system (autopilot 24/7)
  - QR codes → people open on phone, see code in sync with ambient sound
  - Projection: large screen showing editor with code evolving live
- Community curation and trending feed
- Mobile-first optimized experience with "eco mode" (save battery)
- Sponsorship model for Ipe Village (shared API key server-side for all participants)

## Considerations across all phases

- **Legal**: AGPL-3.0 means all public deploys must open source. Consider dual license for marketplace patterns. Samples need clear licensing terms. AI-generated music has unclear copyright — document as CC0
- **Performance**: lazy load Strudel/CodeMirror, cache samples in Service Worker, Web Workers for AI, reduce spectrum FPS on mobile
- **Security**: server-side AI keys, rate limiting, validate Strudel code before eval, CSP allows `unsafe-eval` (required by Strudel transpiler)
