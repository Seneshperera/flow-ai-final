"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, Shield } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-50 animate-blob"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-medium text-primary">FlowPilot OS v2.0 is Live</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            Manage your business at <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent glow-text">light speed.</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            The world's first AI-native business operating system. Automate inventory, predict sales, and scale operations with zero friction.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 glow-border">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-medium hover:bg-white/5 transition-all">
              Book Demo
            </button>
          </div>

          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">AI Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Bank-grade Security</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="relative perspective-1000"
        >
          <div className="glass-panel p-2 rounded-3xl rotate-y-[-10deg] rotate-x-[5deg] transform-style-3d shadow-2xl shadow-primary/20">
            <div className="rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/5 aspect-[4/3] relative flex flex-col">
              {/* Mock Dashboard Header */}
              <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs text-white/50">dashboard.flowpilot.ai</div>
                <div></div>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="flex-1 p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 glass-panel border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div className="text-sm text-muted-foreground mb-4">Revenue Forecast</div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 60, 45, 80, 55, 90, 75, 100].map((height, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="glass-panel border border-white/5 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">Active Users</div>
                  <div className="text-2xl font-bold text-white">12,482</div>
                  <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                    <Activity className="w-3 h-3" /> +14.5%
                  </div>
                </div>
                
                <div className="glass-panel border border-white/5 rounded-xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">AI Insights</div>
                  <div className="text-sm text-white/80 leading-relaxed">
                    Inventory for <span className="text-primary font-medium">SKU-992</span> is running low. Reorder recommended.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-12 top-1/4 glass-panel p-4 rounded-2xl border-secondary/30 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <Zap className="text-secondary w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">99.9%</div>
              <div className="text-xs text-muted-foreground">Automation</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
