import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createOrder, captureOrder } from '../utils/paypal';
import {
  createCardPaymentIntent,
  confirmPaymentIntent,
  getPaymentIntentStatus,
} from '../utils/stripe';
import Profile from '../models/Profile';
import Payment from '../models/Payment';
import User from '../models/User';
import { Types } from 'mongoose';
import { getPlan, calculateExpirationDate, PlanType } from '../constants/pricing';
import nodemailer from 'nodemailer';

export const createPaymentOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { profileId, planType, paymentMethod = 'paypal' } = req.body;

    if (!profileId) {
      res.status(400).json({ error: 'ID de perfil requerido' });
      return;
    }

    if (!planType || !['monthly', 'yearly', 'lifetime'].includes(planType)) {
      res.status(400).json({ error: 'Tipo de plan inválido. Debe ser: monthly, yearly o lifetime' });
      return;
    }

    // Verificar que el perfil pertenece al usuario
    const profile = await Profile.findOne({
      _id: profileId,
      userId: req.user.userId,
    });

    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado' });
      return;
    }

    // Obtener información del plan
    const plan = getPlan(planType as PlanType);
    const paymentAmount = plan.price;
    const paymentCurrency = plan.currency;

    // Crear orden según el método de pago seleccionado
    let orderId: string | undefined;
    let stripePaymentId: string | undefined;
    let clientSecret: string | undefined;

    const metadata = {
      userId: req.user.userId.toString(),
      profileId: profile._id.toString(),
      planType: planType as string,
    };

    let approvalUrl: string | undefined;
    
    if (paymentMethod === 'paypal') {
      // PayPal - crear orden y obtener URL de aprobación
      const baseUrl = req.protocol + '://' + req.get('host');
      const returnUrl = `${baseUrl}/api/payments/paypal-return?paymentId=${profileId}`;
      const cancelUrl = `${baseUrl}/api/payments/paypal-cancel`;
      
      try {
        const order = await createOrder(paymentAmount, paymentCurrency, returnUrl, cancelUrl);
        orderId = order.id;
        
        // Buscar el link de aprobación en la respuesta de PayPal
        const approvalLink = order.links?.find((link: any) => link.rel === 'approve');
        if (approvalLink) {
          approvalUrl = approvalLink.href;
          console.log('PayPal Approval URL encontrada:', approvalUrl);
        } else {
          console.error('No se encontró link de aprobación en la respuesta de PayPal');
          console.log('Links disponibles:', order.links?.map((link: any) => ({ rel: link.rel, href: link.href })));
          // Fallback: construir la URL manualmente
          const mode = process.env.PAYPAL_MODE || 'sandbox';
          const paypalBaseUrl = mode === 'production' 
            ? 'https://www.paypal.com/checkoutnow'
            : 'https://www.sandbox.paypal.com/checkoutnow';
          approvalUrl = `${paypalBaseUrl}?token=${orderId}`;
          console.log('Usando URL de fallback:', approvalUrl);
        }
      } catch (error: any) {
        console.error('Error al crear orden PayPal:', error);
        res.status(500).json({ 
          error: 'Error al crear orden de PayPal. Verifica tus credenciales de PayPal en .env' 
        });
        return;
      }
    } else if (paymentMethod === 'card') {
      // Stripe - Tarjeta de crédito/débito
      const paymentIntent = await createCardPaymentIntent({
        amount: paymentAmount,
        currency: paymentCurrency,
        paymentMethod: 'card',
        metadata,
      });
      stripePaymentId = paymentIntent.paymentIntentId;
      clientSecret = paymentIntent.clientSecret || undefined;
    } else {
      res.status(400).json({ error: 'Método de pago no soportado. Solo PayPal y Tarjeta están disponibles.' });
      return;
    }

    // Guardar pago en la base de datos
    const payment = new Payment({
      userId: req.user.userId,
      profileId: profile._id,
      amount: paymentAmount,
      currency: paymentCurrency,
      planType: planType as PlanType,
      paymentMethod: paymentMethod as any,
      paypalOrderId: paymentMethod === 'paypal' ? orderId : undefined,
      stripePaymentId: stripePaymentId,
      status: 'pending',
    });

    await payment.save();

    res.json({
      orderId: orderId,
      paymentId: payment._id,
      approvalUrl: approvalUrl, // URL de aprobación de PayPal
      clientSecret: clientSecret, // Para Stripe
      stripePaymentId: stripePaymentId,
      plan: {
        type: plan.type,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
      },
    });
  } catch (error: any) {
    console.error('Error creando orden de pago:', error);
    res.status(500).json({ error: error.message || 'Error al crear orden de pago' });
  }
};

// Función auxiliar para activar un perfil después del pago
async function activateProfile(payment: any) {
  const profile = await Profile.findById(payment.profileId);
  if (profile) {
    profile.isPaid = true;
    profile.isActive = true;
    profile.planType = payment.planType;
    
    // Establecer fecha de expiración según el plan
    if (payment.planType === 'lifetime') {
      profile.paidUntil = null; // Permanente
    } else {
      profile.paidUntil = calculateExpirationDate(payment.planType);
    }
    
    await profile.save();
    return profile;
  }
  return null;
}

