'use client';

import { useAuthStore } from '@/store/authStore';
import AppLogo from './AppLogo';

export default function AppBanner() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre de la app */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <AppLogo className="w-full h-full text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-lg sm:text-xl leading-tight">
                Promoción RRSS
              </h1>
              <p className="text-primary-100 text-xs sm:text-sm hidden sm:block">
                Promociona tus redes sociales
              </p>
            </div>
          </div>

          {/* Información del usuario */}
          {user && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white font-medium text-sm">
                  {user.username}
                </span>
                <span className="text-primary-100 text-xs">
                  {user.email}
                </span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
