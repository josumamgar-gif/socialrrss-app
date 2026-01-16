'use client';

import { useEffect, useState } from 'react';
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

  // Handlers simples
  const handleSwipeLeft = () => {
    const currentProfile = profiles[currentIndex];
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
    
    if (currentIndex < profiles.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Recargar perfiles
      window.location.reload();
    }
  };

  const handleSwipeRight = () => {
    const currentProfile = profiles[currentIndex];
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
    
    if (currentIndex < profiles.length - 1) {
      setHistory([...history, currentIndex]);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Recargar perfiles
      window.location.reload();
    }
  };

  const handleSwipeUp = () => {
    const currentProfile = profiles[currentIndex];
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

  // Ajustar índice si es necesario
  useEffect(() => {
    if (profiles.length > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [profiles.length, currentIndex]);

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

  const tutorialCompleted = typeof window !== 'undefined' ? 
    localStorage.getItem('tutorialCompleted') === 'true' : false;
  const needsDemoInteraction = !tutorialCompleted && !hasCompletedDemo && profiles.length > 0 && currentIndex < demoProfiles.length;
  const currentProfile = profiles[currentIndex];

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

      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}
