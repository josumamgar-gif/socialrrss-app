'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI, userAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import { demoProfiles } from '@/data/demoProfiles';
import ProfileCard from '@/components/principal/ProfileCard';
import ProfileDetail from '@/components/principal/ProfileDetail';
import SocialNetworkSelector from '@/components/principal/SocialNetworkSelector';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
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
  const [discardedProfiles, setDiscardedProfiles] = useState<string[]>([]);

  // Verificar autenticación básica
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      // Si no hay token, redirigir inmediatamente a login
      if (!token) {
        console.log('❌ No hay token, redirigiendo a login');
        window.location.href = '/login';
        return;
      }

      console.log('✅ Token encontrado, esperando usuario...');
    }
  }, []); // Solo verificar una vez

  // Cargar perfiles - LÓGICA ULTRA-SIMPLE Y GARANTIZADA
  useEffect(() => {
    console.log('🚀 Iniciando carga de perfiles...');

    const loadProfiles = async () => {
      try {
        setLoading(true);
        console.log('🚀 CREANDO PERFILES DEMO...');

        // PERFILES DEMO FIJOS
        const demoProfiles: Profile[] = [
          {
            _id: 'demo-001',
            userId: 'demo',
            socialNetwork: 'instagram' as SocialNetwork,
            isActive: true,
            isPaid: false,
            profileData: { username: 'demo_foto', followers: 1000, posts: 50, description: 'Fotografía profesional 📸' },
            images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'],
            link: 'https://instagram.com/demo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidUntil: null,
            planType: null,
          },
          {
            _id: 'demo-002',
            userId: 'demo',
            socialNetwork: 'tiktok' as SocialNetwork,
            isActive: true,
            isPaid: false,
            profileData: { username: 'demo_tiktok', followers: 500, videos: 20, description: 'Bailes y tendencias 🎵' },
            images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'],
            link: 'https://tiktok.com/@demo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidUntil: null,
            planType: null,
          },
          {
            _id: 'demo-003',
            userId: 'demo',
            socialNetwork: 'youtube' as SocialNetwork,
            isActive: true,
            isPaid: false,
            profileData: { channelName: 'Demo Channel', subscribers: 2000, videoCount: 30, description: 'Contenido variado 📺' },
            images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'],
            link: 'https://youtube.com/demo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidUntil: null,
            planType: null,
          }
        ];

        console.log('📄 Perfiles demo listos:', demoProfiles.length);

        // FILTRAR PERFILES YA DESCARTADOS POR ESTE USUARIO
        // Usar el estado discardedProfiles que se carga desde el backend o localStorage
        console.log('👀 Usuario:', user?.id || 'guest', '- Perfiles ya descartados:', discardedProfiles.length);

        let availableProfiles = demoProfiles.filter(p => !discardedProfiles.includes(p._id));
        console.log('✅ Perfiles demo disponibles:', availableProfiles.length);

        // SI YA VIÓ TODOS LOS DEMO, INTENTAR CARGAR PERFILES REALES
        if (availableProfiles.length === 0) {
          console.log('🎯 Todos los perfiles demo han sido vistos - intentando cargar reales');
          
          // INTENTAR CARGAR PERFILES REALES
          try {
            const response = await profilesAPI.getAll();
            const apiProfiles = response.profiles || [];

            if (apiProfiles.length > 0) {
              const realProfiles = apiProfiles.filter((p: any) => {
                const isDemo = p._id?.startsWith('demo-') || p.userId?.username === 'demo';
                return !isDemo && !discardedProfiles.includes(p._id);
              });

              if (realProfiles.length > 0) {
                availableProfiles = [...availableProfiles, ...realProfiles];
                console.log('➕ Agregados perfiles reales:', realProfiles.length);
              } else {
                console.log('🎯 No hay más perfiles disponibles - mostrando mensaje');
                setProfiles([]);
                setLoading(false);
                return;
              }
            } else {
              console.log('🎯 No hay perfiles en el backend - mostrando mensaje');
              setProfiles([]);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.log('⚠️ No se pudieron cargar perfiles reales - mostrando mensaje');
            setProfiles([]);
            setLoading(false);
            return;
          }
        } else {
          // Si hay perfiles demo disponibles, intentar agregar reales también
          try {
            const response = await profilesAPI.getAll();
            const apiProfiles = response.profiles || [];

            if (apiProfiles.length > 0) {
              const realProfiles = apiProfiles.filter((p: any) => {
                const isDemo = p._id?.startsWith('demo-') || p.userId?.username === 'demo';
                return !isDemo && !discardedProfiles.includes(p._id);
              });

              if (realProfiles.length > 0) {
                availableProfiles = [...availableProfiles, ...realProfiles];
                console.log('➕ Agregados perfiles reales:', realProfiles.length);
              }
            }
          } catch (error) {
            console.log('⚠️ No se pudieron cargar perfiles reales');
          }
        }

        // MEZCLAR Y ESTABLECER
        const shuffled = [...availableProfiles].sort(() => Math.random() - 0.5);
        setProfiles(shuffled);
        console.log('🎉 PERFILES FINALES CARGADOS:', shuffled.length);

      } catch (error) {
        console.error('❌ Error cargando perfiles:', error);
        // Fallback mínimo
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    // Cargar perfiles cuando cambie el usuario o los perfiles descartados
    loadProfiles();
  }, [user, discardedProfiles]); // Reactivar si cambia el usuario o los perfiles descartados

  // Cargar perfiles descartados desde el backend cuando el usuario esté autenticado
  useEffect(() => {
    const loadDiscardedProfiles = async () => {
      if (user?.id) {
        try {
          const response = await userAPI.getDiscardedProfiles();
          setDiscardedProfiles(response.discardedProfiles || []);
          console.log('✅ Perfiles descartados cargados desde backend:', response.discardedProfiles.length);
        } catch (error) {
          console.error('❌ Error cargando perfiles descartados:', error);
          // Si falla, usar localStorage como fallback
          if (typeof window !== 'undefined') {
            const viewedKey = `viewedProfiles_${user.id}`;
            const viewedData = localStorage.getItem(viewedKey);
            const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];
            setDiscardedProfiles(viewedProfiles);
          }
        }
      } else {
        // Si no hay usuario, usar localStorage como fallback
        if (typeof window !== 'undefined') {
          const viewedKey = 'viewedProfiles_guest';
          const viewedData = localStorage.getItem(viewedKey);
          const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];
          setDiscardedProfiles(viewedProfiles);
        }
      }
    };

    loadDiscardedProfiles();
  }, [user?.id]);

  // Marcar perfil como visto (sincronizar con backend si está autenticado)
  const markProfileAsViewed = async (profileId: string) => {
    if (typeof window !== 'undefined') {
      const userId = user?.id || 'guest';
      
      // Si el usuario está autenticado, sincronizar con backend
      if (user?.id) {
        try {
          await userAPI.discardProfile(profileId);
          // Actualizar estado local
          if (!discardedProfiles.includes(profileId)) {
            setDiscardedProfiles([...discardedProfiles, profileId]);
          }
          console.log('✅ Perfil descartado sincronizado con backend:', profileId);
        } catch (error) {
          console.error('❌ Error descartando perfil en backend:', error);
          // Fallback a localStorage si falla el backend
          const viewedKey = `viewedProfiles_${userId}`;
          const viewedData = localStorage.getItem(viewedKey);
          const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];
          if (!viewedProfiles.includes(profileId)) {
            viewedProfiles.push(profileId);
            localStorage.setItem(viewedKey, JSON.stringify(viewedProfiles));
            setDiscardedProfiles([...discardedProfiles, profileId]);
          }
        }
      } else {
        // Si no hay usuario, usar solo localStorage
        const viewedKey = `viewedProfiles_${userId}`;
        const viewedData = localStorage.getItem(viewedKey);
        const viewedProfiles = viewedData ? JSON.parse(viewedData) : [];
        if (!viewedProfiles.includes(profileId)) {
          viewedProfiles.push(profileId);
          localStorage.setItem(viewedKey, JSON.stringify(viewedProfiles));
          setDiscardedProfiles([...discardedProfiles, profileId]);
        }
      }
    }
  };

  // Filtrar perfiles por red social seleccionada Y excluir descartados
  const filteredProfiles = useMemo(() => {
    console.log('🔍 FILTRANDO PERFILES:');
    console.log('   Total perfiles en state:', profiles.length);
    console.log('   Perfiles descartados:', discardedProfiles.length);
    console.log('   Red social seleccionada:', selectedNetwork);

    // Filtrar perfiles no descartados (usar estado del backend o localStorage)
    let availableProfiles = profiles.filter(p => !discardedProfiles.includes(p._id));

    console.log('✅ Perfiles disponibles (no descartados):', availableProfiles.length);

    // Filtrar por red social si es necesario
    if (selectedNetwork !== 'all') {
      availableProfiles = availableProfiles.filter((p) => p.socialNetwork === selectedNetwork);
      console.log('📱 Perfiles filtrados por red social:', availableProfiles.length);
    }

    console.log('🎯 RESULTADO FINAL filteredProfiles:', availableProfiles.length);

    return availableProfiles;
  }, [profiles, selectedNetwork, discardedProfiles]);

  // Resetear índice cuando cambia el filtro
  useEffect(() => {
    setCurrentIndex(0);
    setHistory([]);
  }, [selectedNetwork]);

  // Ajustar índice si es necesario o detectar cuando no hay más perfiles
  useEffect(() => {
    if (filteredProfiles.length === 0 && currentIndex > 0) {
      // No hay perfiles disponibles, el índice se ajustará automáticamente
      setCurrentIndex(0);
      setHistory([]);
    } else if (filteredProfiles.length > 0 && currentIndex >= filteredProfiles.length) {
      setCurrentIndex(0);
      setHistory([]);
    }
  }, [filteredProfiles.length, currentIndex]);

  // Handler para seleccionar red social
  const handleNetworkSelect = (network: 'all' | SocialNetwork) => {
    setSelectedNetwork(network);
    setShowNetworkSelector(false);
  };

  // Handlers simples - MARCAN COMO VISTOS Y AVANZAN
  const handleSwipeLeft = async () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) {
      console.log('⚠️ No hay perfil actual para swipe left');
      return;
    }

    // Marcar como visto ANTES de avanzar
    await markProfileAsViewed(currentProfile._id);
    console.log('👎 Swipe left - perfil descartado:', currentProfile._id);

    // Resetear historial al hacer swipe (no se puede volver atrás)
    setHistory([]);
    setBackUsed(false);

    // Avanzar al siguiente perfil disponible
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log('📍 Avanzando al siguiente perfil');
    } else {
      // Si era el último perfil disponible, verificar el estado
      console.log('🎯 Último perfil visto - verificando estado');

      // Verificar si quedan perfiles disponibles después del filtro
      const unseenProfiles = profiles.filter(p => !discardedProfiles.includes(p._id));

      console.log('📊 Análisis final:');
      console.log('   Total perfiles:', profiles.length);
      console.log('   Perfiles descartados:', discardedProfiles.length);
      console.log('   Perfiles sin ver:', unseenProfiles.length);

      if (unseenProfiles.length === 0) {
        // No hay más perfiles disponibles - mostrar mensaje
        console.log('💬 NO HAY MÁS PERFILES - mostrando mensaje');
        setProfiles([]); // Forzar mostrar mensaje de perfiles agotados
      } else {
        // Hay más perfiles en otras categorías - recargar para actualizar filtros
        console.log('🔄 Hay más perfiles disponibles - recargando');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  };

  const handleSwipeRight = async () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) {
      console.log('⚠️ No hay perfil actual para swipe right');
      return;
    }

    // Marcar como visto SIEMPRE
    await markProfileAsViewed(currentProfile._id);

    const userIdObj = currentProfile.userId as any;
    const isDemo =
      (typeof currentProfile._id === 'string' && currentProfile._id.startsWith('demo-')) ||
      userIdObj?.username === 'demo' ||
      userIdObj?._id === '000000000000000000000000';

    if (isDemo) {
      console.log('❤️ Swipe right en demo - marcado como visto');
    } else {
      console.log('❤️ Swipe right en perfil real - abrir enlace');
      if (currentProfile.link) {
        window.open(currentProfile.link, '_blank');
      }
    }

    // Resetear historial al hacer swipe (no se puede volver atrás)
    setHistory([]);
    setBackUsed(false);

    // Avanzar al siguiente perfil disponible
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      console.log('📍 Avanzando al siguiente perfil');
    } else {
      // Si era el último perfil disponible, verificar el estado
      console.log('🎯 Último perfil visto - verificando estado');

      // Verificar si quedan perfiles disponibles después del filtro
      const unseenProfiles = profiles.filter(p => !discardedProfiles.includes(p._id));

      console.log('📊 Análisis final:');
      console.log('   Total perfiles:', profiles.length);
      console.log('   Perfiles descartados:', discardedProfiles.length);
      console.log('   Perfiles sin ver:', unseenProfiles.length);

      if (unseenProfiles.length === 0) {
        // No hay más perfiles disponibles - mostrar mensaje
        console.log('💬 NO HAY MÁS PERFILES - mostrando mensaje');
        setProfiles([]); // Forzar mostrar mensaje de perfiles agotados
      } else {
        // Hay más perfiles en otras categorías - recargar para actualizar filtros
        console.log('🔄 Hay más perfiles disponibles - recargando');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  };

  const handleSwipeUp = () => {
    const currentProfile = filteredProfiles[currentIndex];
    if (!currentProfile) {
      console.log('⚠️ No hay perfil actual para swipe up');
      return;
    }

    // NO marcar como visto en swipe up (solo ver detalles)
    console.log('⭐ Swipe up - ver detalles:', currentProfile._id);

    const userIdObj = currentProfile.userId as any;
    const isDemo =
      (typeof currentProfile._id === 'string' && currentProfile._id.startsWith('demo-')) ||
      userIdObj?.username === 'demo' ||
      userIdObj?._id === '000000000000000000000000';

    if (isDemo) {
      console.log('⭐ Swipe up en demo - mostrar detalles');
      setSelectedProfile(currentProfile);
    } else {
      console.log('⭐ Swipe up en perfil real - mostrar detalles');
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

  // Mostrar loading mientras se cargan perfiles
  if (loading) {
    return (
      <div className="w-full bg-white flex items-center justify-center px-4 overflow-hidden relative fixed inset-0">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje cuando no hay perfiles disponibles
  if (filteredProfiles.length === 0 && !loading) {
    return (
      <div 
        className="w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 overflow-hidden relative fixed inset-0"
        style={{
          height: '-webkit-fill-available',
          width: '100vw',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        <div className="text-center px-6 max-w-md mx-auto">
          {/* Selector de red social - Parte superior */}
          <div className="absolute top-6 left-6 z-50">
            <button
              onClick={() => setShowNetworkSelector(true)}
              className="bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
              }}
              aria-label="Seleccionar red social"
            >
              {selectedNetwork === 'all' ? (
                <Squares2X2Icon className="h-6 w-6" />
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <SocialNetworkLogo network={selectedNetwork} className="h-6 w-6 text-gray-800" />
                </div>
              )}
            </button>
          </div>

          {/* Mensaje principal */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              No hay perfiles disponibles
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-6">
              Has visto todos los perfiles disponibles en este momento.
            </p>
            <p className="text-base sm:text-lg text-gray-500 mb-8">
              Vuelve más tarde para descubrir nuevos perfiles
            </p>
            
            {/* Botón para cambiar filtro */}
            <button
              onClick={() => setShowNetworkSelector(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl transition-colors font-semibold text-base shadow-lg hover:shadow-xl"
            >
              Cambiar filtro de red social
            </button>
          </div>
        </div>

        {/* Modal del selector de redes */}
        {showNetworkSelector && (
          <SocialNetworkSelector
            selectedNetwork={selectedNetwork}
            onSelect={(network) => {
              setSelectedNetwork(network);
              setShowNetworkSelector(false);
            }}
            onClose={() => setShowNetworkSelector(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white flex items-center justify-center px-0 sm:px-4 overflow-hidden relative fixed inset-0"
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
        maxWidth: '100%',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        height: 'calc(100vh - 10rem)',
        minHeight: 'calc(100vh - 10rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: '0'
      }}>


        {filteredProfiles.length > 0 && (
          <div className="relative w-full mx-auto profile-card-container" style={{ 
            overflow: 'visible', 
            touchAction: 'none', 
            width: '100%', 
            maxWidth: '100%',
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
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

        {/* Controles de navegación - Parte inferior - Solo se muestran cuando hay perfiles */}
        {filteredProfiles.length > 0 && (
          <div className="absolute bottom-20 md:bottom-24 left-6 right-6 flex justify-between items-center z-50">
            {/* Botón Selector de Red Social - Extremo izquierdo */}
            <button
              onClick={() => setShowNetworkSelector(true)}
              className="bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all relative z-50 flex items-center justify-center"
              style={{
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 50
              }}
              aria-label="Seleccionar red social"
            >
              {selectedNetwork === 'all' ? (
                <Squares2X2Icon className="h-6 w-6" />
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <SocialNetworkLogo network={selectedNetwork} className="h-6 w-6 text-gray-800" />
                </div>
              )}
            </button>
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
              className="bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-16 h-16 sm:w-18 sm:w-18 flex items-center justify-center transform hover:scale-110 active:scale-95 relative z-50"
              style={{
                boxShadow: '0 8px 16px rgba(239, 68, 68, 0.5), 0 4px 8px rgba(239, 68, 68, 0.4)',
                zIndex: 50
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
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 active:scale-95 relative z-50"
              style={{
                boxShadow: '0 6px 12px rgba(107, 114, 128, 0.5), 0 3px 6px rgba(107, 114, 128, 0.4)',
                zIndex: 50
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
              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transform hover:scale-110 active:scale-95 relative z-50"
              style={{
                boxShadow: '0 6px 12px rgba(234, 179, 8, 0.5), 0 3px 6px rgba(234, 179, 8, 0.4)',
                zIndex: 50
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
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transform hover:scale-110 active:scale-95 relative z-50"
              style={{
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.5), 0 4px 8px rgba(59, 130, 246, 0.4)',
                zIndex: 50
              }}
              aria-label="Ir al Enlace"
            >
              <ArrowRightIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
          </div>
        )}
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