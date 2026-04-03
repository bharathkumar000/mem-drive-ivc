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
  ChevronDown,
  Mail,
  Layers,
  Cpu,
  UserPlus,
  LogIn
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userRole, setUserRole] = useState("candidate");
  const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/dashboard");
    }
    checkSession();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Mock bypass logic
    if (mode === "login") {
      if (email === "1234" || password === "1234" || email === "1" || password === "1") {
        document.cookie = "mock_session=user; path=/";
        router.push("/dashboard");
        return;
      }
      if (email === "2" || password === "2") {
        document.cookie = "mock_session=admin; path=/";
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
        router.push("/dashboard");
      }
    } else {
      // Signup logic
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: fullName,
            role: userRole
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setError("Check your email for the confirmation link!");
        setLoading(false);
      }
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
    <div className="h-[100dvh] w-full bg-[#F0F4F8] flex items-center justify-center p-4 md:p-8 font-sans text-black overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary-blue/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-indigo/5 rounded-full blur-[100px] animate-pulse delay-700" />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
        className="w-full max-w-[1100px] h-full max-h-[750px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white/40 overflow-hidden relative z-10"
      >
        <div className={`grid h-full w-full transition-all duration-700 ${
          mode === "login" ? "md:grid-cols-[2fr_3fr]" : "md:grid-cols-[3fr_2fr]"
        }`}>
          {/* Blue Panel - Branding */}
          <motion.div 
            layout
            transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 20 }}
            className={`bg-primary-blue p-12 md:p-16 text-white flex flex-col justify-between relative overflow-hidden group ${
              mode === "login" ? "md:order-1" : "md:order-2"
            }`}
          >
            <div className="relative z-10">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3 mb-10"
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-black tracking-tight leading-none pt-1">Skill Forge</h1>
              </motion.div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 max-w-[320px]"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white opacity-90 uppercase tracking-widest leading-tight mb-4">
                      {mode === "login" ? "Welcome Back to the Node" : "Join the Elite Network"}
                    </h2>
                    <p className="text-white/70 text-sm font-medium leading-relaxed">
                      {mode === "login" 
                        ? "Synchronize your session and resume your NEXUS assessment progress."
                        : "Initialize your candidate profile and start your journey with Skill Forge."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-4 text-white/60">
                      <Zap size={18} className="text-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Instant Validation</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/60">
                      <Lock size={18} className="text-white/40" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Military Grade Security</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 text-white/30">
                  <div className="w-8 h-px bg-white/20" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em]">Node Protocol 4.2.0</span>
                </div>
                <div className="flex gap-8">
                  <span className="text-[10px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer uppercase tracking-widest">Privacy</span>
                  <span className="text-[10px] font-bold text-white/40 hover:text-white transition-colors cursor-pointer uppercase tracking-widest">Help</span>
                </div>
              </div>
            </div>

            {/* Abstract Background Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-80 h-80 bg-deep-indigo rounded-full blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-indigo rounded-full blur-[120px] opacity-30 -translate-x-1/3 translate-y-1/3" 
            />
          </motion.div>

          {/* White Panel - Form */}
          <motion.div 
            layout
            transition={{ duration: 0.8, type: "spring", stiffness: 120, damping: 20 }}
            className={`p-12 md:p-16 bg-white flex flex-col relative overflow-y-auto ${
              mode === "login" ? "md:order-2" : "md:order-1"
            } scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-transparent`}
          >
            <div className="max-w-[420px] mx-auto w-full flex flex-col h-full justify-between py-4">
              <div className="mb-8 flex flex-col items-center text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[20px] font-black text-[#2563EB] uppercase tracking-[0.25em] mb-4 whitespace-nowrap">Innovators & Visionaries Club</p>
                    <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter mb-3 leading-none">
                      {mode === "login" ? "System Authentication" : "Create Protocol"}
                    </h1>
                    <p className="text-xs font-black text-[#94A3B8] uppercase tracking-[0.3em]">
                      {mode === "login" ? "Enter Authorized Credentials" : "Initialize New Node"}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 relative p-1 bg-[#F1F5F9] rounded-[24px] border border-[#E2E8F0] w-full max-w-[320px] mx-auto flex items-center h-[45px]">
                  {/* Sliding Background */}
                  <motion.div
                    initial={false}
                    animate={{
                      x: userRole === "candidate" ? 0 : "100%",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[20px] shadow-lg shadow-blue-900/5"
                  />
                  
                  <button 
                    type="button"
                    onClick={() => setUserRole("candidate")}
                    className={`relative z-10 flex-1 px-4 h-full text-[9px] font-black uppercase transition-colors duration-300 ${
                      userRole === "candidate" ? "text-primary-blue" : "text-[#64748B]"
                    }`}
                  >
                    I'm a Candidate
                  </button>
                  <button 
                    type="button"
                    onClick={() => setUserRole("evaluator")}
                    className={`relative z-10 flex-1 px-4 h-full text-[9px] font-black uppercase transition-colors duration-300 ${
                      userRole === "evaluator" ? "text-primary-blue" : "text-[#64748B]"
                    }`}
                  >
                    I'm an Evaluator
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4 mt-6 flex flex-col items-center">
                <div className="w-full space-y-3 bg-[#F8FAFC]/50 pt-5 pb-6 px-6 rounded-[32px] border border-[#F1F5F9]">
                  {userRole === "evaluator" && mode === "signup" && (
                    <motion.div 
                      key="evaluator-key"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-1.5 mb-2"
                    >
                      <label className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.2em] block text-left ml-4">Access Protocol Key</label>
                      <div className="relative group overflow-hidden">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-primary-blue">
                          <Fingerprint size={18} />
                        </div>
                        <input
                          type="password"
                          required
                          value={accessKey}
                          onChange={(e) => setAccessKey(e.target.value)}
                          placeholder="Evaluator Pin"
                          className="w-full bg-white border border-[#E2E8F0] rounded-[22px] py-4 pl-14 pr-6 text-sm font-bold text-[#0F172A] text-left focus:outline-none focus:border-primary-blue focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {mode === "signup" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-1.5"
                      >
                        <label className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.2em] block text-left ml-4">Full Name</label>
                      <div className="relative group overflow-hidden">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-primary-blue">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Candidate Full Name"
                          className="w-full bg-white border border-[#E2E8F0] rounded-[22px] py-4 pl-14 pr-6 text-sm font-bold text-[#0F172A] text-left focus:outline-none focus:border-primary-blue focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.2em] block text-left ml-4">Identity Identifier</label>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-primary-blue">
                        <Mail size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Node Email or ID"
                        className="w-full bg-white border border-[#E2E8F0] rounded-[22px] py-4 pl-14 pr-6 text-sm font-bold text-[#0F172A] text-left focus:outline-none focus:border-primary-blue focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.2em] block text-left ml-4">Security Key</label>
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
                        className="w-full bg-white border border-[#E2E8F0] rounded-[22px] py-4 pl-14 pr-12 text-sm font-bold text-[#0F172A] text-left focus:outline-none focus:border-primary-blue focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] transition-all"
                      />
                      <button 
                        type="button" 
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#94A3B8] hover:text-primary-blue uppercase tracking-widest transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-blue text-white py-5 rounded-[22px] font-black text-xs tracking-[0.3em] uppercase hover:bg-deep-indigo transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(37,99,235,0.25)] active:scale-[0.98] disabled:opacity-50 group"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>{mode === "login" ? "Execute Login" : "Initialize Account"}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`rounded-2xl p-4 text-center mt-6 border ${
                        error.includes("Check your email") 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                          : "bg-rose-50 border-rose-100 text-rose-500"
                      }`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest leading-normal">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative pt-4 pb-2">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[#F1F5F9]" />
                  <div className="relative z-10 flex justify-center">
                    <span className="bg-white px-6 text-[9px] font-black text-[#94A3B8] uppercase tracking-[0.4em] leading-none">
                      Secondary Authentication
                    </span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-3 bg-white border border-[#E2E8F0] py-4 rounded-[22px] hover:border-primary-blue hover:bg-blue-50/30 transition-all duration-300 group active:scale-[0.98]"
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B] group-hover:text-primary-blue transition-colors">Continue with Google</span>
                </button>
              </form>
              
              <div className="mt-8 text-center pb-10">
                <p className="text-xs font-bold text-[#64748B]">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="ml-2 text-primary-blue font-black uppercase tracking-widest hover:underline text-[10px]"
                  >
                    {mode === "login" ? "Initialize One" : "Sign In Here"}
                  </button>
                </p>

                <div className="mt-12 opacity-40">
                  <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-[0.6em] leading-none">Skill Forge Labs © 2026</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
