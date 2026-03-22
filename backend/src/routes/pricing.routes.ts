import express from 'express';
import { getPlans } from '../controllers/pricing.controller';
import { optionalAuthenticate } from '../middleware/optionalAuth.middleware';

const router = express.Router();

router.get('/', optionalAuthenticate, getPlans);

export default router;


