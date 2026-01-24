'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import { demoProfiles } from '@/data/demoProfiles';
import ProfileCard from '@/components/principal/ProfileCard';
import ProfileDetail from '@/components/principal/ProfileDetail';
import SocialNetworkSelector from '@/components/principal/SocialNetworkSelector';
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
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [cornerEffects, setCornerEffects] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [backUsed, setBackUsed] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'all' | SocialNetwork>('all');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  // Redirigir si no hay usuario
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      // Si no hay token ni usuario después de 3 segundos, redirigir
      const timer = setTimeout(() => {
        if (!user && !token) {
          window.location.href = '/login';
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Cargar perfiles cuando el usuario esté disponible
  useEffect(() => {
    if (!user) {
      setLoading(true);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await profilesAPI.getAll();
        const allProfiles = response.profiles || [];

        // Separar perfiles reales y demo
        const realProfiles: Profile[] = [];
        allProfiles.forEach((p: Profile) => {
          const userIdObj = p.userId as any;
          const isDemo =
            (typeof p._id === 'string' && p._id.startsWith('demo-')) ||
            userIdObj?.username === 'demo' ||
            userIdObj?._id === '000000000000000000000000';

          if (!isDemo) {
            realProfiles.push(p);
          }
        });

        // Obtener perfiles vistos por este usuario
        const viewedKey = `viewedProfiles_${user.id}`;
        const viewedData = typeof window !== 'undefined' ? localStorage.getItem(viewedKey) : null;
        const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];

        // Filtrar perfiles reales no vistos (nuevos desde última sesión)
        const newRealProfiles = realProfiles.filter(p => !viewedProfiles.includes(p._id));

        // Para usuario nuevo: mostrar 10 demos + todos los reales
        // Para usuario existente: mostrar solo reales nuevos
        const isNewUser = viewedProfiles.length === 0;
        let profilesToShow: Profile[] = [];

        if (isNewUser) {
          // Usuario nuevo: 10 perfiles demo + todos los reales
          const demoProfilesToShow = demoProfiles.slice(0, 10);
          profilesToShow = [...demoProfilesToShow, ...realProfiles];
        } else {
          // Usuario existente: solo perfiles reales nuevos
          profilesToShow = newRealProfiles;
        }

        // Mezclar aleatoriamente
        profilesToShow = [...profilesToShow].sort(() => Math.random() - 0.5);

        setProfiles(profilesToShow);
      } catch (error) {
        console.error('Error cargando perfiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Marcar perfil como visto
  const markProfileAsViewed = (profileId: string) => {
    if (typeof window !== 'undefined' && user) {
      const viewedKey = `viewedProfiles_${user.id}`;
      const viewedData = localStorage.getItem(viewedKey);
      const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];

      if (!viewedProfiles.includes(profileId)) {
        viewedProfiles.push(profileId);
        localStorage.setItem(viewedKey, JSON.stringify(viewedProfiles));
      }
    }
  };

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

  // Handler para seleccionar red social
  const handleNetworkSelect = (network: 'all' | SocialNetwork) => {
    setSelectedNetwork(network);
    setShowNetworkSelector(false);
  };

  // Handlers simples
  const handleSwipeLeft = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) return;

    markProfileAsViewed(currentProfile._id);
    console.log('👎 Swipe left - perfil descartado:', currentProfile._id);

    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHistory(prev => [...prev, currentIndex]);
    }
  };

  const handleSwipeRight = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) return;

    markProfileAsViewed(currentProfile._id);

    const userIdObj = currentProfile.userId as any;
    const isDemo =
      (typeof currentProfile._id === 'string' && currentProfile._id.startsWith('demo-')) ||
      userIdObj?.username === 'demo' ||
      userIdObj?._id === '000000000000000000000000';

    if (isDemo) {
      console.log('❤️ Swipe right en demo - solo marcar como visto');
      if (currentIndex < filteredProfiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setHistory(prev => [...prev, currentIndex]);
      }
    } else {
      console.log('❤️ Swipe right en perfil real - abrir enlace');
      if (currentProfile.link) {
        window.open(currentProfile.link, '_blank');
      }
      if (currentIndex < filteredProfiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setHistory(prev => [...prev, currentIndex]);
      }
    }
  };

  const handleSwipeUp = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) return;

    markProfileAsViewed(currentProfile._id);

    const userIdObj = currentProfile.userId as any;
    const isDemo =
      (typeof currentProfile._id === 'string' && currentProfile._id.startsWith('demo-')) ||
      userIdObj?.username === 'demo' ||
      userIdObj?._id === '000000000000000000000000';

    if (isDemo) {
      console.log('⭐ Swipe up en demo - marcar como visto');
      if (currentIndex < filteredProfiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setHistory(prev => [...prev, currentIndex]);
      }
    } else {
      console.log('⭐ Swipe up en perfil real - ver detalles');
      setSelectedProfile(currentProfile);
    }
  };

  const handleGoBack = () => {
    if (history.length > 0 && !backUsed) {
      const previousIndex = history[history.length - 1];
      setCurrentIndex(previousIndex);
      setHistory(prev => prev.slice(0, -1));
      setBackUsed(true);
    }
  };

  // Mostrar selector si está activo
  if (showNetworkSelector) {
    return (
      <SocialNetworkSelector
        selectedNetwork={selectedNetwork}
        onSelect={handleNetworkSelect}
        onClose={() => setShowNetworkSelector(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    // Determinar si es usuario nuevo o existente
    const viewedKey = user ? `viewedProfiles_${user.id}` : null;
    const viewedData = viewedKey && typeof window !== 'undefined' ? localStorage.getItem(viewedKey) : null;
    const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];
    const isNewUser = viewedProfiles.length === 0;

    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0">
        <div className="text-center px-6">
          <div className="text-6xl mb-6">{isNewUser ? '📭' : '🔄'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isNewUser ? 'No hay perfiles disponibles' : 'No hay perfiles nuevos por el momento'}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {isNewUser
              ? 'Actualmente no hay perfiles disponibles para mostrar.'
              : 'No hay nuevos perfiles desde tu última visita. Vuelve más tarde para ver contenido nuevo.'
            }
          </p>
          <button
            onClick={() => {
              setLoading(true);
              window.location.reload();
            }}
            className="bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Comprobar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0"
      style={{
        height: '-webkit-fill-available',
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
        height: 'calc(100vh - 10rem)',
        minHeight: 'calc(100vh - 10rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: '0'
      }}>

        {/* Botón selector de red social */}
        <button
          onClick={() => setShowNetworkSelector(true)}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <Squares2X2Icon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Indicador de red seleccionada */}
        {selectedNetwork !== 'all' && (
          <div className="absolute top-4 right-4 z-20 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            {selectedNetwork}
          </div>
        )}

        {filteredProfiles.length > 0 && (
          <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'visible', touchAction: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {filteredProfiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
              <div
                key={`${profile._id}-${currentIndex}`}
                className={idx === 0 ? 'relative z-10' : 'absolute top-0 left-0 right-0 z-[5]'}
                style={{
                  zIndex: idx === 0 ? 10 : 5 - idx,
                  opacity: idx === 0 ? 1 : Math.max(0.2, 0.6 - idx * 0.2),
                  transform: idx === 0
                    ? 'translate(0, 0) scale(1)'
                    : `translate(0, ${idx * 8}px) scale(${1 - idx * 0.05})`,
                  transition: idx === 0
                    ? 'opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    : 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: idx === 0 ? 'auto' : 'opacity, transform'
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

        {/* Controles de navegación - Parte inferior */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
          {/* Botón Izquierda (No me gusta) */}
          <button
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
            className="bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-16 h-16 sm:w-18 sm:w-18 flex items-center justify-center transform hover:scale-110 active:scale-95"
            style={{
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.5), 0 4px 8px rgba(239, 68, 68, 0.4)'
            }}
            aria-label="No me gusta"
          >
            <ArrowLeftIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>

          {/* Botón Abajo (Volver) */}
          <button
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
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 active:scale-95"
            style={{
              boxShadow: '0 6px 12px rgba(107, 114, 128, 0.5), 0 3px 6px rgba(107, 114, 128, 0.4)'
            }}
            aria-label="Volver al perfil anterior"
          >
            <ArrowUturnLeftIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Botón Arriba (Ver Detalles) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating) {
                setIsAnimating(true);
                handleSwipeUp();
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            disabled={isAnimating}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 active:scale-95"
            style={{
              boxShadow: '0 6px 12px rgba(234, 179, 8, 0.5), 0 3px 6px rgba(234, 179, 8, 0.4)'
            }}
            aria-label="Ver detalles del perfil"
          >
            <ArrowUpIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Botón Derecha (Me gusta/Ir al enlace) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!isAnimating) {
                setIsAnimating(true);
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
      </div>

      {/* Modal de detalles del perfil */}
      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}