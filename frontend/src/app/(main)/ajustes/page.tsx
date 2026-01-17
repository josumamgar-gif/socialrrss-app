'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import ProfileSection from '@/components/ajustes/ProfileSection';
import PaymentHistorySection from '@/components/ajustes/PaymentHistorySection';
import PendingPaymentsSection from '@/components/ajustes/PendingPaymentsSection';
import StatisticsSection from '@/components/ajustes/StatisticsSection';
import AutoRenewalSection from '@/components/ajustes/AutoRenewalSection';
import SupportSection from '@/components/ajustes/SupportSection';
import WelcomeTutorial from '@/components/shared/WelcomeTutorial';

type TabType = 'profile' | 'payments' | 'statistics' | 'settings' | 'support';

interface Tab {
  id: TabType;
  name: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'profile', name: 'Mi Perfil', icon: '👤' },
  { id: 'payments', name: 'Pagos', icon: '💳' },
  { id: 'statistics', name: 'Estadísticas', icon: '📊' },
  { id: 'settings', name: 'Configuración', icon: '⚙️' },
  { id: 'support', name: 'Soporte', icon: '💬' },
];

export default function AjustesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showTutorial, setShowTutorial] = useState(false);

  // Ocultar controles del navegador (fullscreen) - Optimizado para móvil
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hideNavBar = () => {
        setTimeout(() => window.scrollTo(0, 1), 100);
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

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
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
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-white" 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        touchAction: 'pan-y', 
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0 
      }}
    >
      {/* Tutorial Modal */}
      {showTutorial && (
        <WelcomeTutorial 
          forceOpen={showTutorial}
          onForceOpenChange={setShowTutorial}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* Main Container - Optimizado para móvil */}
      <div className="max-w-6xl mx-auto w-full h-full overflow-y-auto overflow-x-hidden flex flex-col px-2 sm:px-4 py-3 sm:py-6">
        
        {/* Header - Optimizado para móvil */}
        <div className="mb-4 sm:mb-6 text-center px-2 flex-shrink-0 pt-2 sm:pt-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Ajustes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Gestiona tu cuenta, pagos y configuración
          </p>
          
          {/* Botón Tutorial - Más grande en móvil */}
          <button
            onClick={handleOpenTutorial}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl sm:rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-sm font-semibold transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            aria-label="Ver Tutorial de la App"
          >
            <InformationCircleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm sm:text-sm">📚 Ver Tutorial</span>
          </button>
        </div>

        {/* Tabs Navigation - Optimizado para móvil con mejor tamaño */}
        <div className="bg-white rounded-lg sm:rounded-lg shadow-md mb-4 sm:mb-6 overflow-hidden sticky top-0 z-10">
          <div className="flex border-b border-gray-200 w-full">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`
                  flex flex-col items-center justify-center flex-1 py-3 sm:py-4 px-1 sm:px-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-0
                  ${activeTab === tab.id
                    ? 'text-primary-600 border-b-3 border-primary-600 bg-primary-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
                  }
                `}
                style={{
                  borderBottomWidth: activeTab === tab.id ? '3px' : '0px',
                }}
                aria-label={tab.name}
              >
                <span className="text-2xl sm:text-3xl md:text-4xl mb-1 leading-none">
                  {tab.icon}
                </span>
                <span className="text-[10px] sm:text-xs font-medium leading-tight">
                  {tab.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - Optimizado para móvil */}
        <div className="flex-1 flex flex-col items-center w-full space-y-4 sm:space-y-6 pb-4 sm:pb-6">
          {renderTabContent()}
        </div>

        {/* CTA Promocionar - Optimizado para móvil */}
        <div className="mt-4 sm:mt-6 bg-primary-600 rounded-lg sm:rounded-md shadow-sm border-0 sm:border border-primary-700 p-4 sm:p-6 text-white text-center max-w-2xl mx-auto w-full flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            ¡Promociona tu Perfil!
          </h2>
          <p className="text-sm sm:text-base mb-4 opacity-90">
            Lleva tu perfil al siguiente nivel y aumenta tu visibilidad
          </p>
          <Link
            href="/promocion"
            className="inline-block bg-white text-primary-600 px-6 py-3 sm:py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Promocionar Perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
