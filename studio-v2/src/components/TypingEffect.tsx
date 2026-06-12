import React from 'react';

export const TypingEffect: React.FC<{
  text: string;
  progress: number; // 0 to 1
  className?: string;
  cursorColor?: string;
}> = ({ text, progress, className = '', cursorColor = 'bg-sky-400' }) => {
  const charCount = Math.floor(text.length * progress);
  const displayedText = text.slice(0, charCount);
  const isFinished = progress >= 1;

  return (
    <span className={`${className} relative inline`}>
      {displayedText}
      {!isFinished && (
        <span
          className={`inline-block w-[2.5px] h-[1.1em] ${cursorColor} ml-[2px]`}
          style={{
            verticalAlign: 'middle',
            animation: 'blink 0.8s infinite',
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};
