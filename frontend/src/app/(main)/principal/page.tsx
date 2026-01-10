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

  const loadProfiles = useCallback(async () => {
    try {
      const response = await profilesAPI.getAll();
      // Primero los demos, luego los perfiles reales
      const realProfiles = (response.profiles || []).filter((p: Profile) => !p._id.startsWith('demo-'));
      const allProfiles = [...demoProfiles, ...realProfiles];
      setProfiles(allProfiles);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      // Si falla, usar solo demos
      setProfiles(demoProfiles);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
    checkDemoCompletion();
  }, [loadProfiles, checkDemoCompletion]);

  const handleSwipeLeft = () => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile && currentProfile._id.startsWith('demo-')) {
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
    }
  };

  const handleSwipeRight = () => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile && currentProfile._id.startsWith('demo-')) {
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
    }
  };

  const handleSwipeUp = () => {
    const currentProfile = profiles[currentIndex];
    if (currentProfile && currentProfile._id.startsWith('demo-')) {
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
  const needsDemoInteraction = !hasCompletedDemo && currentIndex < demoProfiles.length;
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

