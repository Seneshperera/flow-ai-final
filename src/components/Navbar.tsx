"use client";

import { motion } from "framer-motion";
import { Sparkles, Terminal, Activity, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 overflow-hidden">
            <Activity className="text-primary w-5 h-5 absolute z-10" />
            <div className="absolute inset-0 bg-primary/20 blur-md animate-pulse"></div>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            Flow<span className="text-primary glow-text">Pilot</span> AI
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors hover:glow-text">Features</Link>
          <Link href="#solutions" className="hover:text-primary transition-colors hover:glow-text">Solutions</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors hover:glow-text">Pricing</Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors hover:glow-text">Dashboard</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <button className="relative group px-6 py-2 rounded-full bg-primary/10 border border-primary/50 text-primary font-medium overflow-hidden transition-all hover:bg-primary/20 hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Get Started
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-panel mt-4 p-4 flex flex-col gap-4 absolute left-6 right-6"
        >
          <Link href="#features" className="text-white hover:text-primary p-2">Features</Link>
          <Link href="#solutions" className="text-white hover:text-primary p-2">Solutions</Link>
          <Link href="#pricing" className="text-white hover:text-primary p-2">Pricing</Link>
          <Link href="/dashboard" className="text-white hover:text-primary p-2">Dashboard</Link>
          <Link href="/login" className="text-white hover:text-primary p-2">Sign In</Link>
          <Link href="/register" className="w-full">
            <button className="w-full py-3 rounded-xl bg-primary/20 border border-primary/50 text-primary font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Get Started
            </button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}
