"use client";

import React from 'react';
import { Network, Activity, Brain, Handshake, Zap, Mail, Server, Cpu, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const agents = [
  { name: 'Intake & Triage Agent', icon: <Activity className="w-8 h-8 text-purple-400" />, status: 'active', tasks: 12, uptime: '99.9%', color: 'border-purple-500/50', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80' },
  { name: 'Knowledge & Context Agent', icon: <Brain className="w-8 h-8 text-blue-400" />, status: 'active', tasks: 4, uptime: '100%', color: 'border-blue-500/50', img: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=600&q=80' },
  { name: 'Diagnostic & Root Cause Agent', icon: <Handshake className="w-8 h-8 text-yellow-400" />, status: 'active', tasks: 8, uptime: '99.8%', color: 'border-yellow-500/50', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' },
  { name: 'Action & Remediation Agent', icon: <Terminal className="w-8 h-8 text-red-400" />, status: 'standby', tasks: 0, uptime: '99.9%', color: 'border-red-500/50', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80' },
  { name: 'Communication & Update Agent', icon: <Mail className="w-8 h-8 text-green-400" />, status: 'active', tasks: 45, uptime: '100%', color: 'border-green-500/50', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80' },
];

const OrchestratorPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] p-8 bg-background text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Network className="w-10 h-10 text-primary" />
            Agent Orchestrator
          </h1>
          <p className="text-secondary mt-3 text-lg max-w-2xl mx-auto">
            Live topological map of the UiPath autonomous agent fleet. Monitor task delegation, agent health, and operational bandwidth.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div 
              key={agent.name}
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.1 }}
              className={`bg-card/60 backdrop-blur-sm border-2 ${agent.color} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col`}
            >
              <div className="h-32 w-full relative">
                <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
                <div className="absolute bottom-4 left-4 p-3 bg-background/80 backdrop-blur-md rounded-xl border border-border shadow-lg">
                  {agent.icon}
                </div>
              </div>
              <div className="p-6 pt-2 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{agent.name}</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${agent.status === 'active' ? 'bg-success/20 text-success border border-success/30' : 'bg-warning/20 text-warning border border-warning/30'}`}>
                    {agent.status}
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border">
                  <span className="text-secondary text-sm flex items-center gap-2"><Server className="w-4 h-4"/> Active Tasks</span>
                  <span className="font-mono font-bold text-primary">{agent.tasks}</span>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border">
                  <span className="text-secondary text-sm flex items-center gap-2"><Cpu className="w-4 h-4"/> Fleet Uptime</span>
                  <span className="font-mono font-bold">{agent.uptime}</span>
                </div>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrchestratorPage;
