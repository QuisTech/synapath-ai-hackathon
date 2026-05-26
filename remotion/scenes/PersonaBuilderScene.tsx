import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { User, Sun, Send } from 'lucide-react';

export const PersonaBuilderScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Fade in
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  const targetText = "I need a chic outfit for a summer wedding...";
  const charsToShow = Math.floor(interpolate(frame, [60, 200], [0, targetText.length], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));
  const typedText = targetText.slice(0, charsToShow);

  const showUserMessage = frame > 240;
  const showAiResponse = frame > 360;

  return (
    <div style={{ opacity }} className="flex flex-col md:flex-row min-h-screen gap-6 p-8 bg-dark text-foreground font-sans">
      
      {/* Left Column: Control Panel */}
      <div className="w-[600px] flex flex-col space-y-6 mx-auto mt-20">
        <h2 className="text-6xl font-bold mb-4 text-center">Studio</h2>
        <div className="bg-panel backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col h-[700px]">
          
          {/* Tabs */}
          <div className="flex space-x-2 bg-dark/50 p-2 rounded-xl mb-8">
            <button className="flex-1 py-3 px-4 rounded-lg text-3xl font-medium transition-all bg-primary/80 text-foreground shadow-md">
              <User className="w-5 h-5 inline-block mr-2" /> Persona
            </button>
            <button className="flex-1 py-3 px-4 rounded-lg text-3xl font-medium transition-all text-light/60">
              <Sun className="w-5 h-5 inline-block mr-2" /> Beauty Lab
            </button>
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl max-w-[85%] text-3xl bg-white/5 text-light/90 border border-white/10 rounded-tl-sm">
                Hello! I am your AI stylist. Describe the look you are going for today.
              </div>
            </div>

            {showUserMessage && (
              <div className="flex justify-end">
                <div className="p-4 rounded-2xl max-w-[85%] text-3xl bg-primary text-light rounded-tr-sm">
                  {targetText}
                </div>
              </div>
            )}

            {showAiResponse && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl max-w-[85%] text-3xl bg-white/5 text-light/90 border border-white/10 rounded-tl-sm">
                  I love that idea. I'll focus on sophisticated, modern aesthetics for your look.
                </div>
              </div>
            )}
          </div>

          <div className="relative mt-8">
            <div className="w-full p-6 pr-16 rounded-xl bg-dark/50 border border-white/10 text-light text-3xl">
              {showUserMessage ? "" : typedText}
              {!showUserMessage && <span className="animate-pulse">|</span>}
            </div>
            <button className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 transition-colors ${showUserMessage ? 'text-light/20' : 'text-primary'}`}>
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
</div>
  );
};
