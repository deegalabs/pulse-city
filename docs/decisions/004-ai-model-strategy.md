# ADR 004: AI Model Strategy — Model per Task

**Date**: 2026-04-12
**Status**: accepted

## Context

pulse.city uses AI for multiple tasks with different requirements: composing full tracks needs quality, evolving every 30s needs speed, chat needs low latency, and vision needs multimodal support. A single model can't optimize for all. Cost matters for 24/7 autopilot (2880 calls/day).

## Decision

Use different models per task, leveraging Vercel AI SDK's multi-provider support.

### POC (current)

| Task | Model | Reason |
|------|-------|--------|
| All tasks | **Groq — Llama 3.3 70B** | Free, fast (~1s), good JSON output |
| Offline fallback | **Ollama — Llama 3.2** | No internet required |

### Production

| Task | Model | Latency | Cost/call |
|------|-------|---------|-----------|
| **Compose** (new track) | Claude Sonnet 4.6 | ~2-3s | ~$0.008 |
| **Evolve** (30s mutations) | Claude Haiku 4.5 | ~1s | ~$0.002 |
| **Chat** (copilot) | Claude Haiku 4.5 | ~1s | ~$0.002 |
| **Vision** (image analysis) | Claude Haiku 4.5 | ~1.5s | ~$0.003 |
| **Reference analysis** (YouTube/links) | Claude Sonnet 4.6 | ~2-3s | ~$0.008 |
| **Free tier fallback** | Groq Llama 3.3 70B | ~1s | $0.00 |

### Cost estimates (24/7 autopilot)

| Strategy | Daily cost | Monthly cost |
|----------|-----------|--------------|
| All Haiku | ~$5.76 | ~$173 |
| Compose Sonnet + Evolve Haiku | ~$6.50 | ~$195 |
| All Groq (free tier) | $0 | $0 |
| Mixed (Sonnet first + Haiku evolve) | ~$3.50 | ~$105 |

### Model routing logic

```ts
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { createGroq } from '@ai-sdk/groq';

function getModel(task: string, userTier: string) {
  // Free tier users always use Groq
  if (userTier === 'free') {
    return groq('llama-3.3-70b-versatile');
  }

  switch (task) {
    case 'compose':
    case 'analyze-reference':
      return anthropic('claude-sonnet-4-6');

    case 'evolve':
    case 'chat':
    case 'vision':
      return anthropic('claude-haiku-4-5-20251001');

    default:
      return anthropic('claude-haiku-4-5-20251001');
  }
}
```

### User tier model access

| Tier | Models available | Autopilot | Manual chat |
|------|-----------------|-----------|-------------|
| **Free** | Groq only | Yes (Groq) | Yes (Groq) |
| **Pro** ($9.99/mo) | Haiku + Sonnet | Yes (Haiku evolve, Sonnet compose) | Yes (Haiku) |
| **Creator** ($19.99/mo) | All + priority | Yes (Sonnet all) | Yes (Sonnet) |

## Alternatives considered

- **Single model for everything**: Simpler but either too expensive (Sonnet for evolve) or too low quality (Haiku for compose)
- **OpenAI GPT-4o**: Good quality but more expensive, no free tier, less reliable JSON for Strudel code
- **Fine-tuned model**: Best for Strudel syntax but requires training data, maintenance, and hosting costs. Consider post-launch
- **Groq only (production)**: Free but rate limits (30 req/min) may hit issues with many concurrent users

## Consequences

- Vercel AI SDK handles provider switching natively — no custom abstraction needed
- Server route needs `task` parameter to select model
- Cost scales linearly with active autopilot instances
- Free tier viable with Groq (rate limited but functional)
- Future: fine-tuned Strudel model could replace Haiku for evolve (lower latency, better syntax)
