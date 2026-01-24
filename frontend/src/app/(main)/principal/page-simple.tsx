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
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0">
        <div className="text-center px-6">
          <div className="text-6xl mb-6">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No hay perfiles disponibles
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Actualmente no hay perfiles disponibles para mostrar.
          </p>
          <button
            onClick={() => {
              setLoading(true);
              window.location.reload();
            }}
            className="bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Recargar
          </button>
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
          Sistema simplificado funcionando correctamente.
        </p>
      </div>
    </div>
  );
}