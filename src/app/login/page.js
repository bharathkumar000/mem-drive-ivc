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
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/quiz");
    }
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Bypass for 1234
    if (email === "1234" || password === "1234") {
      document.cookie = "mock_session=user; path=/";
      router.push("/quiz");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/quiz");
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F0F4F8] flex items-center justify-center p-4 md:p-8 font-sans text-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] h-full max-h-[700px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white/40 overflow-hidden grid md:grid-cols-[1fr_1.2fr] relative"
      >
        {/* Left Side: Branding (Blue) */}
        <div className="bg-primary-blue p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Skill Forge</h1>
            </motion.div>
            
            <div className="space-y-4 max-w-[300px]">
              <h2 className="text-lg font-bold text-white opacity-80 uppercase tracking-widest leading-none">Innovators & Visionaries</h2>
              <p className="text-white/60 text-sm font-medium leading-relaxed">
                Unlock your potential through the industry-validated NEXUS assessment framework.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/40">
                <div className="w-5 h-px bg-white/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Institutional Node v2.0</span>
              </div>
              <div className="flex gap-6 mt-2">
                <p className="text-[10px] font-bold text-white/50 hover:text-white transition-colors cursor-pointer">Support</p>
                <p className="text-[10px] font-bold text-white/50 hover:text-white transition-colors cursor-pointer">Privacy Policy</p>
              </div>
            </div>
          </div>

          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-deep-indigo rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-indigo rounded-full blur-[120px] opacity-30 -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Right Side: Form Content (White) */}
        <div className="p-12 md:p-16 bg-white overflow-hidden flex flex-col">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-[#0F172A] tracking-tight mb-2">Welcome Back</h1>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-[0.2em]">Enter authorized credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 flex-1">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-primary-blue">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address / Access Code"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-primary-blue focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-primary-blue">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Protocol Key"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] py-4 pl-14 pr-12 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-primary-blue focus:bg-white transition-all shadow-sm"
                />
                <button 
                  type="button" 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-primary-blue text-[10px] font-black uppercase"
                >
                  Forgot?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue text-white py-5 rounded-[20px] font-black text-xs tracking-[0.2em] uppercase hover:bg-deep-indigo transition-all flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Execute Login</span>}
            </button>

            <div className="relative my-8 text-center text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
              <div className="absolute inset-x-0 top-1/2 h-px bg-[#E2E8F0] transition-all" />
              <span className="relative z-10 bg-white px-6">Dual Authentication</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 bg-white border border-[#E2E8F0] py-4 rounded-[20px] hover:bg-[#F8FAFC] transition-all group"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Google</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-3 bg-white border border-[#E2E8F0] py-4 rounded-[20px] hover:bg-[#F8FAFC] transition-all group"
              >
                <div className="w-5 h-5 bg-[#F1F5F9] rounded-md flex items-center justify-center">
                  <Fingerprint size={14} className="text-[#64748B]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Biometric</span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex justify-center gap-2 p-1 bg-[#F1F5F9] rounded-full border border-[#E2E8F0] w-fit mx-auto">
             <button className="px-6 py-2 text-[9px] font-black uppercase rounded-full bg-white text-primary-blue shadow-sm">I'm a Candidate</button>
             <button className="px-6 py-2 text-[9px] font-black uppercase rounded-full text-[#64748B] hover:text-primary-blue transition-colors">I'm an Evaluator</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
