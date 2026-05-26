import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring, Img, staticFile } from 'remotion';
import { User, Sun, Camera, Sparkles, UploadCloud } from 'lucide-react';

export const BeautyLabScene: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  
  // Show selfie after frame 120
  const showSelfie = frame > 120;
  // Show analysis start after frame 200
  const showAnalysisProgress = frame > 200;
  // Show final report after frame 400
  const showReport = frame > 400;

  const progressWidth = interpolate(frame, [200, 380], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <div style={{ opacity }} className="flex flex-col md:flex-row min-h-screen gap-6 p-8 bg-dark text-foreground font-sans">
      
      <div className="w-[600px] flex flex-col space-y-6 mx-auto mt-20">
        <h2 className="text-6xl font-bold mb-4 text-center">Studio</h2>
        <div className="bg-panel backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col h-[700px]">
          
          <div className="flex space-x-2 bg-dark/50 p-2 rounded-xl mb-8">
            <button className="flex-1 py-3 px-4 rounded-lg text-3xl font-medium transition-all text-light/60">
              <User className="w-5 h-5 inline-block mr-2" /> Persona
            </button>
            <button className="flex-1 py-3 px-4 rounded-lg text-3xl font-medium transition-all bg-primary/80 text-foreground shadow-md">
              <Sun className="w-5 h-5 inline-block mr-2" /> Beauty Lab
            </button>
          </div>

          <div className="flex flex-col space-y-8">
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center bg-white/5 relative overflow-hidden">
              
              {!showSelfie ? (
                <div className="flex flex-col items-center py-8">
                  <div className="p-6 rounded-full bg-primary/20 text-accent mb-4">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-light/80 font-medium text-4xl">Uploading Selfie...</p>
                </div>
              ) : (
                <div className="relative">
                  <Img src={staticFile('images/selfie.jpg')} className="w-48 h-48 object-cover rounded-full mx-auto shadow-2xl ring-4 ring-primary/50" />
                  {showAnalysisProgress && !showReport && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-4 border-t-accent border-r-secondary border-b-transparent border-l-transparent animate-spin" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button className={`w-full py-6 rounded-xl shadow-lg text-foreground font-bold text-4xl flex justify-center items-center ${showAnalysisProgress ? 'bg-primary/50' : 'bg-gradient-to-r from-primary to-secondary'}`}>
              {showAnalysisProgress && !showReport ? 'Analyzing...' : <><Camera className="w-6 h-6 mr-3" /> Run AI Skin Analysis</>}
            </button>

            {showAnalysisProgress && !showReport && (
              <div className="w-full bg-dark/50 h-3 rounded-full overflow-hidden">
                <div className="bg-accent h-full" style={{ width: `${progressWidth}%` }} />
              </div>
            )}

            {showReport && (
              <div className="p-6 rounded-2xl bg-white/10 border border-white/20 mt-4">
                <h4 className="font-bold text-light mb-4 flex items-center text-4xl"><Sparkles className="w-6 h-6 mr-3 text-accent" /> Analysis Results</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-light/80 text-3xl">Overall Health</span>
                  <span className="text-accent font-extrabold text-3xl">88/100</span>
                </div>
                <div className="space-y-2">
                  <span className="text-light/60 text-md uppercase tracking-wider">Focus Areas:</span>
                  <p className="text-3xl text-light/90">• Slight dehydration</p>
                  <p className="text-3xl text-light/90">• Mild uneven tone</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
</div>
      
    </div>
  );
};
