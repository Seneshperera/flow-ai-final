"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Package, Bell, Search, Activity, Bot } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/actions/dashboard.actions";

export default function DashboardPage() {
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getDashboardStats();
      if (res.success) {
        setDbData(res.data);
      }
    }
    loadData();
  }, []);

  const data = dbData?.chartData || [
    { name: "Mon", revenue: 0, users: 0 },
    { name: "Tue", revenue: 0, users: 0 },
    { name: "Wed", revenue: 0, users: 0 },
    { name: "Thu", revenue: 0, users: 0 },
    { name: "Fri", revenue: 0, users: 0 },
    { name: "Sat", revenue: 0, users: 0 },
    { name: "Sun", revenue: 0, users: 0 },
  ];

  const stats = [
    { label: "Total Revenue", value: `$${(dbData?.revenue || 0).toLocaleString()}`, change: "+20.1%", icon: DollarSign, color: "text-primary", bg: "bg-primary/20" },
    { label: "Active Users", value: dbData?.activeUsers || "0", change: "+180.1%", icon: Users, color: "text-secondary", bg: "bg-secondary/20" },
    { label: "Total Products", value: dbData?.totalProducts || "0", change: "+19%", icon: Package, color: "text-accent", bg: "bg-accent/20" },
    { label: "Low Stock", value: dbData?.lowStockCount || "0", change: "-2", icon: TrendingUp, color: "text-destructive", bg: "bg-destructive/20" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, system operations running smoothly.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative glass-panel rounded-full px-4 py-2 flex items-center gap-2 border-white/5 w-64">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-muted-foreground w-full"
            />
          </div>
          <button className="glass-panel p-2.5 rounded-full border-white/5 relative hover:bg-white/5 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(0,255,255,1)]"></span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-white/5`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="xl:col-span-2 glass-panel p-6 rounded-2xl flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
              <p className="text-sm text-muted-foreground">AI predicted growth trajectory</p>
            </div>
            <select className="glass-panel bg-black/20 text-sm px-3 py-1.5 rounded-lg border-white/10 text-white outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,255,255,0.1)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-panel p-6 rounded-2xl flex flex-col relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/50">
              <Bot className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Insights</h2>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-secondary/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary">Inventory Alert</span>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors">
                SKU-992 (Quantum CPU) is depleting 40% faster than usual. Reorder recommended in next 48h to prevent stockout.
              </p>
              <button className="mt-3 text-xs font-medium text-secondary hover:text-white transition-colors flex items-center gap-1">
                Auto-order now <Activity className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary">Revenue Opportunity</span>
                <span className="text-xs text-muted-foreground">2 hrs ago</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors">
                Based on current traffic patterns, launching the weekend promo campaign today could yield +15% conversion lift.
              </p>
              <button className="mt-3 text-xs font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
                Launch Campaign <Activity className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
