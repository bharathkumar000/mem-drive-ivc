"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  FileText, 
  Trophy, 
  Settings, 
  LogOut, 
  Activity,
  Users,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { href: "/quiz/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quiz/admin/quizzes", label: "Protocols", icon: FileText },
  { href: "/quiz/admin/users", label: "Users", icon: Users },
  { href: "/quiz/admin/security", label: "Security", icon: ShieldCheck },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    document.cookie = "mock_session=; path=/; max-age=0;";
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-5 left-5 z-[60] p-3 bg-white border border-[#E8EDF2] rounded-xl shadow-lg"
      >
        {isOpen ? <X size={20} className="text-[#0F172A]" /> : <Menu size={20} className="text-[#0F172A]" />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-[#E8EDF2] flex flex-col z-[58] transition-transform duration-500 ease-spring lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
      {/* Logo */}
      <div className="px-6 h-20 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-heading font-bold text-xl text-[#0F172A] tracking-tight">Skill Forge</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-6 py-4 transition-all text-base font-bold ${
                isActive 
                  ? "bg-nav-active-bg text-[#0F172A] rounded-2xl shadow-xl shadow-blue-50/50" 
                  : "text-[#0F172A] hover:bg-nav-hover rounded-2xl group"
              }`}
            >
              <div className="flex items-center gap-5">
                <item.icon size={22} className={isActive ? "text-[#2563EB] stroke-[2.5]" : "text-[#2563EB]/40 group-hover:text-[#2563EB] stroke-[2]"} />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-[#2563EB] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout */}
      <div className="p-4 border-t border-[#E8EDF2]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 text-base font-bold text-[#E11D48] hover:bg-red-50 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
             <LogOut size={20} />
          </div>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
