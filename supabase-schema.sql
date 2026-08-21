create extension if not exists pgcrypto;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'active',
  health text not null default 'green',
  priority text not null default 'medium',
  progress integer not null default 0 check (progress between 0 and 100),
  next_milestone text,
  blocker text,
  next_action text,
  owner text default 'Michael',
  due_date date,
  mission text,
  success text,
  risk text,
  strategy text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  bucket text not null default 'do',
  priority text not null default 'medium',
  status text not null default 'open',
  owner text default 'Michael',
  due_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists waiting_on (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  person text not null,
  item text not null,
  requested_on date,
  follow_up_on date,
  priority text default 'medium',
  status text default 'waiting',
  created_at timestamptz default now()
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  context text,
  recommendation text,
  consequence_of_delay text,
  priority text default 'medium',
  status text default 'open',
  due_date date,
  impact integer default 80 check (impact between 1 and 100),
  confidence integer default 80 check (confidence between 1 and 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  role text,
  company text,
  health integer default 70 check (health between 1 and 100),
  last_interaction date,
  project_ids uuid[] default '{}',
  next_move text,
  open_loops integer default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists health_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  health_data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists daily_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brief_date date not null default current_date,
  executive_summary text,
  priorities jsonb default '[]'::jsonb,
  risks jsonb default '[]'::jsonb,
  decisions jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  unique(user_id, brief_date)
);

alter table projects enable row level security;
alter table actions enable row level security;
alter table waiting_on enable row level security;
alter table decisions enable row level security;
alter table relationships enable row level security;
alter table health_profiles enable row level security;
alter table daily_briefs enable row level security;

drop policy if exists projects_own on projects;
drop policy if exists actions_own on actions;
drop policy if exists waiting_own on waiting_on;
drop policy if exists decisions_own on decisions;
drop policy if exists relationships_own on relationships;
drop policy if exists health_own on health_profiles;
drop policy if exists briefs_own on daily_briefs;

create policy projects_own on projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy actions_own on actions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy waiting_own on waiting_on for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy decisions_own on decisions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy relationships_own on relationships for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy health_own on health_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy briefs_own on daily_briefs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Safe upgrades for anyone who ran an earlier MichaelOS schema.
alter table projects add column if not exists progress integer not null default 0;
alter table projects add column if not exists mission text;
alter table projects add column if not exists success text;
alter table projects add column if not exists risk text;
alter table projects add column if not exists strategy text;
alter table decisions add column if not exists impact integer default 80;
alter table decisions add column if not exists confidence integer default 80;
alter table decisions add column if not exists updated_at timestamptz default now();
