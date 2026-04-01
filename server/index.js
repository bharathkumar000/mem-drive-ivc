require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Admin (Bypasses RLS for backend tasks)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// ⚡ HEALTH CHECK
app.get('/api/status', (req, res) => {
  res.json({ status: 'TERMINAL_ACTIVE', timestamp: new Date().toISOString() });
});

// 🏆 GET LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(10);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'DATABASE_QUERY_FAILED', msg: error.message });
  }
});

// 📝 LOG RESPONSE
app.post('/api/responses', async (req, res) => {
  const { user_id, question_id, answer, points, time_taken } = req.body;
  try {
    const { data, error } = await supabase
      .from('responses')
      .insert({ user_id, question_id, answer, points, time_taken });

    if (error) throw error;
    res.json({ status: 'LOGGED', data });
  } catch (error) {
    res.status(500).json({ error: 'ENTRY_FAILED', msg: error.message });
  }
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `--- [IVC BACKEND TERMINAL ONLINE] ---`);
  console.log(`LISTENING ON PORT: ${PORT}`);
});
