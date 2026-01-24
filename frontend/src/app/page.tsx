'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth';
import AppLogo from '@/components/shared/AppLogo';

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Pequeño delay para asegurar que el componente esté completamente montado
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Verificar si hay sesión activa antes de mostrar la pantalla de bienvenida
        const token = getAuthToken();
        if (token) {
          // Si hay token, redirigir a la página principal
          window.location.href = '/principal';
          return;
        }
      }
      setCheckingAuth(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading mientras se verifica la autenticación
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <AppLogo size="xl" showText={true} />
        </div>

        {/* Título y descripción */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Bienvenido
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-12">
          Descubre perfiles increíbles y promociona los tuyos
        </p>

        {/* Botones de acción */}
        <div className="space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary-600 text-white py-4 px-6 rounded-xl hover:bg-primary-700 font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => router.push('/register')}
            className="w-full bg-white text-primary-600 border-2 border-primary-600 py-4 px-6 rounded-xl hover:bg-primary-50 font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Crear Cuenta
          </button>
        </div>

        {/* Enlace de prueba */}
        <div className="mt-8">
          <a
            href="/test"
            className="text-sm text-primary-600 hover:text-primary-800 underline"
          >
            Ir a página de prueba
          </a>
        </div>
      </div>
    </div>
  );
}

