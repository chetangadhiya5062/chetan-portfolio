-- agent-v1 migration. Additive and idempotent: safe to run on the shared database.
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.

-- 1) Posts written in /admin (shown in the site's Writing section) ------------------------------
create table if not exists public.site_posts (
  id         uuid primary key default gen_random_uuid(),
  body       text not null,
  targets    text[] not null default '{site}',
  results    jsonb not null default '{}'::jsonb,   -- { linkedin: {ok, url|error}, x: {ok, url|error} }
  pinned     boolean not null default false,
  hidden     boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists site_posts_created_idx on public.site_posts (pinned desc, created_at desc);

-- 2) OAuth tokens for connected accounts. No public access at all: service role only. ------------
create table if not exists public.integrations (
  provider   text primary key,
  data       jsonb not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.site_posts   enable row level security;
alter table public.integrations enable row level security;

drop policy if exists "public read visible" on public.site_posts;
create policy "public read visible" on public.site_posts for select using (not hidden);
-- integrations: RLS on with no policies = invisible to anon and authenticated roles
