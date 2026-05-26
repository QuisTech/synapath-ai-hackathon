"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Network, Activity, Brain, Handshake, Terminal, Mail, Server, Cpu, CheckCircle, AlertTriangle, XCircle, MoreHorizontal } from 'lucide-react';

// Unified UI Components (Hardcoded for perfect presentation)
const IntroUI = () => (
  <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full text-center z-10">
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, type: 'spring' }} className="flex flex-col items-center">
      <ShieldAlert className="w-40 h-40 text-red-500 mb-10" style={{ filter: 'drop-shadow(0 0 40px rgba(239,68,68,0.8))' }} />
      <h1 className="text-8xl font-black mb-8 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">SynaPath AI</h1>
      <p className="text-4xl text-slate-300 max-w-5xl leading-relaxed">Autonomous IT Incident Management.<br/>Transforming reactive response into proactive resolution.</p>
    </motion.div>
  </div>
);

const DashboardUI = () => (
  <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
    <header className="mb-10 flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3"><Activity className="w-10 h-10 text-primary" /> Active Incidents</h1>
        <p className="text-secondary mt-2 text-xl">Real-time alerts processed by Intake Agents.</p>
      </div>
      <div className="flex gap-4">
        <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> 1 Critical
        </div>
        <div className="px-6 py-3 bg-card border border-border rounded-xl font-medium text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" /> 24 Resolved
        </div>
      </div>
    </header>
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-border hover:bg-white/5 transition-colors cursor-pointer bg-red-500/5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><AlertTriangle className="w-8 h-8" /></div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold">Database connection error in Production API</h3>
                <span className="px-3 py-1 bg-warning/20 text-warning text-sm rounded-full font-bold uppercase tracking-wider border border-warning/30 flex items-center gap-1">
                  <Activity className="w-4 h-4 animate-pulse" /> Investigating
                </span>
              </div>
              <p className="text-secondary text-lg">INC001 • Reported 2 mins ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InvestigationUI = () => (
  <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
    <header className="mb-10 text-center">
      <h1 className="text-5xl font-bold flex items-center justify-center gap-3"><Network className="w-12 h-12 text-primary" /> Agent Orchestrator</h1>
      <p className="text-secondary mt-4 text-2xl max-w-3xl mx-auto">Live topological map of the autonomous agent fleet.</p>
    </header>
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-card/60 backdrop-blur-sm border-2 border-yellow-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(234,179,8,0.15)] flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-yellow-500/20 text-yellow-500 rounded-xl"><Handshake className="w-10 h-10" /></div>
          <div><h2 className="text-2xl font-bold">Diagnostic Agent</h2><div className="text-success font-bold text-lg">ACTIVE</div></div>
        </div>
        <div className="bg-black/50 p-6 rounded-xl border border-border font-mono text-green-400 text-lg flex-1">
          &gt; Analyzing INC001 traces...<br/>
          &gt; Scanning application logs...<br/>
          &gt; Cross-referencing database metrics...<br/>
          &gt; Root cause identified: Connection pool exhaustion due to memory leak.
        </div>
      </div>
      <div className="bg-card/60 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.15)] flex flex-col opacity-50 grayscale">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-red-500/20 text-red-500 rounded-xl"><Terminal className="w-10 h-10" /></div>
          <div><h2 className="text-2xl font-bold">Action Agent</h2><div className="text-warning font-bold text-lg">STANDBY</div></div>
        </div>
        <div className="bg-black/50 p-6 rounded-xl border border-border font-mono text-secondary text-lg flex-1">
          &gt; Waiting for diagnostic handoff...
        </div>
      </div>
    </div>
  </div>
);

