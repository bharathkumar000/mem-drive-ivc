# NEXUS Platform - Innovators & Visionaries Club

NEXUS is a production-ready, full-stack quiz management platform designed for the Innovators & Visionaries Club. It features real-time analytics, AI-powered paragraph analysis, and a robust anti-cheat engine.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI (GPT-4o via Supabase Edge Functions)
- **Animations**: Framer Motion
- **UI**: Modern CSS + Tailwind 4 (Gradients, Glassmorphism, Dark mode)

## Getting Started

### 1. Supabase Setup
- Create a new project at [supabase.com](https://supabase.com).
- Run the `supabase/schema.sql` in the SQL Editor.
- Enable Google OAuth in **Authentication -> Providers**.
- Set Redirect URL to `http://localhost:3000/auth/callback`.

### 2. Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Deploy Edge Functions
Login to Supabase CLI and deploy:
```bash
supabase functions deploy check-paragraph-similarity
```

### 4. Local Development
```bash
npm install
npm run dev
```

## Anti-Cheat Engine
NEXUS implements multi-layer protection:
- **Navigation Lock**: Disables browser back button via state manipulation.
- **Activity Monitoring**: Tracks window visibility changes.
- **AI Verification**: Real-time paragraph analysis to detect similarity and AI-generated text.

## Administration
To set a user as admin, run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'youremail@gmail.com';
```

---
*Developed for V&I Club. Premium access only.*
