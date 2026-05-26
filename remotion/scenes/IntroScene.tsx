import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring, AbsoluteFill } from 'remotion';
import { ShieldAlert } from 'lucide-react';

export const IntroScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-red-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity }} className="flex-1 flex flex-col items-center justify-center relative w-full h-full text-center z-10">
        <div style={{ transform: `scale(${0.8 + (scale * 0.2)})` }} className="flex flex-col items-center">
          <ShieldAlert className="w-40 h-40 text-red-500 mb-10" style={{ filter: 'drop-shadow(0 0 40px rgba(239,68,68,0.8))' }} />
          <h1 className="text-8xl font-black mb-8 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">SynaPath AI</h1>
          <p className="text-4xl text-slate-300 max-w-5xl leading-relaxed">Autonomous IT Incident Management.<br/>Transforming reactive response into proactive resolution.</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