const RemediationUI = () => (
  <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
    <header className="mb-10 text-center">
      <h1 className="text-5xl font-bold flex items-center justify-center gap-3"><Network className="w-12 h-12 text-primary" /> Agent Orchestrator</h1>
    </header>
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-card/60 backdrop-blur-sm border-2 border-yellow-500/20 rounded-2xl p-8 opacity-50 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-yellow-500/20 text-yellow-500 rounded-xl"><Handshake className="w-10 h-10" /></div>
          <div><h2 className="text-2xl font-bold">Diagnostic Agent</h2><div className="text-secondary font-bold text-lg">IDLE</div></div>
        </div>
        <div className="bg-black/50 p-6 rounded-xl border border-border font-mono text-secondary text-lg flex-1">
          &gt; Diagnostic handoff complete.
        </div>
      </div>
      <div className="bg-card/60 backdrop-blur-sm border-2 border-red-500/80 rounded-2xl p-8 shadow-[0_0_60px_rgba(239,68,68,0.3)] flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-red-500/20 text-red-500 rounded-xl"><Terminal className="w-10 h-10 animate-pulse" /></div>
          <div><h2 className="text-2xl font-bold text-white">Action Agent</h2><div className="text-success font-bold text-lg animate-pulse">GENERATING FIX...</div></div>
        </div>
        <div className="bg-black/80 p-6 rounded-xl border border-border font-mono text-cyan-400 text-lg flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
          &gt; Generating rollback patch for DB pool...<br/>
          <span className="text-pink-400">let MAX_CONNECTIONS = 200; // Updated</span><br/>
          &gt; Running tests in sandbox... <span className="text-success">PASSED</span><br/>
          &gt; Awaiting Human-in-the-Loop approval...
        </div>
      </div>
    </div>
  </div>
);

const OutroUI = () => (
  <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full text-center z-10">
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
      <ShieldAlert className="w-32 h-32 text-emerald-500 mb-10" style={{ filter: 'drop-shadow(0 0 40px rgba(16,185,129,0.8))' }} />
      <h1 className="text-7xl font-black mb-8 text-white">Experience Zero Downtime.</h1>
      <p className="text-3xl text-slate-400 max-w-4xl mb-12">Dramatically reduce MTTR and enhance reliability with Autonomous AI.</p>
      <div className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white font-bold text-2xl shadow-[0_0_30px_rgba(239,68,68,0.5)]">
        Try SynaPath AI Demo
      </div>
    </motion.div>
  </div>
);

export default function CinematicDemoPage() {
  const [activeScene, setActiveScene] = useState<string>('intro');

  useEffect(() => {
    // Expose window.startScene to Playwright
    (window as any).startScene = (id: string) => {
      console.log(`🎬 CinematicDemoPage received startScene: ${id}`);
      setActiveScene(id);
      
      // Dispatch custom event if other scripts need it
      window.dispatchEvent(new CustomEvent('scene-change', { detail: { id } }));
    };

    // Listen to custom event (fallback)
    const handleSceneChange = (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      setActiveScene(id);
    };
    window.addEventListener('scene-change', handleSceneChange);

    return () => {
      window.removeEventListener('scene-change', handleSceneChange);
      delete (window as any).startScene;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden relative">
      {/* Universal Cinematic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none transition-colors duration-1000"
           style={{ 
             backgroundColor: activeScene === 'intro' ? 'rgba(239, 68, 68, 0.15)' : 
                              activeScene === 'dashboard' ? 'rgba(59, 130, 246, 0.15)' : 
                              activeScene === 'investigation' ? 'rgba(234, 179, 8, 0.15)' : 
                              activeScene === 'remediation' ? 'rgba(239, 68, 68, 0.2)' : 
                              'rgba(16, 185, 129, 0.15)' 
           }}
      />
      
      <main className="flex-1 flex flex-col relative z-10 w-full h-full p-8">
        <AnimatePresence mode="wait">
          {activeScene === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="flex-1 flex w-full h-full">
              <IntroUI />
            </motion.div>
          )}
          {activeScene === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.6 }} className="flex-1 flex w-full h-full">
              <DashboardUI />
            </motion.div>
          )}
          {activeScene === 'investigation' && (
            <motion.div key="investigation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }} className="flex-1 flex w-full h-full">
              <InvestigationUI />
            </motion.div>
          )}
          {activeScene === 'remediation' && (
            <motion.div key="remediation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }} className="flex-1 flex w-full h-full">
              <RemediationUI />
            </motion.div>
          )}
          {(activeScene === 'analytics' || activeScene === 'outro') && (
            <motion.div key="outro" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="flex-1 flex w-full h-full">
              <OutroUI />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
