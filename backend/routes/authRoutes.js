import express from 'express';
import { registerUser, verifyOTP, loginUser, logoutUser, updateUserProfile, generateReferral } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateUserProfile);
router.post('/generate-referral', protect, generateReferral);

export default router;
