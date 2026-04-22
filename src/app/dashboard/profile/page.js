"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import DashboardWrapper from "@/components/layout/DashboardWrapper";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Activity, 
  Award,
  Zap,
  ArrowLeft,
  Settings,
  Lock,
  LogOut,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ sessions: 0, accuracy: 0, rank: "N/A" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Detailed Profile State
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    college: "",
    branch: "",
    section: "",
    skills: ""
  });

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      let activeUser = user;

      if (!activeUser) {
        const cookies = document.cookie.split(';');
        const mockSession = cookies.find(c => c.trim().startsWith('mock_session='));
        if (mockSession) {
          const { data: mockProfile } = await supabase.from("profiles").select("*").limit(1).single();
          activeUser = { id: mockProfile?.id || "mock_id", email: "candidate@skillforge.io" };
        }
      }

      if (activeUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", activeUser.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setFormData({
            full_name: profileData.full_name || "",
            phone_number: profileData.phone_number || "",
            college: profileData.college || "",
            branch: profileData.branch || "",
            section: profileData.section || "",
            skills: profileData.skills || ""
          });
          
          const { data: subs } = await supabase
            .from("submissions")
            .select("total_score, quizzes(total_questions)")
            .eq("user_id", activeUser.id);
            
          if (subs && subs.length > 0) {
            const totalQuestions = subs.reduce((acc, s) => acc + (s.quizzes?.total_questions || 10), 0);
            const totalScore = subs.reduce((acc, s) => acc + s.total_score, 0);
            setStats({
              sessions: subs.length,
              accuracy: Math.round((totalScore / totalQuestions) * 100),
              rank: `#${1000 + (subs.length * 7) % 500}`
            });
          }
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .update({ 
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        college: formData.college,
        branch: formData.branch,
        section: formData.section,
        skills: formData.skills
      })
      .eq("id", profile.id);
    
    if (!error) {
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    document.cookie = "mock_session=; path=/; max-age=0;";
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <DashboardWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decrypting Node Credentials...</p>
        </div>
      </DashboardWrapper>
    );
  }

  if (!profile) return (
    <DashboardWrapper>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Shield size={48} className="text-slate-200" />
        <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter">Access Denied</h3>
        <button onClick={() => router.push('/')} className="bg-[#0F172A] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Return to Gateway</button>
      </div>
    </DashboardWrapper>
  );

  return (
    <DashboardWrapper>
      <div className="p-6 md:p-10 space-y-10 max-w-6xl mx-auto pb-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors mb-3 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Protocol Hub
            </button>
            <h2 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
              Node <span className="text-blue-600">Registry</span>
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
              Comprehensive Intelligence Profile
            </p>
          </div>
          
          <div className="flex gap-3">
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm border ${isEditing ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-white border-slate-200 text-[#0F172A] hover:border-blue-600"}`}
             >
               <Settings size={14} className={isEditing ? "animate-spin" : ""} />
               {isEditing ? "Cancel Modification" : "Modify Credentials"}
             </button>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
             >
               <LogOut size={14} />
               Logout
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Core Identity Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              <div className="bg-[#0F172A] h-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,#ffffff_1px,transparent_1px),linear-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />
                <div className="absolute -bottom-14 left-10">
                  <div className="w-28 h-28 bg-white rounded-[32px] p-1 shadow-2xl">
                    <div className="w-full h-full bg-[#2563EB] rounded-[28px] flex items-center justify-center text-white font-black text-4xl border-2 border-white uppercase">
                      {profile.full_name?.[0] || "N"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-12 px-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div className="space-y-3 flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Full Name / Alias</label>
                           <input 
                             type="text" 
                             value={formData.full_name}
                             onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                             className="w-full text-3xl font-black text-[#0F172A] tracking-tight uppercase bg-slate-50 border-b-2 border-blue-600 focus:outline-none pb-2 rounded-t-lg px-2"
                             placeholder="NODE NAME"
                           />
                        </div>
                      ) : (
                        <>
                          <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">{profile.full_name}</h3>
                          <div className="flex items-center gap-3">
                             <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest pt-[1px]">{profile.role === "admin" ? "Master Evaluator" : "Authorized Skill Node"}</span>
                             </div>
                             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{profile.id?.slice(0, 16)}</span>
                          </div>
                        </>
                      )}
                   </div>
                   {isEditing && (
                     <button 
                       onClick={handleUpdateProfile}
                       disabled={updating}
                       className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center gap-3"
                     >
                       {updating ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
                       Execute Sync
                     </button>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-10 border-t border-slate-50">
                  {/* Academic Protocol */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <Award size={18} className="text-blue-500" />
                        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Academic Protocol</h4>
                     </div>
                     <div className="space-y-6">
                        <DetailField 
                          icon={Calendar} 
                          label="College / Institution" 
                          value={profile.college} 
                          isEditing={isEditing} 
                          val={formData.college} 
                          onChange={(v) => setFormData({...formData, college: v})} 
                          placeholder="University Name"
                        />
                        <DetailField 
                          icon={Activity} 
                          label="Branch / Specialization" 
                          value={profile.branch} 
                          isEditing={isEditing} 
                          val={formData.branch} 
                          onChange={(v) => setFormData({...formData, branch: v})} 
                          placeholder="Computer Science, etc."
                        />
                        <DetailField 
                          icon={Zap} 
                          label="Section / Node" 
                          value={profile.section} 
                          isEditing={isEditing} 
                          val={formData.section} 
                          onChange={(v) => setFormData({...formData, section: v})} 
                          placeholder="Section A, etc."
                        />
                     </div>
                  </div>

                  {/* Contact & Skills Protocol */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <Mail size={18} className="text-blue-500" />
                        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-[0.2em]">Identity Metadata</h4>
                     </div>
                     <div className="space-y-6">
                        <DetailField 
                          icon={Mail} 
                          label="Communication Path (Email)" 
                          value={profile.email} 
                          isEditing={false} 
                          placeholder="email@skillforge.io"
                        />
                        <DetailField 
                          icon={Settings} 
                          label="Mobile Neural Link (Phone)" 
                          value={profile.phone_number} 
                          isEditing={isEditing} 
                          val={formData.phone_number} 
                          onChange={(v) => setFormData({...formData, phone_number: v})} 
                          placeholder="+91 XXXXX XXXXX"
                        />
                        <DetailField 
                          icon={Cpu} 
                          label="Technical Skill Mesh" 
                          value={profile.skills} 
                          isEditing={isEditing} 
                          val={formData.skills} 
                          onChange={(v) => setFormData({...formData, skills: v})} 
                          placeholder="React, SQL, Python..."
                        />
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0F172A] rounded-[32px] p-10 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-blue-900/10"
            >
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Zap size={28} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 leading-none">Intelligence Metrics</h4>
                  <p className="text-5xl font-black tracking-tighter leading-none">{stats.sessions} <span className="text-lg text-white/20 uppercase tracking-widest ml-2">Syncs</span></p>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Efficiency Rating</p>
                      <p className="text-xl font-black text-blue-400">{stats.accuracy}%</p>
                   </div>
                   <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${stats.accuracy}%` }} 
                        className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                      />
                   </div>
                </div>
              </div>
              <Shield size={200} className="absolute -bottom-20 -right-20 text-white/5 opacity-40 pointer-events-none" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm space-y-8"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-100">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Neural Tier</h4>
                    <p className="text-3xl font-black text-[#0F172A] tracking-tighter">{stats.rank}</p>
                  </div>
               </div>
               <div className="pt-6 border-t border-slate-50">
                  <div className="flex justify-between items-center py-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                     <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">TOP {Math.max(5, 15 - stats.sessions)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Level</span>
                     <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest">Tier 4 Verified</span>
                  </div>
               </div>
            </motion.div>

            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-200 border-dashed space-y-4">
               <div className="flex items-center gap-3">
                  <Lock size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Credentials</span>
               </div>
               <div className="space-y-3 font-mono text-[9px] text-slate-500">
                  <div className="flex justify-between">
                     <span>NODE_UID:</span>
                     <span className="text-[#0F172A]">{profile.id?.slice(0, 16).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>ENCRYPTION:</span>
                     <span className="text-[#0F172A]">ECC-P384-SHA384</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}

// Sub-component for individual profile fields
function DetailField({ icon: Icon, label, value, isEditing, val, onChange, placeholder }) {
  return (
    <div className="space-y-2 group">
      <label className="flex items-center gap-2 text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] leading-none group-hover:text-blue-500 transition-colors">
        <Icon size={12} strokeWidth={2.5} />
        {label}
      </label>
      <div className="ml-5">
        {isEditing ? (
          <input 
            type="text" 
            value={val}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#0F172A] focus:outline-none focus:border-blue-500 transition-all"
            placeholder={placeholder}
          />
        ) : (
          <p className="text-[15px] font-extrabold text-[#0F172A] tracking-tight truncate leading-tight">
            {value || <span className="text-slate-300 italic font-normal tracking-normal text-xs uppercase opacity-50">Data Undefined</span>}
          </p>
        )}
      </div>
    </div>
  );
}
