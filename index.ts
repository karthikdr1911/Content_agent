import dotenv from 'dotenv';
dotenv.config();

import { runIdeation } from './agents/ideationAgent';
import { generateScript } from './agents/scriptAgent';
import { generateVoiceover } from './services/elevenlabs';
import { renderVideo } from './services/ffmpegRenderer';
import { schedulePost } from './services/scheduler';

async function main() {
  const topics = await runIdeation();
  const script = await generateScript(topics[0]);
  const voicePath = await generateVoiceover(script);
  const videoPath = await renderVideo(voicePath);
  await schedulePost(videoPath);
}

main(); 