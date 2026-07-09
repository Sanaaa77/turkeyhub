create table if not exists public.academy_courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  language text not null check (language in ('English','Turkish')),
  path text not null,
  level text not null,
  description text not null,
  status text not null default 'draft' check (status in ('draft','published')),
  readiness_weight numeric not null default 0,
  xp_reward integer not null default 0,
  estimated_weeks integer not null default 1,
  created_at timestamptz default timezone('utc'::text, now()) not null
);
create table if not exists public.academy_modules (id uuid default uuid_generate_v4() primary key, course_id uuid references public.academy_courses(id) on delete cascade not null, title text not null, description text not null, order_index integer not null, readiness_focus text not null, xp_reward integer not null default 0, created_at timestamptz default timezone('utc'::text, now()) not null);
create table if not exists public.academy_lessons (id uuid default uuid_generate_v4() primary key, module_id uuid references public.academy_modules(id) on delete cascade not null, title text not null, summary text not null, order_index integer not null, duration_minutes integer not null, video_url text, reading_content text not null, vocabulary_count integer not null default 0, grammar_focus text not null, listening_prompt text not null, speaking_prompt text not null, writing_prompt text not null, xp_reward integer not null default 0, readiness_gain numeric not null default 0, status text not null default 'draft' check (status in ('draft','published')), created_at timestamptz default timezone('utc'::text, now()) not null);
create table if not exists public.academy_quizzes (id uuid default uuid_generate_v4() primary key, lesson_id uuid references public.academy_lessons(id) on delete cascade not null, title text not null, pass_score integer not null default 70, xp_reward integer not null default 0);
create table if not exists public.academy_questions (id uuid default uuid_generate_v4() primary key, quiz_id uuid references public.academy_quizzes(id) on delete cascade not null, prompt text not null, options jsonb not null default '[]'::jsonb, correct_answer text not null, explanation text not null);
create table if not exists public.academy_vocabulary (id uuid default uuid_generate_v4() primary key, lesson_id uuid references public.academy_lessons(id) on delete cascade not null, term text not null, translation text not null, example text not null, mastery_level integer not null default 0);
create table if not exists public.academy_student_progress (profile_id uuid references public.profiles(id) on delete cascade primary key, daily_goal_minutes integer not null default 30, weekly_goal_lessons integer not null default 5, current_streak integer not null default 0, longest_streak integer not null default 0, total_xp integer not null default 0, level integer not null default 1, english_level text not null default 'A1', turkish_level text not null default 'A1', language_readiness numeric not null default 0, overall_readiness numeric not null default 0, last_lesson_id uuid references public.academy_lessons(id) on delete set null, updated_at timestamptz default timezone('utc'::text, now()) not null);
create table if not exists public.academy_achievements (id uuid default uuid_generate_v4() primary key, code text unique not null, title text not null, description text not null, badge_icon text not null, xp_reward integer not null default 0);
create table if not exists public.academy_xp_history (id uuid default uuid_generate_v4() primary key, profile_id uuid references public.profiles(id) on delete cascade not null, source_type text not null, source_id uuid, xp_delta integer not null, created_at timestamptz default timezone('utc'::text, now()) not null);
create table if not exists public.academy_daily_streaks (id uuid default uuid_generate_v4() primary key, profile_id uuid references public.profiles(id) on delete cascade not null, streak_date date not null, minutes_learned integer not null default 0, xp_earned integer not null default 0, unique(profile_id, streak_date));
create table if not exists public.academy_lesson_completions (id uuid default uuid_generate_v4() primary key, profile_id uuid references public.profiles(id) on delete cascade not null, lesson_id uuid references public.academy_lessons(id) on delete cascade not null, score integer not null default 0, xp_earned integer not null default 0, readiness_gain numeric not null default 0, completed_at timestamptz default timezone('utc'::text, now()) not null, unique(profile_id, lesson_id));
alter table public.academy_courses enable row level security; create policy "Public can view published academy courses" on public.academy_courses for select using (status = 'published');
alter table public.academy_modules enable row level security; create policy "Public can view academy modules" on public.academy_modules for select using (true);
alter table public.academy_lessons enable row level security; create policy "Public can view published academy lessons" on public.academy_lessons for select using (status = 'published');
alter table public.academy_quizzes enable row level security; create policy "Public can view academy quizzes" on public.academy_quizzes for select using (true);
alter table public.academy_questions enable row level security; create policy "Public can view academy questions" on public.academy_questions for select using (true);
alter table public.academy_vocabulary enable row level security; create policy "Public can view academy vocabulary" on public.academy_vocabulary for select using (true);
alter table public.academy_student_progress enable row level security; create policy "Users manage own academy progress" on public.academy_student_progress for all using (auth.uid() = profile_id);
alter table public.academy_xp_history enable row level security; create policy "Users view own academy xp" on public.academy_xp_history for select using (auth.uid() = profile_id);
alter table public.academy_daily_streaks enable row level security; create policy "Users manage own academy streaks" on public.academy_daily_streaks for all using (auth.uid() = profile_id);
alter table public.academy_lesson_completions enable row level security; create policy "Users manage own lesson completions" on public.academy_lesson_completions for all using (auth.uid() = profile_id);
