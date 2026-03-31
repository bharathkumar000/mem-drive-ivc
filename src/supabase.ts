import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Custom Auth for testing 1/1 and 2/2
export const mockLogin = async (id: string, pass: string) => {
  if (id === '1' && pass === '1') {
    return { user: { id: 'user-001', email: 'user@ivc.club', role: 'user' }, error: null };
  }
  if (id === '2' && pass === '2') {
    return { user: { id: 'admin-001', email: 'admin@ivc.club', role: 'admin' }, error: null };
  }
  return { user: null, error: 'Invalid credentials' };
};
