import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

export const register = async (req: any, res: Response): Promise<void> => {
  try {
    const { 
      username, 
      email, 
      password,
      fullName,
      bio,
      age,
      location,
      interests,
      favoriteSocialNetwork
    } = req.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Usuario, email y contraseña son requeridos' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      res.status(400).json({ error: 'El usuario o email ya existe' });
      return;
    }

    // Crear nuevo usuario
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      fullName: fullName || undefined,
      bio: bio || undefined,
      age: age ? parseInt(age) : undefined,
      location: location || undefined,
      interests: interests && Array.isArray(interests) ? interests : undefined,
      favoriteSocialNetwork: favoriteSocialNetwork || undefined,
    });

    await user.save();

    // Generar token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        age: user.age,
        location: user.location,
        interests: user.interests,
        favoriteSocialNetwork: user.favoriteSocialNetwork,
      },
    });
  } catch (error: any) {
    console.error('Error en registro:', error);
    
    if (error.code === 11000) {
      res.status(400).json({ error: 'El usuario o email ya existe' });
      return;
    }

    res.status(500).json({ error: error.message || 'Error al registrar usuario' });
  }
};

export const login = async (req: any, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
    });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message || 'Error al iniciar sesión' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        age: user.age,
        location: user.location,
        interests: user.interests,
        favoriteSocialNetwork: user.favoriteSocialNetwork,
      },
    });
  } catch (error: any) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { username, email, fullName, bio, age, location, interests, favoriteSocialNetwork } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Actualizar campos
    if (username && username !== user.username) {
      // Verificar que el username no esté en uso
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
        return;
      }
      user.username = username;
    }

    if (email && email !== user.email) {
      // Verificar que el email no esté en uso
      const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (existingUser) {
        res.status(400).json({ error: 'El email ya está en uso' });
        return;
      }
      user.email = email.toLowerCase();
    }

    if (fullName !== undefined) user.fullName = fullName || undefined;
    if (bio !== undefined) user.bio = bio || undefined;
    if (age !== undefined) user.age = age ? parseInt(age) : undefined;
    if (location !== undefined) user.location = location || undefined;
    if (interests !== undefined) user.interests = Array.isArray(interests) ? interests : [];
    if (favoriteSocialNetwork !== undefined) user.favoriteSocialNetwork = favoriteSocialNetwork || undefined;

    await user.save();

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        age: user.age,
        location: user.location,
        interests: user.interests,
        favoriteSocialNetwork: user.favoriteSocialNetwork,
      },
    });
  } catch (error: any) {
    console.error('Error actualizando perfil:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'El nombre de usuario o email ya está en uso' });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'La contraseña actual y la nueva contraseña son requeridas' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'La contraseña actual es incorrecta' });
      return;
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error: any) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

