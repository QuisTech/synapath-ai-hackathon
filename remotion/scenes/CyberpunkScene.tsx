import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Img, spring, staticFile } from 'remotion';
import { Wand, Sparkles } from 'lucide-react';

export const CyberpunkScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  // Show loading state initially, then images pop in at frame 120
  const showImages = frame > 120;

  const images = [
    staticFile('images/cyberpunk-1.jpg'),
    staticFile('images/cyberpunk-2.jpg'),
    staticFile('images/cyberpunk-3.jpg')
  ];

  return (
    <div style={{ opacity }} className="flex flex-col min-h-screen p-8 bg-dark text-foreground font-sans items-center justify-center">
      
      <div className="w-[1000px] bg-panel backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col h-[700px] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 z-10 flex gap-2">
          <div className="flex items-center px-4 py-2 rounded-lg bg-accent/90 text-foreground font-medium shadow-lg">
            <Wand className="w-5 h-5 mr-2" /> Generating Concept...
          </div>
        </div>

        <h3 className="text-3xl font-bold text-light mb-6 flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-primary" /> AuraVision Canvas: Cyberpunk
        </h3>

        {!showImages ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Sparkles className="w-16 h-16 text-primary/50" />
            </div>
            <p className="text-2xl text-light/50 max-w-sm">Synthesizing hyper-realistic fashion variants...</p>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-3 gap-6 p-4">
            {images.map((img, idx) => {
              const scale = spring({
                frame: frame - 120 - (idx * 15),
                fps,
                config: { damping: 12 },
              });
              return (
                <div key={idx} style={{ transform: `scale(${scale})` }} className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
                   <Img src={img} className="w-full h-full object-cover" />
                </div>
              )
            })}
          </div>
        )}
      </div>
</div>
  );
};
