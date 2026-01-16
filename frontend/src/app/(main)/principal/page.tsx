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

  // Ref para el userId actual
  const userIdRef = useRef<string | undefined>(user?.id);
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  // Ref para perfiles
  const profilesRef = useRef<Profile[]>(profiles);
  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  // Función estable para marcar perfiles como vistos
  const markProfileAsViewed = useCallback((profileId: string) => {
    if (typeof window === 'undefined') return;
    if (profileId.startsWith('demo-')) return;
    
    const userId = userIdRef.current || 'anonymous';
    const key = `viewedProfiles_${userId}`;
    const viewedData = localStorage.getItem(key);
    const viewed = viewedData ? JSON.parse(viewedData) : [];
    
    if (!viewed.includes(profileId)) {
      viewed.push(profileId);
      localStorage.setItem(key, JSON.stringify(viewed));
    }
  }, []);

  // Función estable para cargar perfiles
  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getAll();
      
      const userId = userIdRef.current || 'anonymous';
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
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      const tutorialCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('tutorialCompleted') === 'true' : false;
      
      if (!tutorialCompleted) {
        setProfiles(demoProfiles.slice(0, 4));
      } else {
        setProfiles([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Ref para displayedProfiles (ahora es igual a profiles sin filtro)
  const displayedProfilesRef = useRef<Profile[]>(profiles);
  useEffect(() => {
    displayedProfilesRef.current = profiles;
  }, [profiles]);

  // Refs para callbacks
  const markProfileAsViewedRef = useRef(markProfileAsViewed);
  const loadProfilesRef = useRef(loadProfiles);
  useEffect(() => {
    markProfileAsViewedRef.current = markProfileAsViewed;
  }, [markProfileAsViewed]);
  useEffect(() => {
    loadProfilesRef.current = loadProfiles;
  }, [loadProfiles]);

  // Ref para currentIndex
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Cargar perfiles solo una vez al montar
  useEffect(() => {
    const checkDemoCompletion = () => {
      if (typeof window !== 'undefined') {
        const completed = localStorage.getItem('demoCompleted');
        setHasCompletedDemo(completed === 'true');
      }
    };
    
    loadProfiles();
    checkDemoCompletion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar - loadProfiles es estable

  const handleSwipeLeft = useCallback(() => {
    const profiles = displayedProfilesRef.current;
    const idx = currentIndexRef.current;
    const currentProfile = profiles[idx];
    if (!currentProfile) return;
    
    markProfileAsViewedRef.current(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      setDemoInteractions((prev) => {
        const newInteractions = prev + 1;
        if (newInteractions >= 3) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('demoCompleted', 'true');
          }
          setHasCompletedDemo(true);
        }
        return newInteractions;
      });
    }
    
    if (idx < profiles.length - 1) {
      setHistory((prev) => [...prev, idx]);
      setCurrentIndex(idx + 1);
    } else {
      loadProfilesRef.current().then(() => {
        setCurrentIndex(0);
        setHistory([]);
      });
    }
  }, []);

  const handleSwipeRight = useCallback(() => {
    const profiles = displayedProfilesRef.current;
    const idx = currentIndexRef.current;
    const currentProfile = profiles[idx];
    if (!currentProfile) return;
    
    markProfileAsViewedRef.current(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      setDemoInteractions((prev) => {
        const newInteractions = prev + 1;
        if (newInteractions >= 3) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('demoCompleted', 'true');
          }
          setHasCompletedDemo(true);
        }
        return newInteractions;
      });
    }
    
    if (idx < profiles.length - 1) {
      setHistory((prev) => [...prev, idx]);
      setCurrentIndex(idx + 1);
    } else {
      loadProfilesRef.current().then(() => {
        setCurrentIndex(0);
        setHistory([]);
      });
    }
  }, []);

  const handleSwipeUp = useCallback(() => {
    const profiles = displayedProfilesRef.current;
    const idx = currentIndexRef.current;
    const currentProfile = profiles[idx];
    if (!currentProfile) return;
    
    markProfileAsViewedRef.current(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      setDemoInteractions((prev) => {
        const newInteractions = prev + 1;
        if (newInteractions >= 3) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('demoCompleted', 'true');
          }
          setHasCompletedDemo(true);
        }
        return newInteractions;
      });
    }
  }, []);

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
  if (!loading && profiles.length === 0) {
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
  const tutorialCompleted = typeof window !== 'undefined' ? 
    localStorage.getItem('tutorialCompleted') === 'true' : false;
  const needsDemoInteraction = !tutorialCompleted && !hasCompletedDemo && profiles.length > 0 && currentIndex < demoProfiles.length;
  const currentProfile = profiles[currentIndex];
  const isDemoProfile = currentProfile?._id.startsWith('demo-');

  // Ajustar índice si es necesario
  useEffect(() => {
    if (profiles.length > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [profiles.length, currentIndex]);

  return (
    <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative" style={{ 
      height: '100%',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
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

      {profiles.length > 0 && currentProfile && (
          <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'hidden' }}>
          {profiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
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

