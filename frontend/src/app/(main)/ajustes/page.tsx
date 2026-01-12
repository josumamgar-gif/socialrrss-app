'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import ProfileSection from '@/components/ajustes/ProfileSection';
import PaymentHistorySection from '@/components/ajustes/PaymentHistorySection';
import PendingPaymentsSection from '@/components/ajustes/PendingPaymentsSection';
import StatisticsSection from '@/components/ajustes/StatisticsSection';
import AutoRenewalSection from '@/components/ajustes/AutoRenewalSection';
import SupportSection from '@/components/ajustes/SupportSection';
import WelcomeTutorial from '@/components/shared/WelcomeTutorial';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

type TabType = 'profile' | 'payments' | 'statistics' | 'settings' | 'support';

export default function AjustesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showTutorial, setShowTutorial] = useState(false);

  const tabs = [
    { id: 'profile' as TabType, name: 'Mi Perfil', icon: '👤' },
    { id: 'payments' as TabType, name: 'Pagos', icon: '💳' },
    { id: 'statistics' as TabType, name: 'Estadísticas', icon: '📊' },
    { id: 'settings' as TabType, name: 'Configuración', icon: '⚙️' },
    { id: 'support' as TabType, name: 'Soporte', icon: '💬' },
  ];

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20 pb-20 sm:pb-24 px-0 sm:px-4">
      {/* Tutorial - se muestra cuando showTutorial es true */}
      {showTutorial && (
        <WelcomeTutorial 
          forceOpen={showTutorial}
          onForceOpenChange={setShowTutorial}
          onClose={() => setShowTutorial(false)}
        />
      )}

      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-6 text-center px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajustes</h1>
          <p className="text-gray-600 mb-4">Gestiona tu cuenta, pagos y configuración</p>
          
          {/* Botón para abrir tutorial */}
          <button
            onClick={handleOpenTutorial}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-semibold transform hover:scale-105"
          >
            <InformationCircleIcon className="h-5 w-5" />
            <span>📚 Ver Tutorial de la App</span>
          </button>
        </div>

        {/* Tabs de navegación */}
        <div className="bg-white rounded-none sm:rounded-lg shadow mb-4 sm:mb-6 overflow-x-auto">
          <div className="flex border-b border-gray-200 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex flex-col items-center justify-center flex-1 py-4 text-sm font-medium transition-colors whitespace-nowrap min-w-0 w-full
                  ${activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-3xl sm:text-4xl mb-1">{tab.icon}</span>
                <span className="text-xs sm:text-sm">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de las tabs */}
        <div className="space-y-6 flex flex-col items-center">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'payments' && (
            <>
              <PendingPaymentsSection />
              <PaymentHistorySection />
            </>
          )}
          {activeTab === 'statistics' && <StatisticsSection />}
          {activeTab === 'settings' && <AutoRenewalSection />}
          {activeTab === 'support' && <SupportSection />}
        </div>

        {/* CTA para promocionar */}
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
      </div>
    </div>
  );
}
