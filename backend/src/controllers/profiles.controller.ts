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

// Función para mezclar aleatoriamente un array (Fisher-Yates shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getAllProfiles = async (_req: any, res: Response): Promise<void> => {
  try {
    // Obtener todos los perfiles activos (reales y demo)
    const profiles = await Profile.find({ isActive: true })
      .populate({
        path: 'userId',
        select: 'username',
        options: { lean: true },
      })
      .lean(); // Usar lean() para mejor rendimiento

    // Procesar perfiles para manejar el caso de userId demo (null o no encontrado)
    const processedProfiles = profiles.map((profile: any) => {
      // Si el userId es null o no se pudo poblar (perfil demo), usar un objeto por defecto
      if (!profile.userId || profile.userId.toString() === '000000000000000000000000') {
        return {
          ...profile,
          userId: {
            _id: '000000000000000000000000',
            username: 'demo',
          },
        };
      }
      return profile;
    });

    // Mezclar aleatoriamente los perfiles
    const shuffledProfiles = shuffleArray(processedProfiles);

    res.json({ profiles: shuffledProfiles });
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

export const updateAutoRenewal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { profileId } = req.params;
    const { autoRenewal } = req.body;

    if (typeof autoRenewal !== 'boolean') {
      res.status(400).json({ error: 'Valor de autoRenewal inválido' });
      return;
    }

    const profile = await Profile.findOne({
      _id: profileId,
      userId: req.user.userId,
    });

    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado' });
      return;
    }

    profile.autoRenewal = autoRenewal;
    await profile.save();

    res.json({ profile });
  } catch (error: any) {
    console.error('Error actualizando autoRenewal:', error);
    res.status(500).json({ error: 'Error al actualizar la renovación automática' });
  }
};

// Actualizar un perfil de RRSS
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { profileId } = req.params;
    const { profileData, link, socialNetwork } = req.body;
    const files = req.files as Express.Multer.File[];

    const profile = await Profile.findOne({
      _id: profileId,
      userId: req.user.userId,
    });

    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado' });
      return;
    }

    // Parsear profileData de forma segura
    let parsedProfileData: Record<string, any> = {};
    if (profileData && typeof profileData === 'string' && profileData.trim() !== '') {
      try {
        const parsed = JSON.parse(profileData);
        // Limpiar valores inválidos
        const cleaned: Record<string, any> = {};
        Object.keys(parsed).forEach((key) => {
          const value = parsed[key];
          if (value !== null && value !== undefined && value !== '') {
            cleaned[key] = value;
          }
        });
        parsedProfileData = cleaned;
      } catch (parseError) {
        console.error('Error parseando profileData:', parseError);
        parsedProfileData = {};
      }
    } else if (profileData && typeof profileData === 'object' && profileData !== null) {
      parsedProfileData = profileData;
    }

    // Actualizar campos
    if (link) profile.link = link.trim();
    if (socialNetwork) profile.socialNetwork = socialNetwork.trim();
    if (Object.keys(parsedProfileData).length > 0) {
      profile.profileData = { ...profile.profileData, ...parsedProfileData };
    }

    // Actualizar imágenes si se proporcionan nuevas
    if (files && files.length > 0) {
      const imagePaths = files.map((file) => `/uploads/${file.filename}`);
      // Si hay nuevas imágenes, reemplazar las existentes o añadirlas según la lógica
      // Por ahora, reemplazamos todas
      profile.images = imagePaths;
    }

    await profile.save();

    res.json({
      message: 'Perfil actualizado exitosamente',
      profile,
    });
  } catch (error: any) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar el perfil' });
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
    const validNetworks = ['tiktok', 'youtube', 'instagram', 'twitch', 'facebook', 'x', 'linkedin', 'otros'];
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

    // Verificar que los archivos se hayan subido correctamente
    console.log('📁 Archivos recibidos:', {
      filesCount: files ? files.length : 0,
      files: files ? files.map(f => ({
        originalname: f.originalname,
        filename: f.filename,
        mimetype: f.mimetype,
        size: f.size,
        path: f.path
      })) : []
    });

    const images = files && Array.isArray(files) && files.length > 0
      ? files.map((file) => {
          const imagePath = `/uploads/${file.filename}`;
          console.log('💾 Guardando imagen:', {
            originalname: file.originalname,
            filename: file.filename,
            path: imagePath,
            exists: fs.existsSync(file.path)
          });
          return imagePath;
        })
      : [];

    console.log('📦 Datos a guardar:', {
      userId: req.user.userId,
      socialNetwork: socialNetwork.trim(),
      profileDataKeys: Object.keys(parsedProfileData),
      link: link.trim(),
      imagesCount: images.length,
      images: images
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
    console.log('🖼️ Imágenes guardadas en perfil:', profile.images);
    console.log('📦 Perfil completo a devolver:', JSON.stringify(profile.toObject(), null, 2));

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


