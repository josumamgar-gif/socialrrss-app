'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import AppLogo from '@/components/shared/AppLogo';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const token = getAuthToken();
        if (token) {
          window.location.href = '/principal';
          return;
        }
      }
      setCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-white">
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
          aria-label="Cargando"
        />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex w-full max-w-[min(100%,24rem)] flex-col items-center text-center">
        <AppLogo
          size="xxl"
          showText
          showMark
          showTagline
          showSubline
          align="center"
          className="mb-8 w-full items-center sm:mb-10"
        />

        <h1 className="sr-only">SocialRRSS — inicio</h1>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="min-h-[52px] w-full rounded-2xl bg-neutral-100 py-3.5 text-lg font-semibold text-gray-900 transition active:scale-[0.98] hover:bg-neutral-200/80"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={() => router.push('/register')}
            className="min-h-[52px] w-full rounded-2xl bg-gray-900 py-3.5 text-lg font-semibold text-white transition active:scale-[0.98] hover:bg-gray-800"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
