import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export const DashboardScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const slideX = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-blue-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity, transform: `translateX(${slideX}px)` }} className="flex-1 flex flex-col relative z-10 w-full h-full p-16 items-center justify-center">
        <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-bold flex items-center gap-4"><Activity className="w-12 h-12 text-blue-500" /> Active Incidents</h1>
              <p className="text-slate-400 mt-2 text-2xl">Real-time alerts processed by Intake Agents.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium text-2xl flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> 1 Critical
              </div>
              <div className="px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl font-medium text-2xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" /> 24 Resolved
              </div>
            </div>
          </header>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-700 bg-red-500/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-red-500/20 text-red-500 rounded-xl"><AlertTriangle className="w-10 h-10" /></div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-4xl font-bold text-white">Database connection error in Production API</h3>
                      <span className="px-4 py-1 bg-yellow-500/20 text-yellow-500 text-lg rounded-full font-bold uppercase tracking-wider border border-yellow-500/30 flex items-center gap-2">
                        <Activity className="w-5 h-5" style={{ opacity: frame % 60 < 30 ? 1 : 0.5 }} /> Investigating
                      </span>
                    </div>
                    <p className="text-slate-400 text-2xl">INC001 • Reported 2 mins ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
