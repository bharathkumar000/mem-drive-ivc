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

          <button 
            onClick={handleInitialize}
            className="bg-[#2563EB] text-white px-8 py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-3 shadow-[0_12px_24px_rgba(37,99,235,0.25)] hover:bg-[#1E40AF] transition-all active:scale-[0.98] group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Initialize Protocol</span>
          </button>
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
              {/* Decorative Circle */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-10 -mr-8 -mt-8 ${stat.color.replace('text-', 'bg-')}`} />
            </motion.div>
          ))}
        </div>

        {/* Overview Chart/Area */}
        <div className="flex-1 bg-white rounded-[40px] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col p-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center border border-[#E2E8F0]">
                <Activity className="text-[#2563EB] w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#0F172A]">Active Node Overview</h3>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
              <button className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white text-[#0F172A] shadow-sm">Active Only</button>
              <button className="px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:text-[#0F172A]">All</button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <BookText size={64} className="text-[#94A3B8] mb-6 animate-pulse" />
            <h4 className="text-lg font-black uppercase tracking-widest text-[#0F172A] mb-2">Protocol Hub Empty</h4>
            <p className="text-sm font-bold text-[#64748B] max-w-[320px] text-center leading-relaxed">
              No protocols have been initialized. Click the button above to start.
            </p>
          </div>
          
          <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden mt-8">
            <motion.div 
              className="h-full bg-[#2563EB]"
              initial={{ width: 0 }}
              animate={{ width: "30%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
