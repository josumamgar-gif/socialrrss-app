import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'sepa';
  metadata?: Record<string, string>;
}

/**
 * Crea un Payment Intent para tarjeta de crédito/débito
 */
export async function createCardPaymentIntent(params: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Stripe usa centavos
      currency: params.currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: params.metadata || {},
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error('Error creando Payment Intent de tarjeta:', error);
    throw new Error(`Error al crear pago con tarjeta: ${error.message}`);
  }
}

/**
 * Crea un Setup Intent para SEPA (transferencia bancaria)
 */
export async function createSepaSetupIntent(params: {
  currency: string;
  metadata?: Record<string, string>;
}) {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['sepa_debit'],
      currency: params.currency.toLowerCase(),
      metadata: params.metadata || {},
    });

    return {
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    };
  } catch (error: any) {
    console.error('Error creando Setup Intent SEPA:', error);
    throw new Error(`Error al crear pago SEPA: ${error.message}`);
  }
}

/**
 * Crea un Payment Intent para SEPA después de confirmar el método de pago
 */
export async function createSepaPaymentIntent(params: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100),
      currency: params.currency.toLowerCase(),
      payment_method_types: ['sepa_debit'],
      metadata: params.metadata || {},
      // SEPA requiere confirmación del cliente, así que marcamos como requires_action
      confirmation_method: 'manual',
      confirm: false,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error('Error creando Payment Intent SEPA:', error);
    throw new Error(`Error al crear pago SEPA: ${error.message}`);
  }
}

/**
 * Confirma un Payment Intent (después de que el cliente confirme el pago en el frontend)
 */
export async function confirmPaymentIntent(
  paymentIntentId: string,
  paymentMethodId?: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      return {
        status: 'succeeded',
        paymentIntentId: paymentIntent.id,
      };
    }

    // Si necesita confirmación, confirmamos el pago
    if (paymentMethodId) {
      const confirmed = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        status: confirmed.status,
        paymentIntentId: confirmed.id,
      };
    }

    // Si ya está confirmado pero no completado, retornamos el estado actual
    return {
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error('Error confirmando Payment Intent:', error);
    throw new Error(`Error al confirmar pago: ${error.message}`);
  }
}

/**
 * Obtiene el estado de un Payment Intent
 */
export async function getPaymentIntentStatus(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error('Error obteniendo estado del Payment Intent:', error);
    throw new Error(`Error al obtener estado del pago: ${error.message}`);
  }
}

export default stripe;


