'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';

const NETWORKS = [
  { label: 'Instagram', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
  { label: 'TikTok',    color: 'bg-neutral-900' },
  { label: 'YouTube',   color: 'bg-red-500' },
  { label: 'LinkedIn',  color: 'bg-blue-700' },
  { label: 'X',         color: 'bg-neutral-800' },
  { label: 'Twitch',    color: 'bg-purple-600' },
];

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const token = getAuthToken();
        if (token) { router.replace('/principal'); return; }
      }
      setCheckingAuth(false);
    }, 100);
    return () => clearTimeout(t);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-surface"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Background subtle gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 h-60 w-60 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-60 w-60 rounded-full bg-primary-100/50 blur-2xl" />

      {/* Main content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-primary-600 shadow-[0_8px_30px_rgba(217,119,6,0.35)]">
            <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <line x1="12" y1="7.5" x2="12" y2="2.5" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-[32px] font-black tracking-tight text-ink">
            Social<span className="text-primary-600">RRSS</span>
          </h1>
          <p className="mt-1.5 text-[16px] font-medium text-ink-light">Descubre · Conecta · Crece</p>
        </div>

        {/* Feature pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 max-w-xs">
          {[
            { icon: '👆', text: 'Desliza como Tinder' },
            { icon: '⭐', text: 'Guarda favoritos' },
            { icon: '🏆', text: 'Rankings Top 100' },
            { icon: '📧', text: 'Recibos por email' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-soft ring-1 ring-surface-200/60">
              <span className="text-[13px]">{f.icon}</span>
              <span className="text-[12px] font-medium text-ink-light">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Social network row */}
        <div className="mb-10 flex items-center gap-2">
          {NETWORKS.map((n) => (
            <div
              key={n.label}
              className={`${n.color} h-8 w-8 rounded-xl shadow-soft`}
              title={n.label}
            />
          ))}
        </div>

        {/* CTA buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => router.push('/register')}
            className="w-full rounded-2xl bg-primary-600 py-4 text-[16px] font-bold text-white shadow-[0_4px_20px_rgba(217,119,6,0.35)] transition hover:bg-primary-700 active:scale-[0.98]"
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={() => router.push('/login')}
            className="w-full rounded-2xl bg-white py-4 text-[16px] font-semibold text-ink shadow-soft ring-1 ring-surface-300/60 transition hover:bg-surface-50 active:scale-[0.98]"
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="pb-5 text-center text-[11px] text-ink-muted">
        Al continuar, aceptas nuestros{' '}
        <span className="underline underline-offset-2">términos</span> y{' '}
        <span className="underline underline-offset-2">privacidad</span>
      </p>
    </div>
  );
}
