-- The Daily Arcana — initial schema
-- Every table holding personal data has row-level security (RLS) enabled with owner-only policies.
-- Reference content (cards, lessons) is world-readable but writable only by the service role.

create schema if not exists private;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Settings the app relies on that users must never be able to change (e.g. AI quotas).
create table private.settings (
  key text primary key,
  value jsonb not null
);
insert into private.settings (key, value) values ('ai_daily_request_limit', '20'::jsonb);

-- ---------------------------------------------------------------------------
-- Profiles & preferences
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  timezone text not null default 'UTC' check (char_length(timezone) between 1 and 64),
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  allow_reversals boolean not null default true,
  write_before_reveal boolean not null default true,
  ai_interpretations boolean not null default true,
  tradition text not null default 'rws' check (tradition in ('rws')),
  default_category text not null default 'general'
    check (default_category in ('love', 'career', 'finances', 'family', 'growth', 'spirituality', 'general')),
  reduced_motion boolean not null default false,
  updated_at timestamptz not null default now()
);

create trigger profiles_touch before update on public.profiles
  for each row execute function private.touch_updated_at();
create trigger user_preferences_touch before update on public.user_preferences
  for each row execute function private.touch_updated_at();

-- Create profile + default preferences whenever someone signs up.
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------------
-- Reference content
-- ---------------------------------------------------------------------------
create table public.tarot_cards (
  id text primary key
    check (id ~ '^(major-(0[0-9]|1[0-9]|2[01])-[a-z-]+|(wands|cups|swords|pentacles)-(0[1-9]|1[0-4])-(ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king))$'),
  name text not null unique,
  arcana text not null check (arcana in ('major', 'minor')),
  suit text check (suit in ('wands', 'cups', 'swords', 'pentacles')),
  number smallint not null check (number between 0 and 21),
  content jsonb not null,
  content_version text not null,
  updated_at timestamptz not null default now(),
  check ((arcana = 'major' and suit is null) or (arcana = 'minor' and suit is not null))
);

create table public.learning_courses (
  id text primary key,
  title text not null,
  description text not null,
  position smallint not null unique
);

create table public.learning_lessons (
  id text primary key,
  course_id text not null references public.learning_courses (id) on delete cascade,
  position smallint not null,
  title text not null,
  content_version text not null,
  unique (course_id, position)
);

-- ---------------------------------------------------------------------------
-- Readings
-- ---------------------------------------------------------------------------
create table public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- daily: the one saved card of the day. daily_extra: an explicitly requested additional pull.
  kind text not null check (kind in ('daily', 'daily_extra', 'question')),
  spread text not null check (spread in ('daily', 'one-card', 'three-card', 'five-card')),
  category text not null default 'general'
    check (category in ('love', 'career', 'finances', 'family', 'growth', 'spirituality', 'general')),
  question text check (char_length(question) <= 500),
  context text check (char_length(context) <= 800),
  -- Calendar date in the user's timezone when the reading was made; drives "today's card".
  local_date date not null,
  timezone text not null check (char_length(timezone) between 1 and 64),
  allow_reversals boolean not null,
  -- A genuinely new pull made from an earlier reading (never a silent replacement).
  parent_reading_id uuid references public.readings (id) on delete set null,
  content_version text not null,
  bookmarked boolean not null default false,
  created_at timestamptz not null default now()
);

-- One saved daily card per user per local calendar day.
create unique index readings_one_daily_per_day on public.readings (user_id, local_date) where kind = 'daily';
create index readings_user_created_idx on public.readings (user_id, created_at desc);
create index readings_user_category_idx on public.readings (user_id, category);

create table public.reading_cards (
  reading_id uuid not null references public.readings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  position smallint not null check (position between 0 and 9),
  position_key text not null check (char_length(position_key) <= 40),
  card_id text not null references public.tarot_cards (id),
  reversed boolean not null,
  primary key (reading_id, position),
  -- A card can appear only once in a spread.
  unique (reading_id, card_id)
);
create index reading_cards_user_card_idx on public.reading_cards (user_id, card_id);

-- Immutable record of each interpretation shown to the user (reference or AI).
create table public.interpretation_snapshots (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references public.readings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  source text not null check (source in ('reference', 'ai')),
  generator text not null check (char_length(generator) <= 120),
  content_version text not null,
  interpretation jsonb not null,
  created_at timestamptz not null default now()
);
create index interpretation_snapshots_reading_idx on public.interpretation_snapshots (reading_id, created_at);

