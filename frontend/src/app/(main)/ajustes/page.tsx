'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import ProfileSection from '@/components/ajustes/ProfileSection';
import PaymentHistorySection from '@/components/ajustes/PaymentHistorySection';
import PendingPaymentsSection from '@/components/ajustes/PendingPaymentsSection';
import StatisticsSection from '@/components/ajustes/StatisticsSection';
import AutoRenewalSection from '@/components/ajustes/AutoRenewalSection';
import SupportSection from '@/components/ajustes/SupportSection';
import MyProfilesGallery from '@/components/ajustes/MyProfilesGallery';
import WelcomeTutorial from '@/components/shared/WelcomeTutorial';
import { InformationCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

type MenuType = 'profile' | 'payments' | 'statistics' | 'settings' | 'support' | 'myProfiles' | null;

export default function AjustesPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Ocultar controles del navegador (fullscreen)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hideNavBar = () => {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 100);
      };
      hideNavBar();
      window.addEventListener('resize', hideNavBar);
      window.addEventListener('orientationchange', hideNavBar);
      
      return () => {
        window.removeEventListener('resize', hideNavBar);
        window.removeEventListener('orientationchange', hideNavBar);
      };
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
    { id: 'profile' as MenuType, name: 'Mi Perfil', icon: '👤' },
    { id: 'payments' as MenuType, name: 'Pagos', icon: '💳' },
    { id: 'statistics' as MenuType, name: 'Estadísticas', icon: '📊' },
    { id: 'settings' as MenuType, name: 'Configuración', icon: '⚙️' },
    { id: 'support' as MenuType, name: 'Soporte', icon: '💬' },
    { id: 'myProfiles' as MenuType, name: 'Comprueba tus Perfiles', icon: '📋' },
  ];

  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'profile':
        return <ProfileSection />;
      case 'payments':
        return (
          <>
            <PendingPaymentsSection />
            <PaymentHistorySection />
          </>
        );
      case 'statistics':
        return <StatisticsSection />;
      case 'settings':
        return <AutoRenewalSection />;
      case 'support':
        return <SupportSection />;
      case 'myProfiles':
        return (
          <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Perfiles Contratados</h2>
            <MyProfilesGallery />
          </div>
        );
      default:
        return null;
    }
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

        {/* Contenedor principal con lista y contenido */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4 px-2 sm:px-4">
          
          {/* Lista de botones - Lateral izquierdo (desktop) o arriba (móvil) */}
          <div className="flex-shrink-0 w-full sm:w-64 mb-4 sm:mb-0">
            <div className="bg-white rounded-none sm:rounded-lg shadow space-y-2 p-2">
              {menuItems.map((item) => (
                <button
                  key={item.id || 'item'}
                  onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left
                    ${activeMenu === item.id
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm sm:text-base font-medium">{item.name}</span>
                  </div>
                  <ArrowRightIcon 
                    className={`h-5 w-5 transition-transform duration-200 ${
                      activeMenu === item.id ? 'rotate-90' : ''
                    }`} 
                  />
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

          {/* Contenido del menú seleccionado - Lado derecho */}
          <div className="flex-1 overflow-y-auto">
            {activeMenu ? (
              <div className="space-y-4 sm:space-y-6">
                {renderMenuContent()}
              </div>
            ) : (
              <div className="bg-white rounded-none sm:rounded-lg shadow p-6 sm:p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona una opción</h2>
                  <p className="text-gray-600">
                    Elige una opción del menú lateral para gestionar tu cuenta, ver tus pagos, estadísticas y más.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA para promocionar - Solo cuando no hay menú activo */}
        {!activeMenu && (
          <div className="mt-6 sm:mt-8 bg-primary-600 rounded-none sm:rounded-md shadow-sm border-0 sm:border border-primary-700 p-4 sm:p-6 text-white text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">¡Promociona tu Perfil!</h2>
            <p className="mb-4 opacity-90">
              Lleva tu perfil al siguiente nivel y aumenta tu visibilidad
            </p>
            <Link
              href="/promocion"
              className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Promocionar Perfil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
