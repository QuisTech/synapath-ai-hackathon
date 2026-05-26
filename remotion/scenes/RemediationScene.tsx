import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Zap, CheckCircle } from 'lucide-react';

export const RemediationScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame: frame - 60, fps, config: { damping: 12 } });

  return (
    <div className="flex-1 flex items-center justify-center bg-background text-foreground w-full h-full text-foreground">

      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-red-500/30 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">

      <div style={{ opacity }} className="max-w-4xl w-full text-center">
        <Zap className="w-32 h-32 text-orange-500 mx-auto mb-12" />
        <h2 className="text-9xl font-black font-bold mb-12">Proactive Remediation</h2>
        <div className="bg-slate-900 border border-orange-500/30 p-12 rounded-3xl relative">
          <h3 className="text-9xl font-black font-bold mb-6">Action Agent Proposal</h3>
          <p className="text-9xl font-black text-slate-300 mb-12">Scale up database connection pool limits and restart idle pods.</p>
          
          <div style={{ transform: `scale(${scale})` }} className="inline-flex items-center gap-4 bg-green-500/20 text-green-400 px-8 py-4 rounded-full border border-green-500/50">
            <CheckCircle className="w-8 h-8" />
            <span className="text-7xl font-black font-bold">Human-in-the-Loop Approved</span>
          </div>
        </div>
      </div>
</div>
    </div>
  );
};
