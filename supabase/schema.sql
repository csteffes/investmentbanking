create extension if not exists "pgcrypto";

create table if not exists public.candidate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  school_program text,
  background text,
  target_banks text[] default '{}',
  target_groups text[] default '{}',
  recruiting_stage text,
  interview_date date,
  technical_confidence integer check (technical_confidence between 1 and 10),
  resume_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  stripe_customer_id text unique not null,
  stripe_subscription_id text unique,
  status text not null,
  price_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mock_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  trial_id text,
  bank text,
  group_name text,
  interview_stage text,
  mode text not null,
  prompt text,
  transcript_text text,
  readiness_score integer,
  created_at timestamptz not null default now()
);

create table if not exists public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.mock_sessions(id) on delete cascade,
  speaker text not null,
  segment_order integer not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.scorecards (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.mock_sessions(id) on delete cascade,
  technical_accuracy integer,
  structure integer,
  communication integer,
  poise integer,
  commercial_judgment integer,
  summary text,
  evidence jsonb not null default '[]'::jsonb,
  next_steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.trial_usage_counters (
  trial_id text primary key,
  realtime_count integer not null default 0,
  debrief_count integer not null default 0,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_ip text
);

create table if not exists public.anonymous_source_limits (
  source_key text not null,
  bucket_date date not null,
  realtime_count integer not null default 0,
  debrief_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (source_key, bucket_date)
);

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

alter table public.candidate_profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.mock_sessions enable row level security;
alter table public.transcript_segments enable row level security;
alter table public.scorecards enable row level security;
alter table public.trial_usage_counters enable row level security;
alter table public.anonymous_source_limits enable row level security;

alter table public.mock_sessions
add column if not exists trial_id text;

create index if not exists mock_sessions_user_id_idx on public.mock_sessions (user_id);
create index if not exists mock_sessions_trial_id_idx on public.mock_sessions (trial_id);
create index if not exists transcript_segments_session_id_idx on public.transcript_segments (session_id);
create index if not exists trial_usage_counters_last_seen_at_idx on public.trial_usage_counters (last_seen_at);
create index if not exists anonymous_source_limits_bucket_date_idx on public.anonymous_source_limits (bucket_date);

drop policy if exists "candidate_profiles_select_own" on public.candidate_profiles;
create policy "candidate_profiles_select_own"
on public.candidate_profiles for select
using (auth.uid() = user_id);

drop policy if exists "candidate_profiles_insert_own" on public.candidate_profiles;
create policy "candidate_profiles_insert_own"
on public.candidate_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "candidate_profiles_update_own" on public.candidate_profiles;
create policy "candidate_profiles_update_own"
on public.candidate_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "candidate_profiles_delete_own" on public.candidate_profiles;
create policy "candidate_profiles_delete_own"
on public.candidate_profiles for delete
using (auth.uid() = user_id);

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions for select
using (auth.uid() = user_id);

drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own"
on public.subscriptions for insert
with check (auth.uid() = user_id);

drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own"
on public.subscriptions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "mock_sessions_select_own" on public.mock_sessions;
create policy "mock_sessions_select_own"
on public.mock_sessions for select
using (auth.uid() = user_id);

drop policy if exists "mock_sessions_insert_own" on public.mock_sessions;
create policy "mock_sessions_insert_own"
on public.mock_sessions for insert
with check (auth.uid() = user_id);

drop policy if exists "mock_sessions_update_own" on public.mock_sessions;
create policy "mock_sessions_update_own"
on public.mock_sessions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "mock_sessions_delete_own" on public.mock_sessions;
create policy "mock_sessions_delete_own"
on public.mock_sessions for delete
using (auth.uid() = user_id);

drop policy if exists "transcript_segments_select_via_session" on public.transcript_segments;
create policy "transcript_segments_select_via_session"
on public.transcript_segments for select
using (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = transcript_segments.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "transcript_segments_insert_via_session" on public.transcript_segments;
create policy "transcript_segments_insert_via_session"
on public.transcript_segments for insert
with check (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = transcript_segments.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "transcript_segments_update_via_session" on public.transcript_segments;
create policy "transcript_segments_update_via_session"
on public.transcript_segments for update
using (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = transcript_segments.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = transcript_segments.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "transcript_segments_delete_via_session" on public.transcript_segments;
create policy "transcript_segments_delete_via_session"
on public.transcript_segments for delete
using (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = transcript_segments.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "scorecards_select_via_session" on public.scorecards;
create policy "scorecards_select_via_session"
on public.scorecards for select
using (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = scorecards.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "scorecards_insert_via_session" on public.scorecards;
create policy "scorecards_insert_via_session"
on public.scorecards for insert
with check (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = scorecards.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "scorecards_update_via_session" on public.scorecards;
create policy "scorecards_update_via_session"
on public.scorecards for update
using (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = scorecards.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = scorecards.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "scorecards_delete_via_session" on public.scorecards;
create policy "scorecards_delete_via_session"
on public.scorecards for delete
using (
  exists (
    select 1
    from public.mock_sessions
    where public.mock_sessions.id = scorecards.session_id
      and public.mock_sessions.user_id = auth.uid()
  )
);

drop policy if exists "resumes_select_own" on storage.objects;
create policy "resumes_select_own"
on storage.objects for select
using (bucket_id = 'resumes' and owner = auth.uid());

drop policy if exists "resumes_insert_own" on storage.objects;
create policy "resumes_insert_own"
on storage.objects for insert
with check (bucket_id = 'resumes' and owner = auth.uid());

drop policy if exists "resumes_update_own" on storage.objects;
create policy "resumes_update_own"
on storage.objects for update
using (bucket_id = 'resumes' and owner = auth.uid())
with check (bucket_id = 'resumes' and owner = auth.uid());

drop policy if exists "resumes_delete_own" on storage.objects;
create policy "resumes_delete_own"
on storage.objects for delete
using (bucket_id = 'resumes' and owner = auth.uid());

create or replace function public.cleanup_anonymous_trial_data(retention_days integer default 30)
returns void
language plpgsql
security definer
as $$
begin
  delete from public.mock_sessions
  where user_id is null
    and created_at < now() - make_interval(days => retention_days);

  delete from public.trial_usage_counters
  where last_seen_at < now() - make_interval(days => retention_days);

  delete from public.anonymous_source_limits
  where bucket_date < (current_date - retention_days);
end;
$$;
