import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

export interface OptionalAuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    email: string;
  };
}

// Middleware opcional: si hay token, lo valida y añade user, si no, continúa sin error
export const optionalAuthenticate = async (
  req: OptionalAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      // No hay token, continuar sin autenticación
      return next();
    }

    const decoded = verifyToken(token);
    
    // Obtener email del usuario
    const user = await User.findById(decoded.userId);
    
    if (user) {
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: user.email,
      };
    }

    next();
  } catch (error: any) {
    // Si el token es inválido, continuar sin autenticación
    next();
  }
};
