-- "Get a free sample menu" requests from the sogilex.com homepage (2026-11-20). Safe to re-run.
-- Anyone can send one; nobody can read them back through the API (read them in the Supabase Table Editor, and each
-- one is also emailed to hello@sogilex.com by the Edge Function message-email, action "sample").
create table if not exists public.sample_requests (
  id bigint generated always as identity primary key,
  restaurant text not null check (char_length(restaurant) between 1 and 120),
  name text not null check (char_length(name) between 1 and 80),
  email text not null check (char_length(email) between 5 and 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  note text check (note is null or char_length(note) <= 1000),
  emailed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.sample_requests enable row level security;
drop policy if exists "sample_requests: anyone can ask" on public.sample_requests;
create policy "sample_requests: anyone can ask" on public.sample_requests for insert to anon, authenticated with check (true);
revoke all on public.sample_requests from anon, authenticated;
grant insert (restaurant, name, email, phone, note) on public.sample_requests to anon, authenticated;
grant select, update on public.sample_requests to service_role;

-- Spam limits: one request per email a day, 30 a day in all. Then ask the Edge Function to email it.
create or replace function public.sample_request_check() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.sample_requests r where lower(r.email) = lower(new.email) and r.created_at > now() - interval '1 day') then
    raise exception 'We already have your request. We''ll be in touch soon.' using errcode = 'P0001';
  end if;
  if (select count(*) from public.sample_requests r where r.created_at > now() - interval '1 day') >= 30 then
    raise exception 'Too many requests today. Please email hello@sogilex.com instead.' using errcode = 'P0001';
  end if;
  return new;
end $$;
create or replace function public.sample_request_email() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform net.http_post(
    url := 'https://sdltqbctuieyjlujsdhj.supabase.co/functions/v1/message-email',
    body := jsonb_build_object('action', 'sample', 'id', new.id),
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 10000);
  return new;
end $$;
revoke all on function public.sample_request_check() from public, anon, authenticated;
revoke all on function public.sample_request_email() from public, anon, authenticated;
drop trigger if exists sample_request_check on public.sample_requests;
create trigger sample_request_check before insert on public.sample_requests for each row execute function public.sample_request_check();
drop trigger if exists sample_request_email on public.sample_requests;
create trigger sample_request_email after insert on public.sample_requests for each row execute function public.sample_request_email();
