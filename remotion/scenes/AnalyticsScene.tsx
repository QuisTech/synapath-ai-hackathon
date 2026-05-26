import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BarChart, TrendingUp, TrendingDown } from 'lucide-react';

export const AnalyticsScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground w-full h-full text-foreground">

      {/* Background Image & Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12">

      <div style={{ opacity }} className="max-w-7xl w-full p-12">
        <div className="flex items-center gap-6 mb-16 justify-center">
          <BarChart className="w-24 h-24 text-purple-500" />
          <h2 className="text-7xl font-bold">The Results</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center">
            <TrendingDown className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-9xl font-black mb-4">-75%</h3>
            <p className="text-9xl font-black text-slate-400">Mean Time To Resolution</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center">
            <TrendingUp className="w-20 h-20 text-blue-500 mx-auto mb-6" />
            <h3 className="text-9xl font-black mb-4">99.99%</h3>
            <p className="text-9xl font-black text-slate-400">System Reliability</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center">
            <TrendingDown className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-9xl font-black mb-4">-40%</h3>
            <p className="text-9xl font-black text-slate-400">Operational Costs</p>
          </div>
        </div>
      </div>
</div>
    </div>
  );
};
