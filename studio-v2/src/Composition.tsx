import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { 
  AlertOctagon, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Code, 
  Database, 
  Settings, 
  ShieldAlert 
} from 'lucide-react';
import { GlowWrapper } from './components/GlowWrapper';
import { TypingEffect } from './components/TypingEffect';
import { AnimatedCursor } from './components/AnimatedCursor';
import scenes from './scenes.json';

// --- Scene 1: SRE Alert Fatigue ---
const AlertFatigueScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const alertsList = [
    { id: 1, startFrame: 30, x: 'left-[10%] top-[15%]', color: 'red', title: 'P1: Response Time > 500ms', details: 'checkout-api • latency spike' },
    { id: 2, startFrame: 90, x: 'right-[15%] top-[20%]', color: 'yellow', title: 'P2: Gateway Error Rate High', details: 'payment-service • HTTP 504' },
    { id: 3, startFrame: 150, x: 'left-[15%] bottom-[20%]', color: 'red', title: 'P0: Service Unavailable', details: 'auth-gateway • connection limit' },
    { id: 4, startFrame: 210, x: 'right-[10%] bottom-[15%]', color: 'yellow', title: 'P1: Database Replication Lag', details: 'replica-db-01 • lag > 120s' },
    { id: 5, startFrame: 270, x: 'left-[45%] top-[35%]', color: 'red', title: 'P0: DB Pool Exhausted', details: 'prod-postgres • 200/200 active' },
    { id: 6, startFrame: 330, x: 'right-[40%] bottom-[25%]', color: 'red', title: 'P0: Checkout Failure Rate 100%', details: 'checkout-api • server error' },
  ];

  // Transition to SynaPath logo (starts around frame 550)
  const fadeOutAlerts = interpolate(frame, [500, 550], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const logoOpacity = interpolate(frame, [550, 575, 875, 900], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  const logoScale = spring({
    frame: frame - 550,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  return (
    <AbsoluteFill className="bg-slate-950 flex justify-center items-center font-sans text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      
      {/* Optimized Radial Gradient Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0) 70%)'
        }}
      />

      {/* Scattered Alerts (Fatigue Phase) */}
      <div style={{ opacity: fadeOutAlerts }} className="absolute inset-0 z-10 w-full h-full pointer-events-none">
        {alertsList.map((alert) => {
          if (frame < alert.startFrame) return null;
          
          const alertScale = spring({
            frame: frame - alert.startFrame,
            fps,
            config: { damping: 8, stiffness: 120 },
          });

          const alertOpacity = interpolate(frame - alert.startFrame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div
              key={alert.id}
              className={`absolute ${alert.x}`}
              style={{
                transform: `scale(${alertScale})`,
                opacity: alertOpacity,
              }}
            >
              <GlowWrapper color={alert.color as 'red' | 'yellow'} intensity={0.8} className="w-[380px]">
                <div className="p-5 flex items-start gap-4">
                  <AlertOctagon className={`w-8 h-8 ${alert.color === 'red' ? 'text-red-500' : 'text-yellow-500'} shrink-0`} />
                  <div>
                    <h4 className="font-bold text-white text-base">{alert.title}</h4>
                    <p className="text-slate-400 font-mono text-xs mt-1">{alert.details}</p>
                  </div>
                </div>
              </GlowWrapper>
            </div>
          );
        })}
      </div>

      {/* SynaPath Logo Reveal (Solution Phase) */}
      {frame >= 550 && (
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }} className="flex flex-col items-center justify-center text-center z-20">
          <div className="relative mb-6">
            <div 
              className="absolute -inset-6 rounded-full pointer-events-none animate-pulse" 
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(56, 189, 248, 0) 70%)'
              }}
            />
            <ShieldAlert className="w-32 h-32 text-sky-400 relative drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" />
          </div>
          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-white via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            SynaPath AI
          </h1>
          <p className="text-2xl text-slate-400 font-mono max-w-2xl leading-relaxed">
            Autonomous IT Incident Management
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- Scene 2: Intelligent Intake ---
const IntelligentIntakeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 875, 900], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Card elements animation timers
  const card1Spring = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const card2Spring = spring({ frame: frame - 30, fps, config: { damping: 15 } });

  const payloadText = JSON.stringify({
    incident_id: "INC-2849",
    severity: "P0",
    alert_name: "Connection Pool Exhausted",
    source: "aws-rds-postgres",
    impacted_services: ["checkout-api", "payment-api"],
    trigger_time: "2026-05-27T18:57:23Z"
  }, null, 2);

  const payloadProgress = interpolate(frame, [40, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const logProgress = interpolate(frame, [130, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="bg-slate-950 flex flex-col justify-center items-center p-16 font-sans text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      
      {/* Optimized Radial Gradient Background */}
      <div 
        className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0) 70%)'
        }}
      />

      <div style={{ opacity }} className="w-full max-w-6xl z-10">
        <header className="mb-10 text-center">
          <span className="px-4 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 text-sm font-mono tracking-widest uppercase rounded-full font-bold">
            Phase 1: Autonomous Triage
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-4">Intelligent Intake & Classification</h2>
        </header>

        <div className="grid grid-cols-2 gap-8 items-stretch">
          {/* Left panel: Raw Alert Payload */}
          <div style={{ transform: `scale(${0.9 + card1Spring * 0.1})`, opacity: card1Spring }}>
            <GlowWrapper color="blue" intensity={0.8} className="h-[480px]">
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
                  <h3 className="font-bold flex items-center gap-2 text-slate-300">
                    <Database className="w-5 h-5 text-sky-400" /> Raw Cloud Watch Alert
                  </h3>
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 animate-ping" />
                </div>
                <div className="bg-black/40 border border-slate-800 rounded-lg p-5 font-mono text-sm text-sky-300 flex-1 overflow-hidden leading-relaxed">
                  <TypingEffect text={payloadText} progress={payloadProgress} cursorColor="bg-sky-400" />
                </div>
              </div>
            </GlowWrapper>
          </div>

          {/* Right panel: Intake Triage Action */}
          <div style={{ transform: `scale(${0.9 + card2Spring * 0.1})`, opacity: card2Spring }}>
            <GlowWrapper color="purple" intensity={0.8} className="h-[480px]">
              <div className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-4">
                  <Cpu className="w-6 h-6 text-purple-400" />
                  <h3 className="font-bold text-slate-300">SynaPath Intake Agent</h3>
                </div>
                
                <div className="bg-black/60 border border-slate-800 rounded-lg p-5 font-mono text-base text-purple-300 flex-1 overflow-hidden space-y-4 mb-4 leading-loose">
                  {frame >= 125 && (
                    <div>
                      <TypingEffect 
                        text="> Initializing triage sequence...\n> Categorizing: Database Connection Leak\n> Determining impact: P0 Critical Outage\n> Creating context repository...\n> Spawning Diagnostic Agent cluster..."
                        progress={logProgress}
                        cursorColor="bg-purple-400"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 border-t border-slate-800 pt-4 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block">Classified Category</span>
                    <span className="text-white text-base font-bold">DATABASE / RESOURCES</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Root Target</span>
                    <span className="text-white text-base font-bold">checkout-api-db</span>
                  </div>
                </div>
              </div>
            </GlowWrapper>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Autonomous Investigation (Diagnostics) ---
const AutonomousInvestigationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 875, 900], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  const cmdLine1 = "$ diagnose-db-pool --service checkout-api";
  const logsList = [
    "[DI Diagnostic Agent] Checking pool connections stats...",
    "  -> Total Allocations: 200/200 (Max capacity reached)",
    "  -> Waiting Client threads: 1,045 active handles",
    "[DI Diagnostic Agent] Checking execution logs of DatabaseConnector...",
    "  -> Connection leak suspected in DatabaseConnector.ts",
    "  -> Stack Trace: DatabaseConnector.ts:142 -> connect()",
    "  -> Analysis: No corresponding release() operation found in error-handling block.",
  ];

  // Command typing
  const cmdProgress = interpolate(frame, [15, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Diagnostic lines typing
  const linesProgress = interpolate(frame, [45, 240], [0, logsList.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // SVG Chart Animation Path drawing
  const chartPathProgress = interpolate(frame, [60, 350], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="bg-slate-950 flex flex-col justify-center items-center p-16 font-sans text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      
      {/* Optimized Radial Gradient Background */}
      <div 
        className="absolute bottom-1/3 right-1/4 w-[700px] h-[700px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, rgba(234, 179, 8, 0) 70%)'
        }}
      />

      <div style={{ opacity }} className="w-full max-w-6xl z-10">
        <header className="mb-10 text-center">
          <span className="px-4 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-mono tracking-widest uppercase rounded-full font-bold">
            Phase 2: Live Diagnostics
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-4">Autonomous System Analysis</h2>
        </header>

        <div className="grid grid-cols-2 gap-8 items-stretch">
          {/* Left Panel: Diagnostic Terminal */}
          <GlowWrapper color="yellow" intensity={0.9} className="h-[480px]">
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="font-mono text-xs text-slate-500">diagnostic-cluster.sh</span>
                <TerminalIcon className="w-4 h-4 text-slate-500" />
              </div>

              <div className="p-6 font-mono text-sm leading-relaxed overflow-hidden flex-1">
                <div className="mb-4">
                  <span className="text-emerald-500 mr-2">agent@synapath:~$</span>
                  <TypingEffect text={cmdLine1} progress={cmdProgress} />
                </div>

                {frame >= 45 && (
                  <div className="space-y-2">
                    {logsList.map((line, idx) => {
                      const lineProgress = Math.max(0, Math.min(1, linesProgress - idx));
                      if (lineProgress <= 0) return null;

                      let color = "text-slate-300";
                      if (line.includes("suspected") || line.includes("Analysis")) {
                        color = "text-red-400 font-bold";
                      } else if (line.includes("Diagnostic Agent")) {
                        color = "text-yellow-400";
                      }

                      return (
                        <div key={idx} className={color}>
                          <TypingEffect text={line} progress={lineProgress} cursorColor="bg-yellow-400" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </GlowWrapper>

          {/* Right Panel: Metric Chart */}
          <GlowWrapper color="blue" intensity={0.8} className="h-[480px]">
            <div className="p-6 flex flex-col h-full">
              <div className="pb-4 border-b border-slate-800 mb-6 flex justify-between items-center">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-400" /> Connection Queue Latency
                </h3>
                <span className="text-xs font-mono text-red-500">ALERT THRESHOLD EXCEEDED</span>
              </div>

              <div className="flex-1 bg-black/40 border border-slate-800/80 rounded-lg relative overflow-hidden flex items-end p-6">
                {/* SVG Graph Drawing */}
                <svg className="w-full h-[220px] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#334155" strokeDasharray="3" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeDasharray="3" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#334155" strokeDasharray="3" strokeWidth="0.5" />

                  {/* Latency Line Chart */}
                  <path
                    d={`M 0 90 L 20 88 L 40 85 L 50 20 L 70 15 L 100 12`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeDasharray="500"
                    strokeDashoffset={500 - (chartPathProgress * 500)}
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.7))',
                    }}
                  />
                  {/* Shading fill */}
                  <path
                    d={`M 0 90 L 20 88 L 40 85 L 50 20 L 70 15 L 100 12 L 100 100 L 0 100 Z`}
                    fill="url(#gradient-red)"
                    opacity={chartPathProgress * 0.15}
                  />

                  <defs>
                    <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Y-axis Labels */}
                <div className="absolute left-3 top-3 text-[10px] font-mono text-slate-500 flex flex-col justify-between h-[200px]">
                  <span>1000ms</span>
                  <span>500ms</span>
                  <span>0ms</span>
                </div>
              </div>
            </div>
          </GlowWrapper>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 4: Root Cause Discovery ---
const RootCauseDiscoveryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 875, 900], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Highlight box scale/opacity spring
  const borderFlash = Math.sin(frame * 0.1) * 0.3 + 0.7;
  const focusSpring = spring({ frame: frame - 30, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill className="bg-slate-950 flex flex-col justify-center items-center p-16 font-sans text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      
      {/* Optimized Radial Gradient Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0) 70%)'
        }}
      />

      <div style={{ opacity }} className="w-full max-w-5xl z-10">
        <header className="mb-10 text-center">
          <span className="px-4 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono tracking-widest uppercase rounded-full font-bold">
            Phase 3: Root Cause Isolation
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-4">Pinpointing the Memory Leak</h2>
        </header>

        <GlowWrapper color="red" intensity={0.9}>
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-8 flex flex-col justify-between h-[480px] relative">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-red-500" />
                <span className="text-slate-400 font-mono text-sm">src/DatabaseConnector.ts</span>
              </div>
              <span className="px-3 py-1 bg-red-500/20 text-red-400 font-mono text-xs uppercase tracking-wider font-bold rounded">
                Leak Point Isolated
              </span>
            </div>

            {/* Code Body with Focus Border */}
            <div className="flex-1 bg-black/60 border border-slate-800 rounded-lg p-6 font-mono text-base overflow-hidden relative leading-loose">
              <div className="text-slate-500">138: export async function query(sql: string) {'{'}</div>
              <div className="text-slate-500">139:   // Allocation request</div>
              <div className="text-red-400/90 font-bold bg-red-500/5 border-l-4 border-red-500 px-3 my-1 relative">
                140:   const client = await pool.connect();
                {frame >= 30 && (
                  <div
                    className="absolute -inset-1 border-2 border-red-500 rounded-md pointer-events-none"
                    style={{
                      opacity: focusSpring,
                      transform: `scale(${interpolate(focusSpring, [0, 1], [0.95, 1])})`,
                      boxShadow: `0 0 ${12 * borderFlash}px rgba(239, 68, 68, 0.6)`,
                    }}
                  />
                )}
              </div>
              <div className="text-slate-400">141:   try {'{'}</div>
              <div className="text-slate-400">142:     const res = await client.query(sql);</div>
              <div className="text-slate-400">143:     await client.release(); <span className="text-slate-500">{'// Released here'}</span></div>
              <div className="text-slate-400">144:     return res;</div>
              <div className="text-slate-300 bg-red-500/5 border-l-4 border-yellow-500 px-3 my-1">
                145:   {'}'} catch (err) {'{'}
              </div>
              <div className="text-red-400 font-bold bg-red-500/10 border-l-4 border-red-500 px-3 my-1">
                146:     throw err; <span className="text-slate-500">{'// Client is never released in exception block!'}</span>
              </div>
              <div className="text-slate-400">147:   {'}'}</div>
              <div className="text-slate-500">148: {'}'}</div>
            </div>

            <div className="mt-6 flex items-center justify-between font-mono text-sm text-slate-400 bg-slate-950 p-4 rounded-lg">
              <span className="text-red-400 font-bold">⚠️ FATAL ROOT CAUSE:</span>
              <span>Exception thrown by query breaks standard connection cleanup path.</span>
            </div>
          </div>
        </GlowWrapper>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 5: Code Repair & Sandboxing ---
const CodeRepairScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 875, 900], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Terminal commands and output typing
  const fixProgress = interpolate(frame, [10, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const terminalCmdProgress = interpolate(frame, [90, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  const testLines = [
    "Running sandbox integration tests...",
    "Test 1/3: Connection release verification ... PASSED",
    "Test 2/3: Exception cleanup verification ... PASSED",
    "Test 3/3: Stress-load connection lifecycle ... PASSED",
    "==================================================",
    "✅ SANDBOX TEST SUITE PASSED. 100% RELIABILITY ACHIEVED."
  ];

  const testLinesProgress = interpolate(frame, [130, 300], [0, testLines.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill className="bg-slate-950 flex flex-col justify-center items-center p-16 font-sans text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      
      {/* Optimized Radial Gradient Background */}
      <div 
        className="absolute bottom-1/3 left-1/3 w-[700px] h-[700px] rounded-full pointer-events-none" 
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 70%)'
        }}
      />

      <div style={{ opacity }} className="w-full max-w-6xl z-10">
        <header className="mb-10 text-center">
          <span className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono tracking-widest uppercase rounded-full font-bold">
            Phase 4: Action & Sandboxing
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-4">Programmatic Patch Generation & Testing</h2>
        </header>

        <div className="grid grid-cols-2 gap-8 items-stretch">
          {/* Left panel: Patch / Git Diff */}
          <GlowWrapper color="blue" intensity={0.8} className="h-[480px]">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-4">
                <Code className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-slate-300">Generated Fix Patch</h3>
              </div>

              <div className="bg-black/60 border border-slate-800 rounded-lg p-5 font-mono text-xs flex-1 overflow-hidden leading-relaxed">
                <div style={{ opacity: fixProgress }}>
                  <div className="text-slate-500">{"// Applied try-finally closure fix"}</div>
                  <div className="bg-red-950/20 text-red-400 px-2 py-0.5 border-l-2 border-red-500 my-1">
                    - const client = await pool.connect();
                  </div>
                  <div className="bg-emerald-950/20 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 my-0.5">
                    + let client;
                  </div>
                  <div className="bg-emerald-950/20 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 my-0.5">
                    + try {"{"}
                  </div>
                  <div className="bg-emerald-950/20 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 my-0.5">
                    +   client = await pool.connect();
                  </div>
                  <div className="text-slate-400">    const res = await client.query(sql);</div>
                  <div className="text-slate-400">    return res;</div>
                  <div className="bg-emerald-950/20 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 my-0.5">
                    + {"}"} finally {"{"}
                  </div>
                  <div className="bg-emerald-950/20 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 my-0.5">
                    +   if (client) client.release();
                  </div>
                  <div className="bg-emerald-950/20 text-emerald-400 px-2 py-0.5 border-l-2 border-emerald-500 my-0.5">
                    + {"}"}
                  </div>
                </div>
              </div>
            </div>
          </GlowWrapper>

          {/* Right panel: Sandbox verification */}
          <GlowWrapper color="green" intensity={0.9} className="h-[480px]">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
                <h3 className="font-bold text-slate-300 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" /> Isolated Sandbox Testing
                </h3>
                {frame >= 250 && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono rounded font-bold">
                    VERIFIED
                  </span>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 font-mono text-sm text-slate-300 flex-1 overflow-hidden leading-relaxed">
                <div className="mb-4">
                  <span className="text-sky-400 mr-2">sandbox@test:~$</span>
                  <TypingEffect text="npm run test:sandbox" progress={terminalCmdProgress} />
                </div>

                {frame >= 125 && (
                  <div className="space-y-2">
                    {testLines.map((line, idx) => {
                      const lineProgress = Math.max(0, Math.min(1, testLinesProgress - idx));
                      if (lineProgress <= 0) return null;

                      let color = "text-slate-300";
                      if (line.includes("PASSED") || line.includes("VERIFIED")) {
                        color = "text-emerald-400 font-bold";
                      } else if (line.includes("Running")) {
                        color = "text-yellow-400";
                      }

                      return (
                        <div key={idx} className={color}>
                          <TypingEffect text={line} progress={lineProgress} cursorColor="bg-emerald-400" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </GlowWrapper>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 6: Human Approval & Restoration ---
const RestorationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15, 875, 900], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Click timing
  const clickFrame = 200;
  const isClicked = frame >= clickFrame;

  // Connection reduction chart animation
  const connectionsVal = interpolate(frame, [clickFrame, clickFrame + 150], [200, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const successScale = spring({
    frame: frame - clickFrame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <AbsoluteFill className="bg-slate-950 flex flex-col justify-center items-center p-16 font-sans text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      
      {/* Optimized Radial Gradient Background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: isClicked 
            ? 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0) 70%)'
            : 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(14, 165, 233, 0) 70%)',
        }}
      />

      <div style={{ opacity }} className="w-full max-w-5xl z-10 relative">
        <header className="mb-10 text-center">
          <span className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-mono tracking-widest uppercase rounded-full font-bold">
            Phase 5: Release & Recovery
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-4">Human-in-the-Loop Approval</h2>
        </header>

        <GlowWrapper color={isClicked ? 'green' : 'blue'} intensity={1.0}>
          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-8 flex flex-col justify-between h-[450px] relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-slate-400 font-mono text-sm block">AWAITING PRODUCTION APPROVAL</span>
                <span className="text-xl font-bold text-white">Deploy Patch: INC-2849</span>
              </div>
              <span className={`px-3 py-1 font-mono text-xs uppercase tracking-wider font-bold rounded ${
                isClicked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                {isClicked ? 'Approved & Deployed' : 'Awaiting Confirmation'}
              </span>
            </div>

            {/* Middle metrics section */}
            <div className="grid grid-cols-2 gap-8 flex-1 items-center mb-6">
              <div className="bg-black/40 border border-slate-800 rounded-lg p-6">
                <span className="text-slate-500 font-mono text-xs block">Active DB Pool Connections</span>
                <span className={`text-4xl font-black font-mono transition-colors duration-300 ${
                  isClicked ? 'text-emerald-400' : 'text-red-500'
                }`}>
                  {Math.round(connectionsVal)} / 200
                </span>
              </div>
              <div className="bg-black/40 border border-slate-800 rounded-lg p-6">
                <span className="text-slate-500 font-mono text-xs block">Service Health Status</span>
                <span className={`text-3xl font-black transition-colors duration-300 ${
                  isClicked ? 'text-emerald-400' : 'text-yellow-500'
                }`}>
                  {isClicked ? '100% HEALTHY' : 'DEGRADED (0%)'}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-6">
              <span className="text-slate-400 font-mono text-sm">
                Safety validation checks: <span className="text-emerald-400 font-bold">All OK</span>
              </span>

              <button
                id="approve-btn"
                className={`px-8 py-3.5 rounded-lg font-bold flex items-center gap-3 border transition-all duration-300 ${
                  isClicked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                    : 'bg-gradient-to-r from-sky-500 to-indigo-600 border-sky-400 text-white shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:scale-105'
                }`}
              >
                {isClicked ? 'Deployed Fix' : 'Approve & Deploy Fix'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Success Overlay Modal */}
            {isClicked && (
              <div
                style={{ transform: `translate(-50%, -50%) scale(${successScale})` }}
                className="absolute top-1/2 left-1/2 bg-slate-900 border-2 border-emerald-500 rounded-xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center text-center w-[480px] z-50 animate-fade-in"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Production Restored</h3>
                <p className="text-slate-400 font-mono text-sm mb-4">
                  Connection leak remediated. Database recovered.
                </p>
                <div className="flex gap-6 border-t border-slate-800 pt-4 w-full justify-around font-mono text-xs">
                  <div>
                    <span className="text-slate-500 block">Pool Connections</span>
                    <span className="text-emerald-400 text-lg font-bold">12 / 200 (OK)</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 text-lg font-bold">Response Time</span>
                    <span className="text-emerald-400 text-lg font-bold">42ms (Healthy)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlowWrapper>
      </div>

      {/* Programmatic cursor simulation. Hover and click at frame 200. */}
      <AnimatedCursor
        startFrame={50}
        endFrame={200}
        startX={1600}
        startY={850}
        endX={1220}
        endY={735}
        clickFrame={clickFrame}
      />
    </AbsoluteFill>
  );
};

// --- Main Composition Orchestrator ---
export const SynaPathVideo: React.FC = () => {
  let currentFrame = 0;

  return (
    <AbsoluteFill className="bg-slate-950">
      {scenes.map((scene) => {
        const startFrame = currentFrame;
        currentFrame += scene.durationFrames;

        let Component: React.FC = AlertFatigueScene;
        if (scene.id === 'scene2_intake') Component = IntelligentIntakeScene;
        if (scene.id === 'scene3_diagnostics') Component = AutonomousInvestigationScene;
        if (scene.id === 'scene4_rootcause') Component = RootCauseDiscoveryScene;
        if (scene.id === 'scene5_remediation') Component = CodeRepairScene;
        if (scene.id === 'scene6_recovery') Component = RestorationScene;

        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={scene.durationFrames}>
            <AbsoluteFill>
              <Component />
            </AbsoluteFill>
            <Audio src={staticFile(`audio/${scene.audio}`)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
