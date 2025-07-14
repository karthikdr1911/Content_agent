import express, { Request, Response } from 'express';
import { voiceoverController } from '../controllers/voiceoverController';
import fs from 'fs';
import path from 'path'; // Added missing import
const router = express.Router();

router.post('/', voiceoverController);

// New endpoint for script-based voiceover generation
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { text, voice_id } = req.body;
    console.log('Voiceover generation request:', { text: text?.substring(0, 50) + '...', voice_id });
    if (!text || !voice_id) {
      console.log('Missing required fields:', { text: !!text, voice_id: !!voice_id });
      res.status(400).json({ error: 'Missing required fields: text, voice_id' });
      return;
    }

    // Import the service dynamically to avoid circular dependencies
    const { synthesizeSpeech } = await import('../services/elevenlabsService');
    console.log('ElevenLabs service imported successfully');
    
    // Generate UUID for this session and create data directory
    const uuid = `voiceover_${Date.now()}`;
    const dataDir = path.join('data', uuid);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    
    // Save voiceover in the data directory
    const voiceoverPath = path.join(dataDir, 'voiceover.mp3');
    console.log('Voiceover file path:', voiceoverPath);
    
    // Generate the voiceover
    console.log('Calling synthesizeSpeech...');
    await synthesizeSpeech(text, voiceoverPath, voice_id);
    console.log('Voiceover generated successfully');
    
    // Return the file path and UUID for use in editing
    res.json({ 
      voiceoverPath: voiceoverPath,
      uuid: uuid,
      message: 'Voiceover generated successfully'
    });
  } catch (err: any) {
    console.error('Voiceover generation error:', err.message);
    res.status(500).json({ error: err.message || 'Voiceover generation failed' });
  }
});

// Route to serve generated voiceover files
router.get('/file/:uuid', (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const voiceoverPath = path.join('data', uuid, 'voiceover.mp3');
    
    if (!fs.existsSync(voiceoverPath)) {
      res.status(404).json({ error: 'Voiceover file not found' });
      return;
    }
    
    res.sendFile(voiceoverPath, { root: '.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to serve voiceover file' });
  }
});

export default router; 