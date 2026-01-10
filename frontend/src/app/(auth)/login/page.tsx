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
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Lado izquierdo - Branding minimalista */}
        <div className="hidden md:block text-center md:text-left">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-lg mb-4">
              <span className="text-white text-2xl font-bold">PR</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Promoción RRSS
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Tu marca personal, al siguiente nivel
            </p>
            <p className="text-sm text-gray-500 max-w-md">
              Descubre perfiles increíbles y promociona los tuyos. 
              La plataforma para creadores que quieren destacar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">Descubre</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">Promociona</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">Destaca</span>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-sm text-gray-600">Accede a tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
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
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Recordar mis datos
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
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

