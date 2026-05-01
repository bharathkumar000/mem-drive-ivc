"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Zap, 
  Lock, 
  Loader2,
  Activity,
  CheckCircle2,
  BookText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [mode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Demo Credentials Check
    if (email === "1" && password === "1") {
      document.cookie = "mock_session=user:1; path=/";
      router.push("/dashboard");
      return;
    }

    if (email === "2" && password === "2") {
      document.cookie = "mock_session=admin:2; path=/";
      router.push("/quiz/admin");
      return;
    }

    if (email === "9" && password === "9") {
      document.cookie = "mock_session=user:9; path=/";
      router.push("/dashboard");
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
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] flex items-center justify-center p-4 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] grid md:grid-cols-2 min-h-[600px]"
      >
        {/* Branding Side (Left) */}
        <div className="bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] p-12 text-white flex flex-col justify-between relative overflow-hidden order-1">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-black tracking-[0.2em] uppercase">SkillForge</span>
            </div>

            <div className="space-y-2 mb-12">
              <h1 className="text-5xl font-black tracking-tighter leading-none uppercase">System Sync</h1>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.3em] max-w-[200px]">Establish node presence in the NEXUS layers.</p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Zap size={14} />, label: "Instant Validation" },
                { icon: <Lock size={14} />, label: "Military Grade" },
                { icon: <Activity size={14} />, label: "Biometric Nodes" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-default">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-8 border-t border-white/10">
             <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.5em]">Secure Auth Node</p>
          </div>
        </div>

        {/* Form Side (Right) */}
        <div className="p-12 flex flex-col justify-center order-2">
          <div className="text-center mb-10">
            <p className="text-[9px] font-black text-[#2563EB] uppercase tracking-[0.4em] mb-2">Innovators and Visionaries</p>
            <h2 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase mb-1">Welcome</h2>
            <p className="text-[8px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Identification Parameters Sync</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[8px] font-black text-[#64748B] uppercase tracking-[0.3em] pl-1">Node Credentials</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="authorized@skillforge.io"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[8px] font-black text-[#64748B] uppercase tracking-[0.3em] pl-1">Security Protocol Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-bold text-rose-500 uppercase tracking-wider text-center">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(37,99,235,0.2)] active:scale-[0.98]"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  <span>Establish Link</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center opacity-30">
            <p className="text-[7px] font-black text-[#0F172A] uppercase tracking-[0.4em]">Protocol Session: Alpha-9</p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
