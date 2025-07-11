import { Request, Response } from 'express';
import { renderVideo } from '../services/videoRenderer';

export async function handleRender(req: Request, res: Response) {
  try {
    const { uuid, script, voiceoverPath } = req.body;
    if (!uuid || !script || !voiceoverPath) {
      return res.status(400).json({ error: 'Missing required fields: uuid, script, voiceoverPath' });
    }
    const result = await renderVideo({ uuid, script, voiceoverPath });
    res.json({ videoPath: result.videoPath });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Video rendering failed' });
  }
} 