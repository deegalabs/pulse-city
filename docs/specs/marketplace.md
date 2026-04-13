# Spec: Marketplace (Future)

## Summary

A marketplace where users can browse, publish, fork, and trade Strudel patterns, sample packs, AI agent personalities, and visual themes.

## Assets

| Type | Description | Format |
|------|-------------|--------|
| Patterns | Strudel compositions | Code string + metadata (title, tags, preview) |
| Sample packs | Custom sound kits | Audio files (WAV/MP3) in zip, hosted on R2/S3 |
| AI Agents | DJ personalities | System prompt + style config (JSON) |
| Visual themes | Spectrum/editor skins | CSS variables + config |

## User flows

### Browse & discover
- Feed of trending/recent patterns
- Click to preview (plays in mini player without leaving feed)
- Tags: #techno #ambient #lofi #brazilian #experimental
- Search by title, tag, creator

### Publish
- User creates pattern in editor (manual mode)
- Clicks "Publish" → fills title, description, tags
- Auto-generates 30s audio preview
- Pattern code is stored (open source by default — AGPL)

### Fork & remix
- Any published pattern can be forked
- Fork loads code into editor
- User modifies and can publish as new pattern
- Fork chain is tracked (attribution)

### Economy
- Free tier: browse, play, publish basic patterns, 1 AI agent
- Pro: all agents, premium sample packs, collab, analytics
- Creator revenue: % when someone uses your pattern/sample/agent
- Currency options: Stripe credits or USDC on Base

## Technical requirements (production)

- Auth: email + optional wallet connect
- DB: patterns table, users table, transactions table
- Storage: Cloudflare R2 for samples
- Search: full-text search on patterns (Supabase or Meilisearch)
- Realtime: live listener count per pattern
- Analytics: play count, fork count, revenue per creator

## Not in POC

This is a future phase feature. The POC focuses on the core experience (autopilot + manual). Marketplace comes in Phase 3 (Beta).
