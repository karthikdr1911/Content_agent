import { Composition } from 'remotion';
import React from 'react';
import { useCurrentFrame, interpolate, Audio } from 'remotion';

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

// Scene-based video template
export interface Scene {
  voiceover: string;
  images: string[];
  visualPrompt?: string;
  visualInstructions?: any;
  voiceoverPath?: string; // Added voiceoverPath to Scene interface
  duration?: number; // Added duration to Scene interface
  [key: string]: any;
}

export interface SceneVideoProps {
  scenes: Scene[];
}

// --- Animation/Transition Helpers ---
function getTransitionOpacity(frame: number, sceneStart: number, transitionType: string, transitionDuration: number) {
  switch (transitionType) {
    case 'crossfade':
      return interpolate(frame, [sceneStart, sceneStart + transitionDuration], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    // Add more transition types here
    default:
      return 1;
  }
}

function getTextAnimationStyle(frame: number, anim: any, defaultFadeIn: number = 30) {
  let fadeInDuration = anim?.duration || defaultFadeIn;
  let opacity = 1;
  let transform = 'none';
  switch (anim?.type) {
    case 'fadeIn':
      opacity = interpolate(frame, [0, fadeInDuration], [0, 1], { extrapolateRight: 'clamp' });
      break;
    case 'fadeOut':
      opacity = interpolate(frame, [0, fadeInDuration], [1, 0], { extrapolateRight: 'clamp' });
      break;
    case 'slideIn':
      opacity = interpolate(frame, [0, fadeInDuration], [0, 1], { extrapolateRight: 'clamp' });
      const translateY = interpolate(frame, [0, fadeInDuration], [40, 0], { extrapolateRight: 'clamp' });
      transform = `translateY(${translateY}px)`;
      break;
    // Add more text animation types here
    default:
      opacity = interpolate(frame, [0, defaultFadeIn], [0, 1], { extrapolateRight: 'clamp' });
  }
  return { opacity, transform };
}

function getShapeOverlayStyle(frame: number, anim: any, idx: number) {
  const shape = anim.shape || 'rect';
  const color = anim.color || '#fff';
  const width = typeof anim.width === 'number' ? anim.width : 100;
  const height = typeof anim.height === 'number' ? anim.height : 100;
  const radius = typeof anim.radius === 'number' ? anim.radius : 50;
  const left = typeof anim.left === 'number' ? anim.left : '50%';
  const top = typeof anim.top === 'number' ? anim.top : '50%';
  const type = anim.type || 'fadeIn';
  const duration = typeof anim.duration === 'number' ? anim.duration : 30;
  let opacity = 1;
  let scale = 1;
  switch (type) {
    case 'fadeIn':
      opacity = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
      break;
    case 'fadeOut':
      opacity = interpolate(frame, [0, duration], [1, 0], { extrapolateRight: 'clamp' });
      break;
    case 'grow':
      scale = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
      break;
    // Add more shape animation types here
    default:
      opacity = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' });
  }
  const style: React.CSSProperties = {
    position: 'absolute',
    left: typeof left === 'number' ? left : `calc(${left} - ${width/2}px)`,
    top: typeof top === 'number' ? top : `calc(${top} - ${height/2}px)`,
    opacity,
    transform: `scale(${scale})`,
    pointerEvents: 'none',
    zIndex: 10 + idx
  };
  return { shape, color, width, height, radius, style };
}
// --- End Helpers ---

const SceneVideo: React.FC<SceneVideoProps> = ({ scenes }) => {
  const frame = useCurrentFrame();
  // Calculate start frame for each scene
  let sceneStartFrames: number[] = [];
  let currentStart = 0;
  for (let i = 0; i < scenes.length; i++) {
    sceneStartFrames.push(currentStart);
    const duration = typeof scenes[i].duration === 'number' ? scenes[i].duration : 100; // fallback 100 frames
    currentStart += duration;
  }
  return (
    <div style={{ background: '#222', color: '#fff', width: '100%', height: '100%', position: 'relative' }}>
      {scenes.map((scene, idx) => {
        const sceneStart = sceneStartFrames[idx];
        const sceneEnd = sceneStart + (typeof scene.duration === 'number' ? scene.duration : 100);
        // Calculate transition parameters
        const transition = (scene.visualInstructions && scene.visualInstructions.transition) || {};
        const transitionType = transition.type || 'crossfade';
        const transitionDuration = typeof transition.duration === 'number' ? transition.duration : 30;
        // Determine if this scene should be visible at the current frame
        let visible = frame >= sceneStart && frame < sceneEnd;
        // Determine transition opacity
        let transitionOpacity = 1;
        if (visible && idx > 0) {
          transitionOpacity = getTransitionOpacity(frame, sceneStart, transitionType, transitionDuration);
        }
        if (!visible) return null;
        return (
          <div key={idx} style={{ marginBottom: 48, border: '2px solid #444', borderRadius: 8, padding: 16, opacity: transitionOpacity, position: 'relative', transition: 'opacity 0.3s' }}>
            {/* Per-Scene Audio/Voiceover */}
            {scene.voiceoverPath && (
              <Audio src={scene.voiceoverPath} startFrom={0} />
            )}
            {scene.images?.map((img, i) => {
              // Animation logic for images
              let anim = scene.visualInstructions && Array.isArray(scene.visualInstructions.animations)
                ? scene.visualInstructions.animations.find((a: any) => a.target === `image${i}` || a.target === 'image')
                : null;
              let fadeInDuration = 30;
              if (anim && anim.type === 'fadeIn' && typeof anim.duration === 'number') fadeInDuration = anim.duration;
              let opacity = anim ? interpolate(frame, [0, fadeInDuration], [0, 1], { extrapolateRight: 'clamp' }) : interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
              return (
                <img
                  key={i}
                  src={img}
                  alt={`Scene ${idx + 1} Img ${i + 1}`}
                  style={{ width: '100%', maxHeight: 320, objectFit: 'cover', marginBottom: 8, opacity }}
                />
              );
            })}
            {/* Animated Voiceover Text Overlay */}
            {(() => {
              let anim = scene.visualInstructions && Array.isArray(scene.visualInstructions.animations)
                ? scene.visualInstructions.animations.find((a: any) => a.target === 'text0' || a.target === 'voiceover')
                : null;
              const { opacity, transform } = getTextAnimationStyle(frame, anim, 30);
              return (
                <div style={{ fontSize: 32, fontWeight: 'bold', margin: '16px 0', opacity, transform, transition: 'opacity 0.3s, transform 0.3s' }}>
                  {scene.voiceover}
                </div>
              );
            })()}
            {/* Animated Visual Prompt Text Overlay */}
            {(() => {
              let anim = scene.visualInstructions && Array.isArray(scene.visualInstructions.animations)
                ? scene.visualInstructions.animations.find((a: any) => a.target === 'text1' || a.target === 'visualPrompt')
                : null;
              const { opacity, transform } = getTextAnimationStyle(frame, anim, 30);
              return (
                <div style={{ fontSize: 24, fontWeight: 'normal', margin: '8px 0', opacity, transform, transition: 'opacity 0.3s, transform 0.3s' }}>
                  {scene.visualPrompt}
                </div>
              );
            })()}
            {/* Animated Shape/Graphic Overlays */}
            {scene.visualInstructions && Array.isArray(scene.visualInstructions.animations) && scene.visualInstructions.animations.filter((a: any) => a.target && a.target.startsWith('shape')).map((anim: any, shapeIdx: number) => {
              const { shape, color, width, height, radius, style } = getShapeOverlayStyle(frame, anim, shapeIdx);
              if (shape === 'rect') {
                return <div key={shapeIdx} style={{ ...style, width, height, background: color, borderRadius: 8 }} />;
              }
              if (shape === 'circle') {
                return <div key={shapeIdx} style={{ ...style, width: radius*2, height: radius*2, background: color, borderRadius: '50%' }} />;
              }
              if (shape === 'svg' && anim.svg) {
                return <div key={shapeIdx} style={style} dangerouslySetInnerHTML={{ __html: anim.svg }} />;
              }
              return null;
            })}
            <div><strong>Instructions:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(scene.visualInstructions, null, 2)}</pre></div>
            {/* TODO: Render overlays, transitions, and audio per scene */}
          </div>
        );
      })}
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

    {/* New: Scene-based composition */}
    <Composition
      id="SceneVideo"
      component={SceneVideo}
      width={1280}
      height={720}
      fps={30}
      durationInFrames={1800} // Placeholder, should be set based on total audio duration
      defaultProps={{
        scenes: []
      }}
    />
  </>
); 