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

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;
