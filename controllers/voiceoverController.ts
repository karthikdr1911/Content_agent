import { Request, Response } from 'express';
export const voiceoverController = async (req: Request, res: Response) => {
  // TODO: Implement TTS using ElevenLabs
  res.json({ audioUrl: 'stub-audio-url.mp3' });
}; 