"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  FileText, 
  Trophy, 
  Settings, 
  LogOut, 
  Activity,
  Users
} from "lucide-react";

const navItems = [
  { href: "/quiz/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quiz/admin/quizzes", label: "Quizzes", icon: FileText },
  { href: "/quiz/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/quiz/admin/users", label: "Users", icon: Users },
  { href: "/quiz/admin/security", label: "Security", icon: ShieldCheck },
  { href: "/quiz/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-sidebar-bg border-r border-[#E8EDF2] flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 h-20 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-heading font-bold text-xl text-text-primary tracking-tight">Skill Forge</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 transition-all text-sm font-semibold ${
                isActive 
                  ? "bg-nav-active-bg text-primary-blue rounded-pill" 
                  : "text-text-secondary hover:bg-nav-hover hover:text-text-primary rounded-pill group"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={isActive ? "text-primary-blue" : "text-text-secondary group-hover:text-text-primary"} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-primary-blue rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout */}
      <div className="p-4 border-t border-[#E8EDF2]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-text-secondary hover:bg-red-50 hover:text-red-600 rounded-pill transition-all group">
          <LogOut size={18} className="text-text-secondary group-hover:text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
