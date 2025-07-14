import { Composition } from 'remotion';
import React from 'react';

export interface VideoTemplateProps {
  intro: string;
  points: string[];
  outro: string;
  cta: string;
  voiceoverPath: string;
}

// Placeholder for the animated video content
const VideoTemplate: React.FC<VideoTemplateProps> = ({ intro, points, outro, cta, voiceoverPath }) => {
  // TODO: Implement text animation, timing, and audio overlay using Remotion primitives
  return (
    <div style={{ background: '#111', color: '#fff', width: '100%', height: '100%' }}>
      <h1>{intro}</h1>
      <ul>
        {points.map((pt, i) => (
          <li key={i}>{pt}</li>
        ))}
      </ul>
      <h2>{outro}</h2>
      <h3>{cta}</h3>
      {/* TODO: Add Remotion <Audio> component for voiceoverPath */}
    </div>
  );
};

export default VideoTemplate;

// Remotion composition registration (for CLI rendering)
export const RemotionRoot: React.FC = () => (
  <Composition
    id="VideoTemplate"
    component={VideoTemplate}
    durationInFrames={1800} // Placeholder, should be set based on audio duration
    fps={30}
    width={1280}
    height={720}
    defaultProps={{
      intro: '',
      points: [],
      outro: '',
      cta: '',
      voiceoverPath: ''
    }}
  />
); 