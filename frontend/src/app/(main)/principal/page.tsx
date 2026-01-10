'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile } from '@/types';
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

  const checkDemoCompletion = useCallback(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('demoCompleted');
      setHasCompletedDemo(completed === 'true');
    }
  }, []);

  // Obtener perfiles vistos por el usuario actual
  const getViewedProfiles = useCallback((): string[] => {
    if (!user || typeof window === 'undefined') return [];
    const key = `viewedProfiles_${user.id}`;
    const viewed = localStorage.getItem(key);
    return viewed ? JSON.parse(viewed) : [];
  }, [user]);

  // Marcar un perfil como visto
  const markProfileAsViewed = useCallback((profileId: string) => {
    if (!user || typeof window === 'undefined') return;
    const key = `viewedProfiles_${user.id}`;
    const viewed = getViewedProfiles();
    if (!viewed.includes(profileId)) {
      viewed.push(profileId);
      localStorage.setItem(key, JSON.stringify(viewed));
    }
  }, [user, getViewedProfiles]);

  const loadProfiles = useCallback(async () => {
    try {
      const response = await profilesAPI.getAll();
      const viewedProfiles = getViewedProfiles();
      
      // Filtrar perfiles reales que no han sido vistos
      const realProfiles = (response.profiles || [])
        .filter((p: Profile) => !p._id.startsWith('demo-') && !viewedProfiles.includes(p._id));
      
      // Los perfiles demo solo aparecen si el tutorial NO está completado (primera vez)
      const tutorialCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('tutorialCompleted') === 'true' : false;
      const demoCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('demoCompleted') === 'true' : false;
      
      // Solo incluir demos si el tutorial NO está completado (primera vez)
      let profilesToShow: Profile[] = [];
      if (!tutorialCompleted && !demoCompleted) {
        // Si el tutorial no está completado, mostrar demos sin filtrar por vistos
        // Los demos nunca se marcan como vistos permanentemente
        const demosNotViewed = demoProfiles.filter((p: Profile) => !viewedProfiles.includes(p._id));
        profilesToShow = [...demosNotViewed, ...realProfiles];
      } else {
        // Si el tutorial está completado, NO mostrar demos nunca más
        profilesToShow = realProfiles;
      }
      
      setProfiles(profilesToShow);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      // Si falla, solo mostrar demos si el tutorial no está completado
      const tutorialCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('tutorialCompleted') === 'true' : false;
      const demoCompleted = typeof window !== 'undefined' ? 
        localStorage.getItem('demoCompleted') === 'true' : false;
      
      if (!tutorialCompleted && !demoCompleted) {
        setProfiles(demoProfiles);
      } else {
        setProfiles([]);
      }
    } finally {
      setLoading(false);
    }
  }, [getViewedProfiles]);

  useEffect(() => {
    if (user) {
      loadProfiles();
      checkDemoCompletion();
    }
  }, [loadProfiles, checkDemoCompletion, user]);

  const handleSwipeLeft = () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;
    
    // Marcar perfil como visto
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      const newInteractions = demoInteractions + 1;
      setDemoInteractions(newInteractions);
      
      if (newInteractions >= 3 && !hasCompletedDemo) {
        localStorage.setItem('demoCompleted', 'true');
        setHasCompletedDemo(true);
      }
    }
    
    if (currentIndex < profiles.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Si no hay más perfiles, recargar para obtener nuevos (sin los vistos)
      loadProfiles().then(() => {
        // Resetear índice después de recargar para mostrar nuevos perfiles
        setCurrentIndex(0);
        setHistory([]);
      });
    }
  };

  const handleSwipeRight = () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;
    
    // Marcar perfil como visto
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      const newInteractions = demoInteractions + 1;
      setDemoInteractions(newInteractions);
      
      if (newInteractions >= 3 && !hasCompletedDemo) {
        localStorage.setItem('demoCompleted', 'true');
        setHasCompletedDemo(true);
      }
    }
    
    if (currentIndex < profiles.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Si no hay más perfiles, recargar para obtener nuevos (sin los vistos)
      loadProfiles().then(() => {
        // Resetear índice después de recargar para mostrar nuevos perfiles
        setCurrentIndex(0);
        setHistory([]);
      });
    }
  };

  const handleSwipeUp = () => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;
    
    // Marcar perfil como visto cuando se ven los detalles
    markProfileAsViewed(currentProfile._id);
    
    if (currentProfile._id.startsWith('demo-')) {
      const newInteractions = demoInteractions + 1;
      setDemoInteractions(newInteractions);
      
      if (newInteractions >= 3 && !hasCompletedDemo) {
        localStorage.setItem('demoCompleted', 'true');
        setHasCompletedDemo(true);
      }
    }
    // Los detalles se manejan dentro del ProfileCard
  };

  const handleGoBack = () => {
    if (history.length > 0) {
      const previousIndex = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentIndex(previousIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Mostrar mensaje si no hay perfiles
  if (profiles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No hay perfiles disponibles por el momento</p>
        </div>
      </div>
    );
  }

  // Verificar si el usuario ha completado los demos
  // Solo mostrar interacción demo si el tutorial NO está completado
  const tutorialCompleted = typeof window !== 'undefined' ? 
    localStorage.getItem('tutorialCompleted') === 'true' : false;
  const needsDemoInteraction = !tutorialCompleted && !hasCompletedDemo && currentIndex < demoProfiles.length;
  const currentProfile = profiles[currentIndex];
  const isDemoProfile = currentProfile?._id.startsWith('demo-');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
      {needsDemoInteraction && (
        <div className="mb-6 max-w-md w-full mx-auto bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 z-50">
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


      <div className="relative w-full max-w-md mx-auto profile-card-container" style={{ overflow: 'hidden' }}>
        {profiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
          <div
            key={profile._id}
            className={idx === 0 ? 'relative z-10' : 'absolute top-0 left-0 right-0 opacity-50 scale-95'}
            style={{ zIndex: 10 - idx }}
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

