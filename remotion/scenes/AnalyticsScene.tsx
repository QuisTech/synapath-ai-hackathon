import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ShieldAlert } from 'lucide-react';

export const AnalyticsScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const translateY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity }} className="flex-1 flex flex-col items-center justify-center relative w-full h-full text-center z-10">
        <div style={{ transform: `translateY(${translateY}px)` }} className="flex flex-col items-center">
          <ShieldAlert className="w-40 h-40 text-emerald-500 mb-10" style={{ filter: 'drop-shadow(0 0 60px rgba(16,185,129,0.8))' }} />
          <h1 className="text-8xl font-black mb-8 text-white drop-shadow-2xl">Experience Zero Downtime.</h1>
          <p className="text-4xl text-slate-400 max-w-5xl mb-16 leading-relaxed">Dramatically reduce MTTR and enhance reliability with Autonomous AI.</p>
          <div className="px-16 py-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold text-4xl shadow-[0_0_50px_rgba(16,185,129,0.5)]">
            Try SynaPath AI Demo
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
