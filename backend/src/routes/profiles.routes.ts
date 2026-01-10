import express from 'express';
import {
  getAllProfiles,
  getMyProfiles,
  createProfile,
  uploadMiddleware,
} from '../controllers/profiles.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/my-profiles', authenticate, getMyProfiles);
router.post('/', authenticate, uploadMiddleware, createProfile);

export default router;


