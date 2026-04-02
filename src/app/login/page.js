"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff,
  Loader2,
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
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

  return (
    <div className="h-[100dvh] w-full bg-page-bg flex items-center justify-center p-4 md:p-12 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-blue/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-indigo/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1100px] h-full max-h-[850px] grid md:grid-cols-[450px_1fr] bg-white rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20"
      >
        {/* Left Side: Brand & Visual */}
        <div className="bg-primary-blue p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#ffffff_1px,transparent_1px)] bg-[length:24px_24px]" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Skill Forge</h1>
              <p className="text-white/60 text-sm font-bold uppercase tracking-widest mt-1">Authorized Access Only</p>
            </div>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Secure Infrastructure</p>
                  <p className="text-[11px] text-white/50">Military-grade session encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Elite Performance</p>
                  <p className="text-[11px] text-white/50">Zero-latency benchmarking engine</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Skill Forge V2.4 Deployment</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-12 md:p-16 flex flex-col justify-center space-y-8 overflow-y-auto bg-white">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-text-primary tracking-tight">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <div className="flex p-1 bg-[#F1F5F9] rounded-pill w-fit">
              <button 
                onClick={() => setMode("login")}
                className={`px-6 py-2 text-xs font-bold rounded-pill transition-all ${mode === "login" ? "bg-white text-primary-blue shadow-sm" : "text-text-meta hover:text-text-primary"}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setMode("signup")}
                className={`px-6 py-2 text-xs font-bold rounded-pill transition-all ${mode === "signup" ? "bg-white text-primary-blue shadow-sm" : "text-text-meta hover:text-text-primary"}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`${error.includes("Check your email") ? 'bg-success-green/10 text-success-green border-success-green/20' : 'bg-red-50 text-red-600 border-red-100'} border px-4 py-3 rounded-inner text-xs font-bold leading-relaxed`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-[#E8EDF2] hover:border-primary-blue hover:bg-[#F8FAFC] py-4 rounded-inner text-sm font-bold text-text-primary transition-all shadow-sm active:scale-[0.98] group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>{mode === "login" ? "Sign in" : "Sign up"} with Google</span>
              <ArrowRight size={16} className="text-text-meta opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px bg-[#E8EDF2] flex-1" />
              <span className="text-[10px] font-black text-text-meta uppercase tracking-widest">or use credentials</span>
              <div className="h-px bg-[#E8EDF2] flex-1" />
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <AnimatePresence>
                {mode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-meta group-focus-within:text-primary-blue transition-colors">
                        <LogIn size={18} />
                      </div>
                      <input
                        type="text"
                        required={mode === "signup"}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-[#F8FAFC] border-2 border-[#E8EDF2] rounded-inner pl-12 pr-4 py-4 text-sm font-bold text-text-primary placeholder:text-text-meta focus:outline-none focus:border-primary-blue transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-1">Gmail Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-meta group-focus-within:text-primary-blue transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Gmail"
                    className="w-full bg-[#F8FAFC] border-2 border-[#E8EDF2] rounded-inner pl-12 pr-4 py-4 text-sm font-bold text-text-primary placeholder:text-text-meta focus:outline-none focus:border-primary-blue transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between pl-1 pr-1">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Secret Protocol Key</label>
                  {mode === "login" && <button type="button" className="text-[10px] font-bold text-primary-blue hover:underline">Forgot?</button>}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-meta group-focus-within:text-primary-blue transition-colors">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F8FAFC] border-2 border-[#E8EDF2] rounded-inner pl-12 pr-12 py-4 text-sm font-bold text-text-primary placeholder:text-text-meta focus:outline-none focus:border-primary-blue transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-text-meta hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-blue text-white py-4 rounded-inner font-bold text-sm tracking-widest uppercase hover:bg-deep-indigo transition-all flex items-center justify-center gap-3 shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed pt-6"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <>
                    <span>{mode === "login" ? "Execute Sign In" : "Protocol Registration"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          <footer className="pt-8 border-t border-[#F1F5F9] mt-auto">
            <p className="text-[12px] font-black text-text-primary uppercase tracking-[0.2em] mb-2">INNOVATORS & VISIONARIES CLUB</p>
            <p className="text-[10px] text-text-meta font-medium leading-relaxed">
              By proceeding, you agree to our System Access Protocols and Privacy Policy. All session attempts are logged.
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
