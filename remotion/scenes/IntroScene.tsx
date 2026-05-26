import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShieldAlert } from 'lucide-react';

export const IntroScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground w-full h-full relative overflow-hidden text-center text-foreground">

      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-red-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">

      <div style={{ opacity, transform: `scale(${scale})` }} className="relative z-10 flex flex-col items-center">
        <ShieldAlert className="w-32 h-32 text-red-500 mb-8" style={{ filter: 'drop-shadow(0 0 30px rgba(239,68,68,0.8))' }} />
        <h1 className="text-9xl font-black mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">SynaPath AI</h1>
        <p className="text-9xl font-black text-slate-300 max-w-4xl leading-relaxed">Autonomous IT Incident Management.<br/>Transforming reactive response into proactive resolution.</p>
      </div>
</div>
    </div>
  );
};
