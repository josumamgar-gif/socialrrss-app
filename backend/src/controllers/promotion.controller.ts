import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Promotion from '../models/Promotion';
import User from '../models/User';
import Profile from '../models/Profile';

export const checkPromotionAvailability = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Count how many users have already used the free promotion
    const usedPromotionsCount = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: { $in: ['active', 'expired', 'converted'] }
    });

    const maxPromotions = 100;
    const isAvailable = usedPromotionsCount < maxPromotions;

    res.json({
      isAvailable,
      remainingSpots: Math.max(0, maxPromotions - usedPromotionsCount),
      totalSpots: maxPromotions,
      usedSpots: usedPromotionsCount
    });
  } catch (error: any) {
    console.error('Error checking promotion availability:', error);
    res.status(500).json({ error: 'Error al verificar disponibilidad de promoción' });
  }
};

export const activateFreePromotion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userId = req.user.userId;

    // Check if user already has a promotion
    const existingPromotion = await Promotion.findOne({ userId });
    if (existingPromotion) {
      res.status(400).json({ error: 'El usuario ya tiene una promoción activa' });
      return;
    }

    // Check availability
    const usedPromotionsCount = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: { $in: ['active', 'expired', 'converted'] }
    });

    if (usedPromotionsCount >= 100) {
      res.status(400).json({ error: 'La promoción gratuita ya no está disponible' });
      return;
    }

    // Calculate end date (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Create promotion record
    const promotion = new Promotion({
      userId,
      type: 'free_trial_30_days',
      status: 'active',
      startDate,
      endDate,
      usageCount: usedPromotionsCount + 1,
      maxUsage: 100,
    });

    await promotion.save();

    // Update user record
    await User.findByIdAndUpdate(userId, {
      isOnFreePromotion: true,
      freePromotionStartDate: startDate,
      freePromotionEndDate: endDate,
    });

    res.json({
      message: 'Promoción gratuita activada exitosamente',
      promotion: {
        type: promotion.type,
        status: promotion.status,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        remainingDays: 30,
      }
    });
  } catch (error: any) {
    console.error('Error activating promotion:', error);
    res.status(500).json({ error: 'Error al activar la promoción' });
  }
};

export const getUserPromotionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userId = req.user.userId;

    // Get user promotion data
    const user = await User.findById(userId).select('isOnFreePromotion freePromotionStartDate freePromotionEndDate');
    const promotion = await Promotion.findOne({ userId });

    if (!user || !promotion) {
      res.json({ hasPromotion: false });
      return;
    }

    // Calculate remaining days
    const now = new Date();
    const endDate = new Date(user.freePromotionEndDate || promotion.endDate);
    const remainingMs = endDate.getTime() - now.getTime();
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

    res.json({
      hasPromotion: user.isOnFreePromotion || false,
      promotion: {
        type: promotion.type,
        status: promotion.status,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        remainingDays,
        isExpired: remainingDays <= 0,
      }
    });
  } catch (error: any) {
    console.error('Error getting user promotion status:', error);
    res.status(500).json({ error: 'Error al obtener estado de promoción' });
  }
};

export const convertExpiredPromotions = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const now = new Date();

    // Find expired promotions that haven't been converted yet
    const expiredPromotions = await Promotion.find({
      status: 'active',
      endDate: { $lt: now }
    }).populate('userId', 'username email');

    const convertedUsers = [];

    for (const promotion of expiredPromotions) {
      try {
        // Update promotion status
        promotion.status = 'expired';
        await promotion.save();

        // Update user status
        await User.findByIdAndUpdate(promotion.userId, {
          isOnFreePromotion: false,
          freePromotionStartDate: null,
          freePromotionEndDate: null,
        });

        // Find and deactivate user's profiles
        await Profile.updateMany(
          { userId: promotion.userId, isActive: true },
          { isActive: false }
        );

        convertedUsers.push({
          userId: promotion.userId,
          username: (promotion.userId as any).username,
          email: (promotion.userId as any).email,
        });

      } catch (error) {
        console.error(`Error converting promotion for user ${promotion.userId}:`, error);
      }
    }

    res.json({
      message: `${convertedUsers.length} promociones expiradas convertidas`,
      convertedUsers,
    });
  } catch (error: any) {
    console.error('Error converting expired promotions:', error);
    res.status(500).json({ error: 'Error al convertir promociones expiradas' });
  }
};

export const getPromotionStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalPromotions = await Promotion.countDocuments({ type: 'free_trial_30_days' });
    const activePromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'active'
    });
    const expiredPromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'expired'
    });
    const convertedPromotions = await Promotion.countDocuments({
      type: 'free_trial_30_days',
      status: 'converted'
    });

    res.json({
      totalPromotions,
      activePromotions,
      expiredPromotions,
      convertedPromotions,
      remainingSpots: Math.max(0, 100 - totalPromotions),
    });
  } catch (error: any) {
    console.error('Error getting promotion stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas de promoción' });
  }
};