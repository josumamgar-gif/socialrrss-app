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
import AppBanner from '@/components/shared/AppBanner';
import { useAuthStore } from '@/store/authStore';
import { getAuthToken } from '@/lib/auth';
import { authAPI } from '@/lib/api';

// Icono de radar personalizado (círculos concéntricos con línea de barrido)
const RadarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <line x1="12" y1="12" x2="12" y2="3" strokeLinecap="round" />
    <line x1="12" y1="12" x2="21" y2="12" strokeLinecap="round" />
  </svg>
);

const RadarIconSolid = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fillOpacity="0.1" />
    <circle cx="12" cy="12" r="6" fillOpacity="0.2" />
    <circle cx="12" cy="12" r="3" fillOpacity="0.3" />
    <circle cx="12" cy="12" r="1.5" />
    <line x1="12" y1="12" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Icono de tuerca típica de ajustes
const CogIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CogIconSolid = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

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
      mobileIcon: RadarIcon,
      mobileIconSolid: RadarIconSolid,
    },
    {
      name: 'Promoción',
      href: '/promocion',
      icon: FireIcon,
      iconSolid: FireIconSolid,
      mobileIcon: FireIcon,
      mobileIconSolid: FireIconSolid,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <WelcomeTutorial />
      
      {/* Banner superior */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AppBanner />
      </div>
      
      {/* Pestañas de navegación - Parte superior FIJAS (solo desktop) */}
      <nav className="hidden md:flex fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 w-full">
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
      <main className="flex-1 pt-16 md:pt-28 pb-24 md:pb-20 flex items-center justify-center overflow-hidden" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {children}
      </main>

      {/* Navegación móvil - Parte inferior FIJA (solo móvil) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-20">
          {/* Promoción - Izquierda */}
          <Link
            href="/promocion"
            onClick={() => {
              if (typeof window !== 'undefined') {
                setPathname('/promocion');
              }
            }}
            className={`
              flex flex-col items-center justify-center flex-1 h-full transition-colors py-2
              ${isActive('/promocion')
                ? 'text-primary-600'
                : 'text-gray-600'
              }
            `}
          >
            <FireIcon className={`h-8 w-8 ${isActive('/promocion') ? 'text-primary-600' : 'text-gray-600'}`} />
            <span className="text-sm font-medium mt-1">Promoción</span>
          </Link>

          {/* Principal - Centro con radar */}
          <Link
            href="/principal"
            onClick={() => {
              if (typeof window !== 'undefined') {
                setPathname('/principal');
              }
            }}
            className={`
              flex flex-col items-center justify-center flex-1 h-full transition-colors py-2
              ${isActive('/principal')
                ? 'text-primary-600'
                : 'text-gray-600'
              }
            `}
          >
            {isActive('/principal') ? (
              <RadarIconSolid className="h-8 w-8 text-primary-600" />
            ) : (
              <RadarIcon className="h-8 w-8 text-gray-600" />
            )}
            <span className="text-sm font-medium mt-1">Principal</span>
          </Link>

          {/* Ajustes - Derecha con martillo y llave */}
          <Link
            href="/ajustes"
            onClick={() => {
              if (typeof window !== 'undefined') {
                setPathname('/ajustes');
              }
            }}
            className={`
              flex flex-col items-center justify-center flex-1 h-full transition-colors py-2
              ${isActive('/ajustes')
                ? 'text-primary-600'
                : 'text-gray-600'
              }
            `}
          >
            {isActive('/ajustes') ? (
              <CogIconSolid className="h-8 w-8 text-primary-600" />
            ) : (
              <CogIcon className="h-8 w-8 text-gray-600" />
            )}
            <span className="text-sm font-medium mt-1">Ajustes</span>
          </Link>
        </div>
      </div>

      {/* Botón de ajustes - Parte inferior FIJA (solo desktop) */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 w-full">
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

