"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Lock,
  Loader2,
  Fingerprint,
  Users,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProtocolAccessPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: quiz, error: fetchError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("access_code", accessCode.toUpperCase())
      .single();

    if (fetchError || !quiz) {
      setError("Invalid Protocol Access Key");
      setLoading(false);
    } else if (quiz.status !== 'lobby') {
      setError("AUTHENTICATION DENIED: Protocol cluster is currently in active assessment. No new node signatures accepted.");
      setLoading(false);
    } else {
      router.push(`/quiz/play/${quiz.access_code}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.02)_0%,_transparent_50%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01, transition: { duration: 0.4 } }}
        className="w-full max-w-[600px] bg-white rounded-[32px] md:rounded-[40px] shadow-[0_50px_90px_-20px_rgba(37,99,235,0.1)] border border-[#f1f5f9] p-8 md:p-12 md:px-16 text-center space-y-8 md:space-y-12 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors" />
        <div className="space-y-3 md:space-y-4">
          <div className="w-14 md:w-16 h-14 md:h-16 bg-blue-50/80 rounded-[24px] md:rounded-[28px] flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
            <Lock className="text-primary-blue w-6 md:w-8 h-6 md:h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-[#0f172a] leading-tight md:leading-none">Protocol <span className="text-primary-blue">Lockdown</span></h1>
          <p className="text-[9px] md:text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.4em] md:tracking-[0.5em]">Initialize High-Fidelity Session Access</p>
        </div>

        <form onSubmit={handleAccess} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-[#94a3b8] uppercase tracking-widest text-left ml-6 italic">Authenticated Node Access Key</label>
            <div className="relative group/input">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within/input:text-primary-blue transition-colors">
                 <Fingerprint size={20} />
              </div>
              <input
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="EX: NEXUS-AURORA"
                className="w-full bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-[24px] py-6 pl-16 pr-8 text-sm font-black text-[#0f172a] tracking-[0.2em] focus:outline-none focus:border-primary-blue focus:ring-[10px] focus:ring-blue-100/40 transition-all placeholder:text-[#cbd5e1] placeholder:font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f172a] text-white py-3.5 rounded-[20px] font-black text-[10px] tracking-[0.3em] uppercase shadow-[0_15px_30px_-10px_rgba(15,23,42,0.25)] hover:bg-primary-blue hover:shadow-primary-blue/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                 <span className="group-hover/btn:tracking-[0.5em] transition-all">Establish Link</span>
                <Zap size={18} className="text-primary-blue group-hover/btn:text-white group-hover/btn:scale-125 transition-all" />
              </>
            )}
          </button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center justify-center gap-3"
              >
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

      </motion.div>
    </div>
  );
}
