export type PlanType = 'monthly' | 'yearly' | 'lifetime';

export interface PricingPlan {
  type: PlanType;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
  features: string[];
}

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


