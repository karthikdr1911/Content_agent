import express from 'express';
import { renderVideo } from '../services/videoRenderer';

const router = express.Router();

router.post('/api/render', async (req, res) => {
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
});

export default router; 