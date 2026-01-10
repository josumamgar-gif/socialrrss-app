'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  FireIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  FireIcon as FireIconSolid 
} from '@heroicons/react/24/solid';
import WelcomeTutorial from '@/components/shared/WelcomeTutorial';
import { useAuthStore } from '@/store/authStore';
import { getAuthToken } from '@/lib/auth';
import { authAPI } from '@/lib/api';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState('');
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
      
      // Inicializar sesión desde el token si existe (sin bloquear la carga)
      const token = getAuthToken();
      if (token && !isAuthenticated) {
        // Cargar usuario en background sin bloquear
        authAPI.getMe()
          .then((response) => {
            setUser(response.user);
          })
          .catch((error) => {
            // Si el token es inválido, limpiar silenciosamente
            console.error('Error verificando sesión:', error);
            localStorage.removeItem('token');
          });
      }
    }
  }, [setUser, isAuthenticated]);

  const tabs = [
    {
      name: 'Principal',
      href: '/principal',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Promoción',
      href: '/promocion',
      icon: FireIcon,
      iconSolid: FireIconSolid,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WelcomeTutorial />
      
      {/* Pestañas de navegación - Parte superior FIJAS */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-1 md:space-x-2">
            {tabs.map((tab) => {
              const Icon = isActive(tab.href) ? tab.iconSolid : tab.icon;
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      setPathname(tab.href);
                    }
                  }}
                  className={`
                    flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors
                    ${isActive(tab.href)
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-1 pt-16 pb-20">
        {children}
      </main>

      {/* Botón de ajustes - Parte inferior FIJA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/ajustes"
            onClick={() => {
              if (typeof window !== 'undefined') {
                setPathname('/ajustes');
              }
            }}
            className={`
              flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors
              ${isActive('/ajustes')
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Ajustes
          </Link>
        </div>
      </div>
    </div>
  );
}

