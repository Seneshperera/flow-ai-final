"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small businesses just getting started.",
    price: "$29",
    features: [
      "Up to 500 Inventory Items",
      "Basic Analytics Dashboard",
      "Standard Email Support",
      "1 User Account"
    ],
    highlighted: false,
    delay: 0.1
  },
  {
    name: "Pro",
    description: "Unlock the full power of AI for your growing business.",
    price: "$99",
    features: [
      "Unlimited Inventory Items",
      "AI Predictive Analytics",
      "WhatsApp Automations",
      "FlowPilot AI Assistant",
      "Priority 24/7 Support",
      "Up to 5 Team Members"
    ],
    highlighted: true,
    delay: 0.2
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large-scale operations.",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Custom AI Model Training",
      "Dedicated Success Manager",
      "SSO Authentication",
      "Unlimited Team Members",
      "On-premise deployment options"
    ],
    highlighted: false,
    delay: 0.3
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Transparent, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Scalable Pricing</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Invest in software that pays for itself. Choose the plan that fits your ambition.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: plan.delay, duration: 0.5 }}
              className={`relative rounded-3xl p-8 glass-panel transition-all duration-300 ${
                plan.highlighted 
                  ? "border-primary/50 shadow-[0_0_50px_rgba(0,255,255,0.1)] md:scale-105 z-10 bg-black/60" 
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-xs font-bold text-black flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground h-10">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground mb-1">/mo</span>}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/login">
                <button className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}>
                  Get Started
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
