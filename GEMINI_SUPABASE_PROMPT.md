# Skill Forge - Gemini Supabase Prompt

Copy and paste the prompt below into **Gemini** to generate the high-fidelity SQL and setup flow for your project.

---

### 🗨️ COPY THIS PROMPT TO GEMINI:

"I am building a premium Quiz Platform called **Skill Forge** using **Next.js 14 App Router** and **Supabase (PostgreSQL)**. 

Please act as a Senior Supabase Architect and generate a comprehensive **SQL Setup Script** that includes the following:

**1. DATABASE TABLES:**
- **Profiles**: Linked to `auth.users`, including `full_name`, `email`, `avatar_url`, `role` (default 'user'), and `created_at`.
- **Quizzes**: Including `title`, `description`, `created_by` (FK to profiles), and `created_at`.
- **Questions**: Linked to Quizzes, including `question_text`, `question_type` (MCQ or Paragraph), `options` (JSONB for MCQ), `correct_answer`, `time_limit`, and `order_index`.
- **Submissions**: Linked to Quizzes and Profiles, including `total_score`, `time_taken`, `submitted_at`, and a section for **AI Stats** (`similarity_score` float, `ai_probability` float, `flagged` boolean).
- **Admin Settings**: A single-row table to store `ai_flag_threshold` (float, default 75.0).

**2. ROW LEVEL SECURITY (RLS):**
- Enable RLS on all tables.
- **Profiles**: Users can only see/update their own data; Admins can see all profiles.
- **Quizzes & Questions**: Publicly readable for authenticated users; Only Admins can Create/Update/Delete.
- **Submissions**: Users can only see their own submissions; Admins can see and update all submissions for analysis.

**3. REAL-TIME REPLICATION:**
Provide the SQL command to add the `submissions` table to the `supabase_realtime` publication for the live leaderboard.

**4. ADMIN PROMOTION:**
Give me a snippet to manually update a user email to the 'admin' role.

**FORMATTING:**
Please provide the SQL in a single block for the Supabase SQL Editor and a clear **Step-by-Step Flow** for the Google OAuth Authentication setup."

---

### 🌊 THE SETUP FLOW (RECAP):

1.  **Paste Prompt**: Copy the block above into Gemini.
2.  **SQL Editor**: Take the generated SQL and paste it into your **Supabase Dashboard -> SQL Editor -> New Query -> Run**.
3.  **Authentication**: In Supabase, go to **Auth -> Providers -> Google** and paste your Client ID/Secret. Set Redirect URL to `http://localhost:3000/auth/callback`.
4.  **Environment**: Update your `.env.local` with the **Project URL**, **Anon Key**, and **Service Role Key** from Settings -> API.
5.  **Promote Admin**: Once you log in for the first time, run the 'Admin Promotion' SQL from Gemini to grant yourself access to the Dashboard.
