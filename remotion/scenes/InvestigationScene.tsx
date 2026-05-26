import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Search } from 'lucide-react';

export const InvestigationScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const codeProgress = interpolate(frame, [30, 200], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground w-full h-full text-foreground p-24">

      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-yellow-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">

      <div style={{ opacity }} className="w-full flex flex-col h-full">
        <div className="flex items-center gap-6 mb-12">
          <Search className="w-20 h-20 text-yellow-500" />
          <h2 className="text-9xl font-black font-bold">Autonomous Investigation</h2>
        </div>
        <div className="flex-1 bg-background text-foreground rounded-xl p-8 font-mono text-7xl font-black text-green-400 overflow-hidden relative border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none z-10" />
          <div style={{ clipPath: `inset(0 0 ${100 - codeProgress}% 0)` }}>
            <p className="mb-4">&gt; Initializing Diagnostic Agents...</p>
            <p className="mb-4">&gt; Pulling logs from Kubernetes cluster...</p>
            <p className="mb-4">&gt; Analyzing stack traces across microservices...</p>
            <p className="mb-4 text-orange-400">&gt; Identifying root cause: Connection pool exhaustion.</p>
            <p className="mb-4">&gt; Context gathered successfully.</p>
          </div>
        </div>
      </div>
</div>
    </div>
  );
};
