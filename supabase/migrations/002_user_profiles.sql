-- =============================================
-- User Profiles & Subscriptions Migration
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- Create user_profiles table linked to auth.users
create table if not exists public.user_profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  full_name           text,
  subscription_status text not null default 'free', -- 'free' | 'premium'
  subscription_ends_at timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;

-- Drop existing policies if they exist to prevent duplicates
drop policy if exists "Users can read own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;

-- Create policies
create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Create automatic trigger to instantiate user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, subscription_status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'free'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to prevent duplicates
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger updated_at automatically on save
create or replace trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.update_updated_at();
