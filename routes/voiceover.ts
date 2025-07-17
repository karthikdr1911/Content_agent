import express, { Router, RequestHandler } from 'express';
import path from 'path';
import { voiceoverController } from '../controllers/voiceoverController';

const router: Router = express.Router();

// Generate voiceover
router.post('/generate', voiceoverController as RequestHandler);

// Serve voiceover files
router.get('/file/:uuid', (req, res) => {
  const { uuid } = req.params;
  const voiceoverPath = path.join('data', `voiceover_${uuid}`, 'voiceover.mp3');
  res.sendFile(path.resolve(voiceoverPath));
});

export default router; 