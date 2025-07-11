import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

interface ScriptSections {
  intro: string;
  points: string[];
  outro: string;
  cta: string;
}

// Main FFmpeg fallback renderer
export async function renderVideoFFmpeg(
  script: ScriptSections,
  voiceoverPath: string,
  dataDir: string
): Promise<string> {
  // 1. Try to use DALL·E images if they exist
  const sections = [script.intro, ...script.points, script.outro, script.cta];
  const dalleSlides: string[] = [];
  for (let i = 0; i < sections.length; i++) {
    const imgPath = path.join(dataDir, `dalle_img_${i + 1}.png`);
    if (fs.existsSync(imgPath)) {
      dalleSlides.push(imgPath);
    }
  }
  let slides: string[];
  if (dalleSlides.length === sections.length) {
    // All DALL·E images exist, use them
    slides = dalleSlides;
  } else {
    // Fallback: generate text slides
    slides = [];
    for (let i = 0; i < sections.length; i++) {
      const imgPath = path.join(dataDir, `slide${i + 1}.png`);
      await generateImage(sections[i], imgPath);
      slides.push(imgPath);
    }
  }

  // 2. Create slideshow video from images
  const slidesTxt = path.join(dataDir, 'slides.txt');
  const slideDuration = 3; // seconds per slide (can be improved by aligning with voiceover)
  fs.writeFileSync(
    slidesTxt,
    slides.map(s => `file '${s.replace(/\\/g, '/')}'\nduration ${slideDuration}`).join('\n') + `\nfile '${slides[slides.length - 1].replace(/\\/g, '/')}'\n` // last slide hold
  );
  const slidesVideo = path.join(dataDir, 'slides.mp4');
  const ffmpegSlidesCmd = `ffmpeg -y -f concat -safe 0 -i "${slidesTxt}" -vsync vfr -pix_fmt yuv420p "${slidesVideo}"`;
  execSync(ffmpegSlidesCmd);

  // 3. Merge with voiceover
  const finalVideo = path.join(dataDir, 'finalVideo.mp4');
  const ffmpegMergeCmd = `ffmpeg -y -i "${slidesVideo}" -i "${voiceoverPath}" -c:v copy -c:a aac -shortest "${finalVideo}"`;
  execSync(ffmpegMergeCmd);

  return finalVideo;
}

// Helper: Generate an image with text (used only if DALL·E images are missing)
import { createCanvas } from 'canvas';
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