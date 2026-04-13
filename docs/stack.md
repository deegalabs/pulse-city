# Stack — pulse.city

## Current (POC)

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Vanilla JS, no framework | POC speed, no build complexity |
| Build | Vite | Fast HMR, ESM native |
| Editor | StrudelMirror (CodeMirror 6) | Native Strudel inline visuals, syntax highlighting, Ctrl+Enter eval |
| Audio | Strudel (superdough + webaudio) | The best browser live-coding engine, pattern-based |
| AI | BYOM — Groq/Anthropic/Ollama | User controls cost, no backend needed for POC |
| Styling | Vanilla CSS | Single file, no build step |
| State | localStorage | Per-browser, no auth needed |
| Fonts | Google Fonts (Chakra Petch, DM Sans, JetBrains Mono) | Free, good contrast |

## Production stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15 + React 19** | App Router, Server Components, Server Actions, streaming, PWA, Vercel deploy |
| Audio | **Strudel** (client component) | No substitute — best browser live-coding engine. `"use client"` + `dynamic()` with `ssr: false` |
| AI | **Vercel AI SDK** | Server-side (keys safe), streaming, `useChat` hook, tool calling, multi-provider (Anthropic, Groq, OpenAI, Ollama) |
| Chat | **Vercel AI SDK `useChat`** | Streaming responses, context accumulation, tool calling for code actions |
| Auth | **Supabase Auth** | Email, Google, wallet connect |
| DB | **Supabase Postgres** | Row Level Security, per-user data, pattern storage |
| Realtime | **Liveblocks** (collab) + **Supabase Realtime** (presence/listeners) | Liveblocks: cursors, conflict resolution. Supabase: simpler pub/sub |
| State | **Zustand** + `zustand/middleware` | Simpler than Redux, localStorage persistence built-in, 1KB |
| Styling | **Tailwind CSS 4 + shadcn/ui** | Utility-first, dark mode native, accessible components |
| Payments | **Stripe** + **USDC on Base** (optional) | Fiat subscriptions + crypto for web3 audience |
| Storage | **Cloudflare R2** | Sample packs, cheap, global CDN |
| Deploy | **Vercel** | Edge, preview per branch, analytics, free tier for alpha |
| Analytics | **PostHog** (open source) or **Vercel Analytics** | No Google Analytics — privacy first |
| Rate limiting | **Upstash** (`@upstash/ratelimit`) | Protect AI endpoints in Next.js middleware |
| Monorepo | **Turborepo** (if needed) | If admin panel, landing page, API grow as separate apps |
| E2E tests | **Playwright** | Test boot → play → autopilot → manual flow |

## Performance considerations

| Concern | Solution |
|---------|----------|
| Strudel + CodeMirror bundle (~800KB) | Lazy load after boot via `next/dynamic` with `ssr: false` |
| AI calls blocking audio thread | Web Workers for AI calls + JSON parsing |
| Sample JSONs (~2MB) | Cache in Service Worker / Cache API after first load |
| Spectrum at 60fps on mobile | Reduce to 30fps, pause when tab is hidden, offer "eco mode" |
| Code eval (CSP) | Strudel uses `eval()` — must allow `unsafe-eval` in CSP. Document this |

## Security

| Risk | Mitigation |
|------|------------|
| API keys exposed in browser (POC) | Server-side AI via Vercel AI SDK (production) |
| No rate limiting (POC) | `@upstash/ratelimit` in Next.js middleware |
| Prompt injection → malicious code | Validate Strudel syntax before eval, sandbox evaluation |
| User-uploaded samples | Virus scan + file type validation on upload |

## Strudel packages

```
@strudel/core        — Pattern, Hap, TimeSpan, evalScope, silence
@strudel/codemirror  — StrudelMirror (CodeMirror 6 + inline visuals)
@strudel/draw        — getDrawContext for canvas drawing
@strudel/transpiler  — Rewrites user JS, $: block labels, mini-notation
@strudel/webaudio    — webaudioOutput, initAudio, samples, getAnalyzerData
@strudel/mini        — Mini-notation parser
@strudel/tonal       — Chord/scale helpers
```

Key config: `resolve.dedupe` in Vite (POC) to prevent duplicate `@strudel/core` instances. In Next.js, handle via `transpilePackages` config.
