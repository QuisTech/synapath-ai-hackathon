import React from 'react';
import { Composition } from 'remotion';
import { SynaPathVideo } from './Composition';
import scenes from './scenes.json';
import '../../src/styles/globals.css';

export const RemotionRoot: React.FC = () => {
  const FPS = 30;
  const DURATION_IN_FRAMES = scenes.reduce((acc, scene) => acc + scene.durationFrames, 0);

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
