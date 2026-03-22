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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600"
          aria-label="Cargando"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-5 py-10 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg flex-col items-center justify-center">
        <AppLogo
          size="xl"
          showText
          showMark
          showTagline
          showSubline
          align="center"
          className="mb-6 w-full max-w-md items-center"
        />

        <h1 className="sr-only">SocialRRSS — inicio</h1>

        <div className="w-full max-w-sm space-y-2">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-full rounded-xl bg-neutral-100 py-2.5 text-[15px] font-medium text-gray-900 transition hover:bg-neutral-200/80"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={() => router.push('/register')}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-[15px] font-medium text-white transition hover:bg-gray-800"
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
