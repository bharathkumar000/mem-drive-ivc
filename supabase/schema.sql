-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text unique,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  gender text check (gender in ('male', 'female', 'other', null)),
  department text,
  created_at timestamptz default now()
);

-- Trigger to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Quizzes
create table quizzes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  access_code text unique not null,
  category text,
  is_active boolean default true,
  anti_cheat_enabled boolean default true,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Questions
create table questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('mcq', 'paragraph', 'one_word', 'numerical')),
  options jsonb, -- for MCQ: ["Option A", "Option B", ...]
  correct_answer text,
  time_limit integer default 30, -- seconds
  max_points integer default 100,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Submissions (one row per user per quiz attempt)
create table submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  quiz_id uuid references quizzes(id),
  total_score numeric default 0,
  time_taken integer, -- total seconds
  completed boolean default false,
  similarity_score numeric,
  ai_generated_probability numeric,
  flagged boolean default false,
  flag_reason text,
  submitted_at timestamptz default now()
);

-- Answers (one row per question per submission)
create table answers (
  id uuid default uuid_generate_v4() primary key,
  submission_id uuid references submissions(id) on delete cascade,
  question_id uuid references questions(id),
  answer_text text,
  time_taken integer, -- seconds taken for this question
  score numeric default 0,
  similarity_score numeric,
  ai_generated_probability numeric,
  flagged boolean default false,
  created_at timestamptz default now()
);

-- Admin settings
create table admin_settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Default settings
insert into admin_settings (key, value) values
  ('ai_flag_threshold', '75'),
  ('max_violations_before_submit', '3');

-- RLS Policies
alter table profiles enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table submissions enable row level security;
alter table answers enable row level security;

-- Profiles: users can read their own, admins read all
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Quizzes: anyone authenticated can read active quizzes, only admins can write
create policy "Authenticated users can read active quizzes" on quizzes for select using (auth.role() = 'authenticated' and is_active = true);
create policy "Admins can manage quizzes" on quizzes for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Questions: same as quizzes
create policy "Authenticated users can read questions" on questions for select using (auth.role() = 'authenticated');
create policy "Admins can manage questions" on questions for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Submissions: users can see own, admins see all
create policy "Users can manage own submissions" on submissions for all using (user_id = auth.uid());
create policy "Admins can view all submissions" on submissions for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Answers: same as submissions
create policy "Users can manage own answers" on answers for all using (
  exists (select 1 from submissions where id = answers.submission_id and user_id = auth.uid())
);
create policy "Admins can view all answers" on answers for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
