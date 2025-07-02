import express from 'express';
import { ideateController } from '../controllers/ideateController';
const router = express.Router();
router.post('/', ideateController);
export default router; 