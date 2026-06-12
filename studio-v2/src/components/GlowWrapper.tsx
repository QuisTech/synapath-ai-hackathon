import React from 'react';
import { useCurrentFrame } from 'remotion';

type GlowColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple';

interface GlowWrapperProps {
  children: React.ReactNode;
  color: GlowColor;
  intensity?: number; // 0 to 1
  className?: string;
}

const colorMap = {
  red: {
    glow: 'rgba(239, 68, 68, 0.15)',
    border: 'border-red-500/30',
    bg: 'bg-slate-900',
  },
  blue: {
    glow: 'rgba(14, 165, 233, 0.15)',
    border: 'border-sky-500/30',
    bg: 'bg-slate-900',
  },
  yellow: {
    glow: 'rgba(234, 179, 8, 0.15)',
    border: 'border-yellow-500/30',
    bg: 'bg-slate-900',
  },
  green: {
    glow: 'rgba(34, 197, 94, 0.15)',
    border: 'border-emerald-500/30',
    bg: 'bg-slate-900',
  },
  purple: {
    glow: 'rgba(168, 85, 247, 0.15)',
    border: 'border-purple-500/30',
    bg: 'bg-slate-900',
  },
};

export const GlowWrapper: React.FC<GlowWrapperProps> = ({
  children,
  color,
  intensity = 1,
  className = '',
}) => {
  const frame = useCurrentFrame();
  
  // Ambient pulse animation (simplified to reduce shadow redraw recalculation if possible)
  const pulse = 1 + Math.sin(frame * 0.05) * 0.03; 
  const style = colorMap[color];

  return (
    <div
      className={`relative rounded-2xl border ${style.border} ${style.bg} transition-shadow duration-300 ${className}`}
      style={{
        boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 ${25 * intensity * pulse}px ${style.glow}`,
      }}
    >
      {/* Inner Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
