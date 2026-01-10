'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuthToken } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { saveLoginCredentials, getSavedEmail } from '@/lib/cookies';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Cargar email guardado si existe
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      setAuthToken(response.token);
      setUser(response.user);
      
      // Guardar email si está marcado "recordar"
      saveLoginCredentials(email, remember);
      
      if (typeof window !== 'undefined') {
        window.location.href = '/principal';
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      
      // Mensajes de error más descriptivos
      if (err.response) {
        // El servidor respondió con un error
        setError(err.response?.data?.error || `Error ${err.response?.status}: No se pudo iniciar sesión`);
      } else if (err.request) {
        // No se pudo conectar al servidor
        setError('No se pudo conectar al servidor. Por favor, verifica tu conexión o contacta al administrador.');
      } else {
        setError(err.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Lado izquierdo - Branding mejorado (solo en desktop) */}
        <div className="hidden md:block text-center md:text-left">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 rounded-2xl mb-6 shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-white text-3xl font-bold relative">
                <span className="relative z-10">PR</span>
                <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Promoción RRSS
            </h1>
            <p className="text-xl text-gray-700 mb-3 font-medium">
              Tu marca personal, al siguiente nivel 🚀
            </p>
            <p className="text-base text-gray-600 max-w-md leading-relaxed">
              Descubre perfiles increíbles y promociona los tuyos. 
              La plataforma para creadores que quieren destacar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 rounded-lg text-sm font-semibold border border-primary-200 shadow-sm">✨ Descubre</span>
            <span className="px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 rounded-lg text-sm font-semibold border border-primary-200 shadow-sm">🔥 Promociona</span>
            <span className="px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 rounded-lg text-sm font-semibold border border-primary-200 shadow-sm">⭐ Destaca</span>
          </div>
        </div>

        {/* Logo y título mejorado en móvil */}
        <div className="md:hidden text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 via-primary-500 to-purple-600 rounded-xl mb-4 shadow-lg">
            <div className="text-white text-2xl font-bold relative">
              <span className="relative z-10">PR</span>
              <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Promoción RRSS
          </h1>
          <p className="text-sm text-gray-600">
            Tu marca personal, al siguiente nivel 🚀
          </p>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">Accede a tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:text-base text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm text-gray-700">
                Recordar mis datos
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base transition-colors mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

