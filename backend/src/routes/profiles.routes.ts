import express from 'express';
import {
  getAllProfiles,
  getMyProfiles,
  createProfile,
  uploadMiddleware,
} from '../controllers/profiles.controller';
import { authenticate } from '../middleware/auth.middleware';
import multer from 'multer';

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/my-profiles', authenticate, getMyProfiles);

// Usar uploadMiddleware con manejo de errores integrado
router.post('/', authenticate, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      // Multer lanza errores que deben ser manejados
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB por imagen.' });
          return;
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({ error: 'Demasiados archivos. Máximo 3 imágenes.' });
          return;
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          res.status(400).json({ error: 'Campo de archivo inesperado. El campo debe llamarse "images".' });
          return;
        }
        res.status(400).json({ error: 'Error al subir archivos: ' + err.message });
        return;
      }
      if (err && err.message && typeof err.message === 'string' && err.message.includes('Solo se permiten imágenes')) {
        res.status(400).json({ error: err.message });
        return;
      }
      // Otros errores
      res.status(400).json({ error: 'Error al procesar archivos: ' + (err.message || 'Error desconocido') });
      return;
    }
    // Si no hay error, continuar con el siguiente middleware
    next();
  });
}, createProfile);

export default router;


