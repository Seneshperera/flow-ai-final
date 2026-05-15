"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Package, BarChart3, Settings, Bot, Activity, Zap, ShoppingCart, Sun, Moon, DollarSign, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { logout } from "@/actions/auth.actions";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ShoppingCart, label: "Point of Sale", href: "/pos" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
  { icon: Zap, label: "Automations", href: "/automations" },
  { icon: DollarSign, label: "Expenses", href: "/expenses" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 fixed inset-y-0 left-0 z-40 glass-panel border-r border-white/5 rounded-none flex flex-col pt-6 pb-6 px-4 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-2 mb-10">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/50 overflow-hidden">
            <Activity className="text-primary w-4 h-4 absolute z-10" />
            <div className="absolute inset-0 bg-primary/20 blur-md animate-pulse"></div>
          </div>
          <span className="text-lg font-bold tracking-tighter">
            Flow<span className="text-primary glow-text">Pilot</span>
          </span>
        </div>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>
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
        
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/5 mt-4 border border-transparent hover:border-destructive/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
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
