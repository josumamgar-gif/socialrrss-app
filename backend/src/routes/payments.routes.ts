import express from 'express';
import {
  createPaymentOrder,
  capturePaymentOrder,
  getPaymentHistory,
  checkPaymentStatus,
  getPendingPayments,
  deletePayment,
} from '../controllers/payments.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create-order', authenticate, createPaymentOrder);
router.post('/capture-order', authenticate, capturePaymentOrder);
router.get('/history', authenticate, getPaymentHistory);
router.get('/pending', authenticate, getPendingPayments);
router.delete('/:paymentId', authenticate, deletePayment);
router.get('/status/:paymentId', authenticate, checkPaymentStatus);

// Ruta para manejar el retorno de PayPal después del pago
router.get('/paypal-return', (req, res) => {
  const { token, PayerID, paymentId } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  if (token && PayerID) {
    // Redirigir al frontend con los parámetros
    res.redirect(`${frontendUrl}/promocion?token=${token}&PayerID=${PayerID}${paymentId ? `&paymentId=${paymentId}` : ''}`);
  } else {
    res.redirect(`${frontendUrl}/promocion?paypal_success=true`);
  }
});

// Ruta para manejar la cancelación de PayPal
router.get('/paypal-cancel', (_req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/promocion?paypal_cancel=true`);
});

export default router;

