export type PlanType = 'monthly' | 'yearly' | 'lifetime' | 'free_trial';

export interface PricingPlan {
  type: PlanType;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
  features: string[];
}

export const FREE_PROMOTION_PLAN: PricingPlan = {
  type: 'free_trial',
  name: 'Prueba Gratuita 30 Días',
  price: 0.0,
  currency: 'EUR',
  durationDays: 30,
  description: 'Prueba gratuita por tiempo limitado',
  features: [
    'Promoción gratuita durante 30 días',
    'Acceso completo a todas las funciones',
    'Soporte por email',
    'Sin compromiso - luego 1€/mes',
  ],
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    type: 'monthly',
    name: 'Plan Mensual',
    price: 1.0,
    currency: 'EUR',
    durationDays: 30,
    description: 'Ideal para probar nuestra plataforma',
    features: [
      'Promoción durante 30 días',
      'Acceso a todas las funciones',
      'Soporte por email',
    ],
  },
  {
    type: 'yearly',
    name: 'Plan Anual',
    price: 10.0,
    currency: 'EUR',
    durationDays: 365,
    description: 'El mejor valor para promoción continua',
    features: [
      'Promoción durante 1 año completo',
      'Acceso a todas las funciones',
      'Soporte prioritario',
      'Ahorra 17% vs plan mensual',
    ],
  },
  {
    type: 'lifetime',
    name: 'Plan Permanente',
    price: 50.0,
    currency: 'EUR',
    durationDays: 0, // 0 significa permanente
    description: 'Promoción permanente sin renovaciones',
    features: [
      'Promoción permanente',
      'Sin renovaciones necesarias',
      'Acceso a todas las funciones',
      'Soporte prioritario',
      'Acceso de por vida',
    ],
  },
];

export function getPlan(planType: PlanType): PricingPlan {
  // Si es free_trial, retornar FREE_PROMOTION_PLAN
  if (planType === 'free_trial') {
    return FREE_PROMOTION_PLAN;
  }
  
  const plan = PRICING_PLANS.find((p) => p.type === planType);
  if (!plan) {
    throw new Error(`Plan no encontrado: ${planType}`);
  }
  return plan;
}

export function calculateExpirationDate(planType: PlanType): Date {
  if (planType === 'lifetime') {
    // Retornar una fecha muy lejana para "permanente"
    return new Date('2099-12-31');
  }

  const plan = getPlan(planType);
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + plan.durationDays);
  return expirationDate;
}


