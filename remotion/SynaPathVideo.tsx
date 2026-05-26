import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';

import { IntroScene } from './scenes/IntroScene';
import { DashboardScene } from './scenes/DashboardScene';
import { InvestigationScene } from './scenes/InvestigationScene';
import { RemediationScene } from './scenes/RemediationScene';
import { AnalyticsScene } from './scenes/AnalyticsScene';
import { OutroScene } from './scenes/OutroScene';

export const SynaPathVideo: React.FC = () => {
  const scenes = [
    { id: 'intro', duration: 750, Component: IntroScene, audio: '01_intro.mp3' },
    { id: 'dashboard', duration: 840, Component: DashboardScene, audio: '02_dashboard.mp3' },
    { id: 'investigation', duration: 780, Component: InvestigationScene, audio: '03_investigation.mp3' },
    { id: 'remediation', duration: 840, Component: RemediationScene, audio: '04_remediation.mp3' },
    { id: 'analytics', duration: 750, Component: AnalyticsScene, audio: '05_analytics.mp3' },
    { id: 'outro', duration: 780, Component: OutroScene, audio: '06_outro.mp3' },
  ];

  let currentFrame = 0;

  return (
    <AbsoluteFill className="bg-slate-900 text-white font-sans overflow-hidden">
      {scenes.map((scene) => {
        const startFrame = currentFrame;
        currentFrame += scene.duration;

        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={scene.duration}>
            <AbsoluteFill>
              <scene.Component durationInFrames={scene.duration} />
            </AbsoluteFill>
            <Audio src={staticFile(`audio/${scene.audio}`)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
