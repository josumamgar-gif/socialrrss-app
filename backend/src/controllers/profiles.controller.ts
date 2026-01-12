import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Profile from '../models/Profile';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configurar multer para subir imágenes
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'images-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
    }
  },
});

export const getAllProfiles = async (_req: any, res: Response): Promise<void> => {
  try {
    const profiles = await Profile.find({ isActive: true })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json({ profiles });
  } catch (error: any) {
    console.error('Error obteniendo perfiles:', error);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

export const getMyProfiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const profiles = await Profile.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({ profiles });
  } catch (error: any) {
    console.error('Error obteniendo mis perfiles:', error);
    res.status(500).json({ error: 'Error al obtener perfiles' });
  }
};

export const createProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    // Log para debugging
    console.log('📝 Datos recibidos:', {
      body: req.body,
      files: req.files ? (req.files as Express.Multer.File[]).map(f => f.originalname) : 'No files',
    });

    const { socialNetwork, profileData, link } = req.body;
    const files = req.files as Express.Multer.File[];

    // Validación básica
    if (!socialNetwork || typeof socialNetwork !== 'string') {
      res.status(400).json({ error: 'Red social es requerida' });
      return;
    }

    if (!link || typeof link !== 'string' || !link.trim()) {
      res.status(400).json({ error: 'El enlace del perfil es requerido y debe ser una URL válida' });
      return;
    }

    // Validar formato de URL básico
    try {
      new URL(link.trim());
    } catch {
      res.status(400).json({ error: 'El enlace debe ser una URL válida (ejemplo: https://...)' });
      return;
    }

    // Validar que la red social sea válida
    const validNetworks = ['tiktok', 'youtube', 'instagram', 'twitch', 'facebook', 'x', 'otros'];
    if (!validNetworks.includes(socialNetwork.trim())) {
      res.status(400).json({ error: `Red social no válida. Redes válidas: ${validNetworks.join(', ')}` });
      return;
    }

    // Parsear profileData de forma segura
    let parsedProfileData: Record<string, any> = {};
    if (profileData && typeof profileData === 'string' && profileData.trim() !== '') {
      try {
        const parsed = JSON.parse(profileData);
        // Limpiar campos vacíos pero mantener números válidos (incluyendo 0)
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const cleaned: Record<string, any> = {};
          Object.keys(parsed).forEach(key => {
            const value = parsed[key];
            // Mantener valores válidos: strings no vacíos, números válidos (incluyendo 0), booleanos, objetos, arrays
            if (value !== undefined && value !== null) {
              if (typeof value === 'string' && value.trim() !== '') {
                cleaned[key] = value;
              } else if (typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0) {
                cleaned[key] = value;
              } else if (typeof value === 'boolean' || (typeof value === 'object' && value !== null) || Array.isArray(value)) {
                cleaned[key] = value;
              }
            }
          });
          parsedProfileData = cleaned;
        } else if (typeof parsed === 'object' && parsed !== null) {
          parsedProfileData = parsed;
        }
      } catch (parseError: any) {
        console.error('Error parseando profileData:', parseError);
        console.error('profileData recibido:', profileData);
        res.status(400).json({ error: 'Error en los datos del perfil: ' + (parseError.message || 'JSON inválido') });
        return;
      }
    } else if (profileData && typeof profileData === 'object' && profileData !== null) {
      // Si ya es un objeto, usarlo directamente
      parsedProfileData = profileData;
    }
    // Si profileData está vacío o es undefined, parsedProfileData será un objeto vacío {}

    const images = files && Array.isArray(files) && files.length > 0
      ? files.map((file) => `/uploads/${file.filename}`)
      : [];

    console.log('📦 Datos a guardar:', {
      userId: req.user.userId,
      socialNetwork: socialNetwork.trim(),
      profileDataKeys: Object.keys(parsedProfileData),
      link: link.trim(),
      imagesCount: images.length,
    });

    const profile = new Profile({
      userId: req.user.userId,
      socialNetwork: socialNetwork.trim(),
      profileData: parsedProfileData,
      link: link.trim(),
      images,
      isActive: false,
      isPaid: false,
    });

    await profile.save();

    console.log('✅ Perfil creado exitosamente:', profile._id);

    res.status(201).json({
      message: 'Perfil creado exitosamente',
      profile,
    });
  } catch (error: any) {
    console.error('Error creando perfil:', error);
    
    // Manejar errores específicos de MongoDB
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: 'Datos de perfil inválidos: ' + Object.values(error.errors).map((e: any) => e.message).join(', ') });
      return;
    }
    
    if (error.code === 11000) {
      res.status(400).json({ error: 'Ya existe un perfil con estos datos' });
      return;
    }

    res.status(500).json({ error: error.message || 'Error al crear perfil' });
  }
};

export const uploadMiddleware = upload.array('images', 3);


