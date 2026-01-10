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

    const { socialNetwork, profileData, link } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!socialNetwork || !link) {
      res.status(400).json({ error: 'Red social y enlace son requeridos' });
      return;
    }

    const images = files
      ? files.map((file) => `/uploads/${file.filename}`)
      : [];

    const profile = new Profile({
      userId: req.user.userId,
      socialNetwork,
      profileData: profileData ? JSON.parse(profileData) : {},
      link,
      images,
      isActive: false,
      isPaid: false,
    });

    await profile.save();

    res.status(201).json({
      message: 'Perfil creado exitosamente',
      profile,
    });
  } catch (error: any) {
    console.error('Error creando perfil:', error);
    res.status(500).json({ error: error.message || 'Error al crear perfil' });
  }
};

export const uploadMiddleware = upload.array('images', 10);


