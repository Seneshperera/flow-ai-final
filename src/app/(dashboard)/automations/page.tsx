"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Zap, Clock, Users, ArrowRight, Play, CheckCircle2, MoreVertical, FileText, Bot, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function AutomationsPage() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);

  const workflows = [
    {
      id: "wf-1",
      name: "Low Stock Alert",
      description: "Automatically notifies admins via WhatsApp when inventory drops below threshold.",
      icon: AlertCircle,
      color: "var(--secondary)",
      status: "active",
      triggers: 24,
      lastRun: "2 mins ago"
    },
    {
      id: "wf-2",
      name: "Invoice Delivery",
      description: "Sends PDF invoices to customers automatically upon successful payment.",
      icon: FileText,
      color: "var(--primary)",
      status: "active",
      triggers: 156,
      lastRun: "1 hour ago"
    },
    {
      id: "wf-3",
      name: "AI Customer Support",
      description: "Routes incoming WhatsApp messages to Nexus AI for auto-replies.",
      icon: Bot,
      color: "var(--accent)",
      status: "paused",
      triggers: 0,
      lastRun: "Never"
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            <span className="glow-text">Automations</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage WhatsApp notifications and AI auto-replies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95">
            <PlusIcon /> Create Workflow
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 relative z-10">
        <TabButton active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')}>
          <Zap className="w-4 h-4" /> Workflows
        </TabButton>
        <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
          <Clock className="w-4 h-4" /> Execution Logs
        </TabButton>
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
          <MessageSquare className="w-4 h-4" /> WhatsApp Setup
        </TabButton>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column: Workflows */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence>
            {workflows.map((wf, idx) => (
              <motion.div 
                key={wf.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveWorkflow(wf.id)}
                className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all group overflow-hidden relative ${
                  activeWorkflow === wf.id ? 'border-primary/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                {/* Background glow when active */}
                {activeWorkflow === wf.id && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>
                )}

                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-black/20" style={{ borderColor: `${wf.color}40`, color: wf.color }}>
                      <wf.icon className="w-6 h-6 drop-shadow-[0_0_10px_currentColor]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {wf.name}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                          wf.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-muted-foreground border-white/10'
                        }`}>
                          {wf.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                          {wf.status}
                        </span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{wf.description}</p>
                      
                      <div className="flex items-center gap-4 mt-4 text-xs font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 text-primary" /> {wf.triggers} triggers
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> Last run: {wf.lastRun}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right Column: Workflow Builder Preview */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel border-white/5 rounded-2xl h-[600px] flex flex-col overflow-hidden sticky top-8"
          >
            {activeWorkflow ? (
              <div className="flex flex-col h-full">
                <div className="p-5 border-b border-white/5 bg-black/20 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <h3 className="text-sm font-bold text-white">Visual Builder</h3>
                </div>
                
                <div className="flex-1 p-6 relative overflow-hidden flex flex-col items-center gap-2">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

                  {/* Trigger Node */}
                  <Node icon={Zap} title="Trigger" subtitle="Event Received" color="text-secondary" borderColor="border-secondary/30" bgColor="bg-secondary/10" />
                  <div className="w-px h-8 bg-gradient-to-b from-secondary/50 to-primary/50 relative">
                    <div className="absolute inset-0 bg-secondary blur-[2px] opacity-50"></div>
                  </div>

                  {/* Condition Node */}
                  <Node icon={ArrowRight} title="Condition" subtitle="If Stock < Threshold" color="text-white" borderColor="border-white/10" bgColor="bg-white/5" />
                  <div className="w-px h-8 bg-gradient-to-b from-white/20 to-primary/50"></div>

                  {/* Action Node */}
                  <Node icon={MessageSquare} title="Action" subtitle="Send WhatsApp Template" color="text-primary" borderColor="border-primary/30" bgColor="bg-primary/10" />

                  <div className="mt-8 w-full p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]">
                    <div className="text-xs font-mono text-primary mb-2 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Preview Message
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                      {"⚠️ *Low Stock Alert*\n\nProduct: {{product_name}}\nRemaining: {{stock}}\n\nPlease restock immediately."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 opacity-50" />
                </div>
                <p>Select a workflow to view its automation builder.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3.33331V12.6666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.3335 8H12.6668" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TabButton({ children, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
        active ? 'bg-white/10 text-white shadow-inner' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function Node({ icon: Icon, title, subtitle, color, borderColor, bgColor }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full max-w-[240px] p-4 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-md relative z-10 flex flex-col items-center text-center shadow-lg`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-black/40 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
    </motion.div>
  );
}
