import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No se proporcionó token de autenticación' });
      return;
    }

    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Token inválido o expirado' });
  }
};

