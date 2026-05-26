import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Img, spring, staticFile } from 'remotion';
import { Sparkles } from 'lucide-react';

export const MinimalistScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  const images = [
    staticFile('images/minimalist-1.jpg'),
    staticFile('images/minimalist-2.jpg'),
    staticFile('images/minimalist-3.jpg')
  ];

  return (
    <div style={{ opacity }} className="flex flex-col min-h-screen p-8 bg-dark text-foreground font-sans items-center justify-center">
      
      <div className="w-[1000px] bg-panel backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col h-[700px] relative overflow-hidden group">

        <h3 className="text-3xl font-bold text-light mb-6 flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-secondary" /> AuraVision Canvas: Minimalist
        </h3>

        <div className="flex-1 grid grid-cols-3 gap-6 p-4">
          {images.map((img, idx) => {
            const scale = spring({
              frame: frame - (idx * 20),
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
      </div>
</div>

    </div>
  );
};
