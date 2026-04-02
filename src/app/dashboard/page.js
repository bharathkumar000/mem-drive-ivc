"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  BarChart3, 
  BookText, 
  Users2, 
  FileBox, 
  LogOut, 
  Plus, 
  Activity, 
  FileText, 
  LayoutDashboard,
  Search,
  Bell,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Home");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('mock_session='));
    if (sessionCookie) {
      const value = sessionCookie.split('=')[1];
      setRole(value);
    }
  }, []);

  const isAdmin = role === "admin";

  const sidebarItems = isAdmin ? [
    { name: "Home", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Protocols", icon: BookText, path: "/quiz" },
    { name: "Candidates", icon: Users2, path: "/dashboard/candidates" },
    { name: "Reports", icon: FileBox, path: "/dashboard/reports" },
  ] : [
    { name: "Home", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Assessments", icon: BookText, path: "/quiz" },
    { name: "Archive", icon: Shield, path: "/dashboard/archive" },
    { name: "Feedback", icon: FileText, path: "/dashboard/feedback" },
  ];

  const stats = [
    { title: isAdmin ? "PROTOCOLS ACTIVE" : "TASKS COMPLETED", value: "0", icon: Shield, color: "text-blue-600" },
    { title: isAdmin ? "VALIDATIONS LOGGED" : "NODES SYNCED", value: "0", icon: Activity, color: "text-green-500" },
    { title: isAdmin ? "REPORTS FILED" : "RANKING POSITION", value: "-", icon: FileText, color: "text-indigo-600" },
    { title: isAdmin ? "SYSTEM NODES" : "SESSION UPTIME", value: "0m", icon: LayoutDashboard, color: "text-slate-800" },
  ];

  const handleLogout = () => {
    document.cookie = "mock_session=; path=/; max-age=0;";
    router.push("/login");
  };

  const handleInitialize = () => {
    router.push("/quiz");
  };

  const handleSidebarClick = (name, path) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-[#0F172A] font-sans selection:bg-blue-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#E2E8F0] flex flex-col pt-8 shrink-0">
        <div className="px-8 flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none">Skill Forge</h1>
            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mt-1">
              {isAdmin ? "Admin Node" : "Candidate Node"}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleSidebarClick(item.name, item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.name 
                  ? "bg-[#2563EB] text-white shadow-xl shadow-blue-100" 
                  : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              <item.icon size={20} className={activeTab === item.name ? "stroke-[2.5]" : "stroke-[2]"} />
              <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFE4E6] transition-all group border border-[#FECDD3]"
          >
            <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center text-white font-black text-xs shrink-0">
              N
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Logout Protocol</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-8 md:p-12">
        <header className="flex justify-between items-start mb-12 w-full">
          <div className="space-y-1">
            <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tighter flex items-center gap-3">
              CONTROL <span className="text-[#2563EB]">CENTER</span>
            </h2>
            <p className="text-sm font-bold text-[#64748B] tracking-tight">
              Authorized access: {isAdmin ? "Administrator" : "Candidate"}
            </p>
          </div>

          {isAdmin && (
            <button 
              onClick={handleInitialize}
              className="bg-[#2563EB] text-white px-8 py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-3 shadow-[0_12px_24px_rgba(37,99,235,0.25)] hover:bg-[#1E40AF] transition-all active:scale-[0.98] group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Initialize Protocol</span>
            </button>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group"
            >
              <div className="relative z-10 flex flex-col items-start gap-4">
                <div className={`p-3 rounded-xl bg-[#F8FAFC] ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-[#0F172A]">{stat.value}</p>
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">{stat.title}</p>
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-10 -mr-8 -mt-8 ${stat.color.replace('text-', 'bg-')}`} />
            </motion.div>
          ))}
        </div>

        {/* Improved Overview Area */}
        <div className="flex-1 bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center border border-[#E2E8F0]">
                <Activity className="text-[#2563EB] w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-[#0F172A]">Active Node Overview</h3>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Real-time Station Status</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
              <button className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-[#0F172A] shadow-sm">Active Only</button>
              <button className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:text-[#0F172A]">All</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
            {/* Station Health */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#F8FAFC] p-8 rounded-[32px] border border-[#F1F5F9] space-y-6">
                 <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">Neural Sync Status</h4>
                 <div className="space-y-5">
                    {[
                      { label: "Core Uplink", status: "Operational", color: "bg-green-500" },
                      { label: "AI Evaluator", status: "Synced", color: "bg-green-500" },
                      { label: "Network Latency", status: "24ms", color: "bg-blue-500" }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#64748B]">{s.label}</span>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                           <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-wider">{s.status}</span>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="bg-[#2563EB] p-8 rounded-[32px] text-white overflow-hidden relative group">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Build Version</p>
                    <h4 className="text-2xl font-black mb-2 tracking-tighter">NEXUS v2.4</h4>
                    <p className="text-xs font-medium text-white/60 leading-relaxed italic">"Industry standard validation framework."</p>
                 </div>
                 <Shield size={100} className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Assessment Hub */}
            <div className="lg:col-span-2">
               <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">Pending Assignments</h4>
                  <span className="bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">02 New</span>
               </div>
               
               <div className="space-y-4">
                  {[
                    { id: "A-42", title: "Technical Component Analysis", time: "45m", diff: "Expert" },
                    { id: "B-12", title: "Edge Security Optimization", time: "30m", diff: "High" }
                  ].map((a, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 8 }}
                      className="group cursor-pointer bg-white border border-[#F1F5F9] hover:border-[#2563EB] p-6 rounded-[28px] flex items-center justify-between transition-all hover:shadow-xl hover:shadow-blue-50"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] group-hover:bg-blue-50 flex items-center justify-center text-[#94A3B8] group-hover:text-[#2563EB] transition-colors">
                          <BookText size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest leading-none mb-1">ID: {a.id}</p>
                          <h5 className="font-bold text-[#0F172A]">{a.title}</h5>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest leading-none mb-1">Duration</p>
                            <p className="text-xs font-bold text-[#0F172A]">{a.time}</p>
                         </div>
                         <button onClick={() => router.push('/quiz')} className="bg-[#F8FAFC] group-hover:bg-[#2563EB] group-hover:text-white p-3 rounded-xl transition-colors">
                            <ArrowRight size={18} />
                         </button>
                      </div>
                    </motion.div>
                  ))}
                  
                  <button className="w-full py-5 border-2 border-dashed border-[#E2E8F0] rounded-[28px] text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] hover:text-[#2563EB] hover:border-[#2563EB] transition-all">
                    View Archive Protocol Statistics
                  </button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
