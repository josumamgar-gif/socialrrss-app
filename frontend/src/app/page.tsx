'use client';

import { useEffect } from 'react';
import { getAuthToken } from '@/lib/auth';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si hay sesión activa antes de redirigir
      const token = getAuthToken();
      if (token) {
        // Si hay token, redirigir a la página principal
        window.location.href = '/principal';
      } else {
        // Si no hay token, redirigir al login
        window.location.href = '/login';
      }
    }
  }, []);

  return null;
}

