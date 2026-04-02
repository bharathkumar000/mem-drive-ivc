# Skill Forge - Supabase Setup Guide

Follow these steps to configure your Supabase backend and synchronize it with the Skill Forge infrastructure.

## 1. Database Schema
Copy and run the following SQL code in the **Supabase SQL Editor**:

```sql
-- Profiles Table (Linked to Supabase Auth)
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  avatar_url text,
  role text DEFAULT 'user', -- 'user' or 'admin'
  created_at timestamp WITH time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quizzes Table
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamp WITH time zone DEFAULT now()
);

-- Questions Table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL, -- 'mcq' or 'paragraph'
  options jsonb, -- ['A', 'B', 'C', 'D']
  correct_answer text,
  time_limit integer DEFAULT 30, -- in seconds
  order_index integer
);

-- Submissions Table
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  total_score integer DEFAULT 0,
  time_taken integer, -- total time in seconds
  submitted_at timestamp WITH time zone DEFAULT now(),
  -- AI Stats
  similarity_score float,
  ai_probability float,
  flagged boolean DEFAULT false
);

-- Admin Settings
CREATE TABLE admin_settings (
  id integer PRIMARY KEY DEFAULT 1,
  ai_flag_threshold float DEFAULT 75.0,
  updated_at timestamp WITH time zone DEFAULT now()
);
```

## 2. Row Level Security (RLS)
Enable RLS on all tables and run these policies to secure your data:

```sql
-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users view self" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Submissions: Users can view their own, Admins view all
CREATE POLICY "Users view own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins full control submissions" ON submissions ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

## 3. Real-time setup
To enable the **Real-time Leaderboard**, navigate to **Database -> Replication** in Supabase and ensure the `submissions` table is added to the `supabase_realtime` publication.

## 4. Google Auth Setup
1. Go to **Authentication -> Providers**.
2. Enable **Google**.
3. Input your `Client ID` and `Client Secret` from the Google Cloud Console.
4. Set the **Site URL** to `http://localhost:3000` for development.

## 5. Promote yourself to Admin
To access the Admin Dashboard, run this SQL after your first login:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'YOUREMAIL@gmail.com';
```

## 6. Environment Variables
Ensure your `.env.local` contains the keys derived from **Project Settings -> API**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (The "secret" secret key)
