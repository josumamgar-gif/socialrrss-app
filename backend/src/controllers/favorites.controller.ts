import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import Profile from '../models/Profile';
import mongoose from 'mongoose';

// Agregar perfil a favoritos
export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userId = req.user.userId;
    const { profileId } = req.body;

    if (!profileId) {
      res.status(400).json({ error: 'ID de perfil requerido' });
      return;
    }

    // Convertir IDs a ObjectId
    const userIdObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const profileIdObjectId = typeof profileId === 'string' ? new mongoose.Types.ObjectId(profileId) : profileId;

    // Verificar que el perfil existe
    const profile = await Profile.findById(profileIdObjectId);
    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado' });
      return;
    }

    // Obtener usuario y agregar favorito si no existe
    const user = await User.findById(userIdObjectId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Inicializar array si no existe
    if (!user.favoriteProfiles) {
      user.favoriteProfiles = [];
    }

    // Verificar si ya está en favoritos
    if (user.favoriteProfiles.some((id) => id.toString() === profileIdObjectId.toString())) {
      res.status(400).json({ error: 'El perfil ya está en favoritos' });
      return;
    }

    // Agregar a favoritos
    user.favoriteProfiles.push(profileIdObjectId);
    await user.save();

    res.json({
      message: 'Perfil agregado a favoritos',
      favoriteProfiles: user.favoriteProfiles,
    });
  } catch (error: any) {
    console.error('Error agregando favorito:', error);
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
};

// Eliminar perfil de favoritos
export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userId = req.user.userId;
    const { profileId } = req.body;

    if (!profileId) {
      res.status(400).json({ error: 'ID de perfil requerido' });
      return;
    }

    // Convertir IDs a ObjectId
    const userIdObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const profileIdObjectId = typeof profileId === 'string' ? new mongoose.Types.ObjectId(profileId) : profileId;

    // Obtener usuario y eliminar favorito
    const user = await User.findById(userIdObjectId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Inicializar array si no existe
    if (!user.favoriteProfiles) {
      user.favoriteProfiles = [];
    }

    // Eliminar de favoritos
    user.favoriteProfiles = user.favoriteProfiles.filter(
      (id) => id.toString() !== profileIdObjectId.toString()
    );
    await user.save();

    res.json({
      message: 'Perfil eliminado de favoritos',
      favoriteProfiles: user.favoriteProfiles,
    });
  } catch (error: any) {
    console.error('Error eliminando favorito:', error);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
};

// Obtener perfiles favoritos del usuario
export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userId = req.user.userId;

    // Convertir userId a ObjectId
    const userIdObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;

    // Obtener usuario con favoritos
    const user = await User.findById(userIdObjectId).populate('favoriteProfiles');
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Obtener perfiles completos
    const favoriteProfileIds = user.favoriteProfiles || [];
    const profiles = await Profile.find({
      _id: { $in: favoriteProfileIds },
    }).sort({ createdAt: -1 });

    res.json({
      profiles,
      count: profiles.length,
    });
  } catch (error: any) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

// Verificar si un perfil está en favoritos
export const checkFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userId = req.user.userId;
    const { profileId } = req.query;

    if (!profileId) {
      res.status(400).json({ error: 'ID de perfil requerido' });
      return;
    }

    // Convertir IDs a ObjectId
    const userIdObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
    const profileIdObjectId = typeof profileId === 'string' ? new mongoose.Types.ObjectId(profileId as string) : profileId;

    // Obtener usuario
    const user = await User.findById(userIdObjectId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar si está en favoritos
    const isFavorite = user.favoriteProfiles?.some(
      (id) => id.toString() === profileIdObjectId.toString()
    ) || false;

    res.json({
      isFavorite,
    });
  } catch (error: any) {
    console.error('Error verificando favorito:', error);
    res.status(500).json({ error: 'Error al verificar favorito' });
  }
};
