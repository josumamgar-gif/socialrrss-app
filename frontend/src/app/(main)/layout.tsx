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

// Icono de martillo y llave cruzados
const WrenchScrewdriverIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    {/* Llave inglesa */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 010-3.586l4.94-4.94a2.548 2.548 0 013.586 0l5.653 4.655M11.42 15.17l-3.03 2.496a2.548 2.548 0 01-3.586 0l-4.94-4.94a2.548 2.548 0 010-3.586l4.94-4.94a2.548 2.548 0 013.586 0l4.94 4.94a2.548 2.548 0 010 3.586l-2.496 3.03" />
    {/* Martillo */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 2.5l3 3M14.5 5.5l-3-3M17.5 5.5l-3 3" />
    <rect x="16" y="1" width="4" height="6" rx="1" />
  </svg>
);

const WrenchScrewdriverIconSolid = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    {/* Llave inglesa */}
    <path d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 010-3.586l4.94-4.94a2.548 2.548 0 013.586 0l5.653 4.655M11.42 15.17l-3.03 2.496a2.548 2.548 0 01-3.586 0l-4.94-4.94a2.548 2.548 0 010-3.586l4.94-4.94a2.548 2.548 0 013.586 0l4.94 4.94a2.548 2.548 0 010 3.586l-2.496 3.03" />
    {/* Martillo */}
    <rect x="16" y="1" width="4" height="6" rx="1" />
    <path d="M14.5 2.5l3 3M14.5 5.5l-3-3M17.5 5.5l-3 3" />
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <WelcomeTutorial />
      
      {/* Pestañas de navegación - Parte superior FIJAS (solo desktop) */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
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
      <main className="flex-1 pt-0 md:pt-16 pb-20 md:pb-20">
        {children}
      </main>

      {/* Navegación móvil - Parte inferior FIJA (solo móvil) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16">
          {/* Promoción - Izquierda */}
          <Link
            href="/promocion"
            onClick={() => {
              if (typeof window !== 'undefined') {
                setPathname('/promocion');
              }
            }}
            className={`
              flex flex-col items-center justify-center flex-1 h-full transition-colors
              ${isActive('/promocion')
                ? 'text-primary-600'
                : 'text-gray-600'
              }
            `}
          >
            <FireIcon className={`h-6 w-6 ${isActive('/promocion') ? 'text-primary-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1">Promoción</span>
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
              flex flex-col items-center justify-center flex-1 h-full transition-colors
              ${isActive('/principal')
                ? 'text-primary-600'
                : 'text-gray-600'
              }
            `}
          >
            {isActive('/principal') ? (
              <RadarIconSolid className="h-6 w-6 text-primary-600" />
            ) : (
              <RadarIcon className="h-6 w-6 text-gray-600" />
            )}
            <span className="text-xs mt-1">Principal</span>
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
              flex flex-col items-center justify-center flex-1 h-full transition-colors
              ${isActive('/ajustes')
                ? 'text-primary-600'
                : 'text-gray-600'
              }
            `}
          >
            {isActive('/ajustes') ? (
              <WrenchScrewdriverIconSolid className="h-6 w-6 text-primary-600" />
            ) : (
              <WrenchScrewdriverIcon className="h-6 w-6 text-gray-600" />
            )}
            <span className="text-xs mt-1">Ajustes</span>
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

