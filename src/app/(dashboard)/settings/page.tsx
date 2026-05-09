"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, Key, Database, Zap, Smartphone, CreditCard } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and system preferences.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <nav className="flex flex-col gap-2">
          {[
            { icon: User, label: "Profile", active: true },
            { icon: Bell, label: "Notifications" },
            { icon: Shield, label: "Security" },
            { icon: Database, label: "Integrations" },
            { icon: CreditCard, label: "Billing" },
          ].map((item) => (
            <button 
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Settings Content */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl border-white/5"
          >
            <h2 className="text-lg font-bold text-white mb-6">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                <User className="w-8 h-8 text-primary group-hover:opacity-0 transition-opacity" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-white">Upload</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium">Administrator</h3>
                <p className="text-sm text-muted-foreground">admin@flowpilot.ai</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <input 
                  type="text" 
                  defaultValue="Admin" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="User" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@flowpilot.ai" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl border-white/5"
          >
            <h2 className="text-lg font-bold text-white mb-6">AI Preferences</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">Auto-Optimization</h4>
                    <p className="text-xs text-muted-foreground">Allow AI to automatically adjust inventory buffers.</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(150,0,255,0.5)]">
                  <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-medium">Push Notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive critical AI alerts on mobile.</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-0.5 w-4 h-4 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
