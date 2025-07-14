import { Request, Response } from 'express';
export const voiceoverController = async (req: Request, res: Response) => {
  try {
    const { uuid, script, voiceId } = req.body;
    if (!uuid || !script) {
      return res.status(400).json({ error: 'Missing required fields: uuid, script' });
    }
    const dataDir = path.join('data', uuid);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const audioPath = path.join(dataDir, 'voiceover.mp3');
    await synthesizeSpeech(script, audioPath, voiceId);
    res.json({ audioPath });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Voiceover generation failed' });
  }
}; 