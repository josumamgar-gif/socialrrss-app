'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { setAuthToken, getAuthToken } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { validatePasswordStrength, passwordRequirementsMet } from '@/lib/passwordValidation';

export default function RegisterPage() {
  const router = useRouter();
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
        localStorage.setItem('showFreeProfileModal', 'true');
        sessionStorage.clear();
        router.replace('/principal');
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setError(ax.response?.data?.error || 'Error al registrarse');
      setLoading(false);
    }
  };

  const CheckIcon = ({ ok }: { ok: boolean }) => (
    <svg className={`h-3.5 w-3.5 ${ok ? 'text-emerald-500' : 'text-ink-faint'}`} viewBox="0 0 16 16" fill="currentColor">
      {ok
        ? <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
        : <circle cx="8" cy="8" r="3" />
      }
    </svg>
  );

  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      {/* Back */}
      <div className="mb-6">
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
          <div className="mb-7">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Crea tu cuenta</h1>
            <p className="mt-1.5 text-[15px] text-ink-light">Empieza a descubrir y promocionar perfiles</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-[13px] font-medium text-ink-light">
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
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-muted focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                placeholder="tu_usuario"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-ink-light">
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
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-surface-300 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-muted focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                placeholder="Mínimo 8 caracteres"
              />
              <div className="mt-2 flex flex-col gap-1">
                {[
                  { ok: req.length, label: 'Al menos 8 caracteres' },
                  { ok: req.letter, label: 'Una letra' },
                  { ok: req.number, label: 'Un número' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-1.5">
                    <CheckIcon ok={r.ok} />
                    <span className={`text-xs ${r.ok ? 'text-emerald-600' : 'text-ink-muted'}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[13px] font-medium text-ink-light">
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
                className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink-muted focus:border-primary-400 focus:ring-2 focus:ring-primary-100 ${
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? 'border-red-300'
                    : 'border-surface-300'
                }`}
                placeholder="Misma contraseña"
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">Las contraseñas no coinciden.</p>
              )}
            </div>

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
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink-muted">
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
