"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Lock,
  Loader2,
  Fingerprint,
  User,
  LogOut,
  Trophy,
  Settings,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
    
    // Check for mock session safely on client
    setHasSession(document.cookie.includes('mock_session'));
  }, []);

  const handleSignOut = async () => {
    document.cookie = "mock_session=; path=/; max-age=0;";
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleAccessCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Access Code Bypass for "1234" or Dev mocks "1" and "2"
    if (accessCode === "1234" || accessCode === "1") {
      document.cookie = "mock_session=user; path=/";
      router.push("/quiz");
      router.refresh();
      return;
    }
    if (accessCode === "2") {
      document.cookie = "mock_session=admin; path=/";
      router.push("/quiz/admin");
      router.refresh();
      return;
    }

    setError("Access denied. Invalid protocol code.");
    setLoading(false);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans text-black">
      {/* Subtle Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-blue/5 rounded-full blur-[120px]" />
      
      {/* Top Right Profile Option (Only visible if session exists) */}
      {(user || hasSession) && (
        <div className="absolute top-6 right-6 z-50">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-pill shadow-sm hover:border-primary-blue transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-primary-blue text-xs font-bold shadow-sm group-hover:bg-primary-blue group-hover:text-white transition-colors">
                {user?.email?.[0].toUpperCase() || <User size={14} />}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-black text-[#0F172A] leading-tight truncate max-w-[120px]">
                  {user?.email?.split('@')[0] || "Authorized User"}
                </p>
                <p className="text-[9px] text-[#10B981] uppercase tracking-widest font-black leading-none mt-0.5">Active</p>
              </div>
              <ChevronDown size={14} className={`text-[#64748B] transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 bg-white border border-[#E2E8F0] rounded-[24px] shadow-2xl z-50 p-2 overflow-hidden"
                >
                  <div className="px-4 py-4 border-b border-[#F1F5F9] mb-2 bg-[#F8FAFC]">
                    <p className="text-[9px] text-[#64748B] font-black uppercase tracking-widest mb-1">Session Data</p>
                    <p className="text-xs font-bold text-[#0F172A] truncate">{user?.email || "Guest Session (1234)"}</p>
                  </div>

                  <div className="space-y-1">
                    <Link 
                      href="/quiz/profile"
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC] hover:text-primary-blue rounded-pill transition-all"
                    >
                      <User size={14} />
                      <span>Security Profile</span>
                    </Link>
                    <Link 
                      href="/quiz/leaderboard"
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#64748B] hover:bg-[#F8FAFC] hover:text-primary-blue rounded-pill transition-all"
                    >
                      <Trophy size={14} />
                      <span>Global Ranking</span>
                    </Link>
                  </div>

                  <div className="h-px bg-[#F1F5F9] my-2" />

                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-pill transition-all mb-1"
                  >
                    <LogOut size={14} />
                    <span>Terminate Session</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-[40px] p-10 md:p-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-[#E2E8F0] relative z-10"
      >
        {/* Portal Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-primary-blue rounded-[20px] shadow-[0_8px_20px_rgba(37,99,235,0.2)] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-black text-[#0F172A] tracking-tight text-center">Skill Forge Login</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <p className="text-[11px] font-black text-[#64748B] uppercase tracking-[0.2em] whitespace-nowrap">
                INNOVATORS & VISIONARIES CLUB
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#F1F5F9] w-full my-10" />

        {/* Access Code Form */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#1E293B]">Authorize Session</h2>
          </div>

          <form onSubmit={handleAccessCode} className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="PROCEEDING CODE"
                className="w-full bg-[#F8FAFC] border-2 border-[#F1F5F9] rounded-[24px] py-5 px-6 text-center text-xl font-black tracking-[0.3em] text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:border-primary-blue focus:bg-white transition-all shadow-sm"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue text-white py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:bg-deep-indigo transition-all flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Begin Quiz Attempt</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-500 text-[11px] font-bold"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[#F59E0B]" />
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Low Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-[#10B981]" />
              <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Secure Link</span>
            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-primary-blue/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-accent-indigo/5 rounded-full blur-[80px]" />
      </motion.div>
    </div>
  );
}
