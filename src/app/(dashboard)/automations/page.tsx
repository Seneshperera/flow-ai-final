"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Zap, Clock, Users, ArrowRight, Play, CheckCircle2, MoreVertical, FileText, Bot, AlertCircle, Plus, Trash2, Power, Loader2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getAutomationsAction, createAutomationAction, toggleAutomationAction, deleteAutomationAction } from "@/actions/automation.actions";

export default function AutomationsPage() {
  const [activeTab, setActiveTab] = useState('workflows');
  const [activeWorkflow, setActiveWorkflow] = useState<any>(null);
  const [automations, setAutomations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    triggerType: "LOW_STOCK",
    actionType: "SEND_WHATSAPP"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAutomations();
  }, []);

  async function loadAutomations() {
    setIsLoading(true);
    const res = await getAutomationsAction();
    if (res.success && res.data) {
      setAutomations(res.data);
      if (res.data.length > 0 && !activeWorkflow) {
        setActiveWorkflow(res.data[0]);
      }
    }
    setIsLoading(false);
  }

  async function handleCreate() {
    setIsSaving(true);
    const res = await createAutomationAction({
      name: newWorkflow.name || "Untitled Workflow",
      description: newWorkflow.description || "Custom automation",
      triggerType: newWorkflow.triggerType,
      actionType: newWorkflow.actionType,
      triggerConfig: {},
      actionConfig: {}
    });
    
    if (res.success && res.data) {
      setAutomations(prev => [res.data, ...prev]);
      setIsCreating(false);
      setNewWorkflow({ name: "", description: "", triggerType: "LOW_STOCK", actionType: "SEND_WHATSAPP" });
      setActiveWorkflow(res.data);
    } else {
      alert("Failed to create automation: " + (res.error || "Unknown error"));
    }
    setIsSaving(false);
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    // Optimistic update
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !currentStatus } : a));
    const res = await toggleAutomationAction(id, !currentStatus);
    if (!res.success) {
      // Revert on failure
      setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: currentStatus } : a));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    setAutomations(prev => prev.filter(a => a.id !== id));
    if (activeWorkflow?.id === id) setActiveWorkflow(null);
    await deleteAutomationAction(id);
  }

  const getTriggerIcon = (type: string) => {
    switch(type) {
      case 'LOW_STOCK': return AlertCircle;
      case 'NEW_ORDER': return Package;
      case 'INVOICE_PAID': return FileText;
      default: return Zap;
    }
  };

  const getActionIcon = (type: string) => {
    switch(type) {
      case 'SEND_WHATSAPP': return MessageSquare;
      case 'SEND_EMAIL': return FileText;
      default: return Bot;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary glow-icon" />
            <span className="glow-text">Automations</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage trigger-based workflows and WhatsApp auto-replies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-black font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Workflow
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left Column: Workflows */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence>
            {isLoading ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : automations.length === 0 ? (
              <div className="glass-panel p-12 rounded-2xl flex flex-col items-center text-center border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 opacity-50 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Automations Yet</h3>
                <p className="text-muted-foreground max-w-md">Create your first automated workflow to sync inventory events to WhatsApp or Email automatically.</p>
              </div>
            ) : (
              automations.map((wf, idx) => {
                const Icon = getTriggerIcon(wf.triggerType);
                const isActive = wf.isActive;
                return (
                  <motion.div 
                    key={wf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setActiveWorkflow(wf)}
                    className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all group overflow-hidden relative ${
                      activeWorkflow?.id === wf.id ? 'border-primary/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    {activeWorkflow?.id === wf.id && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full pointer-events-none"></div>
                    )}

                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-black/20 ${isActive ? 'border-primary/40 text-primary' : 'border-white/10 text-muted-foreground'}`}>
                          <Icon className="w-6 h-6 drop-shadow-[0_0_10px_currentColor]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {wf.name}
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                              isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-muted-foreground border-white/10'
                            }`}>
                              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                              {isActive ? 'Active' : 'Paused'}
                            </span>
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{wf.description}</p>
                          
                          <div className="flex items-center gap-4 mt-4 text-xs font-medium text-muted-foreground">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
                              TRIGGER: <span className="text-white">{wf.triggerType}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md">
                              ACTION: <span className="text-white">{wf.actionType}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggle(wf.id, wf.isActive); }}
                          className={`p-2 rounded-lg transition-colors ${isActive ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:bg-white/10'}`}
                          title={isActive ? "Pause Workflow" : "Activate Workflow"}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(wf.id); }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
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
                  <div className={`w-2 h-2 rounded-full ${activeWorkflow.isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}></div>
                  <h3 className="text-sm font-bold text-white">Visual Builder</h3>
                </div>
                
                <div className="flex-1 p-6 relative overflow-hidden flex flex-col items-center gap-2">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

                  {/* Trigger Node */}
                  <Node 
                    icon={getTriggerIcon(activeWorkflow.triggerType)} 
                    title="Trigger" 
                    subtitle={activeWorkflow.triggerType.replace('_', ' ')} 
                    color="text-secondary" 
                    borderColor="border-secondary/30" 
                    bgColor="bg-secondary/10" 
                  />
                  
                  <div className="w-px h-8 bg-gradient-to-b from-secondary/50 to-primary/50 relative">
                    <div className="absolute inset-0 bg-secondary blur-[2px] opacity-50"></div>
                  </div>

                  {/* Action Node */}
                  <Node 
                    icon={getActionIcon(activeWorkflow.actionType)} 
                    title="Action" 
                    subtitle={activeWorkflow.actionType.replace('_', ' ')} 
                    color="text-primary" 
                    borderColor="border-primary/30" 
                    bgColor="bg-primary/10" 
                  />

                  <div className="mt-8 w-full p-4 rounded-xl border border-primary/20 bg-primary/5 shadow-[inset_0_0_20px_rgba(0,255,255,0.05)] relative z-10">
                    <div className="text-xs font-mono text-primary mb-2 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Execution Payload
                    </div>
                    <pre className="text-xs text-white/80 leading-relaxed whitespace-pre-wrap font-mono bg-black/40 p-3 rounded-lg">
                      {JSON.stringify({
                        event: activeWorkflow.triggerType,
                        target: activeWorkflow.actionType,
                        timestamp: "{{current_time}}"
                      }, null, 2)}
                    </pre>
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

      {/* Create Modal Overlay */}
      <AnimatePresence>
        {isCreating && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl relative"
              >
                <button 
                  onClick={() => setIsCreating(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <h2 className="text-xl font-bold text-white mb-6">Create New Automation</h2>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Workflow Name</label>
                    <input 
                      type="text" 
                      value={newWorkflow.name}
                      onChange={e => setNewWorkflow({...newWorkflow, name: e.target.value})}
                      placeholder="e.g. Alert Admin on Low Stock"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                    <textarea 
                      value={newWorkflow.description}
                      onChange={e => setNewWorkflow({...newWorkflow, description: e.target.value})}
                      placeholder="What does this do?"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors resize-none h-20"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Trigger Event</label>
                      <select 
                        value={newWorkflow.triggerType}
                        onChange={e => setNewWorkflow({...newWorkflow, triggerType: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="LOW_STOCK">Low Stock</option>
                        <option value="NEW_ORDER">New Order</option>
                        <option value="INVOICE_PAID">Invoice Paid</option>
                        <option value="CUSTOM_WEBHOOK">Custom Webhook</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Execute Action</label>
                      <select 
                        value={newWorkflow.actionType}
                        onChange={e => setNewWorkflow({...newWorkflow, actionType: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="SEND_WHATSAPP">Send WhatsApp Message</option>
                        <option value="SEND_EMAIL">Send Email</option>
                        <option value="CREATE_NOTIFICATION">In-App Notification</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleCreate}
                    disabled={isSaving || !newWorkflow.name}
                    className="mt-4 w-full py-3 rounded-xl bg-primary text-black font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save & Activate
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
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
// Removed unused icons from old static code
function Package(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> }
