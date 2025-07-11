import { Composition } from 'remotion';
import React from 'react';

export interface VideoTemplateProps {
  intro: string;
  points: string[];
  outro: string;
  cta: string;
  voiceoverPath: string;
  images: string[]; // [intro, ...points, outro, cta]
}

// Animated video content with images
const VideoTemplate: React.FC<VideoTemplateProps> = ({ intro, points, outro, cta, voiceoverPath, images }) => {
  // Map images to sections: [intro, ...points, outro, cta]
  let imgIdx = 0;
  return (
    <div style={{ background: '#111', color: '#fff', width: '100%', height: '100%' }}>
      {/* Intro */}
      {images?.[imgIdx] && <img src={images[imgIdx]} alt="Intro" style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }} />}
      <h1>{intro}</h1>
      {/* Points */}
      <ul>
        {points.map((pt, i) => {
          imgIdx++;
          return (
            <li key={i} style={{ marginBottom: 24 }}>
              {images?.[imgIdx] && <img src={images[imgIdx]} alt={`Point ${i + 1}`} style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }} />}
              <div>{pt}</div>
            </li>
          );
        })}
      </ul>
      {/* Outro */}
      {images?.[imgIdx + 1] && <img src={images[imgIdx + 1]} alt="Outro" style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }} />}
      <h2>{outro}</h2>
      {/* CTA */}
      {images?.[imgIdx + 2] && <img src={images[imgIdx + 2]} alt="CTA" style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }} />}
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
      voiceoverPath: '',
      images: []
    }}
  />
); 