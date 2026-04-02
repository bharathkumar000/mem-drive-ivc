"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import { 
  Users, 
  FileCheck, 
  ShieldAlert, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from("submissions")
        .select("*, profiles(*)")
        .order("submitted_at", { ascending: false });
      
      setSubmissions(data || []);
      setLoading(false);
    }
    loadData();
  }, []);

  const stats = [
    { label: "Total Sessions", value: "1,284", icon: Monitor, color: "#2563EB" },
    { label: "Platform Pulse", value: "98.2%", icon: Activity, color: "#10B981" },
    { label: "Active Quizzes", value: "24", icon: FileCheck, color: "var(--color-accent-indigo)" },
    { label: "Avg. Completion", value: "84.5%", icon: TrendingUp, color: "#F59E0B" },
    { label: "Security Flags", value: "12", icon: ShieldAlert, color: "#EF4444" },
    { label: "Time Optimized", value: "4h 12m", icon: Clock, color: "var(--color-primary-blue)" },
  ];

  return (
    <div className="min-h-screen bg-page-bg flex font-sans">
      <Sidebar />

      <main className="flex-1 ml-[240px] p-10 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard Overview</h1>
            <p className="text-meta">NEXUS INFRASTRUCTURE MONITORING</p>
          </motion.div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-pill border border-card-border shadow-subtle">
              <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-text-secondary">SYSTEMS ONLINE</span>
            </div>
            <div className="w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center text-white font-bold text-sm">BK</div>
          </div>
        </div>

        {/* 6-Column Stats Grid */}
        <div className="grid grid-cols-6 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="dashboard-card flex flex-col items-start gap-4"
            >
              <div className="w-10 h-10 rounded-inner flex items-center justify-center bg-gray-50">
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <p className="text-meta mb-1">{stat.label}</p>
                <h3 className="text-metric leading-tight">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two-Column Bottom Section */}
        <div className="grid grid-cols-2 gap-10">
          {/* Platform Flow Card */}
          <div className="dashboard-card space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <LayoutGrid size={20} className="text-primary-blue" />
                <h3 className="text-section-header">Platform Flow</h3>
              </div>
              <ChevronRight size={18} className="text-text-meta" />
            </div>
            
            <div className="space-y-6 pt-2">
              {[
                { label: "MCQ Validation", value: 92, color: "bg-success-green" },
                { label: "Paragraph Analysis", value: 68, color: "bg-warning-amber" },
                { label: "Real-time Sync", value: 84, color: "bg-primary-blue" }
              ].map((flow) => (
                <div key={flow.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-text-secondary">
                    <span>{flow.label}</span>
                    <span>{flow.value}%</span>
                  </div>
                  <div className="h-2 bg-nav-hover rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${flow.value}%` }} className={`h-full ${flow.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Utilization Card */}
          <div className="dashboard-card space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-primary-blue" />
                <h3 className="text-section-header">Team Utilization</h3>
              </div>
              <button className="text-[11px] font-bold text-primary-blue uppercase tracking-widest hover:underline flex items-center gap-1">
                Manage all users <ChevronRight size={12} strokeWidth={3} />
              </button>
            </div>

            <div className="space-y-6 pt-2">
              {[
                { name: "John Carter", role: "DevOps Engineer", sessions: 42, color: "bg-primary-blue" },
                { name: "Sarah Miller", role: "Security Admin", sessions: 28, color: "bg-accent-indigo" },
                { name: "BK", role: "Superadmin", sessions: 94, color: "bg-[#7C3AED]" }
              ].map((user) => (
                <div key={user.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${user.color} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary leading-tight">{user.name}</p>
                        <p className="text-[11px] text-text-secondary font-medium tracking-tight">{user.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-text-primary">{user.sessions} Sessions</span>
                  </div>
                  <div className="utilization-bar-bg">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(user.sessions * 2.5, 100)}%` }} className="utilization-bar-fill" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
