import express from 'express';
import { voiceoverController } from '../controllers/voiceoverController';
const router = express.Router();
router.post('/', voiceoverController);
export default router; 