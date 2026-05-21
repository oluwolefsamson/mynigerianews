-- =============================================
-- MyNigeriaNews Admin Schema
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Admin Profiles ────────────────────────────────────────────────
create table if not exists public.admin_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'editor', -- 'super_admin' | 'editor' | 'viewer'
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create policy "Admin can read own profile"
  on public.admin_profiles for select
  using (auth.uid() = id);

create policy "Super admin can manage all profiles"
  on public.admin_profiles for all
  using (
    exists (
      select 1 from public.admin_profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- ── Categories ────────────────────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  label       text not null,
  slug        text not null unique,
  description text,
  color       text default '#0a8f07',
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Anyone can read categories"
  on public.categories for select using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (
    exists (select 1 from public.admin_profiles where id = auth.uid())
  );

-- Seed default categories
insert into public.categories (label, slug, description, color) values
  ('Politics', 'politics', 'Nigerian political news and government updates', '#dc2626'),
  ('Business', 'business', 'Economy, markets and corporate news', '#2563eb'),
  ('Sports', 'sports', 'Football, athletics and Nigerian sports coverage', '#16a34a'),
  ('Technology', 'technology', 'Tech industry, startups and innovation', '#7c3aed'),
  ('Health', 'health', 'Health, medicine and wellness in Nigeria', '#0891b2'),
  ('Entertainment', 'entertainment', 'Nollywood, music and celebrity news', '#d97706'),
  ('Education', 'education', 'Education policy and academic news', '#be123c'),
  ('World', 'world', 'International and global news', '#374151'),
  ('Africa', 'africa', 'Pan-African news and continental affairs', '#92400e')
on conflict (slug) do nothing;

-- ── Articles ──────────────────────────────────────────────────────
create table if not exists public.articles (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  content       text,
  excerpt       text,
  category      text not null default 'World',
  image_url     text,
  image_alt     text,
  status        text not null default 'draft', -- 'draft' | 'published' | 'scheduled'
  source        text default 'manual',         -- 'manual' | 'rss'
  source_name   text,                          -- 'BBC World', 'Punch', etc.
  source_url    text,
  read_time     text,
  author_id     uuid references auth.users(id),
  published_at  timestamptz,
  scheduled_for timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_category_idx on public.articles(category);
create index if not exists articles_published_at_idx on public.articles(published_at desc);
create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists articles_source_url_idx on public.articles(source_url);

alter table public.articles enable row level security;

create policy "Published articles are public"
  on public.articles for select
  using (status = 'published');

create policy "Admins can manage all articles"
  on public.articles for all
  using (
    exists (select 1 from public.admin_profiles where id = auth.uid())
  );

-- ── RSS Sources ────────────────────────────────────────────────────
create table if not exists public.rss_sources (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  url             text not null unique,
  category        text not null default 'World',
  enabled         boolean not null default true,
  last_fetched_at timestamptz,
  fetch_interval  integer not null default 60, -- minutes
  created_at      timestamptz not null default now()
);

alter table public.rss_sources enable row level security;

create policy "Admins can manage rss_sources"
  on public.rss_sources for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Seed default RSS sources
insert into public.rss_sources (name, url, category) values
  ('BBC World News',    'https://feeds.bbci.co.uk/news/world/rss.xml',        'World'),
  ('BBC Africa',        'https://feeds.bbci.co.uk/news/world/africa/rss.xml', 'Africa'),
  ('Punch Nigeria',     'https://punchng.com/feed/',                           'Nigeria'),
  ('Vanguard Nigeria',  'https://www.vanguardngr.com/feed/',                   'Nigeria'),
  ('Premium Times',     'https://www.premiumtimesng.com/feed/',                'Nigeria'),
  ('Guardian Nigeria',  'https://guardian.ng/feed/',                           'Nigeria'),
  ('The Nation Nigeria','https://thenationonline.net/feed/',                   'Nigeria')
on conflict (url) do nothing;

-- ── Import Log ─────────────────────────────────────────────────────
create table if not exists public.import_log (
  id                 uuid primary key default uuid_generate_v4(),
  source_id          uuid references public.rss_sources(id),
  source_name        text,
  articles_imported  integer default 0,
  articles_skipped   integer default 0,
  status             text default 'success', -- 'success' | 'error'
  error_message      text,
  ran_at             timestamptz not null default now()
);

alter table public.import_log enable row level security;

create policy "Admins can view import log"
  on public.import_log for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- ── Site Settings (CMS) ────────────────────────────────────────────
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings for select using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Seed default settings
insert into public.site_settings (key, value) values
  ('site_name',      '"MyNigeriaNews"'),
  ('site_tagline',   '"Nigeria''s Trusted News Source"'),
  ('breaking_news',  '["Senate passes new budget amendment", "CBN raises interest rate to 26.75%"]'),
  ('social_links',   '{"facebook": "https://facebook.com", "twitter": "https://x.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com"}'),
  ('auto_import',    '{"enabled": true, "interval_minutes": 60}')
on conflict (key) do nothing;

-- ── Updated-at trigger ─────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger articles_updated_at
  before update on public.articles
  for each row execute function public.update_updated_at();

create or replace trigger admin_profiles_updated_at
  before update on public.admin_profiles
  for each row execute function public.update_updated_at();

-- =============================================
-- Media Storage & Video Support Additions
-- =============================================

-- 1. Support Video Column in Articles Table
alter table public.articles add column if not exists video_url text;

-- 2. Create the 'media' storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 3. Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- 4. Drop any existing policies on storage.objects for 'media' bucket to avoid duplicates
drop policy if exists "Media bucket is publicly readable" on storage.objects;
drop policy if exists "Authenticated users can upload media" on storage.objects;
drop policy if exists "Authenticated users can delete media" on storage.objects;

-- 5. Set up storage policies for the 'media' bucket
create policy "Media bucket is publicly readable"
  on storage.objects for select
  using ( bucket_id = 'media' );

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check ( bucket_id = 'media' );

create policy "Authenticated users can delete media"
  on storage.objects for delete
  using ( bucket_id = 'media' );
