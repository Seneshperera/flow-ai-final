"use client";

import { motion } from "framer-motion";
import { Bot, BarChart3, Package, Zap, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

const features = [
  {
    title: "AI Business Assistant",
    description: "Your 24/7 intelligent copilot. Ask questions about your business, generate reports, and get actionable insights instantly.",
    icon: Bot,
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Predictive Analytics",
    description: "Harness the power of machine learning to forecast demand, spot trends, and optimize your inventory before stockouts happen.",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Smart Inventory",
    description: "Real-time stock tracking with automated low-stock alerts and predictive restocking recommendations.",
    icon: Package,
    color: "from-emerald-400 to-teal-500"
  },
  {
    title: "WhatsApp Automations",
    description: "Engage customers automatically. Send invoices, order updates, and AI-driven replies directly via WhatsApp.",
    icon: Zap,
    color: "from-amber-400 to-orange-500"
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption, secure Clerk authentication, and role-based access control for your entire team.",
    icon: ShieldCheck,
    color: "from-rose-400 to-red-500"
  },
  {
    title: "Neural Integrations",
    description: "Connect seamlessly with your existing tools. Our API-first architecture ensures data flows perfectly.",
    icon: Cpu,
    color: "from-indigo-400 to-blue-600"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">Core Capabilities</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            An operating system built for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">future of business</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Replace outdated spreadsheets and fragmented tools with a unified, AI-driven platform that thinks and scales with you.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                <div className="w-full h-full bg-background/90 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
