import express from 'express';
import { sendSupportEmail } from '../controllers/support.controller';
import { optionalAuthenticate } from '../middleware/optionalAuth.middleware';

const router = express.Router();

// Permitir tanto usuarios autenticados como no autenticados
router.post('/', optionalAuthenticate, sendSupportEmail);

export default router;
