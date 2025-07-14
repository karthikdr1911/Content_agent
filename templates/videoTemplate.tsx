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

// MVP: Full-screen image video with voiceover
const Video: React.FC<VideoTemplateProps> = ({ intro, points, outro, cta, voiceoverPath, images }) => {
  return (
    <div style={{ 
      background: '#000', 
      color: '#fff', 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          alt={`Slide ${i + 1}`}
        />
      ))}
      {/* TODO: Add Remotion <Audio> component for voiceoverPath */}
      {/* TODO: Add text overlays for intro, points, outro, cta */}
    </div>
  );
};

// Original template for backward compatibility
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
  <>
    {/* Original composition for backward compatibility */}
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
    
    {/* MVP: 9:16 vertical composition for full-screen images */}
    <Composition
      id="MVP"
      component={Video}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800} // Placeholder, should be set based on audio duration
      defaultProps={{
        intro: '',
        points: [],
        outro: '',
        cta: '',
        voiceoverPath: '',
        images: []
      }}
    />
  </>
); 