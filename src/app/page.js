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
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    // Force clear all auth cookies for both mock and live sessions
    document.cookie = "mock_session=; path=/; max-age=0;";
    document.cookie = "mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    await supabase.auth.signOut();
    
    // Immediate hard redirect to ensure state clear
    window.location.href = "/login";
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans text-black">
      {/* Subtle Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-blue/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-[#E2E8F0] relative z-10 overflow-hidden"
      >
        {/* Top Branding Strip */}
        <div className="bg-primary-blue h-2 w-full" />
        
        <div className="p-8 md:p-12 space-y-8">
          {/* Header & User Info */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-[#F1F5F9] rounded-[24px] border-2 border-[#E2E8F0] flex items-center justify-center text-primary-blue shadow-sm group-hover:border-primary-blue transition-all">
                {user?.email?.[0].toUpperCase() || <User size={32} className="stroke-[1.5]" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] border-4 border-white rounded-full animate-pulse shadow-sm" />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Active Session</h1>
              <div className="flex items-center justify-center gap-2">
                <p className="text-[11px] font-black text-[#94A3B8] uppercase tracking-[0.2em] whitespace-nowrap">
                  Skill Forge Node #042
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#F1F5F9] w-full" />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] p-5 rounded-[24px] border border-[#F1F5F9] space-y-2 group hover:border-primary-blue transition-all">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                  <Cpu size={16} className="text-primary-blue" />
                </div>
                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">Active</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">AI Core</p>
                <p className="text-sm font-black text-[#1E293B]">Module 2.4</p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-5 rounded-[24px] border border-[#F1F5F9] space-y-2 group hover:border-warning-amber transition-all">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                  <Activity size={16} className="text-warning-amber" />
                </div>
                <span className="text-[10px] font-black text-warning-amber uppercase tracking-widest">99.8%</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.15em]">Stability</p>
                <p className="text-sm font-black text-[#1E293B]">Live Node</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-[#0F172A] rounded-[24px] p-6 text-white space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Mail size={14} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Authorized Email</p>
                <p className="text-xs font-bold text-white truncate">{user?.email || "guest_042@skillforge.io"}</p>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-4">
            <Link
              href="/quiz"
              className="w-full bg-primary-blue text-white py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:bg-deep-indigo transition-all flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(37,99,235,0.25)] active:scale-[0.98] group"
            >
              <span>Begin Quiz Evaluation</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={handleSignOut}
              disabled={isSignOutLoading}
              className="w-full border-2 border-[#F1F5F9] text-[#64748B] py-5 rounded-[24px] font-black text-xs tracking-[0.2em] uppercase hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {isSignOutLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogOut size={18} />
                  <span>Terminate Session</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[14px] font-black text-[#0F172A] uppercase tracking-[0.3em]">INNOVATORS & VISIONARIES CLUB</p>
            <div className="flex items-center justify-center gap-6 mt-4 opacity-50">
              <div className="flex items-center gap-1.5 font-black text-[9px] uppercase tracking-widest text-[#64748B]">
                <Zap size={12} className="text-warning-amber" />
                <span>Low Latency</span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-[9px] uppercase tracking-widest text-[#64748B]">
                <Lock size={12} className="text-[#10B981]" />
                <span>Secure Link</span>
              </div>
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
