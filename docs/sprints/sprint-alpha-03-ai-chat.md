# Sprint Alpha-03 — AI Chat + Server Routes

**Goal**: Streaming AI chat with server-side keys, mode-aware behavior
**Status**: planned

## Tasks

- [ ] API route `/api/chat` with Vercel AI SDK (`streamText`)
- [ ] API route `/api/compose` (full track generation)
- [ ] API route `/api/evolve` (mutation of current code)
- [ ] Model router: Sonnet for compose, Haiku for evolve/chat, Groq for free tier
- [ ] Environment variables for API keys (ANTHROPIC_API_KEY, GROQ_API_KEY)
- [ ] ChatPanel component with `useChat()` hook
- [ ] Streaming responses (tokens appear in real-time)
- [ ] Chat mode-aware: autopilot (steer) vs manual (copilot)
- [ ] Intent detection in manual mode (apply/aplica/sim/do it)
- [ ] Scrollable chat history with sticky scroll

## Acceptance criteria

- Chat streams AI response token by token
- API keys are server-side only (never exposed to browser)
- Autopilot: user message steers next evolution
- Manual: AI suggests code, applies only on "apply"
- Model routing works (compose uses Sonnet, evolve uses Haiku)

## Technical notes

- Vercel AI SDK handles streaming, context, tool calling natively
- `useChat` body sends { mode, currentCode } to server route
- Server route selects model via `getModel(task, userTier)`
- Rate limiting via Upstash middleware (future sprint)
