"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  User, 
  LogOut, 
  Lock,
  Activity,
  History,
  Trophy,
  LayoutDashboard,
  Cpu,
  Mail,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LandingPortal() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      const hasMockSession = document.cookie.includes("mock_session=");
      
      if (!user && !hasMockSession) {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
     return (
       <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
       </div>
     );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans text-black">
      {/* Subtle Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-[#E2E8F0] relative z-10 overflow-hidden"
      >
        {/* Top Branding Strip */}
        <div className="bg-[#2563EB] h-2 w-full" />
        
        <div className="p-8 md:p-12 space-y-8">
          {/* Header & Identifer */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-[#F8FAFC] rounded-[24px] border-2 border-[#E2E8F0] flex items-center justify-center shadow-inner group-hover:border-[#2563EB] transition-all">
                <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {user?.email?.[0].toUpperCase() || "S"}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-4 border-white rounded-full shadow-sm" />
            </div>
            
            <div className="space-y-1 text-center">
               <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter">Authorized Node Active</h1>
               <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.3em]">Skill Forge Sync Protocol #001</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Core Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-[#F1F5F9] space-y-3">
               <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Cpu size={16} className="text-[#2563EB]" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest leading-none mb-1">Compute Core</p>
                  <p className="text-sm font-black text-[#0F172A]">Module 2.4</p>
               </div>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-[24px] border border-[#F1F5F9] space-y-3">
               <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <Activity size={16} className="text-[#10B981]" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest leading-none mb-1">Stability</p>
                  <p className="text-sm font-black text-[#0F172A]">Live Sync</p>
               </div>
            </div>
          </div>

          {/* User Telemetry Card */}
          <div className="bg-[#0F172A] rounded-[24px] p-6 space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                   <Mail size={14} className="text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Authenticated Identity</p>
                   <p className="text-xs font-bold text-white truncate">{user?.email || "CANDIDATE_ACCESS_NODE"}</p>
                </div>
             </div>
          </div>

          {/* Initiation Trigger */}
          <Link
            href="/quiz"
            className="w-full bg-[#2563EB] text-white py-6 rounded-[28px] font-black text-xs tracking-[0.25em] uppercase hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] group"
          >
            <span>Begin Evaluation</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>

          {/* Footnotes */}
          <div className="text-center space-y-4 pt-4 border-t border-gray-50/50">
            <p className="text-[12px] font-black text-[#0F172A] uppercase tracking-[0.3em]">INNOVATORS & VISIONARIES CLUB</p>
            <div className="flex justify-center gap-8 opacity-40">
               <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#2563EB]" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Low Latency</span>
               </div>
               <div className="flex items-center gap-2">
                  <Lock size={14} className="text-[#10B981]" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Encrypted</span>
               </div>
            </div>
          </div>
        </div>

        {/* Cinematic Under-overlay */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#2563EB]/5 rounded-full blur-[60px]" />
      </motion.div>
    </div>
  );
}
