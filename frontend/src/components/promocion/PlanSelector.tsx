'use client';

import { useState, useEffect, useRef } from 'react';
import { PricingPlan, PlanType, PaymentMethod } from '@/types';
import { pricingAPI, paymentsAPI } from '@/lib/api';
import { CheckIcon } from '@heroicons/react/24/solid';
import StripePayment from './StripePayment';
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
  const planRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    loadPlans();
    // Si tenemos profile como prop, usarlo directamente
    if (profile) {
      console.log('📸 Perfil recibido como prop:', profile);
      console.log('🖼️ Imágenes del perfil recibido:', profile.images);
      setProfileData(profile);
    } else if (profileId) {
      // Si no, cargar desde el servidor
      loadProfile();
    }
  }, [profileId, profile]);

  // Efecto para centrar el plan recomendado (10€ anual) al cargar
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      // Buscar el plan de 10€ anual (recomendado)
      const recommendedPlan = plans.find(p => p.price === 10 && p.durationDays === 365);
      if (recommendedPlan) {
        setSelectedPlan(recommendedPlan.type);
        // Centrar el plan recomendado después de un delay para asegurar que el DOM esté listo
        setTimeout(() => {
          scrollToPlan(recommendedPlan.type);
        }, 400);
      } else if (plans.length > 0) {
        // Si no hay plan recomendado, seleccionar el primero
        setSelectedPlan(plans[0].type);
        setTimeout(() => {
          scrollToPlan(plans[0].type);
        }, 400);
      }
    }
  }, [plans]);

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
      console.log('🔍 Cargando perfil con ID:', profileId);
      const response = await profilesAPI.getMyProfiles();
      console.log('📋 Perfiles recibidos:', response.profiles);
      const foundProfile = response.profiles.find((p: Profile) => p._id === profileId);
      if (foundProfile) {
        console.log('✅ Perfil encontrado:', foundProfile);
        console.log('🖼️ Imágenes del perfil:', foundProfile.images);
        setProfileData(foundProfile);
      } else {
        console.error('❌ Perfil no encontrado con ID:', profileId);
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
    }
  };

  const loadPlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await pricingAPI.getPlans();
      setPlans(response.plans);
      // No seleccionar automáticamente aquí, se hará en el useEffect que busca el recomendado
    } catch (err: any) {
      setError('Error al cargar los planes');
      console.error(err);
    } finally {
      setLoadingPlans(false);
    }
  };

  // Función para centrar el plan seleccionado
  const scrollToPlan = (planType: PlanType) => {
    const planElement = planRefs.current[planType];
    const carousel = document.getElementById('plans-carousel');
    if (planElement && carousel) {
      const carouselRect = carousel.getBoundingClientRect();
      const elementRect = planElement.getBoundingClientRect();
      const scrollLeft = carousel.scrollLeft + (elementRect.left - carouselRect.left) - (carouselRect.width / 2) + (elementRect.width / 2);
      
      carousel.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Efecto para centrar cuando cambia el plan seleccionado
  useEffect(() => {
    if (selectedPlan) {
      // Pequeño delay para asegurar que el DOM esté actualizado
      setTimeout(() => {
        scrollToPlan(selectedPlan);
      }, 100);
    }
  }, [selectedPlan]);

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
    <div className="h-full flex flex-col max-w-5xl mx-auto px-4 sm:px-6 overflow-hidden">
      <div className="text-center flex-shrink-0 py-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Elige tu Plan de Promoción</h2>
        <p className="text-sm sm:text-base text-gray-600">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>

      {/* Carrusel de planes - Sin scroll vertical */}
      <div className="overflow-x-auto overflow-y-hidden pb-2 pt-6 px-2 flex-shrink-0" id="plans-carousel" style={{ scrollbarWidth: 'thin', maxHeight: '500px' }}>
        <div className="flex gap-4 max-w-full items-center" style={{ scrollSnapType: 'x mandatory' }}>
          {plans.map((plan) => (
            <div
              key={plan.type}
              ref={(el) => {
                planRefs.current[plan.type] = el;
              }}
              onClick={() => setSelectedPlan(plan.type)}
              className={`
                relative border-2 rounded-xl p-5 pt-9 cursor-pointer transition-all overflow-visible flex-shrink-0
                min-w-[300px] max-w-[340px] shadow-lg
                ${selectedPlan === plan.type 
                  ? `${getPlanColor(plan.type)} shadow-xl border-primary-500 scale-105` 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'
                }
              `}
              style={{ scrollSnapAlign: 'center' }}
            >
              {plan.price === 10 && plan.durationDays === 365 && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                    RECOMENDADO
                  </span>
                </div>
              )}
              {plan.price === 50 && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                    ÚNICO
                  </span>
                </div>
              )}
              {selectedPlan === plan.type && (
                <div className="absolute top-3 right-3">
                  <CheckIcon className="h-5 w-5 text-primary-600" />
                </div>
              )}
              
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{getPlanIcon(plan.type)}</div>
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {plan.price % 1 === 0 ? `${plan.price}` : plan.price.toFixed(2)}€
                  </span>
                  {plan.durationDays && plan.durationDays > 0 && (
                    <span className="text-gray-600 text-xs ml-1">/{plan.durationDays === 365 ? 'año' : 'mes'}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">{plan.description}</p>
              </div>

              <ul className="space-y-1.5 mb-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 sm:p-5 max-w-2xl mx-auto flex-shrink-0 mt-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 text-center">Método de Pago</h3>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          <button
            onClick={() => setSelectedPaymentMethod('paypal')}
            className={`
              flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all
              ${selectedPaymentMethod === 'paypal'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="mb-3 flex items-center justify-center bg-white p-3 rounded-lg shadow-sm">
              <svg viewBox="0 0 24 24" className="w-16 h-16">
                <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.337 7.291-6.2 7.291h-2.287c-.524 0-.968.382-1.05.9l-1.12 7.203zm14.146-14.42a13.022 13.022 0 0 0-.44-2.277C20.172 2.988 18.478 2 15.853 2H8.4c-.524 0-.968.382-1.05.9L5.53 19.243h4.357c.524 0 .968-.382 1.05-.9l1.12-7.203c.082-.519.526-.9 1.05-.9h2.287c1.863 0 5.216-2.24 6.2-7.291.03-.15.054-.295.076-.438z"/>
                <path fill="#009CDE" d="M21.222 2.663a13.022 13.022 0 0 0-.44-2.277C20.172 2.988 18.478 2 15.853 2H8.4c-.524 0-.968.382-1.05.9L5.53 19.243h4.357c.524 0 .968-.382 1.05-.9l1.12-7.203c.082-.519.526-.9 1.05-.9h2.287c1.863 0 5.216-2.24 6.2-7.291.03-.15.054-.295.076-.438z"/>
              </svg>
            </div>
            <span className={`text-base font-bold ${selectedPaymentMethod === 'paypal' ? 'text-blue-700' : 'text-blue-600'}`}>
              PayPal
            </span>
          </button>
          
          <button
            onClick={() => setSelectedPaymentMethod('card')}
            className={`
              flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all
              ${selectedPaymentMethod === 'card'
                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="mb-3">
              <svg viewBox="0 0 24 24" className={`w-16 h-16 ${selectedPaymentMethod === 'card' ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
                <circle cx="6" cy="16" r="1.5" fill="currentColor"/>
                <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
              </svg>
            </div>
            <span className={`text-base font-bold ${selectedPaymentMethod === 'card' ? 'text-white' : 'text-gray-700'}`}>
              Tarjeta
            </span>
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
        <div className="max-w-md mx-auto flex-shrink-0 py-4">
          <button
            onClick={handlePayment}
            disabled={loading || !selectedPlan}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-8 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>
                  {(() => {
                    const planPrice = selectedPlan ? plans.find(p => p.type === selectedPlan)?.price || 0 : 0;
                    const formattedPrice = planPrice % 1 === 0 ? planPrice : planPrice.toFixed(2);
                    return `Pagar ${formattedPrice}€`;
                  })()}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

