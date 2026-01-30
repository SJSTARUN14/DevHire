import express from 'express';
import { getJobs, getJobById, createJob, getMyJobs } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(protect, authorize('recruiter', 'company', 'admin'), createJob);

router.get('/my', protect, authorize('recruiter', 'company', 'admin'), getMyJobs);

router.route('/:id').get(getJobById);

export default router;
