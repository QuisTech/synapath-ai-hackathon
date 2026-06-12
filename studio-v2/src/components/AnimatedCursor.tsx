import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const AnimatedCursor: React.FC<{
  startFrame: number;
  endFrame: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  clickFrame?: number;
}> = ({ startFrame, endFrame, startX, startY, endX, endY, clickFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 18,
      stiffness: 70,
      mass: 0.9,
    },
  });

  const x = interpolate(progress, [0, 1], [startX, endX]);
  const y = interpolate(progress, [0, 1], [startY, endY]);

  // Handle clicking pulse/scale animation
  let scale = 1;
  if (clickFrame && frame >= clickFrame) {
    const clickProgress = spring({
      frame: frame - clickFrame,
      fps,
      config: { damping: 8, stiffness: 180 },
    });
    // Shrink then pop back
    scale = interpolate(clickProgress, [0, 0.5, 1], [1, 0.75, 1]);
  }

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(0px, 0px) scale(${scale})`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0px 0px 6px rgba(14, 165, 233, 0.4))',
          }}
        >
          <path
            d="M6 3V26.8284C6 27.7183 7.07802 28.1642 7.70711 27.5351L14.7071 20.5351C14.8946 20.3476 15.149 20.2422 15.4142 20.2422H26.8284C27.7183 20.2422 28.1642 19.1642 27.5351 18.5351L6.70711 3.29289C6.51957 3.10536 6.26522 3 6 3Z"
            fill="white"
            stroke="#0ea5e9"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
        {/* Glowing click pulse */}
        {clickFrame && frame >= clickFrame && frame < clickFrame + 30 && (
          <div
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              width: 100,
              height: 100,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            <div
              className="w-full h-full rounded-full border border-sky-400 bg-sky-400/20"
              style={{
                transform: `scale(${interpolate(frame - clickFrame, [0, 30], [0.1, 1.2])})`,
                opacity: interpolate(frame - clickFrame, [0, 30], [1, 0]),
                transition: 'transform 0.05s linear',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
