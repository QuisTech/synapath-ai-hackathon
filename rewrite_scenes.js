const fs = require('fs');
const path = require('path');

const scenesDir = path.join('remotion', 'scenes');

const introCode = `import React from 'react';
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
        <div style={{ transform: \`scale(\${0.8 + (scale * 0.2)})\` }} className="flex flex-col items-center">
          <ShieldAlert className="w-40 h-40 text-red-500 mb-10" style={{ filter: 'drop-shadow(0 0 40px rgba(239,68,68,0.8))' }} />
          <h1 className="text-8xl font-black mb-8 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">SynaPath AI</h1>
          <p className="text-4xl text-slate-300 max-w-5xl leading-relaxed">Autonomous IT Incident Management.<br/>Transforming reactive response into proactive resolution.</p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
`;

const dashboardCode = `import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export const DashboardScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const slideX = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-blue-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity, transform: \`translateX(\${slideX}px)\` }} className="flex-1 flex flex-col relative z-10 w-full h-full p-16 items-center justify-center">
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
`;

const investigationCode = `import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { Network, Handshake, Terminal } from 'lucide-react';

export const InvestigationScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(frame, [0, 30], [0.95, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const logs = [
    "> Analyzing INC001 traces...",
    "> Scanning application logs...",
    "> Cross-referencing database metrics...",
    "> Root cause identified: Connection pool exhaustion due to memory leak."
  ];
  
  const currentLogLines = Math.floor(interpolate(frame, [30, 200], [0, 4], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-yellow-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity, transform: \`scale(\${scale})\` }} className="flex-1 flex flex-col relative z-10 w-full h-full p-16 items-center justify-center">
        <div className="max-w-7xl mx-auto w-full relative z-10 mt-10">
          <header className="mb-12 text-center">
            <h1 className="text-6xl font-bold flex items-center justify-center gap-4 text-white"><Network className="w-16 h-16 text-yellow-500" /> Agent Orchestrator</h1>
            <p className="text-slate-400 mt-6 text-3xl max-w-3xl mx-auto">Live topological map of the autonomous agent fleet.</p>
          </header>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-slate-900/60 backdrop-blur-md border-2 border-yellow-500/50 rounded-2xl p-10 shadow-[0_0_60px_rgba(234,179,8,0.2)] flex flex-col h-[400px]">
              <div className="flex items-center gap-6 mb-8">
                <div className="p-5 bg-yellow-500/20 text-yellow-500 rounded-2xl"><Handshake className="w-12 h-12" /></div>
                <div><h2 className="text-4xl font-bold text-white">Diagnostic Agent</h2><div className="text-green-500 font-black text-2xl tracking-widest mt-1">ACTIVE</div></div>
              </div>
              <div className="bg-black/80 p-8 rounded-xl border border-slate-700 font-mono text-green-400 text-2xl flex-1 leading-relaxed">
                {logs.slice(0, currentLogLines).map((log, i) => <div key={i}>{log}</div>)}
              </div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border-2 border-red-500/30 rounded-2xl p-10 flex flex-col h-[400px] opacity-60 grayscale">
              <div className="flex items-center gap-6 mb-8">
                <div className="p-5 bg-red-500/20 text-red-500 rounded-2xl"><Terminal className="w-12 h-12" /></div>
                <div><h2 className="text-4xl font-bold text-white">Action Agent</h2><div className="text-yellow-500 font-black text-2xl tracking-widest mt-1">STANDBY</div></div>
              </div>
              <div className="bg-black/50 p-8 rounded-xl border border-slate-700 font-mono text-slate-400 text-2xl flex-1 leading-relaxed">
                &gt; Waiting for diagnostic handoff...
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
`;

const remediationCode = `import React from 'react';
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
      <div style={{ opacity, transform: \`scale(\${scale})\` }} className="flex-1 flex flex-col relative z-10 w-full h-full p-16 items-center justify-center">
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
`;

const analyticsCode = `import React from 'react';
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
        <div style={{ transform: \`translateY(\${translateY}px)\` }} className="flex flex-col items-center">
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
`;

const outroCode = `import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';
import { ShieldAlert } from 'lucide-react';

export const OutroScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const translateY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill className="bg-background text-foreground flex flex-col overflow-hidden relative font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[1600px] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div style={{ opacity }} className="flex-1 flex flex-col items-center justify-center relative w-full h-full text-center z-10">
        <div style={{ transform: \`translateY(\${translateY}px)\` }} className="flex flex-col items-center">
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
`;

fs.writeFileSync(path.join(scenesDir, 'IntroScene.tsx'), introCode);
fs.writeFileSync(path.join(scenesDir, 'DashboardScene.tsx'), dashboardCode);
fs.writeFileSync(path.join(scenesDir, 'InvestigationScene.tsx'), investigationCode);
fs.writeFileSync(path.join(scenesDir, 'RemediationScene.tsx'), remediationCode);
fs.writeFileSync(path.join(scenesDir, 'AnalyticsScene.tsx'), analyticsCode);
fs.writeFileSync(path.join(scenesDir, 'OutroScene.tsx'), outroCode);

console.log("SUCCESS: Masterpiece Remotion UI components have been injected.");
