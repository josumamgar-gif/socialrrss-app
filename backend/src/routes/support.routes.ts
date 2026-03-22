import express from 'express';
import { sendSupportEmail, adminSendMarketingEmail } from '../controllers/support.controller';
import { optionalAuthenticate } from '../middleware/optionalAuth.middleware';

const router = express.Router();

router.post('/', optionalAuthenticate, sendSupportEmail);
router.post('/admin/send', adminSendMarketingEmail);

export default router;