-- Follow-up questions about an existing spread. The cards never change; answers are snapshots too.
create table public.reading_followups (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references public.readings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  question text not null check (char_length(question) between 1 and 500),
  answer jsonb not null,
  generator text not null,
  created_at timestamptz not null default now()
);
create index reading_followups_reading_idx on public.reading_followups (reading_id, created_at);

create table public.reading_feedback (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references public.readings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint check (rating between 1 and 5),
  resonance text check (resonance in ('resonated', 'partly', 'did_not')),
  comment text check (char_length(comment) <= 2000),
  created_at timestamptz not null default now(),
  unique (reading_id, user_id)
);

create table public.shared_readings (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references public.readings (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  -- Unguessable token used in the public URL; the reading id is never exposed.
  token text not null unique default translate(encode(extensions.gen_random_bytes(18), 'base64'), '+/', '-_'),
  include_question boolean not null default false,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Journal
-- ---------------------------------------------------------------------------
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  reading_id uuid references public.readings (id) on delete set null,
  -- pre_reveal: the user's own interpretation written before seeing the app's.
  kind text not null check (kind in ('pre_reveal', 'reflection', 'free', 'practice')),
  title text check (char_length(title) <= 120),
  body text not null check (char_length(body) between 1 and 20000),
  resonance text check (resonance in ('resonated', 'partly', 'did_not')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index journal_entries_user_created_idx on public.journal_entries (user_id, created_at desc);
create index journal_entries_reading_idx on public.journal_entries (reading_id);
create trigger journal_entries_touch before update on public.journal_entries
  for each row execute function private.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Learning
-- ---------------------------------------------------------------------------
create table public.learning_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.learning_lessons (id) on delete cascade,
  status text not null check (status in ('started', 'completed')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create trigger learning_progress_touch before update on public.learning_progress
  for each row execute function private.touch_updated_at();

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject_type text not null check (subject_type in ('lesson', 'card')),
  subject_id text not null check (char_length(subject_id) <= 80),
  score smallint not null check (score >= 0),
  total smallint not null check (total > 0),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  check (score <= total)
);
create index quiz_attempts_user_idx on public.quiz_attempts (user_id, created_at desc);

create table public.practice_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  category text not null
    check (category in ('love', 'career', 'finances', 'family', 'growth', 'spirituality', 'general')),
  cards jsonb not null,
  observations jsonb not null default '{}'::jsonb,
  interpretation text check (char_length(interpretation) <= 10000),
  feedback jsonb,
  created_at timestamptz not null default now()
);
create index practice_exercises_user_idx on public.practice_exercises (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- AI usage (cost control)
-- ---------------------------------------------------------------------------
create table public.ai_usage (
  user_id uuid not null references public.profiles (id) on delete cascade,
  usage_date date not null,
  requests integer not null default 0 check (requests >= 0),
  primary key (user_id, usage_date)
);

-- Atomically consumes one AI request for the calling user. Returns false once the daily limit
-- (stored in private.settings, which users cannot modify) is reached.
create or replace function public.consume_ai_quota() returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  max_requests integer;
  used integer;
begin
  if uid is null then
    return false;
  end if;
  select (value)::text::integer into max_requests from private.settings where key = 'ai_daily_request_limit';
  insert into public.ai_usage (user_id, usage_date, requests)
    values (uid, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, usage_date) do update
    set requests = public.ai_usage.requests + 1
    where public.ai_usage.requests < coalesce(max_requests, 20)
  returning requests into used;
  return used is not null;
end;
$$;

-- ---------------------------------------------------------------------------
-- Public share pages
-- ---------------------------------------------------------------------------
-- Returns only what a share page needs: spread, cards and the latest interpretation. Never
-- journal entries, context or the user's identity. The question is included only if opted in.
create or replace function public.get_shared_reading(share_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'spread', r.spread,
    'category', r.category,
    'question', case when s.include_question then r.question else null end,
    'createdAt', r.created_at,
    'cards', (
      select coalesce(jsonb_agg(jsonb_build_object('cardId', c.card_id, 'position', c.position, 'reversed', c.reversed) order by c.position), '[]'::jsonb)
      from public.reading_cards c where c.reading_id = r.id
    ),
    'interpretation', (
      select i.interpretation from public.interpretation_snapshots i
      where i.reading_id = r.id order by i.created_at desc limit 1
    )
  )
  from public.shared_readings s
  join public.readings r on r.id = s.reading_id
  where s.token = share_token and s.revoked_at is null;
$$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.tarot_cards enable row level security;
alter table public.learning_courses enable row level security;
alter table public.learning_lessons enable row level security;
alter table public.readings enable row level security;
alter table public.reading_cards enable row level security;
alter table public.interpretation_snapshots enable row level security;
alter table public.reading_followups enable row level security;
alter table public.reading_feedback enable row level security;
alter table public.shared_readings enable row level security;
alter table public.journal_entries enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.practice_exercises enable row level security;
alter table public.ai_usage enable row level security;

-- Reference content: readable by everyone.
create policy "cards are public" on public.tarot_cards for select to anon, authenticated using (true);
create policy "courses are public" on public.learning_courses for select to anon, authenticated using (true);
create policy "lessons are public" on public.learning_lessons for select to anon, authenticated using (true);

-- Profiles: created by trigger, readable/updatable only by their owner.
create policy "own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "own preferences" on public.user_preferences for select to authenticated using ((select auth.uid()) = user_id);
create policy "update own preferences" on public.user_preferences for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Readings: owner may create, read, bookmark and delete.
create policy "own readings" on public.readings for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert own readings" on public.readings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own readings" on public.readings for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own readings" on public.readings for delete to authenticated using ((select auth.uid()) = user_id);

-- Child rows must belong to the same user as their reading.
create policy "own reading cards" on public.reading_cards for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert cards into own reading" on public.reading_cards for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.readings r where r.id = reading_id and r.user_id = (select auth.uid()))
);

create policy "own snapshots" on public.interpretation_snapshots for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert snapshot for own reading" on public.interpretation_snapshots for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.readings r where r.id = reading_id and r.user_id = (select auth.uid()))
);

create policy "own followups" on public.reading_followups for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert followup for own reading" on public.reading_followups for insert to authenticated with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.readings r where r.id = reading_id and r.user_id = (select auth.uid()))
);

