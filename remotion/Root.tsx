import React from 'react';
import { Composition } from 'remotion';
import { SynaPathVideo } from './SynaPathVideo';
import '../src/styles/globals.css'; // Use Next.js tailwind globals

export const RemotionRoot: React.FC = () => {
  const FPS = 60;
  const DURATION_IN_FRAMES = 4594; // 733+840+814+869+700+638 = 4594 frames

  return (
    <>
      <Composition
        id="SynaPathCinematic"
        component={SynaPathVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
