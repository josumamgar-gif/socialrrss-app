import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  discardProfile,
  getDiscardedProfiles,
  markTutorialCompleted,
  getTutorialStatus,
} from '../controllers/user.controller';

const router = express.Router();

// Rutas para perfiles descartados
router.post('/discard-profile', authenticate, discardProfile);
router.get('/discarded-profiles', authenticate, getDiscardedProfiles);

// Rutas para tutorial
router.post('/tutorial-completed', authenticate, markTutorialCompleted);
router.get('/tutorial-status', authenticate, getTutorialStatus);

export default router;
