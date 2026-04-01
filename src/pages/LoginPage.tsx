import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { motion } from 'framer-motion';
import ivcLogo from '../assets/ivc_logo.jpg';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('ALL_FIELDS_REQUIRED');
      return;
    }

    setLoading(true);

    try {
      // 1/1 and 2/2 testing bypass
      if (email === '1' && password === '1') {
        navigate('/quiz-hub');
        return;
      }
      if (email === '2' && password === '2') {
        navigate('/admin');
        return;
      }

      const { data, error: sbErr } = await supabase.auth.signInWithPassword({ email, password });
      if (sbErr) throw sbErr;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();

      navigate(profile?.role === 'admin' ? '/admin' : '/quiz-hub');
    } catch (err: any) {
      setError(err.message || 'AUTHENTICATION_FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/quiz-hub'
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#f8fafc] font-body">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
           style={{ 
             backgroundImage: `radial-gradient(#e2e8f0 1px, transparent 1px)`, 
             backgroundSize: '24px 24px' 
           }} />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl px-6 py-24"
      >
        <div className="bg-white border border-[#e2e8f0] rounded-[40px] p-16 md:p-24 shadow-[0_60px_120px_rgba(0,0,0,0.08)] flex flex-col items-center">
          
          <div className="relative mb-16 group">
              <img
                src={ivcLogo}
                alt="IVC Logo"
                className="w-48 h-48 object-contain relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                style={{ borderRadius: '40px', boxShadow: '0 12px 60px rgba(0,0,0,0.1)' }}
              />
          </div>

          <div className="w-full flex flex-col items-center gap-6 mb-20 text-center">
              <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight text-[#0f172a] uppercase">IVC HUB</h1>
              <div className="flex items-center gap-10">
                  <div className="h-[3px] w-24 bg-gradient-to-l from-[#2563eb] to-transparent rounded-full" />
                  <span className="font-display text-[12px] tracking-[0.5em] text-[#94a3b8] font-black uppercase">SECURE PORTAL</span>
                  <div className="h-[3px] w-24 bg-gradient-to-r from-[#2563eb] to-transparent rounded-full" />
              </div>
          </div>

          <form onSubmit={handleAuth} className="w-full flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <label className="text-[11px] tracking-[0.4em] text-[#64748b] uppercase font-black pl-2 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_4px_12px_rgba(59,130,246,0.3)]"></div>
                IDENTITY_TOKEN
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-[#e2e8f0] px-10 py-7 text-lg text-[#0f172a] font-black tracking-tight rounded-[24px] outline-none focus:border-[#3b82f6]/40 focus:bg-white transition-all duration-500 placeholder:text-[#cbd5e1] shadow-inner"
                placeholder="Access Identity"
              />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-[11px] tracking-[0.4em] text-[#64748b] uppercase font-black pl-2 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_4px_12px_rgba(16,185,129,0.3)]"></div>
                ENCRYPTION_KEY
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-[#e2e8f0] px-10 py-7 text-lg text-[#0f172a] font-black tracking-tight rounded-[24px] outline-none focus:border-[#10b981]/40 focus:bg-white transition-all duration-500 placeholder:text-[#cbd5e1] shadow-inner"
                placeholder="Secret Sequence"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-[#ef4444] font-display text-[12px] tracking-[0.2em] uppercase font-black text-center py-4 bg-red-50 rounded-2xl border border-red-100">
                ⚠ ACCESS_DENIED: {error}
              </motion.p>
            )}

            <div className="flex flex-col gap-8 mt-12 w-full px-4">
              <button type="submit" disabled={loading} className="w-full py-10 bg-[#0f172a] text-white font-display text-xl tracking-[0.3em] font-black uppercase rounded-[28px] hover:bg-[#1e293b] hover:shadow-[0_40px_80px_rgba(15,23,42,0.2)] active:scale-[0.98] transition-all duration-500 cursor-pointer disabled:opacity-50 flex items-center justify-center">
                {loading ? 'SYNCHRONIZING...' : 'AUTHORIZE SESSION'}
              </button>
              <button onClick={handleGoogleLogin} type="button" disabled={loading} className="w-full py-10 bg-white border-2 border-[#e2e8f0] rounded-[28px] flex items-center justify-center gap-6 hover:bg-[#f8fafc] hover:border-[#3b82f6]/40 active:scale-[0.98] transition-all duration-500 cursor-pointer group shadow-sm">
                <img src="https://www.google.com/favicon.ico" alt="" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[#64748b] group-hover:text-[#0f172a] font-display text-base tracking-[0.2em] font-black uppercase transition-colors">Sign in with Google</span>
              </button>
            </div>
          </form>

          <footer className="mt-20 pt-10 border-t border-[#f1f5f9] w-full text-center">
             <p className="text-[11px] tracking-[0.4em] text-[#94a3b8] font-black uppercase">IVC SECURITY PROTOCOL ACTIVE</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
