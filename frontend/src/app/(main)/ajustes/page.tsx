'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import WelcomeTutorial from '@/components/shared/WelcomeTutorial';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function AjustesPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);

  // Ocultar controles del navegador (fullscreen) - Solo una vez al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Solo hacer scroll inicial si estamos en la parte superior
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollPosition <= 1) {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 100);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

  const menuItems = [
    { path: '/ajustes/perfil', name: 'Mi Perfil', icon: '👤' },
    { path: '/ajustes/pagos', name: 'Pagos', icon: '💳' },
    { path: '/ajustes/estadisticas', name: 'Estadísticas', icon: '📊' },
    { path: '/ajustes/configuracion', name: 'Configuración', icon: '⚙️' },
    { path: '/ajustes/soporte', name: 'Soporte', icon: '💬' },
    { path: '/ajustes/perfiles', name: 'Comprueba tus Perfiles', icon: '📋' },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div 
      className="fixed inset-0 bg-white px-0 sm:px-4" 
      style={{ 
        height: '-webkit-fill-available',
        width: '100vw', 
        touchAction: 'pan-y', 
        overflow: 'hidden', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      } as React.CSSProperties}
    >
      {/* Tutorial Modal */}
      {showTutorial && (
        <WelcomeTutorial 
          forceOpen={showTutorial}
          onForceOpenChange={setShowTutorial}
          onClose={() => setShowTutorial(false)}
        />
      )}

      <div className="max-w-6xl mx-auto w-full h-full overflow-y-auto overflow-x-hidden flex flex-col" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        
        {/* Header */}
        <div className="mb-6 text-center px-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajustes</h1>
          <p className="text-gray-600 mb-4">Gestiona tu cuenta, pagos y configuración</p>
        </div>

        {/* Lista de botones */}
        <div className="flex-1 flex justify-center items-start px-2 sm:px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-none sm:rounded-lg shadow space-y-2 p-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm sm:text-base font-medium">{item.name}</span>
                  </div>
                  <svg 
                    className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {/* Separador */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Botón Tutorial */}
              <button
                onClick={handleOpenTutorial}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-all duration-200 text-left"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span className="text-sm sm:text-base">📚 Tutorial</span>
              </button>

              {/* Botón Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-all duration-200 text-left"
              >
                <span className="text-2xl">🚪</span>
                <span className="text-sm sm:text-base">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
