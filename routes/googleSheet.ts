import express from 'express';
import { googleSheetController } from '../controllers/googleSheetController';
const router = express.Router();
router.post('/', googleSheetController);
export default router; 