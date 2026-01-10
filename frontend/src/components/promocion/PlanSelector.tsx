'use client';

import { useState, useEffect } from 'react';
import { PricingPlan, PlanType, PaymentMethod } from '@/types';
import { pricingAPI, paymentsAPI } from '@/lib/api';
import { CheckIcon } from '@heroicons/react/24/solid';
import StripePayment from './StripePayment';
import ProfilePreview from './ProfilePreview';
import { Profile } from '@/types';
import { profilesAPI } from '@/lib/api';

interface PlanSelectorProps {
  profileId: string;
  profile?: any;
  onPaymentSuccess?: () => void;
}

export default function PlanSelector({ profileId, profile, onPaymentSuccess }: PlanSelectorProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePaymentId, setStripePaymentId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(profile || null);

  useEffect(() => {
    loadPlans();
    if (profileId && !profile) {
      loadProfile();
    }
  }, [profileId]);

  // Resetear estados cuando cambia el método de pago
  useEffect(() => {
    setPaymentCreated(false);
    setClientSecret(null);
    setStripePaymentId(null);
    setPaymentId(null);
    setError(null);
    setLoading(false);
  }, [selectedPaymentMethod]);

  const loadProfile = async () => {
    try {
      const response = await profilesAPI.getMyProfiles();
      const foundProfile = response.profiles.find((p: Profile) => p._id === profileId);
      if (foundProfile) {
        setProfileData(foundProfile);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await pricingAPI.getPlans();
      setPlans(response.plans);
      if (response.plans.length > 0) {
        setSelectedPlan(response.plans[0].type);
      }
    } catch (err: any) {
      setError('Error al cargar los planes');
      console.error(err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Por favor selecciona un plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await paymentsAPI.createOrder(profileId, selectedPlan, selectedPaymentMethod);
      setPaymentId(response.paymentId);
      
      if (selectedPaymentMethod === 'paypal' && response.orderId) {
        // Para PayPal, necesitamos redirigir al usuario a la página de aprobación
        const approvalUrl = response.approvalUrl;
        if (approvalUrl) {
          console.log('Redirigiendo a PayPal:', approvalUrl);
          // No resetear loading aquí porque vamos a redirigir
          // Redirigir al usuario a PayPal
          window.location.href = approvalUrl;
          return; // Salir temprano para no ejecutar el finally
        } else {
          console.error('No se recibió approvalUrl de PayPal');
          setError('Error: No se pudo obtener la URL de aprobación de PayPal. Por favor, intenta de nuevo.');
          setLoading(false);
        }
      } else if (selectedPaymentMethod === 'card' && response.clientSecret) {
        setClientSecret(response.clientSecret);
        setStripePaymentId(response.stripePaymentId || null);
        setPaymentCreated(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error en handlePayment:', err);
      setError(err.response?.data?.error || 'Error al procesar el pago');
      setLoading(false);
    }
  };

  const handleStripeSuccess = async () => {
    if (!paymentId || !stripePaymentId) return;
    
    try {
      await paymentsAPI.captureOrder(undefined, stripePaymentId);
      const statusCheck = await paymentsAPI.checkPaymentStatus(paymentId);
      
      if (statusCheck.status === 'completed') {
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } else {
        setError('El pago está siendo procesado. Recibirás una confirmación cuando se complete.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al confirmar el pago');
    }
  };

  const getPlanIcon = (type: PlanType) => {
    switch (type) {
      case 'monthly':
        return '📅';
      case 'yearly':
        return '📆';
      case 'lifetime':
        return '⭐';
      default:
        return '💎';
    }
  };

  const getPlanColor = (type: PlanType) => {
    switch (type) {
      case 'monthly':
        return 'border-blue-500 bg-blue-50';
      case 'yearly':
        return 'border-green-500 bg-green-50';
      case 'lifetime':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  if (loadingPlans) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Elige tu Plan de Promoción</h2>
        <p className="text-gray-600">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>

      {/* Preview del perfil */}
      {profileData && (
        <div className="bg-gray-50 border border-gray-300 rounded-none sm:rounded-md p-4 sm:p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            👁️ Vista Previa de tu Perfil Promocionado
          </h3>
          <ProfilePreview profile={profileData} />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.type}
            onClick={() => setSelectedPlan(plan.type)}
            className={`
              relative border rounded-none sm:rounded-lg p-4 sm:p-6 pt-6 sm:pt-8 cursor-pointer transition-all overflow-visible
              ${selectedPlan === plan.type 
                ? `${getPlanColor(plan.type)} shadow-md border-2` 
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
              }
            `}
          >
            {plan.type === 'lifetime' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-green-600 text-white text-xs font-semibold px-4 py-1.5 rounded-md shadow-sm whitespace-nowrap">
                  RECOMENDADO
                </span>
              </div>
            )}
            {selectedPlan === plan.type && (
              <div className="absolute top-4 right-4">
                <CheckIcon className="h-6 w-6 text-primary-600" />
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{getPlanIcon(plan.type)}</div>
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price % 1 === 0 ? `${plan.price}` : plan.price.toFixed(2)}€
                </span>
                {plan.durationDays && plan.durationDays > 0 && (
                  <span className="text-gray-600 text-sm ml-1">/{plan.durationDays === 365 ? 'año' : 'mes'}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
            </div>

            <ul className="space-y-2 mb-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-none sm:rounded-md border border-gray-200 p-4 sm:p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Método de Pago</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => setSelectedPaymentMethod('paypal')}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
              ${selectedPaymentMethod === 'paypal'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="text-2xl mb-2">🔵</div>
            <span className="text-sm font-medium text-gray-700">PayPal</span>
          </button>
          
          <button
            onClick={() => setSelectedPaymentMethod('card')}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
              ${selectedPaymentMethod === 'card'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="text-2xl mb-2">💳</div>
            <span className="text-sm font-medium text-gray-700">Tarjeta</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {paymentCreated && clientSecret && (selectedPaymentMethod === 'card' || selectedPaymentMethod === 'sepa') && (
        <div className="bg-white rounded-none sm:rounded-xl p-4 sm:p-6 border-2 border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completa tu Pago</h3>
          <StripePayment
            clientSecret={clientSecret}
            paymentMethod={selectedPaymentMethod as 'card' | 'sepa'}
            onSuccess={handleStripeSuccess}
            onError={(err) => setError(err)}
          />
        </div>
      )}

      {!paymentCreated && (
        <div className="max-w-md mx-auto">
          <button
            onClick={handlePayment}
            disabled={loading || !selectedPlan}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium shadow-sm transition-colors"
          >
          {loading ? 'Procesando...' : (() => {
            const planPrice = selectedPlan ? plans.find(p => p.type === selectedPlan)?.price || 0 : 0;
            const formattedPrice = planPrice % 1 === 0 ? planPrice : planPrice.toFixed(2);
            return `Pagar ${formattedPrice}€`;
          })()}
          </button>
        </div>
      )}
    </div>
  );
}

