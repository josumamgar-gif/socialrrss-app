import { Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Marcar un perfil como descartado
 */
export const discardProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { profileId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!profileId) {
      res.status(400).json({ error: 'ID de perfil requerido' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Convertir profileId a ObjectId
    let profileObjectId: mongoose.Types.ObjectId;
    try {
      profileObjectId = new mongoose.Types.ObjectId(profileId);
    } catch (error) {
      res.status(400).json({ error: 'ID de perfil inválido' });
      return;
    }

    // Agregar el perfil a la lista de descartados si no está ya incluido
    const discardedIds = (user.discardedProfiles || []).map(id => id.toString());
    if (!discardedIds.includes(profileId)) {
      user.discardedProfiles = [...(user.discardedProfiles || []), profileObjectId];
      await user.save();
    }

    res.json({ 
      success: true, 
      discardedProfiles: (user.discardedProfiles || []).map(id => id.toString())
    });
  } catch (error: any) {
    console.error('Error descartando perfil:', error);
    res.status(500).json({ error: 'Error al descartar perfil' });
  }
};

/**
 * Obtener los perfiles descartados del usuario
 */
export const getDiscardedProfiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const user = await User.findById(userId).select('discardedProfiles');
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({ 
      discardedProfiles: (user.discardedProfiles || []).map(id => id.toString())
    });
  } catch (error: any) {
    console.error('Error obteniendo perfiles descartados:', error);
    res.status(500).json({ error: 'Error al obtener perfiles descartados' });
  }
};

/**
 * Marcar el tutorial como completado
 */
export const markTutorialCompleted = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    user.tutorialCompleted = true;
    await user.save();

    res.json({ 
      success: true, 
      tutorialCompleted: user.tutorialCompleted 
    });
  } catch (error: any) {
    console.error('Error marcando tutorial como completado:', error);
    res.status(500).json({ error: 'Error al marcar tutorial como completado' });
  }
};

/**
 * Obtener el estado del tutorial del usuario
 */
export const getTutorialStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const user = await User.findById(userId).select('tutorialCompleted');
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({ 
      tutorialCompleted: user.tutorialCompleted || false 
    });
  } catch (error: any) {
    console.error('Error obteniendo estado del tutorial:', error);
    res.status(500).json({ error: 'Error al obtener estado del tutorial' });
  }
};
