'use client';

import { useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripePaymentProps {
  clientSecret: string;
  paymentMethod: 'card' | 'sepa';
  onSuccess: () => void;
  onError: (error: string) => void;
}

function StripePaymentForm({
  clientSecret,
  paymentMethod,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Elemento de tarjeta no encontrado');
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          onError(error.message || 'Error al procesar el pago');
          setProcessing(false);
        } else if (paymentIntent?.status === 'succeeded') {
          onSuccess();
        } else {
          onError('El pago no se completó correctamente');
          setProcessing(false);
        }
      } else if (paymentMethod === 'sepa') {
        onError(
          'SEPA requiere confirmación adicional. Por favor, confirma el pago desde tu banco.'
        );
        setProcessing(false);
      }
    } catch (err: any) {
      onError(err.message || 'Error al procesar el pago');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (paymentMethod === 'card') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {processing ? 'Procesando...' : 'Pagar'}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Para completar el pago SEPA, necesitarás confirmar la transferencia
          desde tu banco. El pago se procesará en 2-3 días hábiles.
        </p>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!stripe || processing}
        className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {processing ? 'Procesando...' : 'Confirmar Pago SEPA'}
      </button>
    </div>
  );
}

export default function StripePayment({
  clientSecret,
  paymentMethod,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error: Stripe no está configurado correctamente.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm
        clientSecret={clientSecret}
        paymentMethod={paymentMethod}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}


