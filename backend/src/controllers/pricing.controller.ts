import { Response, Request } from 'express';
import { PRICING_PLANS, FREE_PROMOTION_PLAN } from '../constants/pricing';
import Promotion from '../models/Promotion';

export const getPlans = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Check if free promotion is still available
    const usedPromotionsCount = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: { $in: ['active', 'expired', 'converted'] }
    });

    const isFreePromotionAvailable = usedPromotionsCount < 100;

    let plansToReturn = [...PRICING_PLANS];

    // Add free promotion plan if available
    if (isFreePromotionAvailable) {
      plansToReturn = [FREE_PROMOTION_PLAN, ...PRICING_PLANS];
    }

    res.json({
      plans: plansToReturn,
      freePromotionAvailable: isFreePromotionAvailable,
      remainingFreeSpots: Math.max(0, 100 - usedPromotionsCount)
    });
  } catch (error: any) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ error: 'Error al obtener planes de precios' });
  }
};


