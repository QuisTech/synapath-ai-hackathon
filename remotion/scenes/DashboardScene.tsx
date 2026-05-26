import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';

export const DashboardScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const y = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground w-full h-full text-foreground">

      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">

      <div style={{ opacity, transform: `translateY(${100 - y * 100}px)` }} className="max-w-6xl w-full p-12 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-6 mb-12">
          <LayoutDashboard className="w-20 h-20 text-blue-500" />
          <h2 className="text-9xl font-black font-bold">The Command Center</h2>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-7xl font-black font-bold text-red-400">Critical Alert Detected</h3>
            <p className="text-8xl font-black text-slate-400 mt-2">Database latency spike in eu-west-1</p>
          </div>
          <div className="bg-slate-800 p-8 rounded-2xl">
            <h3 className="text-7xl font-black font-bold text-blue-400 mb-4">Intake Agent</h3>
            <p className="text-8xl font-black text-slate-300">Categorizing and prioritizing incident automatically without human intervention.</p>
          </div>
        </div>
      </div>
</div>
    </div>
  );
};
