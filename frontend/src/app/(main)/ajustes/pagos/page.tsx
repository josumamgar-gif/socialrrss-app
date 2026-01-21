'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentHistorySection from '@/components/ajustes/PaymentHistorySection';
import PendingPaymentsSection from '@/components/ajustes/PendingPaymentsSection';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function PagosPage() {
  const router = useRouter();

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

  const handleBack = () => {
    router.push('/ajustes');
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
      <div className="max-w-6xl mx-auto w-full h-full overflow-y-auto overflow-x-hidden flex flex-col" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        
        {/* Botón Atrás */}
        <div className="mb-4 px-4 flex-shrink-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Atrás</span>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-6">
          <PendingPaymentsSection />
          <PaymentHistorySection />
        </div>
      </div>
    </div>
  );
}
