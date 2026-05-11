"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Workflow, Bot } from "lucide-react";

export default function Solutions() {
  return (
    <section id="solutions" className="py-32 relative bg-primary/5 border-y border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white mb-6">
              <Workflow className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold tracking-wide uppercase">Intelligent Workflow</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Stop reacting. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Start anticipating.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              FlowPilot analyzes your historical data, market trends, and current inventory levels to tell you exactly what to do next. It's like having a team of data scientists working around the clock.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "Reduce stockouts by up to 45%", icon: TrendingUp },
                { title: "Automate 80% of routine customer queries", icon: Users },
                { title: "Increase profit margins with dynamic insights", icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-white font-medium text-lg">{item.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl glass-panel border border-white/10 shadow-2xl shadow-primary/20 p-2 overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              
              {/* Mock Dashboard Elements Floating */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 right-10 h-32 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between shadow-xl"
              >
                <div className="w-32 h-4 bg-white/20 rounded-full"></div>
                <div className="flex items-end gap-2 h-16">
                  {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                    <div key={i} className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 w-48 h-48 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-6 shadow-xl"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 mb-4 flex items-center justify-center">
                  <TrendingUp className="text-secondary w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">+24%</div>
                <div className="text-xs text-muted-foreground">Revenue Forecast</div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-16 right-10 w-64 h-32 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 p-6 shadow-xl flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="text-primary w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">Restock 'Wireless Earbuds' before Friday.</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
