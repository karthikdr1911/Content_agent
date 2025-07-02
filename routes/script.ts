import express from 'express';
import { scriptController } from '../controllers/scriptController';
const router = express.Router();
router.post('/', scriptController);
export default router; 