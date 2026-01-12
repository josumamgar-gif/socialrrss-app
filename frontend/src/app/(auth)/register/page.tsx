'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuthToken, getAuthToken } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';

const INTERESTS_OPTIONS = [
  'Gaming', 'Música', 'Fitness', 'Moda', 'Cocina', 'Viajes', 
  'Tecnología', 'Fotografía', 'Arte', 'Deportes', 'Cine', 'Libros',
  'Mascotas', 'Comedia', 'Educación', 'Negocios'
];

const SOCIAL_NETWORKS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'otros', label: 'Otros' },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    bio: '',
    age: '',
    location: '',
    interests: [] as string[],
    favoriteSocialNetwork: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Verificar si el usuario ya está autenticado y redirigir
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = getAuthToken();
        
        // Si hay token o usuario autenticado, redirigir a principal
        if (token || isAuthenticated || user) {
          // Intentar cargar el usuario si hay token pero no está en el store
          if (token && !user) {
            try {
              const response = await authAPI.getMe();
              setUser(response.user);
            } catch (error) {
              // Si el token es inválido, limpiar y permitir registro
              localStorage.removeItem('token');
            }
          }
          
          // Si hay usuario autenticado, redirigir y reemplazar el historial
          if (user || (token && isAuthenticated)) {
            // Reemplazar la entrada del historial para evitar volver con el botón atrás
            window.history.replaceState(null, '', '/principal');
            window.location.href = '/principal';
            return;
          }
        }
        
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, setUser]);

  // Mostrar loading mientras se verifica la autenticación
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await authAPI.register({
        ...dataToSend,
        age: dataToSend.age ? parseInt(dataToSend.age) : undefined,
        interests: dataToSend.interests.length > 0 ? dataToSend.interests : undefined,
        favoriteSocialNetwork: dataToSend.favoriteSocialNetwork || undefined,
      });
      
      setAuthToken(response.token);
      setUser(response.user);
      
      if (typeof window !== 'undefined') {
        // Asegurarse de que el tutorial se muestre para usuarios nuevos
        // NO establecer tutorialCompleted para que se muestre el tutorial y los demos
        localStorage.removeItem('tutorialCompleted');
        localStorage.removeItem('demoCompleted');
        
        // Reemplazar la entrada del historial para evitar volver al registro con el botón atrás
        window.history.replaceState(null, '', '/principal');
        window.location.href = '/principal';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Crear Cuenta
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">Completa tu perfil para comenzar</p>
          </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Campos requeridos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Usuario * <span className="text-xs text-gray-500 font-normal">(mín. 3)</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    minLength={3}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    placeholder="tu_usuario"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña * <span className="text-xs text-gray-500 font-normal">(mín. 6)</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Confirmar Contraseña *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Información adicional */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                  Información adicional (opcional)
                </p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Nombre Completo
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Biografía
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400 resize-none"
                  placeholder="Cuéntanos sobre ti..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 caracteres
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="age" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Edad
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="13"
                    max="120"
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    placeholder="Tu edad"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    Ubicación
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="favoriteSocialNetwork" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                  Red Social Favorita
                </label>
                <select
                  id="favoriteSocialNetwork"
                  name="favoriteSocialNetwork"
                  value={formData.favoriteSocialNetwork}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base bg-white text-gray-900"
                >
                  <option value="">Selecciona una opción</option>
                  {SOCIAL_NETWORKS.map(network => (
                    <option key={network.value} value={network.value}>
                      {network.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Intereses
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`
                        px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-medium transition-colors
                        ${formData.interests.includes(interest)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {interest} {formData.interests.includes(interest) && '✓'}
                    </button>
                  ))}
                </div>
                {formData.interests.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.interests.length} seleccionado(s)
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base transition-colors mt-3 sm:mt-4"
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
