'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import ProfileCard from '@/components/principal/ProfileCard';
import ProfileDetail from '@/components/principal/ProfileDetail';
import SocialNetworkSelector from '@/components/principal/SocialNetworkSelector';
import { demoProfiles } from '@/data/demoProfiles';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUturnLeftIcon,
  Squares2X2Icon,
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
  const [cornerEffects, setCornerEffects] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | 'back' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [backUsed, setBackUsed] = useState(false);
  // Cargar última red social seleccionada desde localStorage
  const [selectedNetwork, setSelectedNetwork] = useState<'all' | SocialNetwork>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastSelectedNetwork');
      return (saved as 'all' | SocialNetwork) || 'all';
    }
    return 'all';
  });
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [hasSelectedNetwork, setHasSelectedNetwork] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastSelectedNetwork') !== null;
    }
    return false;
  });

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

  // Filtrar perfiles por red social seleccionada
  const filteredProfiles = useMemo(() => {
    if (selectedNetwork === 'all') {
      return profiles;
    }
    return profiles.filter((p) => p.socialNetwork === selectedNetwork);
  }, [profiles, selectedNetwork]);

  // Resetear índice cuando cambia el filtro
  useEffect(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, [selectedNetwork]);

  // Ajustar índice si es necesario
  useEffect(() => {
    if (filteredProfiles.length > 0 && currentIndex >= filteredProfiles.length) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [filteredProfiles.length, currentIndex]);

  // No mostrar selector automáticamente - solo cuando el usuario haga click en el botón

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

  // Handler para seleccionar red social
  const handleNetworkSelect = (network: 'all' | SocialNetwork) => {
    setSelectedNetwork(network);
    setHasSelectedNetwork(true);
    setShowNetworkSelector(false);
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSelectedNetwork', network);
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
    
    // Abrir enlace ANTES de avanzar al siguiente perfil (solo una vez)
    if (currentProfile.link) {
      const linkWindow = window.open(currentProfile.link, '_blank', 'noopener,noreferrer');
      // Si el popup fue bloqueado, no intentar nuevamente para evitar duplicados
      // El navegador ya bloqueó el popup, no tiene sentido intentar otra vez
    }
    
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

  if (!loading && profiles.length === 0) {
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative" style={{ 
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {showNetworkSelector ? (
          <SocialNetworkSelector
            selectedNetwork={selectedNetwork}
            onSelect={handleNetworkSelect}
            onClose={() => {
              if (hasSelectedNetwork) {
                setShowNetworkSelector(false);
              }
            }}
          />
        ) : (
          <div className="text-center px-4">
            <p className="text-gray-600 text-lg mb-2">No hay perfiles disponibles por el momento</p>
            <p className="text-gray-500 text-sm">Intenta recargar la página o contacta al administrador</p>
          </div>
        )}
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
        {showNetworkSelector ? (
          <SocialNetworkSelector
            selectedNetwork={selectedNetwork}
            onSelect={handleNetworkSelect}
            onClose={() => {
              if (hasSelectedNetwork) {
                setShowNetworkSelector(false);
              }
            }}
          />
        ) : (
          <div className="text-center px-4">
            <p className="text-gray-600 text-lg mb-2">No hay perfiles disponibles para esta red social</p>
            <button
              onClick={() => setShowNetworkSelector(true)}
              className="mt-4 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-200"
            >
              Cambiar Red Social
            </button>
          </div>
        )}
      </div>
    );
  }

  const tutorialCompleted = typeof window !== 'undefined' ? 
    localStorage.getItem('tutorialCompleted') === 'true' : false;
  const needsDemoInteraction = !tutorialCompleted && !hasCompletedDemo && filteredProfiles.length > 0 && currentIndex < demoProfiles.length;
  const currentProfile = filteredProfiles[currentIndex];

  // El selector solo se mostrará cuando el usuario haga click en el botón
  // No se muestra automáticamente para evitar el error 310

  // Mostrar selector si está activo
  if (showNetworkSelector) {
    return (
      <SocialNetworkSelector
        selectedNetwork={selectedNetwork}
        onSelect={handleNetworkSelect}
        onClose={() => {
          if (hasSelectedNetwork) {
            setShowNetworkSelector(false);
          }
        }}
      />
    );
  }

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
      {cornerEffects.left > 0 || cornerEffects.right > 0 || cornerEffects.top > 0 || cornerEffects.bottom > 0 ? (
        <div 
          className="fixed inset-0 pointer-events-none z-30"
          style={{
            background: `
              radial-gradient(circle at 0% 50%, rgba(239, 68, 68, ${cornerEffects.left * 0.3}) 0%, transparent 35%),
              radial-gradient(circle at 100% 50%, rgba(59, 130, 246, ${cornerEffects.right * 0.3}) 0%, transparent 35%),
              radial-gradient(circle at 50% 0%, rgba(234, 179, 8, ${cornerEffects.top * 0.3}) 0%, transparent 35%),
              radial-gradient(circle at 50% 100%, rgba(34, 197, 94, ${cornerEffects.bottom * 0.3}) 0%, transparent 35%)
            `,
            transition: 'opacity 0.2s ease-out',
          }}
        />
      ) : null}
      <div className="flex flex-col items-center justify-center w-full" style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '28rem',
        height: 'calc(100vh - 10rem)', // Maximizar espacio: altura total menos espacio para botones
        minHeight: 'calc(100vh - 10rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: '0'
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
          <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'visible', touchAction: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* Botones de acción independientes - Estilo Tinder, grandes y visibles */}
      {filteredProfiles.length > 0 && currentProfile && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 flex justify-center items-center space-x-3 sm:space-x-4 px-4">
          {/* Botón Selector de RRSS */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowNetworkSelector(true);
            }}
            className="bg-gray-700 hover:bg-gray-800 text-white rounded-full transition-all duration-200 focus:outline-none w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 active:scale-95"
            style={{
              boxShadow: '0 8px 16px rgba(55, 65, 81, 0.5), 0 4px 8px rgba(55, 65, 81, 0.4)'
            }}
            aria-label="Seleccionar Red Social"
          >
            <Squares2X2Icon className="h-7 w-7 sm:h-8 sm:w-8" />
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
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 active:scale-95`}
            style={{
              boxShadow: backUsed || history.length === 0 
                ? '0 8px 16px rgba(156, 163, 175, 0.4), 0 4px 8px rgba(156, 163, 175, 0.3)'
                : '0 8px 16px rgba(34, 197, 94, 0.5), 0 4px 8px rgba(34, 197, 94, 0.4)'
            }}
            aria-label="Retroceder"
          >
            <ArrowUturnLeftIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

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
            className="bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transform hover:scale-110 active:scale-95 text-3xl font-bold"
            style={{
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.5), 0 4px 8px rgba(239, 68, 68, 0.4)'
            }}
            aria-label="Siguiente Perfil"
          >
            ✕
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transform hover:scale-110 active:scale-95"
            style={{
              boxShadow: '0 8px 16px rgba(234, 179, 8, 0.5), 0 4px 8px rgba(234, 179, 8, 0.4)'
            }}
            aria-label="Ver Detalles"
          >
            <ArrowUpIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

          {/* Botón Derecha (Ir al Enlace) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating && currentProfile) {
                setIsAnimating(true);
                // handleSwipeRight ya abre el enlace, no hacerlo aquí para evitar duplicados
                handleSwipeRight();
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            disabled={isAnimating}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transform hover:scale-110 active:scale-95"
            style={{
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.5), 0 4px 8px rgba(59, 130, 246, 0.4)'
            }}
            aria-label="Ir al Enlace"
          >
            <ArrowRightIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        </div>
      )}
    </div>
  );
}
