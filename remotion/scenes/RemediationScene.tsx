import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { Network, Handshake, Terminal } from 'lucide-react';

export const RemediationScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 30], [0.95, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const logs = [
    { text: "> Generating rollback patch for DB pool...", color: "text-cyan-400" },
    { text: "let MAX_CONNECTIONS = 200; // Updated", color: "text-pink-400" },
    { text: "> Running tests in sandbox... PASSED", color: "text-green-500" },
    { text: "> Awaiting Human-in-the-Loop approval...", color: "text-yellow-500" }
  ];
  
  const currentLogLines = Math.floor(interpolate(frame, [30, 200], [0, 4], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-red-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity, transform: `scale(${scale})` }} className="flex-1 flex flex-col relative z-10 w-full h-full p-16 items-center justify-center">
        <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
          <header className="mb-12 text-center">
            <h1 className="text-6xl font-bold flex items-center justify-center gap-4 text-white"><Network className="w-16 h-16 text-red-500" /> Agent Orchestrator</h1>
          </header>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-slate-900/60 backdrop-blur-md border-2 border-yellow-500/20 rounded-2xl p-10 flex flex-col h-[400px] opacity-50 grayscale">
              <div className="flex items-center gap-6 mb-8">
                <div className="p-5 bg-yellow-500/20 text-yellow-500 rounded-2xl"><Handshake className="w-12 h-12" /></div>
                <div><h2 className="text-4xl font-bold text-white">Diagnostic Agent</h2><div className="text-slate-500 font-black text-2xl tracking-widest mt-1">IDLE</div></div>
              </div>
              <div className="bg-black/50 p-8 rounded-xl border border-slate-700 font-mono text-slate-400 text-2xl flex-1 leading-relaxed">
                &gt; Diagnostic handoff complete.
              </div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border-2 border-red-500/80 rounded-2xl p-10 shadow-[0_0_80px_rgba(239,68,68,0.3)] flex flex-col h-[400px]">
              <div className="flex items-center gap-6 mb-8">
                <div className="p-5 bg-red-500/20 text-red-500 rounded-2xl"><Terminal className="w-12 h-12" style={{ opacity: frame % 60 < 30 ? 1 : 0.5 }} /></div>
                <div><h2 className="text-4xl font-bold text-white">Action Agent</h2><div className="text-green-500 font-black text-2xl tracking-widest mt-1">GENERATING FIX...</div></div>
              </div>
              <div className="bg-black/80 p-8 rounded-xl border border-slate-700 font-mono text-2xl flex-1 relative overflow-hidden leading-relaxed">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
                {logs.slice(0, currentLogLines).map((log, i) => <div key={i} className={log.color}>{log.text}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
