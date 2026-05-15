"use client";

import { SignUp } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import { register } from "@/actions/auth.actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden p-6">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 flex flex-col items-center"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/50 overflow-hidden mb-4 shadow-[0_0_20px_rgba(150,0,255,0.3)]">
            <Activity className="text-secondary w-6 h-6 relative z-10" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
          <p className="text-sm text-muted-foreground">Join FlowPilot and scale your business operations.</p>
        </div>

        {/* Priority: Custom Registration Form */}
        <form action={register} className="w-full space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">First Name</label>
              <input 
                name="firstName"
                placeholder="John"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Last Name</label>
              <input 
                name="lastName"
                placeholder="Doe"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 outline-none transition-all"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 rounded-xl bg-secondary/20 border border-secondary/50 text-secondary font-bold hover:bg-secondary/30 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(150,0,255,0.15)]"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <div className="w-full flex items-center gap-4 mb-8">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-xs text-muted-foreground font-mono">OR USE CLERK</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Secondary: Clerk SignUp Component */}
        <div className="w-full flex justify-center opacity-50 hover:opacity-100 transition-opacity">
          <SignUp path="/register" routing="path" signInUrl="/login" fallbackRedirectUrl="/onboarding" />
        </div>
      </motion.div>
    </div>
  );
}
