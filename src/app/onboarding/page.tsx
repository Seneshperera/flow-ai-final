"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Building, CheckCircle2, ChevronRight, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  { id: "profile", title: "Complete Profile" },
  { id: "organization", title: "Create Workspace" },
  { id: "preferences", title: "AI Setup" }
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      // Simulate API call to complete onboarding
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      
      {/* Header with Progress Indicator */}
      <header className="p-8 relative z-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white tracking-tighter mb-8">
          Flow<span className="text-primary glow-text">Pilot</span> Setup
        </h1>
        
        <div className="flex items-center gap-4 w-full max-w-2xl">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                  index < currentStep ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,255,255,0.5)]' :
                  index === currentStep ? 'bg-primary/20 text-primary border-2 border-primary shadow-[0_0_15px_rgba(0,255,255,0.2)]' :
                  'bg-white/5 text-muted-foreground border border-white/10'
                }`}>
                  {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs absolute -bottom-6 whitespace-nowrap font-medium ${
                  index <= currentStep ? 'text-white' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: index < currentStep ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Main Wizard Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 mt-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 rounded-3xl border-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/20 text-primary rounded-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Tell us about yourself</h2>
                    <p className="text-sm text-muted-foreground">This helps us personalize your experience.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-muted-foreground pl-1">First Name</label>
                      <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all" placeholder="John" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-muted-foreground pl-1">Last Name</label>
                      <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground pl-1">Role in Company</label>
                    <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all appearance-none">
                      <option className="bg-background">CEO / Founder</option>
                      <option className="bg-background">Operations Manager</option>
                      <option className="bg-background">IT Admin</option>
                      <option className="bg-background">Other</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 rounded-3xl border-white/10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary/20 text-secondary rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create your Workspace</h2>
                    <p className="text-sm text-muted-foreground">Your organization's command center.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground pl-1">Organization Name</label>
                    <input type="text" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary/50 focus:shadow-[0_0_15px_rgba(150,0,255,0.1)] transition-all" placeholder="Acme Corp" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-muted-foreground pl-1">Workspace URL</label>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-secondary/50 focus-within:shadow-[0_0_15px_rgba(150,0,255,0.1)] transition-all overflow-hidden">
                      <span className="pl-4 pr-2 py-3 text-sm text-muted-foreground bg-black/20">flowpilot.ai/</span>
                      <input type="text" className="bg-transparent flex-1 py-3 pr-4 text-sm text-white outline-none" placeholder="acme" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-8 rounded-3xl border-white/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2 bg-accent/20 text-accent rounded-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Initialize Nexus AI</h2>
                    <p className="text-sm text-muted-foreground">Configure your AI assistant permissions.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3 cursor-pointer hover:border-accent/50 hover:bg-white/10 transition-colors">
                    <div className="mt-1 w-5 h-5 rounded border border-accent flex items-center justify-center bg-accent/20">
                      <CheckCircle2 className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">Predictive Inventory Analysis</div>
                      <div className="text-xs text-muted-foreground">Allow AI to scan historical sales to predict future stock needs.</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-start gap-3 cursor-pointer hover:border-accent/50 hover:bg-white/10 transition-colors">
                    <div className="mt-1 w-5 h-5 rounded border border-accent flex items-center justify-center bg-accent/20">
                      <CheckCircle2 className="w-3 h-3 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white mb-1">Automated Financial Insights</div>
                      <div className="text-xs text-muted-foreground">Generate weekly automated revenue and expense reports.</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center">
            {currentStep > 0 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Back
              </button>
            ) : <div></div>}

            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                isSubmitting 
                  ? 'bg-primary/50 text-white/50 cursor-not-allowed' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 glow-border shadow-[0_0_20px_rgba(0,255,255,0.2)]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Initializing...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>Launch Workspace <Zap className="w-4 h-4" /></>
              ) : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
