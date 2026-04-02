"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  User, 
  LogOut, 
  Settings, 
  Trophy,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LandingPortal() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col items-center justify-center p-6 font-sans">
      {/* Profile Dropdown */}
      <div className="absolute top-6 right-6">
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white border border-card-border rounded-pill shadow-subtle hover:border-primary-blue transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
              {user?.email?.[0].toUpperCase() || <User size={14} />}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-bold text-text-primary leading-tight truncate max-w-[120px]">
                {user?.email?.split('@')[0] || "User"}
              </p>
              <p className="text-[9px] text-text-meta uppercase tracking-widest font-black">Authorized</p>
            </div>
            <ChevronDown size={14} className={`text-text-meta transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white border border-card-border rounded-inner shadow-xl z-50 p-2 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-card-border mb-2">
                  <p className="text-[10px] text-text-meta font-black uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-xs font-bold text-text-primary truncate">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  <Link 
                    href="/quiz/profile"
                    className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-text-secondary hover:bg-nav-hover hover:text-primary-blue rounded-pill transition-all group"
                  >
                    <User size={14} />
                    <span>View Profile</span>
                  </Link>
                  <Link 
                    href="/quiz/leaderboard"
                    className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-text-secondary hover:bg-nav-hover hover:text-primary-blue rounded-pill transition-all group"
                  >
                    <Trophy size={14} />
                    <span>Leaderboard</span>
                  </Link>
                  <Link 
                    href="/quiz/settings"
                    className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-text-secondary hover:bg-nav-hover hover:text-primary-blue rounded-pill transition-all group"
                  >
                    <Settings size={14} />
                    <span>Preferences</span>
                  </Link>
                </div>

                <div className="h-px bg-card-border my-2" />

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-pill transition-all mb-1"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-card-bg border border-card-border rounded-card shadow-subtle p-12 space-y-10 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary-blue rounded-2xl flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.2)] ring-4 ring-white">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Skill Forge Portal</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-success-green rounded-full animate-pulse" />
              <p className="text-meta">Innovators & Visionaries Club</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-card-border w-full" />

        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary">Authorize Session</h2>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="ENTER ACCESS CODE" 
                className="w-full bg-nav-hover border border-card-border rounded-inner px-6 py-4 text-center font-black tracking-widest text-lg placeholder:text-text-meta uppercase focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue transition-all text-black"
              />
            </div>
            <button className="w-full bg-primary-blue text-white py-4 rounded-inner font-bold text-sm tracking-widest uppercase hover:bg-deep-indigo transition-all flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-[0.98]">
              <span>Begin Quiz Attempt</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-warning-amber" />
            <span className="text-[10px] font-bold text-text-meta">LOW LATENCY</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-success-green" />
            <span className="text-[10px] font-bold text-text-meta">SECURE LINK</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
