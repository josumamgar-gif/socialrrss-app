'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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

  const checkDemoCompletion = useCallback(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('demoCompleted');
      setHasCompletedDemo(completed === 'true');
    }
  }, []);

  // Obtener perfiles vistos por el usuario actual (funciona incluso sin usuario autenticado)
  const getViewedProfiles = useCallback((): string[] => {
    if (typeof window === 'undefined') return [];
    
    // Si hay usuario, usar su ID, sino usar 'anonymous'
    const userId = user?.id || 'anonymous';
    const key = `viewedProfiles_${userId}`;
    const viewed = localStorage.getItem(key);
    return viewed ? JSON.parse(viewed) : [];
  }, [user]);

  // Marcar un perfil como visto (pero NO marcar demos como vistos permanentemente)
  const markProfileAsViewed = useCallback((profileId: string) => {
    if (typeof window === 'undefined') return;
    
    // NO marcar perfiles demo como vistos - solo los perfiles reales
    if (profileId.startsWith('demo-')) {
      return; // Los demos nunca se marcan como vistos
    }
    
    // Si hay usuario, usar su ID, sino usar 'anonymous'
    const userId = user?.id || 'anonymous';
    const key = `viewedProfiles_${userId}`;
    const viewed = getViewedProfiles();
    if (!viewed.includes(profileId)) {
      viewed.push(profileId);
      localStorage.setItem(key, JSON.stringify(viewed));
    }
  }, [user, getViewedProfiles]);

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getAll();
      const viewedProfiles = getViewedProfiles();
      
      // Filtrar perfiles reales que no han sido vistos
      const realProfiles = (response.profiles || [])
        .filter((p: Profile) => !p._id.startsWith('demo-') && !viewedProfiles.includes(p._id));
      
      // Los perfiles demo solo aparecen si el tutorial NO está completado
      const tutorialCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('tutorialCompleted') === 'true' : false;
      
      let profilesToShow: Profile[] = [];
      if (!tutorialCompleted) {
        // Si el tutorial NO está completado, MOSTRAR 3-4 PERFILES DEMO para practicar
        // Mostrar solo los primeros 3-4 demos para que el usuario practique
        const demosToShow = demoProfiles.slice(0, 4); // Mostrar máximo 4 demos
        profilesToShow = [...demosToShow, ...realProfiles];
      } else {
        // Si el tutorial está completado, NO mostrar demos nunca más
        profilesToShow = realProfiles;
      }
      
      setProfiles(profilesToShow);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      // Si falla, mostrar demos si el tutorial no está completado
      const tutorialCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('tutorialCompleted') === 'true' : false;
      
      if (!tutorialCompleted) {
        // Mostrar solo 3-4 demos para practicar
        setProfiles(demoProfiles.slice(0, 4));
      } else {
        setProfiles([]);
      }
    } finally {
      setLoading(false);
    }
  }, [getViewedProfiles]);

  const networkOptions: { value: 'all' | SocialNetwork; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'x', label: 'X (Twitter)' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'otros', label: 'Otros' },
  ];

  const displayedProfiles = useMemo(() => {
    return selectedNetworkFilter === 'all'
      ? profiles
      : profiles.filter((p) => p.socialNetwork === selectedNetworkFilter);
  }, [profiles, selectedNetworkFilter]);

  // Ref para acceder al array más reciente sin incluirlo en dependencias
  const displayedProfilesRef = useRef(displayedProfiles);
  useEffect(() => {
    displayedProfilesRef.current = displayedProfiles;
  }, [displayedProfiles]);

  useEffect(() => {
    loadProfiles();
    checkDemoCompletion();
  }, [loadProfiles, checkDemoCompletion]);

  const handleSwipeLeft = useCallback(() => {
    const profiles = displayedProfilesRef.current;
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;
    
    // Marcar perfil como visto
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      setDemoInteractions((prev) => {
        const newInteractions = prev + 1;
        if (newInteractions >= 3) {
          const completed = localStorage.getItem('demoCompleted');
          if (completed !== 'true') {
            localStorage.setItem('demoCompleted', 'true');
            setHasCompletedDemo(true);
          }
        }
        return newInteractions;
      });
    }
    
    if (currentIndex < profiles.length - 1) {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Si no hay más perfiles, recargar para obtener nuevos (sin los vistos)
      loadProfiles().then(() => {
        setCurrentIndex(0);
        setHistory([]);
      });
    }
  }, [currentIndex, markProfileAsViewed, loadProfiles]);

  const handleSwipeRight = useCallback(() => {
    const profiles = displayedProfilesRef.current;
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;
    
    // Marcar perfil como visto
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      setDemoInteractions((prev) => {
        const newInteractions = prev + 1;
        if (newInteractions >= 3) {
          const completed = localStorage.getItem('demoCompleted');
          if (completed !== 'true') {
            localStorage.setItem('demoCompleted', 'true');
            setHasCompletedDemo(true);
          }
        }
        return newInteractions;
      });
    }
    
    if (currentIndex < profiles.length - 1) {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Si no hay más perfiles, recargar para obtener nuevos (sin los vistos)
      loadProfiles().then(() => {
        setCurrentIndex(0);
        setHistory([]);
      });
    }
  }, [currentIndex, markProfileAsViewed, loadProfiles]);

  const handleSwipeUp = useCallback(() => {
    const profiles = displayedProfilesRef.current;
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;
    
    // Marcar perfil como visto cuando se ven los detalles
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      setDemoInteractions((prev) => {
        const newInteractions = prev + 1;
        if (newInteractions >= 3) {
          const completed = localStorage.getItem('demoCompleted');
          if (completed !== 'true') {
            localStorage.setItem('demoCompleted', 'true');
            setHasCompletedDemo(true);
          }
        }
        return newInteractions;
      });
    }
    // Los detalles se manejan dentro del ProfileCard
  }, [currentIndex, markProfileAsViewed]);

  const handleGoBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length > 0) {
        const previousIndex = prev[prev.length - 1];
        setCurrentIndex(previousIndex);
        return prev.slice(0, -1);
      }
      return prev;
    });
  }, []);

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

  // Mostrar mensaje si no hay perfiles después de cargar
  if (!loading && displayedProfiles.length === 0) {
    return (
      <div className="w-full bg-white flex items-center justify-center" style={{ 
        height: 'calc(100vh - 4rem)', 
        minHeight: 'calc(100vh - 4rem)'
      }}>
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">No hay perfiles disponibles por el momento</p>
          <p className="text-gray-500 text-sm">Intenta recargar la página o contacta al administrador</p>
        </div>
      </div>
    );
  }

  // Verificar si el usuario ha completado los demos
  // Solo mostrar interacción demo si el tutorial NO está completado
  const tutorialCompleted = typeof window !== 'undefined' ? 
    localStorage.getItem('tutorialCompleted') === 'true' : false;
  const needsDemoInteraction = !tutorialCompleted && !hasCompletedDemo && displayedProfiles.length > 0 && currentIndex < demoProfiles.length;
  const currentProfile = displayedProfiles[currentIndex];
  const isDemoProfile = currentProfile?._id.startsWith('demo-');

  useEffect(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, [selectedNetworkFilter]);

  useEffect(() => {
    if (displayedProfiles.length > 0 && currentIndex >= displayedProfiles.length) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [displayedProfiles.length, currentIndex]);

  return (
    <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative" style={{ 
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Menú desplegable en la parte superior izquierda */}
      <div className="absolute top-4 left-4 z-50">
        <select
          value={selectedNetworkFilter}
          onChange={(e) => setSelectedNetworkFilter(e.target.value as 'all' | SocialNetwork)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 shadow-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium"
          style={{ minWidth: '140px' }}
        >
          {networkOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {needsDemoInteraction && (
          <div className="mb-4 max-w-md w-full mx-auto bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 z-50">
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

      {displayedProfiles.length > 0 && currentProfile && (
          <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'hidden' }}>
          {displayedProfiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
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

      {/* Modal de detalles - renderizado fuera del contenedor para z-index correcto */}
      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}

