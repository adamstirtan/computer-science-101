create table if not exists public.user_progress (
  id           uuid        default gen_random_uuid() primary key,
  user_id      uuid        not null references auth.users (id) on delete cascade,
  slug         text        not null,
  completed_at timestamptz not null default now(),
  constraint user_progress_user_slug_unique unique (user_id, slug)
);

alter table public.user_progress enable row level security;

create policy "Users can read their own progress"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.user_progress
  for delete
  using (auth.uid() = user_id);
