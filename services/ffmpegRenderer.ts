import path from 'path';
import fs from 'fs';
import { createCanvas, registerFont } from 'canvas';
import { execSync } from 'child_process';

interface ScriptSections {
  intro: string;
  points: string[];
  outro: string;
  cta: string;
}

// Helper: Generate an image with text
async function generateImage(text: string, outPath: string) {
  const width = 1280, height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, width, height);
  ctx.font = 'bold 48px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  wrapText(ctx, text, width / 2, height / 2, width - 100, 60);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
}

// Helper: Wrap text for canvas
function wrapText(ctx: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let lines: string[] = [];
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

// Main FFmpeg fallback renderer
export async function renderVideoFFmpeg(
  script: ScriptSections,
  voiceoverPath: string,
  dataDir: string
): Promise<string> {
  console.log('Current working directory:', process.cwd());
  console.log('dataDir:', dataDir);
  console.log('Contents of dataDir:', fs.readdirSync(dataDir));

  // 1. Generate images for each section
  const slides: string[] = [];
  const sections = [script.intro, ...script.points, script.outro, script.cta];
  for (let i = 0; i < sections.length; i++) {
    const imgPath = path.join(dataDir, `slide${i + 1}.png`);
    await generateImage(sections[i], imgPath);
    slides.push(imgPath);
  }

  // 2. Create slideshow video from images
  const slidesTxt = path.join(dataDir, 'slides.txt');
  const slideDuration = 3; // seconds per slide (can be improved by aligning with voiceover)
  const slideFilenames = slides.map(s => path.basename(s));
  let slidesTxtContent = '';
  for (let i = 0; i < slideFilenames.length; i++) {
    slidesTxtContent += `file '${slideFilenames[i]}'\n`;
    slidesTxtContent += `duration ${slideDuration}\n`;
  }
  // List the last slide again without duration
  slidesTxtContent += `file '${slideFilenames[slideFilenames.length - 1]}'\n`;
  fs.writeFileSync(slidesTxt, slidesTxtContent);
  const slidesVideo = path.join(dataDir, 'slides.mp4');
  const ffmpegSlidesCmd = `ffmpeg -y -f concat -safe 0 -i "slides.txt" -vsync vfr -pix_fmt yuv420p "slides.mp4"`;
  try {
    execSync(ffmpegSlidesCmd, { cwd: dataDir, stdio: 'inherit' });
  } catch (err) {
    console.error('FFmpeg slides error:', err);
  }

  // 3. Merge with voiceover
  const finalVideo = path.join(dataDir, 'finalVideo.mp4');
  const ffmpegMergeCmd = `ffmpeg -y -i "slides.mp4" -i "${path.basename(voiceoverPath)}" -c:v copy -c:a aac "finalVideo.mp4"`;
  try {
    execSync(ffmpegMergeCmd, { cwd: dataDir, stdio: 'inherit' });
  } catch (err) {
    console.error('FFmpeg merge error:', err);
  }
  return finalVideo;
} 