export const capturePaymentOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { orderId, paymentId, paymentMethodId } = req.body;

    if (!orderId && !paymentId) {
      res.status(400).json({ error: 'ID de orden o pago requerido' });
      return;
    }

    // Buscar pago en la base de datos evitando cast inválido de ObjectId
    const orConditions: Record<string, any>[] = [];
    if (orderId) {
      orConditions.push({ paypalOrderId: orderId });
    }
    if (paymentId) {
      orConditions.push({ stripePaymentId: paymentId });
      if (Types.ObjectId.isValid(paymentId)) {
        orConditions.push({ _id: paymentId });
      }
    }

    const payment = await Payment.findOne({
      $or: orConditions,
      userId: req.user.userId,
      status: 'pending',
    });

    if (!payment) {
      res.status(404).json({ error: 'Pago no encontrado' });
      return;
    }

    // Procesar según el método de pago
    if (payment.paymentMethod === 'paypal' && payment.paypalOrderId) {
      // PayPal - Capturar orden
      await captureOrder(payment.paypalOrderId);
      payment.status = 'completed';
      await payment.save();
    } else if (payment.paymentMethod === 'card' || payment.paymentMethod === 'sepa') {
      // Stripe - Confirmar Payment Intent
      if (!payment.stripePaymentId) {
        res.status(400).json({ error: 'ID de pago Stripe no encontrado' });
        return;
      }

      const result = await confirmPaymentIntent(payment.stripePaymentId, paymentMethodId);
      
      if (result.status === 'succeeded') {
        payment.status = 'completed';
        await payment.save();
      } else if (result.status === 'requires_action' || result.status === 'processing') {
        // El pago está siendo procesado (especialmente SEPA puede tardar)
        payment.status = 'pending'; // Mantener pendiente hasta que se complete
        await payment.save();
        
        res.json({
          message: 'Pago en procesamiento',
          requiresAction: true,
          status: result.status,
          payment: {
            id: payment._id,
            status: payment.status,
          },
        });
        return;
      } else {
        payment.status = 'failed';
        await payment.save();
        res.status(400).json({ error: `El pago falló con estado: ${result.status}` });
        return;
      }
    } else {
      res.status(400).json({ error: 'Método de pago no soportado' });
      return;
    }

    // Activar perfil solo si el pago se completó
    const profile = await activateProfile(payment);

    res.json({
      message: 'Pago completado exitosamente',
      payment: {
        id: payment._id,
        status: payment.status,
      },
      profile: {
        id: profile?._id,
        isActive: profile?.isActive,
        paidUntil: profile?.paidUntil,
      },
    });
  } catch (error: any) {
    console.error('Error capturando orden de pago:', error);
    res.status(500).json({ error: error.message || 'Error al capturar orden de pago' });
  }
};

// Nuevo endpoint para verificar el estado de un pago Stripe
export const checkPaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { paymentId } = req.params;

    const statusOrConditions: Record<string, any>[] = [];
    if (paymentId) {
      statusOrConditions.push({ stripePaymentId: paymentId });
      if (Types.ObjectId.isValid(paymentId)) {
        statusOrConditions.push({ _id: paymentId });
      }
    }

    const payment = await Payment.findOne({
      $or: statusOrConditions,
      userId: req.user.userId,
    });

    if (!payment) {
      res.status(404).json({ error: 'Pago no encontrado' });
      return;
    }

    if (payment.paymentMethod === 'card' || payment.paymentMethod === 'sepa') {
      if (!payment.stripePaymentId) {
        res.status(400).json({ error: 'ID de pago Stripe no encontrado' });
        return;
      }

      const result = await getPaymentIntentStatus(payment.stripePaymentId);
      
      // Actualizar estado si cambió
      if (result.status === 'succeeded' && payment.status !== 'completed') {
        payment.status = 'completed';
        await payment.save();
        await activateProfile(payment);
      } else if (result.status === 'canceled' || result.status === 'requires_payment_method') {
        payment.status = 'failed';
        await payment.save();
      }

      res.json({
        status: payment.status,
        stripeStatus: result.status,
        payment: {
          id: payment._id,
          status: payment.status,
        },
      });
    } else {
      res.json({
        status: payment.status,
        payment: {
          id: payment._id,
          status: payment.status,
        },
      });
    }
  } catch (error: any) {
    console.error('Error verificando estado de pago:', error);
    res.status(500).json({ error: error.message || 'Error al verificar estado del pago' });
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    // Solo mostrar pagos completados o fallidos, no pendientes
    const payments = await Payment.find({ 
      userId: req.user.userId,
      status: { $in: ['completed', 'failed'] }
    })
      .populate('profileId', 'socialNetwork')
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error: any) {
    console.error('Error obteniendo historial de pagos:', error);
    res.status(500).json({ error: 'Error al obtener historial de pagos' });
  }
};

