import { Response } from 'express';
import { OptionalAuthRequest } from '../middleware/optionalAuth.middleware';
import { PRICING_PLANS, FREE_PROMOTION_PLAN } from '../constants/pricing';
import Promotion from '../models/Promotion';
import Profile from '../models/Profile';

export const getPlans = async (req: OptionalAuthRequest, res: Response): Promise<void> => {
  try {
    // Check if free promotion is still available globally
    const usedPromotionsCount = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: { $in: ['active', 'expired', 'converted'] }
    });

    const isFreePromotionAvailableGlobally = usedPromotionsCount < 100;

    let plansToReturn = [...PRICING_PLANS];
    let isFreePromotionAvailableForUser = false;

    // Si el usuario está autenticado, verificar si ya usó su promoción
    if (req.user) {
      const userId = req.user.userId;
      
      // Verificar si el usuario ya tiene un perfil activo con promoción gratuita
      const existingFreeProfile = await Profile.findOne({ 
        userId, 
        planType: 'free_trial',
        isActive: true 
      });

      // Solo mostrar el plan gratis si:
      // 1. Hay spots disponibles globalmente
      // 2. El usuario NO ha usado su promoción para activar un perfil
      if (isFreePromotionAvailableGlobally && !existingFreeProfile) {
        isFreePromotionAvailableForUser = true;
        plansToReturn = [FREE_PROMOTION_PLAN, ...PRICING_PLANS];
      }
    } else {
      // Si no está autenticado, mostrar el plan gratis si hay disponibilidad global
      if (isFreePromotionAvailableGlobally) {
        isFreePromotionAvailableForUser = true;
        plansToReturn = [FREE_PROMOTION_PLAN, ...PRICING_PLANS];
      }
    }

    res.json({
      plans: plansToReturn,
      freePromotionAvailable: isFreePromotionAvailableForUser,
      remainingFreeSpots: 100, // Mostrar siempre 100 como total disponible
      totalFreeSpots: 100
    });
  } catch (error: any) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ error: 'Error al obtener planes de precios' });
  }
};


