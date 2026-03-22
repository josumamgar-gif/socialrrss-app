'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuthToken, getAuthToken } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { saveLoginCredentials, getSavedEmail } from '@/lib/cookies';
import AppLogo from '@/components/shared/AppLogo';

const inputClass =
  'w-full rounded-xl border-0 bg-neutral-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-500/15 sm:text-base';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (typeof window === 'undefined') return;

      const saved = getSavedEmail();
      if (saved) {
        setEmail(saved);
        setRemember(true);
      }

      const token = getAuthToken();
      if (!token) {
        if (!cancelled) setCheckingAuth(false);
        return;
      }

      try {
        const { user } = await authAPI.getMe();
        if (cancelled) return;
        setUser(user);
        window.history.replaceState(null, '', '/principal');
        window.location.href = '/principal';
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      setAuthToken(response.token);
      setUser(response.user);
      saveLoginCredentials(email, remember);
      window.history.replaceState(null, '', '/principal');
      window.location.href = '/principal';
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string }; status?: number }; request?: unknown };
      if (ax.response?.data?.error) {
        setError(ax.response.data.error);
      } else if (ax.response) {
        setError('No se pudo iniciar sesión.');
      } else if (ax.request) {
        setError('No se pudo conectar con el servidor.');
      } else {
        setError('Error al iniciar sesión.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-5xl items-start gap-6 md:grid-cols-2 md:gap-10">
        <div className="hidden md:block">
          <AppLogo
            size="xl"
            showText
            showMark
            showTagline
            showSubline
            className="items-start"
          />
        </div>

        <div className="mb-4 md:hidden">
          <AppLogo size="lg" showText showMark showTagline align="center" className="items-center" />
        </div>

        <div className="mx-auto w-full max-w-[400px]">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Tu contraseña"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/30"
              />
              <label htmlFor="remember" className="ml-2.5 text-sm text-gray-600">
                Recordar mi email
              </label>
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 sm:text-base"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
