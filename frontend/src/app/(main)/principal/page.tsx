'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import ProfileCard from '@/components/principal/ProfileCard';
import ProfileDetail from '@/components/principal/ProfileDetail';
import { demoProfiles } from '@/data/demoProfiles';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';

export default function PrincipalPage() {
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoInteractions, setDemoInteractions] = useState(0);
  const [hasCompletedDemo, setHasCompletedDemo] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<'all' | SocialNetwork>('all');
  const [cornerEffects, setCornerEffects] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | 'back' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [backUsed, setBackUsed] = useState(false);

  // Opciones del filtro
  const networkOptions: { value: 'all' | SocialNetwork; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'x', label: 'X (Twitter)' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'otros', label: 'Otras Redes' },
  ];

  // Filtrar perfiles por red social
  const filteredProfiles = useMemo(() => {
    if (selectedNetworkFilter === 'all') {
      return profiles;
    }
    return profiles.filter((p) => p.socialNetwork === selectedNetworkFilter);
  }, [profiles, selectedNetworkFilter]);

  // Cargar perfiles
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await profilesAPI.getAll();
        
        if (!mounted) return;

        const userId = user?.id || 'anonymous';
        const key = `viewedProfiles_${userId}`;
        const viewedData = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];
        
        // Separar perfiles demo de los reales
        // Los perfiles demo tienen userId.username === 'demo' o userId._id === '000000000000000000000000'
        const allProfiles = response.profiles || [];
        const demoProfilesFromDB = allProfiles.filter((p: Profile) => {
          const userIdObj = p.userId as any;
          return userIdObj?.username === 'demo' || userIdObj?._id === '000000000000000000000000';
        });
        const realProfiles = allProfiles.filter((p: Profile) => {
          const userIdObj = p.userId as any;
          return userIdObj?.username !== 'demo' && userIdObj?._id !== '000000000000000000000000';
        });
        
        // Filtrar perfiles ya vistos (solo para perfiles reales)
        const unseenRealProfiles = realProfiles.filter((p: Profile) => !viewedProfiles.includes(p._id));
        
        const tutorialCompleted = typeof window !== 'undefined' ? 
          localStorage.getItem('tutorialCompleted') === 'true' : false;
        
        let profilesToShow: Profile[] = [];
        if (!tutorialCompleted) {
          // Mostrar todos los perfiles demo + reales no vistos
          profilesToShow = [...demoProfilesFromDB, ...unseenRealProfiles];
        } else {
          // Mezclar perfiles demo con reales (ya vienen mezclados del backend)
          profilesToShow = [...demoProfilesFromDB, ...unseenRealProfiles];
        }
        
        setProfiles(profilesToShow);

        // Verificar demo completado
        const completed = typeof window !== 'undefined' ? 
          localStorage.getItem('demoCompleted') : null;
        setHasCompletedDemo(completed === 'true');
      } catch (error) {
        console.error('Error cargando perfiles:', error);
        if (mounted) {
          const tutorialCompleted = typeof window !== 'undefined' ? 
            localStorage.getItem('tutorialCompleted') === 'true' : false;
          
          if (!tutorialCompleted) {
            setProfiles(demoProfiles);
          } else {
            setProfiles([]);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Resetear índice cuando cambia el filtro
  useEffect(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, [selectedNetworkFilter]);

  // Ajustar índice si es necesario
  useEffect(() => {
    if (filteredProfiles.length > 0 && currentIndex >= filteredProfiles.length) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [filteredProfiles.length, currentIndex]);

  // Marcar perfil como visto
  const markProfileAsViewed = (profileId: string) => {
    if (typeof window === 'undefined') return;
    if (profileId.startsWith('demo-')) return;
    
    const userId = user?.id || 'anonymous';
    const key = `viewedProfiles_${userId}`;
    const viewedData = localStorage.getItem(key);
    const viewed = viewedData ? JSON.parse(viewedData) : [];
    
    if (!viewed.includes(profileId)) {
      viewed.push(profileId);
      localStorage.setItem(key, JSON.stringify(viewed));
    }
  };

  // Handlers simples
  const handleSwipeLeft = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) return;
    
    markProfileAsViewed(currentProfile._id);
    setLastSwipeDirection('left');
    
    if (currentProfile._id.startsWith('demo-')) {
      const newInteractions = demoInteractions + 1;
      setDemoInteractions(newInteractions);
      if (newInteractions >= 3) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('demoCompleted', 'true');
        }
        setHasCompletedDemo(true);
      }
    }
    
    if (currentIndex < filteredProfiles.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Recargar perfiles
      window.location.reload();
    }
  };

  const handleSwipeRight = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) return;
    
    markProfileAsViewed(currentProfile._id);
    setLastSwipeDirection('right');
    
    if (currentProfile._id.startsWith('demo-')) {
      const newInteractions = demoInteractions + 1;
      setDemoInteractions(newInteractions);
      if (newInteractions >= 3) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('demoCompleted', 'true');
        }
        setHasCompletedDemo(true);
      }
    }
    
    if (currentIndex < filteredProfiles.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Recargar perfiles
      window.location.reload();
    }
  };

  const handleSwipeUp = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) return;
    
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      const newInteractions = demoInteractions + 1;
      setDemoInteractions(newInteractions);
      if (newInteractions >= 3) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('demoCompleted', 'true');
        }
        setHasCompletedDemo(true);
      }
    }
  };

  const handleGoBack = () => {
    if (history.length > 0 && !backUsed) {
      setLastSwipeDirection('back');
      setBackUsed(true);
      const previousIndex = history[history.length - 1];
      setCurrentIndex(previousIndex);
      setHistory(history.slice(0, -1));
    }
  };

  // Resetear backUsed cuando cambia el índice del perfil
  useEffect(() => {
    setBackUsed(false);
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="w-full bg-white flex items-center justify-center" style={{ 
        height: 'calc(100vh - 4rem)', 
        minHeight: 'calc(100vh - 4rem)'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!loading && filteredProfiles.length === 0 && profiles.length > 0) {
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative" style={{ 
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Filtro siempre visible incluso sin perfiles */}
        <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <select
            value={selectedNetworkFilter}
            onChange={(e) => setSelectedNetworkFilter(e.target.value as 'all' | SocialNetwork)}
            className="w-full px-5 py-3 text-sm sm:text-base text-gray-900 font-semibold appearance-none cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1.25rem center',
              paddingRight: '2.75rem',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.85)';
              e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.7)';
              e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)';
            }}
          >
            {networkOptions.map((option) => (
              <option key={option.value} value={option.value} style={{ background: 'white' }}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center px-4" style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          paddingTop: '4rem'
        }}>
          <p className="text-gray-600 text-lg mb-2">No hay perfiles disponibles para esta red social</p>
          <p className="text-gray-500 text-sm">Intenta seleccionar otra red social o recargar la página</p>
        </div>
      </div>
    );
  }

  if (!loading && profiles.length === 0) {
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative" style={{ 
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Filtro siempre visible incluso sin perfiles */}
        <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-4">
          <select
            value={selectedNetworkFilter}
            onChange={(e) => setSelectedNetworkFilter(e.target.value as 'all' | SocialNetwork)}
            className="w-full px-5 py-3 text-sm sm:text-base text-gray-900 font-semibold appearance-none cursor-pointer"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1.25rem center',
              paddingRight: '2.75rem',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.85)';
              e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.7)';
              e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)';
            }}
          >
            {networkOptions.map((option) => (
              <option key={option.value} value={option.value} style={{ background: 'white' }}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center px-4" style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          paddingTop: '4rem'
        }}>
          <p className="text-gray-600 text-lg mb-2">No hay perfiles disponibles por el momento</p>
          <p className="text-gray-500 text-sm">Intenta recargar la página o contacta al administrador</p>
        </div>
      </div>
    );
  }

  const tutorialCompleted = typeof window !== 'undefined' ? 
    localStorage.getItem('tutorialCompleted') === 'true' : false;
  const needsDemoInteraction = !tutorialCompleted && !hasCompletedDemo && filteredProfiles.length > 0 && currentIndex < demoProfiles.length;
  const currentProfile = filteredProfiles[currentIndex];

  return (
    <div 
      className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0"
      style={{
        height: '-webkit-fill-available', // Para Safari iOS
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        touchAction: 'none',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => {
        // Permitir movimiento solo si es dentro de una tarjeta
        const target = e.target as HTMLElement;
        if (!target.closest('.profile-card-container')) {
          e.preventDefault();
        }
      }}
    >
      {/* Efectos de gradiente en las esquinas - colores según gesto */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: `
            radial-gradient(circle at 0% 50%, rgba(239, 68, 68, ${cornerEffects.left * 0.4}) 0%, transparent 40%),
            radial-gradient(circle at 100% 50%, rgba(59, 130, 246, ${cornerEffects.right * 0.4}) 0%, transparent 40%),
            radial-gradient(circle at 50% 0%, rgba(234, 179, 8, ${cornerEffects.top * 0.4}) 0%, transparent 40%),
            radial-gradient(circle at 50% 100%, rgba(34, 197, 94, ${cornerEffects.bottom * 0.4}) 0%, transparent 40%)
          `,
          transition: 'opacity 0.15s ease',
        }}
      />
      {/* Filtro de redes sociales - Parte superior central con efecto liquid glass */}
      <div className="absolute top-2 sm:top-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-4">
        <select
          value={selectedNetworkFilter}
          onChange={(e) => setSelectedNetworkFilter(e.target.value as 'all' | SocialNetwork)}
          className="w-full px-5 py-3 text-sm sm:text-base text-gray-900 font-semibold appearance-none cursor-pointer"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1.25rem center',
            paddingRight: '2.75rem',
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.85)';
            e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.7)';
            e.target.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)';
          }}
        >
          {networkOptions.map((option) => (
            <option key={option.value} value={option.value} style={{ background: 'white' }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center justify-center w-full" style={{ 
        position: 'absolute',
        top: '48%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '28rem'
      }}>
        {needsDemoInteraction && (
          <div className="mb-4 max-w-md w-full mx-auto bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 z-40">
            <div className="flex items-start">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">¡Interactúa con los perfiles demo!</h3>
                <p className="text-sm text-yellow-800">
                  Desliza las tarjetas para aprender cómo funciona la app. 
                  Necesitas interactuar al menos 3 veces para continuar.
                  {demoInteractions > 0 && (
                    <span className="block mt-2 font-semibold">
                      Interacciones: {demoInteractions}/3
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {filteredProfiles.length > 0 && currentProfile && (
          <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'visible', touchAction: 'none', width: '100%' }}>
            {filteredProfiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
              <div
                key={`${profile._id}-${currentIndex}`}
                className={idx === 0 ? 'relative z-10' : 'absolute top-0 left-0 right-0 z-[5]'}
                style={{ 
                  zIndex: idx === 0 ? 10 : 5 - idx,
                  opacity: idx === 0 ? 1 : Math.max(0.2, 0.6 - idx * 0.2),
                  transform: idx === 0 
                    ? (lastSwipeDirection ? undefined : 'translate(0, 0) scale(1)')
                    : `translate(0, ${idx * 8}px) scale(${1 - idx * 0.05})`,
                  transition: idx === 0 
                    ? 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                    : 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: idx === 0 ? 'auto' : 'opacity, transform',
                  ...(idx === 0 && lastSwipeDirection ? {
                    animation: `${
                      lastSwipeDirection === 'left' ? 'slideInFromRight' :
                      lastSwipeDirection === 'right' ? 'slideInFromLeft' :
                      lastSwipeDirection === 'up' ? 'slideInFromBottom' :
                      'slideInFromTop'
                    } 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards`
                  } : {})
                } as React.CSSProperties}
              >
                <ProfileCard
                  profile={profile}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onSwipeUp={handleSwipeUp}
                  onGoBack={handleGoBack}
                  onShowDetail={(profile) => setSelectedProfile(profile)}
                  onCornerEffectsChange={setCornerEffects}
                  index={idx}
                  canGoBack={history.length > 0 && idx === 0}
                  currentProfileIndex={currentIndex + idx}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* Botones de acción independientes - Justo encima de las pestañas */}
      {filteredProfiles.length > 0 && currentProfile && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex justify-center space-x-4 px-4">
          {/* Botón Izquierda (Siguiente Perfil) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating) {
                setIsAnimating(true);
                handleSwipeLeft();
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            disabled={isAnimating}
            className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-110 active:scale-95"
            aria-label="Siguiente Perfil"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          {/* Botón Arriba (Ver Detalles) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating && currentProfile) {
                setIsAnimating(true);
                setSelectedProfile(currentProfile);
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            disabled={isAnimating}
            className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-110 active:scale-95"
            aria-label="Ver Detalles"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>

          {/* Botón Retroceder */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating && !backUsed && history.length > 0) {
                setIsAnimating(true);
                handleGoBack();
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            disabled={isAnimating || backUsed || history.length === 0}
            className={`${
              backUsed || history.length === 0
                ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            } text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-110 active:scale-95`}
            aria-label="Retroceder"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </button>

          {/* Botón Derecha (Ir al Enlace) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating && currentProfile) {
                setIsAnimating(true);
                // Abrir enlace primero
                if (currentProfile.link) {
                  const linkWindow = window.open(currentProfile.link, '_blank', 'noopener,noreferrer');
                  if (!linkWindow || linkWindow.closed || typeof linkWindow.closed === 'undefined') {
                    setTimeout(() => {
                      window.open(currentProfile.link, '_blank', 'noopener,noreferrer');
                    }, 100);
                  }
                }
                handleSwipeRight();
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            disabled={isAnimating}
            className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-110 active:scale-95"
            aria-label="Ir al Enlace"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
