'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const INTERESTS_OPTIONS = [
  'Gaming', 'Música', 'Fitness', 'Moda', 'Cocina', 'Viajes',
  'Tecnología', 'Fotografía', 'Arte', 'Deportes', 'Cine', 'Libros',
  'Mascotas', 'Comedia', 'Educación', 'Negocios'
];

const SOCIAL_NETWORKS = [
  { value: '', label: 'Ninguna' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'otros', label: 'Otros' },
];

export default function ProfileSection() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [location, setLocation] = useState(user?.location || '');
  const [interests, setInterests] = useState<string[]>(user?.interests || []);
  const [favoriteSocialNetwork, setFavoriteSocialNetwork] = useState(user?.favoriteSocialNetwork || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setAge(user.age?.toString() || '');
      setLocation(user.location || '');
      setInterests(user.interests || []);
      setFavoriteSocialNetwork(user.favoriteSocialNetwork || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!username.trim() || !email.trim()) {
      setError('Usuario y email son requeridos');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authAPI.updateProfile({
        username,
        email,
        fullName: fullName.trim() || undefined,
        bio: bio.trim() || undefined,
        age: age ? parseInt(age) : undefined,
        location: location.trim() || undefined,
        interests: interests.length > 0 ? interests : undefined,
        favoriteSocialNetwork: favoriteSocialNetwork || undefined,
      });
      setUser({
        ...user!,
        ...response.user,
      });
      setSuccess('Perfil actualizado exitosamente');
      setEditingProfile(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setSuccess('Contraseña cambiada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl w-full mx-auto">

      {/* Información de Cuenta */}
      <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Información de Cuenta</h2>
          {!editingProfile && (
            <button
              onClick={() => setEditingProfile(true)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Editar
            </button>
          )}
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario *
            </label>
            {editingProfile ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
                required
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.username || 'N/A'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            {editingProfile ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
                required
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.email || 'N/A'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo
          </label>
          {editingProfile ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              disabled={loading}
              placeholder="Tu nombre completo"
            />
          ) : (
            <p className="text-gray-900 py-2">{user?.fullName || 'No especificado'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biografía
          </label>
          {editingProfile ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 resize-none"
              rows={3}
              disabled={loading}
              placeholder="Cuéntanos sobre ti..."
              maxLength={500}
            />
          ) : (
            <p className="text-gray-900 py-2">{user?.bio || 'Sin biografía'}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Edad
            </label>
            {editingProfile ? (
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
                min="13"
                max="120"
                placeholder="Tu edad"
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.age ? `${user.age} años` : 'No especificado'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            {editingProfile ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
                placeholder="Ciudad, País"
              />
            ) : (
              <p className="text-gray-900 py-2">{user?.location || 'No especificado'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intereses
          </label>
          {editingProfile ? (
            <div className="flex flex-wrap gap-2">
              {INTERESTS_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => {
                    if (interests.includes(interest)) {
                      setInterests(interests.filter(i => i !== interest));
                    } else {
                      setInterests([...interests, interest]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    interests.includes(interest)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No has seleccionado intereses</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Red Social Favorita
          </label>
          {editingProfile ? (
            <select
              value={favoriteSocialNetwork}
              onChange={(e) => setFavoriteSocialNetwork(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
              disabled={loading}
            >
              {SOCIAL_NETWORKS.map((network) => (
                <option key={network.value} value={network.value}>
                  {network.label}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-900 py-2">
              {user?.favoriteSocialNetwork 
                ? SOCIAL_NETWORKS.find(n => n.value === user.favoriteSocialNetwork)?.label || user.favoriteSocialNetwork
                : 'No especificada'}
            </p>
          )}
        </div>

        {editingProfile && (
          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
            >
              <CheckIcon className="h-5 w-5" />
              <span>Guardar</span>
            </button>
            <button
              onClick={() => {
                setEditingProfile(false);
                setError(null);
                setSuccess(null);
                if (user) {
                  setUsername(user.username || '');
                  setEmail(user.email || '');
                  setFullName(user.fullName || '');
                  setBio(user.bio || '');
                  setAge(user.age?.toString() || '');
                  setLocation(user.location || '');
                  setInterests(user.interests || []);
                  setFavoriteSocialNetwork(user.favoriteSocialNetwork || '');
                }
              }}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
            >
              <XMarkIcon className="h-5 w-5" />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>

      {/* Cambio de contraseña */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contraseña</h3>
          {!changingPassword && (
            <button
              onClick={() => setChangingPassword(true)}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Cambiar Contraseña
            </button>
          )}
        </div>

        {changingPassword && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                disabled={loading}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                <CheckIcon className="h-5 w-5" />
                <span>Cambiar Contraseña</span>
              </button>
              <button
                onClick={() => {
                  setChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setError(null);
                  setSuccess(null);
                }}
                disabled={loading}
                className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      </div>
    </div>
  );
}

