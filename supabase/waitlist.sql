-- Waitlist for upcoming Sogilex tools (applied 2026-11-18). Anyone can join; nobody can read it
-- back through the API: read it in the Supabase dashboard (Table Editor > waitlist).
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null check (char_length(email) between 5 and 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  product text not null check (product in ('menus', 'flyers')),
  created_at timestamptz not null default now(),
  unique (email, product)
);
alter table public.waitlist enable row level security;
drop policy if exists "waitlist: anyone can join" on public.waitlist;
create policy "waitlist: anyone can join" on public.waitlist
  for insert to anon, authenticated with check (true);
revoke all on public.waitlist from anon, authenticated;
grant insert (email, product) on public.waitlist to anon, authenticated;
