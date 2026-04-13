# Sprint Alpha-01 — Scaffold + Editor + Audio

**Goal**: Next.js app boots, StrudelMirror loads, audio plays
**Status**: planned

## Tasks

- [ ] `create-next-app` with TypeScript, Tailwind, App Router
- [ ] Install dependencies: `@strudel/*`, `zustand`, `ai`, `@ai-sdk/anthropic`, `@ai-sdk/groq`
- [ ] Configure `next.config.ts` (transpilePackages for @strudel/*, CSP headers)
- [ ] Configure `tailwind.config.ts` with custom theme (navy/lime/sky palette)
- [ ] Root layout (fonts: Chakra Petch, DM Sans, JetBrains Mono, dark theme)
- [ ] Boot overlay page (landing with TUNE IN button)
- [ ] StrudelEditor component (`"use client"`, `dynamic()` with `ssr: false`)
- [ ] Audio init on boot click (`initAudio()`, `evalScope()`, `samples()`)
- [ ] Studio page layout (editor left, spectrum right placeholder)

## Acceptance criteria

- `pnpm dev` → app loads at localhost:3000
- Click TUNE IN → boot overlay disappears
- Editor loads with initial code (StrudelMirror with inline visuals)
- Ctrl+Enter → audio plays
- No SSR errors, no duplicate @strudel/core

## Technical notes

- StrudelMirror MUST be loaded with `ssr: false` (uses DOM, eval, WebAudio)
- `transpilePackages` in next.config for all @strudel/* packages
- CSP header must include `unsafe-eval` for Strudel transpiler
- Fonts: use `next/font/google` for automatic optimization
