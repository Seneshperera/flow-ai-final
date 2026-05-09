"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Scatter } from "recharts";
import { Activity, TrendingUp, AlertTriangle, BrainCircuit, RefreshCw, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-4 border-white/10 text-white min-w-[200px] shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        <p className="text-muted-foreground text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => {
          if (entry.dataKey === 'isAnomaly' && !entry.value) return null;
          
          let color = entry.color;
          let name = entry.name;
          let value = entry.value;

          if (entry.dataKey === 'actual') name = 'Actual Revenue';
          if (entry.dataKey === 'predicted') name = 'AI Forecast';
          if (entry.dataKey === 'isAnomaly' && entry.value) {
            name = 'Anomaly Detected';
            value = 'True';
            color = 'var(--destructive)';
          }

          if (value === null || value === undefined) return null;

          return (
            <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                {name}:
              </span>
              <span className="font-bold">
                {typeof value === 'number' ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function AnalyticsLab() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['forecast'],
    queryFn: async () => {
      const res = await fetch('/api/forecast');
      return res.json();
    }
  });

  const chartData = data?.data || [];
  const insights = data?.insights || [];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-secondary" />
            Nexus <span className="text-secondary glow-text">Predictive Lab</span>
          </h1>
          <p className="text-muted-foreground mt-1">Machine Learning models powered by Prophet & Scikit-Learn.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl glass-panel border-white/10 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/5 transition-colors">
            Last 30 Days <ChevronDown className="w-4 h-4" />
          </button>
          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold flex items-center gap-2 hover:bg-secondary/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(150,0,255,0.3)] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} /> Run Model
          </button>
        </div>
      </header>

      {/* Main Forecasting Graph */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Revenue Forecast <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30">95% Confidence</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Predicting 30 days ahead using Prophet time-series analysis.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 text-muted-foreground"><div className="w-3 h-3 rounded bg-primary"></div> Actual</div>
            <div className="flex items-center gap-2 text-muted-foreground"><div className="w-3 h-3 rounded bg-secondary"></div> Forecast</div>
            <div className="flex items-center gap-2 text-muted-foreground"><div className="w-3 h-3 rounded bg-secondary/20"></div> Confidence Interval</div>
            <div className="flex items-center gap-2 text-destructive"><div className="w-3 h-3 rounded-full bg-destructive"></div> Anomaly</div>
          </div>
        </div>

        <div className="h-[400px] w-full relative z-10">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-secondary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-sm text-secondary font-mono animate-pulse">Fitting Prophet Model...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.4)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  tickMargin={10}
                  minTickGap={30}
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    return `${date.getMonth()+1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} 
                  tickFormatter={(value) => `$${value/1000}k`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                
                {/* Confidence Interval */}
                <Area 
                  type="monotone" 
                  dataKey="confidenceUpper" 
                  stroke="none" 
                  fill="rgba(150,0,255,0.05)" 
                  isAnimationActive={true} 
                />
                <Area 
                  type="monotone" 
                  dataKey="confidenceLower" 
                  stroke="none" 
                  fill="#000" // Overlap the bottom to clip
                  isAnimationActive={false} 
                />

                {/* Actual Data */}
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorActual)" 
                  activeDot={{ r: 6, fill: 'var(--primary)', stroke: '#fff', strokeWidth: 2 }}
                />
                
                {/* Predicted Data */}
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="var(--secondary)" 
                  strokeWidth={3} 
                  strokeDasharray="5 5" 
                  dot={false}
                  activeDot={{ r: 6, fill: 'var(--secondary)', stroke: '#fff', strokeWidth: 2 }}
                />

                {/* Anomalies */}
                <Scatter 
                  dataKey="actual" 
                  fill="var(--destructive)" 
                  shape="circle" 
                  data={chartData.filter((d: any) => d.isAnomaly)} 
                  r={6} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* AI Insight Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {!isLoading && insights.map((insight: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border-white/5 relative group hover:-translate-y-1 transition-transform"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                insight.type === 'positive' ? 'bg-primary/20 text-primary border border-primary/20' :
                insight.type === 'warning' ? 'bg-destructive/20 text-destructive border border-destructive/20 shadow-[0_0_20px_rgba(255,50,50,0.2)]' :
                'bg-secondary/20 text-secondary border border-secondary/20'
              }`}>
                {insight.type === 'positive' ? <TrendingUp className="w-5 h-5" /> : 
                 insight.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : 
                 <Activity className="w-5 h-5" />}
              </div>
              <h3 className="text-white font-semibold mb-2">
                {insight.type === 'positive' ? 'Trend Analysis' : 
                 insight.type === 'warning' ? 'Anomaly Detected' : 
                 'Model Confidence'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
