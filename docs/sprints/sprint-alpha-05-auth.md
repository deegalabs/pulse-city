# Sprint Alpha-05 — Auth + DB (Supabase)

**Goal**: User accounts, persistent patterns, shareable links
**Status**: planned

## Tasks

- [ ] Supabase project setup (dashboard + env vars)
- [ ] Auth: email + Google OAuth
- [ ] Auth UI: login/signup modal, user avatar in header
- [ ] DB schema: users, patterns, settings tables
- [ ] Row Level Security policies
- [ ] Save pattern (code, title, mode, tags) per user
- [ ] Load pattern list (my patterns)
- [ ] Share pattern via public URL (/p/[id])
- [ ] Pattern page: read-only view with play button
- [ ] Migrate from localStorage to Supabase (fallback to local if not logged in)

## Acceptance criteria

- Sign up with email or Google
- Save a pattern → appears in "my patterns" list
- Share link → anyone can open and play the pattern
- Logout → login again → patterns restored
- Works without login (localStorage fallback, limited features)

## DB Schema

```sql
create table patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text not null,
  code text not null,
  tags text[] default '{}',
  is_public boolean default false,
  plays integer default 0,
  forks integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table patterns enable row level security;

create policy "Users can CRUD own patterns"
  on patterns for all
  using (auth.uid() = user_id);

create policy "Anyone can read public patterns"
  on patterns for select
  using (is_public = true);
```

## Technical notes

- Use `@supabase/ssr` for Next.js App Router integration
- Auth middleware in `middleware.ts` for protected routes
- Pattern sharing: `/p/[id]` is a public route, server component fetches pattern
- Supabase Realtime (future): presence channel for listener count
