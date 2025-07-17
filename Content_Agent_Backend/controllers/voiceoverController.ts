import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { synthesizeSpeech } from '../services/elevenlabsService';

export const voiceoverController = async (req: Request, res: Response) => {
  try {
    const { text, voice_id } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing required field: text' });
    }

    // Generate UUID for this voiceover
    const uuid = uuidv4();
    const voiceoverDir = path.join('data', `voiceover_${uuid}`);
    if (!fs.existsSync(voiceoverDir)) {
      fs.mkdirSync(voiceoverDir, { recursive: true });
    }

    const voiceoverPath = path.join(voiceoverDir, 'voiceover.mp3');
    await synthesizeSpeech(text, voiceoverPath, voice_id);

    res.json({ 
      uuid,
      voiceoverPath,
      message: 'Voiceover generated successfully'
    });
  } catch (err: any) {
    console.error('Voiceover generation error:', err);
    res.status(500).json({ error: err.message || 'Voiceover generation failed' });
  }
}; 