import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  checkPromotionAvailability,
  activateFreePromotion,
  getUserPromotionStatus,
  convertExpiredPromotions,
  getPromotionStats,
} from '../controllers/promotion.controller';

const router = Router();

// Public routes
router.get('/availability', checkPromotionAvailability);

// Protected routes
router.use(authenticate);
router.post('/activate', activateFreePromotion);
router.get('/status', getUserPromotionStatus);
router.post('/convert-expired', convertExpiredPromotions);
router.get('/stats', getPromotionStats);

export default router;