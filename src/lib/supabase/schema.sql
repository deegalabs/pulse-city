-- pulse.city database schema
-- Run this in Supabase SQL Editor to set up tables

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Patterns
create table if not exists public.patterns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'Untitled',
  code text not null,
  mode text not null default 'autopilot' check (mode in ('autopilot', 'manual')),
  is_public boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.patterns enable row level security;

-- Patterns policies
create policy "Users can read own patterns"
  on public.patterns for select using (auth.uid() = user_id);

create policy "Public patterns are viewable by everyone"
  on public.patterns for select using (is_public = true);

create policy "Users can insert own patterns"
  on public.patterns for insert with check (auth.uid() = user_id);

create policy "Users can update own patterns"
  on public.patterns for update using (auth.uid() = user_id);

create policy "Users can delete own patterns"
  on public.patterns for delete using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_patterns_user_id on public.patterns(user_id);
create index if not exists idx_patterns_public on public.patterns(is_public) where is_public = true;
create index if not exists idx_patterns_updated on public.patterns(updated_at desc);
