import express from 'express';
import { outputController } from '../controllers/outputController';
const router = express.Router();
router.get('/:id', outputController);
export default router; 