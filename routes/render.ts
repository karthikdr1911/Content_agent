import express from 'express';
import { renderController } from '../controllers/renderController';
const router = express.Router();
router.post('/', renderController);
export default router; 