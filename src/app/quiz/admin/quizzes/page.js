"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/layout/Sidebar";
import { 
  FileText, 
  Plus,
  BookText,
  Clock,
  ChevronRight,
  TrendingUp,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadQuizzes() {
      const { data } = await supabase
        .from("quizzes")
        .select("*, questions(count)");
      setQuizzes(data || []);
      setLoading(false);
    }
    loadQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-page-bg flex font-sans">
      <Sidebar />

      <main className="flex-1 ml-[240px] p-10 space-y-10">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Protocol Managed System</h1>
            <p className="text-meta">EVALUATION TEMPLATES & CONFIGURATION</p>
          </motion.div>
          
          <button className="bg-primary-blue text-white px-8 py-4 rounded-inner font-bold text-xs tracking-widest uppercase shadow-lg shadow-blue-200 flex items-center gap-3 active:scale-[0.98] transition-all">
            <Plus size={18} strokeWidth={3} />
            <span>New Protocol</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? (
             <div className="col-span-3 py-20 text-center">
                <div className="w-8 h-8 border-4 border-primary-blue/20 border-t-primary-blue rounded-full animate-spin mx-auto" />
             </div>
           ) : quizzes.map((q, i) => (
             <motion.div
               key={q.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="dashboard-card group hover:border-primary-blue transition-all cursor-pointer relative overflow-hidden"
             >
               <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-primary-blue/10 rounded-xl flex items-center justify-center text-text-meta group-hover:text-primary-blue transition-colors">
                     <BookText size={22} />
                  </div>
                  <button className="text-text-meta hover:text-text-primary transition-colors">
                     <MoreVertical size={18} />
                  </button>
               </div>

               <div className="space-y-1 mb-8">
                  <p className="text-[10px] font-black text-text-meta tracking-widest uppercase">ID: {q.id.slice(0, 8)}</p>
                  <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary-blue transition-colors">
                    {q.title || "Untitled Protocol"}
                  </h3>
               </div>

               <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                     <Clock size={14} className="text-text-meta" />
                     <span className="text-[11px] font-bold text-text-secondary uppercase">30m Limit</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <TrendingUp size={14} className="text-success-green" />
                     <span className="text-[11px] font-bold text-success-green uppercase">High Impact</span>
                  </div>
               </div>

               <div className="absolute -bottom-6 -right-6 opacity-0 group-hover:opacity-10 transition-opacity">
                  <BookText size={120} />
               </div>
             </motion.div>
           ))}

           {/* Placeholder for "Add New" card */}
           {!loading && (
              <button className="border-2 border-dashed border-card-border rounded-[32px] p-10 flex flex-col items-center justify-center gap-4 text-text-meta hover:border-primary-blue hover:text-primary-blue transition-all group scale-[0.98]">
                 <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-primary-blue/10 flex items-center justify-center transition-colors">
                    <Plus size={24} />
                 </div>
                 <p className="text-[10px] font-black tracking-widest uppercase">Add Protocol Stack</p>
              </button>
           )}
        </div>
      </main>
    </div>
  );
}
