import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { generateImageForSection } from './dalleService';

interface Script {
  intro: string;
  points: string[];
  outro: string;
  cta: string;
}

interface RenderParams {
  uuid: string;
  script: Script;
  voiceoverPath: string;
}

export async function renderVideo({ uuid, script, voiceoverPath }: RenderParams): Promise<{ videoPath: string }> {
  const dataDir = path.join('data', uuid);
  const videoPath = path.join(dataDir, 'finalVideo.mp4');
  const logPath = path.join(dataDir, 'log.txt');
  const start = Date.now();

  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    // Generate DALL·E images for each section
    const imagePrompts = [
      script.intro,
      ...script.points,
      script.outro,
      script.cta
    ];
    const imagePaths: string[] = [];
    for (let i = 0; i < imagePrompts.length; i++) {
      const imgPath = path.join(dataDir, `dalle_img_${i + 1}.png`);
      await generateImageForSection(imagePrompts[i], imgPath);
      imagePaths.push(imgPath);
    }

    // Prepare props for Remotion
    const props = {
      intro: script.intro,
      points: script.points,
      outro: script.outro,
      cta: script.cta,
      voiceoverPath: path.resolve(voiceoverPath),
      images: imagePaths.map(p => path.resolve(p))
    };
    const propsPath = path.join(dataDir, 'remotion-props.json');
    fs.writeFileSync(propsPath, JSON.stringify(props));

    // Remotion CLI render command
    const remotionCmd = `npx remotion render templates/remotionRoot.tsx VideoTemplate ${videoPath} --props=${propsPath} --overwrite`;
    execSync(remotionCmd, { stdio: 'inherit' });

    fs.appendFileSync(logPath, `[${new Date().toISOString()}] Rendered video in ${Date.now() - start}ms\n`);
    return { videoPath };
  } catch (err: any) {
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] Error: ${err.message}\n`);
    // Fallback FFmpeg rendering logic
    try {
      const { renderVideoFFmpeg } = await import('./ffmpegRenderer');
      const ffmpegVideoPath = await renderVideoFFmpeg(script, voiceoverPath, dataDir);
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] Fallback: Rendered with FFmpeg\n`);
      return { videoPath: ffmpegVideoPath };
    } catch (ffmpegErr: any) {
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] FFmpeg fallback error: ${ffmpegErr.message}\n`);
      throw new Error('Both Remotion and FFmpeg rendering failed.');
    }
  }
} 