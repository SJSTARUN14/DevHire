import express from 'express';
import { getCompanyStats, addRecruiter, getRecruiters } from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorize('company', 'recruiter', 'admin'), getCompanyStats);
router.post('/recruiters', protect, authorize('company', 'admin'), addRecruiter);
router.get('/recruiters', protect, authorize('company', 'admin'), getRecruiters);

export default router;
