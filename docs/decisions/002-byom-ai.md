# ADR 002: BYOM (Bring Your Own Model) AI architecture

**Date**: 2026-04-11
**Status**: accepted

## Context

The AI compose/evolve features need an LLM backend. Options: (a) server-side proxy with our own API key, (b) client-side calls with user's own key.

## Decision

BYOM — user provides their own API key for Groq, Anthropic, or Ollama. All AI calls happen client-side from the browser.

## Consequences

**Positive:**
- No backend needed for POC
- No API costs for us
- User controls which model and how much they spend
- Groq is free (rate limited) — zero friction for demo
- Ollama option for local/offline use
- No API key management or rate limiting on our side

**Negative:**
- API keys stored in localStorage (visible in devtools)
- CORS issues possible (Anthropic requires `anthropic-dangerous-direct-browser-access` header)
- Can't do server-side 24/7 generation without backend
- Each user needs to configure their own key

**Migration path:**
Production version will have server-side AI orchestration with fallback chain, but BYOM remains as an option for power users.
