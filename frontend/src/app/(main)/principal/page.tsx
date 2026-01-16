'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import ProfileCard from '@/components/principal/ProfileCard';
import ProfileDetail from '@/components/principal/ProfileDetail';
import { demoProfiles } from '@/data/demoProfiles';

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
        
        const realProfiles = (response.profiles || [])
          .filter((p: Profile) => !p._id.startsWith('demo-') && !viewedProfiles.includes(p._id));
        
        const tutorialCompleted = typeof window !== 'undefined' ? 
          localStorage.getItem('tutorialCompleted') === 'true' : false;
        
        let profilesToShow: Profile[] = [];
        if (!tutorialCompleted) {
          profilesToShow = [...demoProfiles.slice(0, 4), ...realProfiles];
        } else {
          profilesToShow = realProfiles;
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
            setProfiles(demoProfiles.slice(0, 4));
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

  // Handlers simples
  const handleSwipeLeft = () => {
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
    if (history.length > 0) {
      const previousIndex = history[history.length - 1];
      setCurrentIndex(previousIndex);
      setHistory(history.slice(0, -1));
    }
  };

  // Filtrar perfiles por red social
  const filteredProfiles = useMemo(() => {
    if (selectedNetworkFilter === 'all') {
      return profiles;
    }
    return profiles.filter((p) => p.socialNetwork === selectedNetworkFilter);
  }, [profiles, selectedNetworkFilter]);

  // Resetear índice cuando cambia el filtro
  useEffect(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, [selectedNetworkFilter]);

  // Filtrar perfiles por red social
  const filteredProfiles = useMemo(() => {
    if (selectedNetworkFilter === 'all') {
      return profiles;
    }
    return profiles.filter((p) => p.socialNetwork === selectedNetworkFilter);
  }, [profiles, selectedNetworkFilter]);

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

  // Filtrar perfiles por red social
  const filteredProfiles = useMemo(() => {
    if (selectedNetworkFilter === 'all') {
      return profiles;
    }
    return profiles.filter((p) => p.socialNetwork === selectedNetworkFilter);
  }, [profiles, selectedNetworkFilter]);

  if (!loading && filteredProfiles.length === 0 && profiles.length > 0) {
    return (
      <div className="w-full bg-white flex items-center justify-center" style={{ 
        height: 'calc(100vh - 4rem)', 
        minHeight: 'calc(100vh - 4rem)'
      }}>
        <div className="text-center px-4">
          <p className="text-gray-600 text-lg mb-2">No hay perfiles disponibles para esta red social</p>
          <p className="text-gray-500 text-sm">Intenta seleccionar otra red social o recargar la página</p>
        </div>
      </div>
    );
  }

  if (!loading && profiles.length === 0) {
    return (
      <div className="w-full bg-white flex items-center justify-center" style={{ 
        height: 'calc(100vh - 4rem)', 
        minHeight: 'calc(100vh - 4rem)'
      }}>
        <div className="text-center px-4">
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
    <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative" style={{ 
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Filtro de redes sociales - Parte superior central con margen para móvil */}
      <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs px-4">
        <select
          value={selectedNetworkFilter}
          onChange={(e) => setSelectedNetworkFilter(e.target.value as 'all' | SocialNetwork)}
          className="w-full px-4 py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg bg-white text-gray-900 shadow-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            paddingRight: '2.5rem'
          }}
        >
          {networkOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto pt-16 sm:pt-20">
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
          <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'hidden' }}>
            {filteredProfiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
              <div
                key={profile._id}
                className={idx === 0 ? 'relative z-10' : 'absolute top-0 left-0 right-0 opacity-50 scale-95'}
                style={{ 
                  zIndex: 10 - idx,
                  transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: idx === 0 ? 'auto' : 'opacity, transform'
                }}
              >
                <ProfileCard
                  profile={profile}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onSwipeUp={handleSwipeUp}
                  onGoBack={handleGoBack}
                  onShowDetail={(profile) => setSelectedProfile(profile)}
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
    </div>
  );
}
