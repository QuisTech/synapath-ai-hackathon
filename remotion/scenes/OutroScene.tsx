import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShieldCheck } from 'lucide-react';

export const OutroScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground w-full h-full relative overflow-hidden text-center text-foreground">

      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">

      <div style={{ opacity, transform: `scale(${scale})` }} className="relative z-10 flex flex-col items-center">
        <ShieldCheck className="w-40 h-40 text-blue-500 mb-8" style={{ filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.8))' }} />
        <h1 className="text-9xl font-black mb-6">Welcome to a Proactive Future</h1>
        <p className="text-9xl font-black text-slate-400 mb-12">SynaPath AI - Your Autonomous Site Reliability Engineer.</p>
        <div className="px-12 py-6 bg-blue-600 rounded-full text-7xl font-black font-bold shadow-2xl shadow-blue-500/50">
          Try the Demo Now
        </div>
      </div>
</div>
    </div>
  );
};
