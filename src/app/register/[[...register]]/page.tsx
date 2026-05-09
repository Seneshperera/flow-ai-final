"use client";

import { SignUp } from "@clerk/nextjs";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

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

        {/* Clerk SignUp Component with Custom Theming passed from layout */}
        <div className="w-full flex justify-center">
          <SignUp path="/register" routing="path" signInUrl="/login" forceRedirectUrl="/onboarding" />
        </div>
      </motion.div>
    </div>
  );
}
