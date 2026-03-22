import express from 'express';
import { getPlans, adminResetFreeTrials } from '../controllers/pricing.controller';
import { optionalAuthenticate } from '../middleware/optionalAuth.middleware';

const router = express.Router();

router.get('/', optionalAuthenticate, getPlans);
router.post('/admin/reset-free-trials', adminResetFreeTrials);

export default router;


