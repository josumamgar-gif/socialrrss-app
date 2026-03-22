import express from 'express';
import { sendSupportEmail } from '../controllers/support.controller';
import { optionalAuthenticate } from '../middleware/optionalAuth.middleware';

const router = express.Router();

router.post('/', optionalAuthenticate, sendSupportEmail);

export default router;
