-- Stores a running total of XP earned per user.
-- Incremented when a quiz is passed; never decremented.
create table if not exists public.user_xp (
  user_id    uuid    not null references auth.users (id) on delete cascade primary key,
  total_xp   integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_xp enable row level security;

create policy "Users can read their own XP"
  on public.user_xp
  for select
  using (auth.uid() = user_id);

create policy "Users can upsert their own XP"
  on public.user_xp
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own XP"
  on public.user_xp
  for update
  using (auth.uid() = user_id);

-- Records each question attempt. One row per (user, article, question).
-- A user may only submit answers once per question (unique constraint).
create table if not exists public.user_question_answers (
  id              uuid        default gen_random_uuid() primary key,
  user_id         uuid        not null references auth.users (id) on delete cascade,
  article_slug    text        not null,
  question_id     text        not null,
  answered_correctly boolean  not null,
  answered_at     timestamptz not null default now(),
  constraint user_question_answers_unique unique (user_id, article_slug, question_id)
);

alter table public.user_question_answers enable row level security;

create policy "Users can read their own answers"
  on public.user_question_answers
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own answers"
  on public.user_question_answers
  for insert
  with check (auth.uid() = user_id);
