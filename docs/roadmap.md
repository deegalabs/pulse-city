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
