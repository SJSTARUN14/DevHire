import express from 'express';
import { applyJob, getMyApplications, getJobApplications, checkApplicationStatus, updateApplicationStatus, applyExternalJob } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('resume'), applyJob);
router.post('/external', protect, applyExternalJob);
router.get('/my', protect, getMyApplications);
router.get('/job/:jobId', protect, getJobApplications);
router.get('/check/:jobId', protect, checkApplicationStatus);
router.put('/:id/status', protect, updateApplicationStatus);

export default router;
