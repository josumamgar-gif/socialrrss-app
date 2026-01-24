'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import { demoProfiles } from '@/data/demoProfiles';

export default function PrincipalPage() {
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [waitingForNewUsers, setWaitingForNewUsers] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await profilesAPI.getAll();

        const tutorialCompleted = typeof window !== 'undefined'
          ? localStorage.getItem('tutorialCompleted') === 'true'
          : false;
        const demoCompleted = typeof window !== 'undefined'
          ? localStorage.getItem('demoCompleted') === 'true'
          : false;
        const demosExhausted = typeof window !== 'undefined'
          ? localStorage.getItem('demosExhausted') === 'true'
          : false;

        const allProfiles = response.profiles || [];
        const realProfiles: Profile[] = [];
        const demoProfilesFromDB: Profile[] = [];

        allProfiles.forEach((p: Profile) => {
          const userIdObj = p.userId as any;
          const isDemo =
            (typeof p._id === 'string' && p._id.startsWith('demo-')) ||
            userIdObj?.username === 'demo' ||
            userIdObj?._id === '000000000000000000000000';

          if (isDemo) {
            demoProfilesFromDB.push(p);
          } else {
            realProfiles.push(p);
          }
        });

        let profilesToShow: Profile[] = [];

        if (demosExhausted || demoCompleted) {
          profilesToShow = realProfiles;
          profilesToShow = [...profilesToShow].sort(() => Math.random() - 0.5);

          if (profilesToShow.length === 0) {
            setWaitingForNewUsers(true);
            setProfiles([]);
          } else {
            setWaitingForNewUsers(false);
            setProfiles(profilesToShow);
          }
        } else if (!tutorialCompleted || !demoCompleted) {
          const demosToShow = demoProfilesFromDB.slice(0, 10);
          profilesToShow = [...demosToShow, ...realProfiles];
          profilesToShow = [...profilesToShow].sort(() => Math.random() - 0.5);

          setWaitingForNewUsers(false);
          setProfiles(profilesToShow);
        } else {
          profilesToShow = realProfiles;
          profilesToShow = [...profilesToShow].sort(() => Math.random() - 0.5);

          setWaitingForNewUsers(false);
          setProfiles(profilesToShow);
        }

        if (profilesToShow.length === 0 && !tutorialCompleted && allProfiles.length === 0 && !demosExhausted) {
          const limitedLocalDemos = demoProfiles.slice(0, 10);
          setWaitingForNewUsers(false);
          setProfiles(limitedLocalDemos);
        }
      } catch (error) {
        console.error('Error cargando perfiles:', error);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (waitingForNewUsers) {
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0">
        <div className="flex flex-col items-center justify-center w-full h-full text-center px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-auto border border-gray-100">
            <div className="text-6xl mb-6">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Esperando nuevos usuarios
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ¡Has completado todos los perfiles de demostración! Estamos esperando a que más usuarios se unan para mostrarte nuevos perfiles reales.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>¿Qué sucede ahora?</strong><br />
                • Solo verás perfiles de usuarios reales que pagan por promoción<br />
                • Te notificaremos cuando haya nuevos perfiles disponibles<br />
                • Mientras tanto, puedes crear tu propio perfil para promocionarte
              </p>
            </div>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              Comprobar nuevos perfiles
            </button>
          </div>
        </div>
      </div>
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

  return (
    <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Perfiles disponibles: {profiles.length}
        </h1>
        <p className="text-gray-600">
          Funcionalidad básica implementada. Pantalla de "esperando usuarios" funciona correctamente.
        </p>
      </div>
    </div>
  );
}