create policy "own feedback" on public.reading_feedback for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.readings r where r.id = reading_id and r.user_id = (select auth.uid()))
  );

create policy "own shares" on public.shared_readings for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.readings r where r.id = reading_id and r.user_id = (select auth.uid()))
  );

create policy "own journal" on public.journal_entries for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (reading_id is null or exists (select 1 from public.readings r where r.id = reading_id and r.user_id = (select auth.uid())))
  );

create policy "own progress" on public.learning_progress for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own quiz attempts" on public.quiz_attempts for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own practice" on public.practice_exercises for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own ai usage" on public.ai_usage for select to authenticated using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Privileges (explicit, so security does not depend on platform defaults)
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
revoke all on schema private from anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.tarot_cards, public.learning_courses, public.learning_lessons to anon, authenticated;

grant select on public.profiles, public.user_preferences to authenticated;
grant update (display_name, timezone, onboarded_at) on public.profiles to authenticated;
grant update (allow_reversals, write_before_reveal, ai_interpretations, tradition, default_category, reduced_motion)
  on public.user_preferences to authenticated;

-- Cards, dates and questions of a reading are fixed once drawn; only the bookmark can change.
grant select, insert, delete on public.readings to authenticated;
grant update (bookmarked) on public.readings to authenticated;
grant select, insert on public.reading_cards, public.interpretation_snapshots, public.reading_followups to authenticated;
grant select, insert, update, delete on public.reading_feedback, public.journal_entries,
  public.learning_progress, public.quiz_attempts, public.practice_exercises to authenticated;
grant select, insert, delete on public.shared_readings to authenticated;
grant update (revoked_at, include_question) on public.shared_readings to authenticated;
grant select on public.ai_usage to authenticated;

revoke all on function public.consume_ai_quota() from public, anon;
grant execute on function public.consume_ai_quota() to authenticated;
revoke all on function public.get_shared_reading(text) from public;
grant execute on function public.get_shared_reading(text) to anon, authenticated;
