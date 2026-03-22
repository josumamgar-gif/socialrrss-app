'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { setAuthToken, getAuthToken } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { saveLoginCredentials, getSavedEmail } from '@/lib/cookies';

export default function LoginPage() {
  const router = useRouter();
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
        router.replace('/principal');
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        if (!cancelled) setCheckingAuth(false);
      }
    })();

    return () => { cancelled = true; };
  }, [setUser, router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
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
      router.replace('/principal');
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
    <div className="flex min-h-[100dvh] flex-col bg-surface px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      {/* Back */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-light hover:text-ink transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Bienvenido de vuelta</h1>
            <p className="mt-1.5 text-[15px] text-ink-light">Inicia sesión en tu cuenta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-ink-light">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-muted focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-ink-light">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-muted focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                placeholder="Tu contraseña"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-200"
              />
              <span className="text-[13px] text-ink-light">Recordar mi email</span>
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700 ring-1 ring-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary-600 py-3.5 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Entrando…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink-muted">
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
