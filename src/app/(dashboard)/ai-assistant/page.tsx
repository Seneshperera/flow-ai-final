"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User, FileText, BarChart2, Zap, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

const suggestedPrompts = [
  { icon: BarChart2, text: "Why did my sales drop last week?" },
  { icon: FileText, text: "Which products should I restock?" },
  { icon: Zap, text: "Predict next week's demand" },
];

export default function AIAssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = (useChat as any)({
    initialMessages: [
      {
        id: 'welcome',
        role: "assistant",
        content: "Hello! I am Flow AI. I've analyzed your latest metrics and noticed a 15% increase in server costs. Would you like me to run an optimization diagnostic or check your inventory levels?"
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] gap-6">
      {/* Header */}
      <header className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            Flow AI <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Online</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Your intelligent business operations co-pilot.</p>
        </div>
        
        {/* Floating AI Orb */}
        <div className="relative w-16 h-16 mr-8 hidden md:block">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              scale: isLoading ? [1, 1.2, 1] : 1,
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-secondary to-primary border border-white/50 shadow-[0_0_30px_rgba(0,255,255,0.8)]"></div>
          </motion.div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 glass-panel rounded-2xl border-white/5 flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(0,255,255,0.02)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 relative z-10 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((msg: any) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant' 
                    ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]' 
                    : 'bg-secondary/20 text-secondary border border-secondary/50 shadow-[0_0_15px_rgba(150,0,255,0.2)]'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                
                <div className={`p-5 rounded-2xl text-sm leading-relaxed relative group ${
                  msg.role === 'assistant' 
                    ? 'glass-panel border-primary/20 text-white shadow-[inset_0_0_20px_rgba(0,255,255,0.05)]' 
                    : 'bg-secondary/10 border border-secondary/20 text-white'
                }`}>
                  {/* Tool Call Indicators */}
                  {(msg as any).toolInvocations && (msg as any).toolInvocations.map((tool: any) => (
                    <div key={tool.toolCallId} className="mb-3 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2 w-fit text-xs text-muted-foreground font-mono">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      Executing protocol: {tool.toolName}...
                    </div>
                  ))}
                  
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 relative z-10 flex flex-wrap gap-3 justify-center"
          >
            {suggestedPrompts.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => append({ role: 'user', content: prompt.text })}
                className="px-5 py-2.5 rounded-xl glass-panel border-white/10 text-sm text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-white/5 transition-all flex items-center gap-2 group hover:scale-105 active:scale-95"
              >
                <prompt.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                {prompt.text}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-black/40 relative z-10 backdrop-blur-xl">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center max-w-4xl mx-auto"
          >
            <div className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLoading ? 'bg-primary/40 animate-pulse' : 'bg-primary/20'}`}>
              <Sparkles className={`w-4 h-4 ${isLoading ? 'text-white' : 'text-primary'}`} />
            </div>
            
            <input 
              type="text" 
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Ask Flow AI to analyze data, create workflows, or optimize operations..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-16 py-4 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-inner disabled:opacity-50"
            />
            
            <button 
              type="submit"
              disabled={isLoading || !(input || "").trim()}
              className="absolute right-2 p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/40 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-primary/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-muted-foreground/50 font-mono tracking-widest uppercase">
            Nexus Intelligence Engine v2.4 • Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
}
