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

// Middleware para manejar errores de multer
const handleMulterError = (err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB por imagen.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Demasiados archivos. Máximo 10 imágenes.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Campo de archivo inesperado. El campo debe llamarse "images".' });
    }
    return res.status(400).json({ error: 'Error al subir archivos: ' + err.message });
  }
  if (err) {
    if (err.message.includes('Solo se permiten imágenes')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: 'Error al procesar archivos: ' + err.message });
  }
  next();
};

router.get('/', getAllProfiles);
router.get('/my-profiles', authenticate, getMyProfiles);
// Usar uploadMiddleware con manejo de errores integrado
router.post('/', authenticate, (req, res, next) => {
  uploadMiddleware(req, res, (err: any) => {
    if (err) {
      // Multer lanza errores que deben ser manejados
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 5MB por imagen.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Demasiados archivos. Máximo 10 imágenes.' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Campo de archivo inesperado. El campo debe llamarse "images".' });
        }
        return res.status(400).json({ error: 'Error al subir archivos: ' + err.message });
      }
      if (err && err.message && err.message.includes('Solo se permiten imágenes')) {
        return res.status(400).json({ error: err.message });
      }
      // Otros errores
      return res.status(400).json({ error: 'Error al procesar archivos: ' + (err.message || 'Error desconocido') });
    }
    next();
  });
}, createProfile);

export default router;


