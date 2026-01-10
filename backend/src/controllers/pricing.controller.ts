import { Response, Request } from 'express';
import { PRICING_PLANS } from '../constants/pricing';

export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ plans: PRICING_PLANS });
  } catch (error: any) {
    console.error('Error obteniendo planes:', error);
    res.status(500).json({ error: 'Error al obtener planes de precios' });
  }
};


