-- =============================================
-- Categories Table Migration
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  slug text not null unique,
  description text,
  color text default '#0a8f07',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Allow anyone to read categories
create policy "Public read categories" on public.categories for select to anon, authenticated using (true);

-- Allow admin role to insert categories (assuming a role claim "role" = 'admin')
create policy "Admin insert categories" on public.categories for insert to authenticated with check (auth.jwt() ->> 'role' = 'admin');