// Obtener pagos pendientes (para que el usuario pueda eliminarlos)
export const getPendingPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const payments = await Payment.find({ 
      userId: req.user.userId,
      status: 'pending'
    })
      .populate('profileId', 'socialNetwork')
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error: any) {
    console.error('Error obteniendo pagos pendientes:', error);
    res.status(500).json({ error: 'Error al obtener pagos pendientes' });
  }
};

// Reanudar pago pendiente (solo PayPal por ahora)
export const resumePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { paymentId } = req.params;
    const payment = await Payment.findOne({
      _id: paymentId,
      userId: req.user.userId,
      status: 'pending',
    });

    if (!payment) {
      res.status(404).json({ error: 'Pago pendiente no encontrado' });
      return;
    }

    if (payment.paymentMethod === 'paypal' && payment.paypalOrderId) {
      const mode = process.env.PAYPAL_MODE || 'sandbox';
      const paypalBaseUrl =
        mode === 'production'
          ? 'https://www.paypal.com/checkoutnow'
          : 'https://www.sandbox.paypal.com/checkoutnow';
      const resumeUrl = `${paypalBaseUrl}?token=${payment.paypalOrderId}`;
      res.json({ resumeUrl });
      return;
    }

    res.json({
      resumeUrl: null,
      reason: payment.paymentMethod,
      message: 'Reanuda este pago desde la pantalla de Promoción.',
    });
  } catch (error: any) {
    console.error('Error reanudando pago:', error);
    res.status(500).json({ error: 'Error al reanudar el pago' });
  }
};

// Eliminar un pago (solo pendientes o fallidos)
export const deletePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId: req.user.userId,
    });

    if (!payment) {
      res.status(404).json({ error: 'Pago no encontrado' });
      return;
    }

    // Solo permitir eliminar pagos pendientes o fallidos
    if (payment.status === 'completed') {
      res.status(400).json({ error: 'No se pueden eliminar pagos completados' });
      return;
    }

    await Payment.findByIdAndDelete(paymentId);

    res.json({ message: 'Pago eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error eliminando pago:', error);
    res.status(500).json({ error: 'Error al eliminar pago' });
  }
};

// Enviar recibo por email
export const sendReceipt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId: req.user.userId,
      status: 'completed',
    });

    if (!payment) {
      res.status(404).json({ error: 'Pago completado no encontrado' });
      return;
    }

    const profile = await Profile.findById(payment.profileId);
    const user = await User.findById(req.user.userId);

    if (!profile || !user) {
      res.status(404).json({ error: 'Perfil o usuario no encontrado' });
      return;
    }

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL || 'oficialsocialrrss@gmail.com',
        pass: process.env.SUPPORT_EMAIL_PASSWORD || '',
      },
    });

    const plan = getPlan(payment.planType as PlanType);
    const planNames: Record<string, string> = {
      monthly: 'Plan Mensual',
      yearly: 'Plan Anual',
      lifetime: 'Plan Permanente',
    };

    const mailOptions = {
      from: process.env.SUPPORT_EMAIL || 'oficialsocialrrss@gmail.com',
      to: user.email,
      subject: `Recibo de Pago - Promoción RRSS`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; margin: 0;">Recibo de Pago</h1>
            <p style="color: #6b7280; margin-top: 5px;">Promoción RRSS</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">ID de Pago:</strong>
              <span style="color: #6b7280; margin-left: 10px;">${payment._id.toString().slice(-8)}</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #374151;">Fecha:</strong>
              <span style="color: #6b7280; margin-left: 10px;">${new Date(payment.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin-top: 0;">Detalles del Pago</h2>
            <div style="margin-bottom: 10px;">
              <strong style="color: #374151;">Perfil:</strong>
              <span style="color: #6b7280; margin-left: 10px;">${profile.profileData?.username || profile.profileData?.channelName || profile.profileData?.handle || 'Mi Perfil'}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #374151;">Red Social:</strong>
              <span style="color: #6b7280; margin-left: 10px; text-transform: capitalize;">${profile.socialNetwork}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #374151;">Plan:</strong>
              <span style="color: #6b7280; margin-left: 10px;">${planNames[payment.planType] || payment.planType}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #374151;">Método de Pago:</strong>
              <span style="color: #6b7280; margin-left: 10px; text-transform: capitalize;">${payment.paymentMethod}</span>
            </div>
          </div>

          <div style="background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <div style="font-size: 12px; margin-bottom: 5px; opacity: 0.9;">Total Pagado</div>
            <div style="font-size: 32px; font-weight: bold;">${plan.price.toFixed(2)} €</div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
            <p>Este es un recibo automático de tu pago en Promoción RRSS.</p>
            <p>Gracias por confiar en nosotros.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Recibo enviado exitosamente a tu correo electrónico' });
  } catch (error: any) {
    console.error('Error enviando recibo:', error);
    res.status(500).json({ error: 'Error al enviar el recibo por email' });
  }
};