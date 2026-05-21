-- =============================================
-- Add views_count column to articles
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

alter table public.articles add column if not exists views_count integer not null default 0;

-- Optional: backfill existing rows (if any) with 0 (already default)

-- Enable RLS if not already enabled (should already be)
-- alter table public.articles enable row level security;

-- Ensure admin can update view counts
create policy "Admin can update view count" on public.articles for update to authenticated using (auth.jwt() ->> 'role' = 'admin');
