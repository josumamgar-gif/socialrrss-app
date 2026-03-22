'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { setAuthToken, getAuthToken } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import AppLogo from '@/components/shared/AppLogo';
import { validatePasswordStrength, passwordRequirementsMet } from '@/lib/passwordValidation';

const inputClass =
  'w-full rounded-xl border-0 bg-neutral-100 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-500/15 sm:text-base';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);

  const req = passwordRequirementsMet(password);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (typeof window === 'undefined') return;

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

    if (username.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      setError(strength.message || 'Contraseña no válida.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setAuthToken(response.token);
      setUser(response.user);

      if (typeof window !== 'undefined') {
        localStorage.removeItem('demoCompleted');
        localStorage.removeItem('demosExhausted');
        localStorage.removeItem('tutorialCompleted');
        sessionStorage.clear();

        setTimeout(() => {
          window.location.href = '/principal';
        }, 100);
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error || 'Error al registrarse');
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
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                className={inputClass}
                placeholder="tu_usuario"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
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
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Mínimo 8 caracteres"
              />
              <ul className="mt-1.5 space-y-0.5 text-xs text-gray-500">
                <li className={req.length ? 'text-emerald-600' : ''}>
                  {req.length ? '✓' : '·'} Al menos 8 caracteres
                </li>
                <li className={req.letter ? 'text-emerald-600' : ''}>
                  {req.letter ? '✓' : '·'} Una letra
                </li>
                <li className={req.number ? 'text-emerald-600' : ''}>
                  {req.number ? '✓' : '·'} Un número
                </li>
              </ul>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                Repetir contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`${inputClass} ${
                  confirmPassword.length > 0 && password !== confirmPassword ? 'ring-2 ring-red-500/20' : ''
                }`}
                placeholder="Misma contraseña"
              />
              {confirmPassword.length > 0 && password !== confirmPassword ? (
                <p className="mt-1.5 text-xs text-red-600">Las contraseñas no coinciden.</p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 sm:text-base"
            >
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
