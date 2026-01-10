'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProfileSection() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
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
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!username.trim() || !email.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authAPI.updateProfile(username, email);
      setUser({
        ...user!,
        username: response.user.username,
        email: response.user.email,
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

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 max-w-3xl w-full mx-auto">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de Usuario
          </label>
          {editingProfile ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          ) : (
            <p className="text-gray-900 py-2">{user?.username || 'N/A'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          {editingProfile ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          ) : (
            <p className="text-gray-900 py-2">{user?.email || 'N/A'}</p>
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

      {/* Cerrar sesión */}
      <div className="border-t border-gray-200 pt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

