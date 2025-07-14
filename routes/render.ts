import express, { Request, Response } from 'express';
import { renderVideo } from '../services/videoRenderer';
import multer from 'multer';
// If you see a type error for Express.Multer, install @types/multer for full type support.
import type { File as MulterFile } from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer setup: store files in memory, move to data/{uuid}/ after parsing
const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/render', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'audio', maxCount: 1 }
]), async (req: Request, res: Response): Promise<void> => {
  console.log('→ Render route hit!');
  console.log('→ Request body fields:', Object.keys(req.body));
  console.log('→ Request body values:', req.body);
  try {
    // Parse fields
    const uuid = req.body.uuid;
    const voiceoverUuid = req.body.voiceoverUuid; // UUID from voiceover generation
    const intro = req.body.intro;
    const outro = req.body.outro;
    const cta = req.body.cta;
    // Points[] may come as array or single string
    let points: string[] = [];
    if (Array.isArray(req.body['points[]'])) {
      points = req.body['points[]'];
    } else if (Array.isArray(req.body.points)) {
      points = req.body.points;
    } else if (req.body.points) {
      points = [req.body.points];
    } else {
      // Try points[0], points[1], ...
      points = Object.keys(req.body)
        .filter(k => k.startsWith('points['))
        .sort()
        .map(k => req.body[k]);
    }
    if (!uuid || !intro || !outro || !cta) {
      res.status(400).json({ error: 'Missing required fields: uuid, intro, outro, cta' });
      return;
    }
    const script = { intro, points, outro, cta };

    // Prepare data dir
    const dataDir = path.join('data', uuid);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    // Save images
    let imagePaths: string[] = [];
    // @ts-expect-error: Express+Multer typing issue
    const files = req.files as Record<string, MulterFile[]> | undefined;
    if (files && files.images) {
      const images = files.images;
      imagePaths = images.map((file, i) => {
        const ext = path.extname(file.originalname) || '.png';
        const imgPath = path.join(dataDir, `user_img_${i + 1}${ext}`);
        fs.writeFileSync(imgPath, file.buffer);
        return imgPath;
      });
    }

    // Log and write remotion-props.json with images
    const remotionProps = { uuid, images: imagePaths, intro, points, outro, cta, voiceoverPath: '' };
    console.log('→ Writing props:', remotionProps);
    fs.writeFileSync(
      path.join(dataDir, 'remotion-props.json'),
      JSON.stringify(remotionProps)
    );

    // Save audio
    let voiceoverPath = '';
    console.log('→ Render request UUID:', uuid);
    console.log('→ Voiceover UUID:', voiceoverUuid);
    console.log('→ Checking for voiceover files...');
    if (files && files.audio && files.audio[0]) {
      const file = files.audio[0];
      const ext = path.extname(file.originalname) || '.mp3';
      voiceoverPath = path.join(dataDir, `voiceover${ext}`);
      fs.writeFileSync(voiceoverPath, file.buffer);
      console.log('→ Using uploaded audio file:', voiceoverPath);
    } else if (voiceoverUuid) {
      // Use the generated voiceover from voiceoverUuid
      const voiceoverDir = path.join('data', voiceoverUuid);
      const generatedVoiceoverPath = path.join(voiceoverDir, 'voiceover.mp3');
      console.log('→ Checking for generated voiceover at:', generatedVoiceoverPath);
      console.log('→ File exists:', fs.existsSync(generatedVoiceoverPath));
      if (fs.existsSync(generatedVoiceoverPath)) {
        voiceoverPath = generatedVoiceoverPath;
        console.log('→ Using generated voiceover from:', voiceoverPath);
      } else {
        console.log('→ Generated voiceover not found for UUID:', voiceoverUuid);
      }
    } else {
      // Check if UUID corresponds to a generated voiceover
      const voiceoverDir = path.join('data', uuid);
      const generatedVoiceoverPath = path.join(voiceoverDir, 'voiceover.mp3');
      console.log('→ Checking for generated voiceover at:', generatedVoiceoverPath);
      console.log('→ File exists:', fs.existsSync(generatedVoiceoverPath));
      if (fs.existsSync(generatedVoiceoverPath)) {
        voiceoverPath = generatedVoiceoverPath;
        console.log('→ Using generated voiceover from:', voiceoverPath);
      } else {
        // Check if this is a voiceover UUID (starts with 'voiceover_')
        if (uuid.startsWith('voiceover_')) {
          console.log('→ UUID appears to be from voiceover generation');
          voiceoverPath = generatedVoiceoverPath;
          console.log('→ Will use voiceover path:', voiceoverPath);
        } else {
          console.log('→ No voiceover found for UUID:', uuid);
        }
      }
    }
    if (!voiceoverPath) {
      console.log('→ No voiceover path found, returning error');
      res.status(400).json({ error: 'Voiceover audio file is required or UUID must correspond to a generated voiceover.' });
      return;
    }

    // Update remotionProps with correct voiceoverPath
    remotionProps.voiceoverPath = voiceoverPath;
    fs.writeFileSync(
      path.join(dataDir, 'remotion-props.json'),
      JSON.stringify(remotionProps)
    );

    // Generate separate video UUID when using voiceover to keep videos separate from voiceover folders
    const videoUuid = voiceoverUuid ? `video_${Date.now()}` : uuid;
    
    // Pass user image paths to renderVideo with the video UUID
    const result = await renderVideo({ uuid: videoUuid, script, voiceoverPath, userImages: imagePaths });
    // Return the UUID instead of the full file path so frontend can construct HTTP URL
    // Videos are created in the video UUID folder, separate from voiceover folders
    res.json({ videoPath: `data/${videoUuid}/finalVideo.mp4` });
  } catch (err: any) {
    if (err.response && err.response.data) {
      res.status(500).json({ error: err.response.data });
      return;
    }
    res.status(500).json({ error: err.message || 'Video rendering failed' });
  }
});

// Route to serve video files
router.get('/api/video/:uuid', (req: Request, res: Response) => {
  const { uuid } = req.params;
  const videoPath = path.join('data', uuid, 'finalVideo.mp4');
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  res.sendFile(path.resolve(videoPath));
});

export default router; 