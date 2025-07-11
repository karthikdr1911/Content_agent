import express, { Request, Response } from 'express';
import { renderVideo } from '../services/videoRenderer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer setup: store files in memory, move to data/{uuid}/ after parsing
const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/render', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'audio', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    // Parse fields
    const uuid = req.body.uuid;
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
      return res.status(400).json({ error: 'Missing required fields: uuid, intro, outro, cta' });
    }
    const script = { intro, points, outro, cta };

    // Prepare data dir
    const dataDir = path.join('data', uuid);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    // Save images
    let imagePaths: string[] = [];
    if (req.files && (req.files as any).images) {
      const images = (req.files as any).images;
      imagePaths = images.map((file: Express.Multer.File, i: number) => {
        const ext = path.extname(file.originalname) || '.png';
        const imgPath = path.join(dataDir, `user_img_${i + 1}${ext}`);
        fs.writeFileSync(imgPath, file.buffer);
        return imgPath;
      });
    }

    // Save audio
    let voiceoverPath = '';
    if (req.files && (req.files as any).audio && (req.files as any).audio[0]) {
      const file = (req.files as any).audio[0];
      const ext = path.extname(file.originalname) || '.mp3';
      voiceoverPath = path.join(dataDir, `voiceover${ext}`);
      fs.writeFileSync(voiceoverPath, file.buffer);
    }
    if (!voiceoverPath) {
      return res.status(400).json({ error: 'Voiceover audio file is required.' });
    }

    // Pass user image paths to renderVideo (update renderVideo to accept userImages if needed)
    const result = await renderVideo({ uuid, script, voiceoverPath, userImages: imagePaths });
    res.json({ videoPath: result.videoPath });
  } catch (err: any) {
    if (err.response && err.response.data) {
      return res.status(500).json({ error: err.response.data });
    }
    res.status(500).json({ error: err.message || 'Video rendering failed' });
  }
});

export default router; 