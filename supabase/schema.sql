-- ============================================
-- KidSpark AI — Database Schema (Supabase/PostgreSQL)
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PARENTS (account holders)
-- ============================================
create table parents (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  password_hash text not null,
  language text not null default 'en',
  country text not null default 'US',

  -- Consent (COPPA/GDPR)
  consent_logged_at timestamptz not null default now(),
  consent_version text not null default '1.0',
  consent_method text not null default 'email_sms', -- 'email_sms', 'id_scan'

  -- Secondary safeguarding contact (MANDATORY - no null)
  secondary_safeguarding_contact_name text not null,
  secondary_safeguarding_contact_phone text not null,
  secondary_safeguarding_contact_relation text not null, -- 'grandparent', 'aunt', 'school_counselor', etc.

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- CHILD PROFILES
-- ============================================
create table child_profiles (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references parents(id) on delete cascade,
  name text not null,
  age integer not null check (age >= 3 and age <= 16),
  grade text not null,
  curriculum text not null default 'british',
  language text not null default 'en',

  -- Cultural adaptation
  cultural_mode text not null default 'default',
  relational_register text not null default 'facilitator',
  emotional_framing text not null default 'feelings',

  -- Avatar
  avatar_id text not null default 'owl',

  -- Vulnerability profile (F6.4)
  vulnerability_tags text[] not null default '{}',
  vulnerability_notes text not null default '',

  -- Session limits (F4.2)
  daily_session_limit_minutes integer not null default 60,
  allowed_hours_start time not null default '08:00',
  allowed_hours_end time not null default '21:00',

  -- Feature toggles
  creative_studio_enabled boolean not null default true,
  cross_session_memory_enabled boolean not null default false, -- OFF by default
  coaching_mode_only boolean not null default false,

  -- Parent visibility (age-graduated)
  parent_visibility text not null default 'full',

  -- Usage tracking for dependency detection
  avg_daily_minutes_last_14d real not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Max 5 children per parent
create or replace function check_child_limit()
returns trigger as $$
begin
  if (select count(*) from child_profiles where parent_id = NEW.parent_id) >= 5 then
    raise exception 'Maximum 5 child profiles per parent';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger enforce_child_limit
  before insert on child_profiles
  for each row execute function check_child_limit();

-- ============================================
-- CHAT SESSIONS
-- ============================================
create table chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  status text not null default 'active', -- 'active', 'paused', 'ended', 'locked_cooldown'
  duration_minutes real not null default 0,
  topics text[] not null default '{}',

  -- Curriculum context for this session
  curriculum text,
  grade text,
  subject text,
  unit_name text,
  methodology_notes text
);

create index idx_sessions_child on chat_sessions(child_id);
create index idx_sessions_started on chat_sessions(started_at);

-- ============================================
-- CHAT MESSAGES
-- ============================================
create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('child', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now(),

  -- Hint-first tracking
  hint_level integer not null default 0,

  -- Safety flags
  flagged boolean not null default false,
  flag_reason text
);

create index idx_messages_session on chat_messages(session_id);

-- ============================================
-- SAFEGUARDING FLAGS (immutable audit log)
-- ============================================
create table safeguarding_flags (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references chat_sessions(id),
  child_id uuid not null references child_profiles(id),
  message_id uuid references chat_messages(id),

  severity text not null, -- 'scenario_a_abuse', 'scenario_b_crisis', 'scenario_c_parent_implicated', 'scenario_d_pattern'
  trigger_content text not null,
  ai_response text not null,

  status text not null default 'pending_review',
  alerted_parent boolean not null default false,
  alerted_secondary boolean not null default false,

  reviewed_by text,
  reviewed_at timestamptz,
  review_notes text,

  created_at timestamptz not null default now()
);

-- Safeguarding flags are APPEND ONLY — never updated or deleted
-- This is an audit log for regulatory compliance
create index idx_safeguarding_child on safeguarding_flags(child_id);
create index idx_safeguarding_status on safeguarding_flags(status);

-- ============================================
-- WEEKLY SUMMARIES (auto-generated for parents)
-- ============================================
create table weekly_summaries (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  week_start date not null,
  total_sessions integer not null default 0,
  total_minutes real not null default 0,
  topics_explored text[] not null default '{}',
  longest_session_minutes real not null default 0,
  safeguarding_flags_count integer not null default 0,
  struggles text[] not null default '{}',
  strengths text[] not null default '{}',
  generated_summary text not null default '',
  created_at timestamptz not null default now(),

  unique(child_id, week_start)
);

-- ============================================
-- CURRICULUM DATA (metadata layer)
-- ============================================
create table curriculum_subjects (
  id uuid primary key default uuid_generate_v4(),
  curriculum text not null,
  grade text not null,
  subject text not null,
  term integer not null default 1,

  unique(curriculum, grade, subject, term)
);

create table curriculum_units (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references curriculum_subjects(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  learning_objectives text[] not null default '{}',
  methodology_notes text not null default '',
  keywords text[] not null default '{}'
);

-- ============================================
-- CONSENT AUDIT LOG (immutable, for COPPA/GDPR)
-- ============================================
create table consent_log (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references parents(id),
  action text not null, -- 'initial_consent', 'consent_renewed', 'consent_withdrawn', 'data_deletion_requested'
  terms_version text not null,
  method text not null,
  ip_address text,
  created_at timestamptz not null default now()
);

-- ============================================
-- SESSION USAGE (for dependency detection)
-- ============================================
create table daily_usage (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references child_profiles(id) on delete cascade,
  date date not null,
  total_minutes real not null default 0,
  session_count integer not null default 0,

  unique(child_id, date)
);

create index idx_daily_usage_child_date on daily_usage(child_id, date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table parents enable row level security;
alter table child_profiles enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table safeguarding_flags enable row level security;
alter table weekly_summaries enable row level security;
alter table consent_log enable row level security;
alter table daily_usage enable row level security;

-- Parents can only see their own data
create policy "Parents see own data" on parents
  for select using (id = auth.uid());

create policy "Parents see own children" on child_profiles
  for all using (parent_id = auth.uid());

create policy "Parents see own children sessions" on chat_sessions
  for select using (
    child_id in (select id from child_profiles where parent_id = auth.uid())
  );

create policy "Parents see own children messages" on chat_messages
  for select using (
    session_id in (
      select cs.id from chat_sessions cs
      join child_profiles cp on cs.child_id = cp.id
      where cp.parent_id = auth.uid()
    )
  );
