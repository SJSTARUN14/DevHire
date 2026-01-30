import express from 'express';
import { analyzeResume } from '../controllers/atsController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/analyze', upload.single('resume'), analyzeResume);

export default router;
