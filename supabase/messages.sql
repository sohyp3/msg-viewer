create extension if not exists pgcrypto;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  wa_no text not null,
  content text not null,
  sender text not null
);

alter table public.messages enable row level security;

drop policy if exists "Authenticated users can read messages" on public.messages;
create policy "Authenticated users can read messages"
on public.messages
for select
to authenticated
using (true);

alter publication supabase_realtime add table public.messages;
