"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Package, BarChart3, Settings, Bot, Activity, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Zap, label: "Automations", href: "/automations" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-40 glass-panel border-r border-white/5 rounded-none flex flex-col pt-6 pb-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 overflow-hidden">
          <Activity className="text-primary w-4 h-4 absolute z-10" />
          <div className="absolute inset-0 bg-primary/20 blur-md animate-pulse"></div>
        </div>
        <span className="text-lg font-bold tracking-tighter text-white">
          Flow<span className="text-primary glow-text">Pilot</span>
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                isActive ? "text-white" : "text-muted-foreground hover:text-white"
              }`}>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"></div>
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary glow-text" : "group-hover:text-primary transition-colors"}`} />
                <span className="text-sm font-medium relative z-10">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-3 relative z-10 mb-3">
          <Bot className="w-5 h-5 text-secondary" />
          <span className="text-sm font-bold text-white">Pro Plan</span>
        </div>
        <div className="w-full bg-black/50 h-1.5 rounded-full mb-2 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary w-[80%] rounded-full shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>80% Usage</span>
          <span className="text-primary hover:underline cursor-pointer">Upgrade</span>
        </div>
      </div>
    </aside>
  );
}
