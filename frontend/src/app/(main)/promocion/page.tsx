'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import ProfileForm from '@/components/promocion/forms/ProfileForm';
import PlanSelector from '@/components/promocion/PlanSelector';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

interface SocialNetworkOption {
  id: SocialNetwork;
  name: string;
  color: string;
  description: string;
  stats: string[];
}

const socialNetworks: SocialNetworkOption[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
    description: 'La red social visual más popular',
    stats: ['Seguidores', 'Publicaciones', 'Engagement'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'bg-black',
    description: 'La plataforma de videos cortos',
    stats: ['Seguidores', 'Videos', 'Likes'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    color: 'bg-red-600',
    description: 'La plataforma de video más grande',
    stats: ['Suscriptores', 'Videos', 'Visualizaciones'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: 'bg-blue-600',
    description: 'La red social más grande del mundo',
    stats: ['Me gusta', 'Seguidores', 'Alcance'],
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    color: 'bg-black',
    description: 'La plataforma de noticias en tiempo real',
    stats: ['Seguidores', 'Tweets', 'Retweets'],
  },
  {
    id: 'twitch',
    name: 'Twitch',
    color: 'bg-purple-600',
    description: 'La plataforma de streaming en vivo',
    stats: ['Seguidores', 'Visualizaciones', 'Juego Principal'],
  },
  {
    id: 'otros',
    name: 'Otras Redes',
    color: 'bg-gray-600',
    description: 'Otras plataformas sociales',
    stats: ['Personalizado'],
  },
];

export default function PromocionPage() {
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<SocialNetwork | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfiles();
    } else {
      setLoading(false);
    }
    
    // Verificar si hay parámetros de retorno de PayPal
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const PayerID = params.get('PayerID');
      const paypalSuccess = params.get('paypal_success');
      
      if (token && PayerID) {
        // Capturar el pago de PayPal
        handlePayPalReturn(token, PayerID);
      } else if (paypalSuccess === 'true') {
        // Pago completado exitosamente
        loadProfiles();
        // Limpiar URL
        window.history.replaceState({}, '', '/promocion');
      }
    }
  }, [user]);

  const handlePayPalReturn = async (token: string, PayerID: string) => {
    try {
      // Buscar el pago pendiente y capturarlo
      // Esto se manejará en el backend cuando se implemente la ruta de retorno
      console.log('PayPal return:', token, PayerID);
      loadProfiles();
      window.history.replaceState({}, '', '/promocion');
    } catch (error) {
      console.error('Error procesando retorno de PayPal:', error);
    }
  };

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getMyProfiles();
      setProfiles(response.profiles || []);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCreated = async (profileId: string, createdProfile?: Profile) => {
    console.log('✅ Perfil creado, ID:', profileId);
    console.log('📦 Perfil recibido:', createdProfile);
    if (!profileId) {
      console.error('❌ Error: No se recibió un ID de perfil válido');
      return;
    }
    
    try {
      // Si tenemos el perfil creado, añadirlo directamente a la lista
      if (createdProfile) {
        console.log('🖼️ Imágenes del perfil creado:', createdProfile.images);
        setProfiles(prev => {
          // Evitar duplicados
          const exists = prev.find(p => p._id === createdProfile._id);
          if (exists) {
            return prev.map(p => p._id === createdProfile._id ? createdProfile : p);
          }
          return [createdProfile, ...prev];
        });
      } else {
        // Si no, recargar perfiles
        await loadProfiles();
      }
      
      // Configurar el estado para mostrar el selector de planes
      setSelectedNetwork(null);
      setSelectedProfile(profileId);
      setShowPlanSelector(true);
    } catch (error) {
      console.error('Error después de crear perfil:', error);
      // Si hay error cargando, aún así intentar mostrar el selector
      setSelectedNetwork(null);
      setSelectedProfile(profileId);
      setShowPlanSelector(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPlanSelector(false);
    setSelectedProfile(null);
    loadProfiles();
  };

  const handleSelectNetwork = (network: SocialNetwork) => {
    setSelectedNetwork(network);
    setCurrentNetwork(network);
  };

  const handleBack = () => {
    setSelectedNetwork(null);
    setSelectedProfile(null);
    setShowPlanSelector(false);
  };

  // Vista de selección de planes
  if (showPlanSelector && selectedProfile) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-white overflow-hidden px-0 sm:px-4">
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
          <div className="text-center py-4 flex-shrink-0">
            <button
              onClick={handleBack}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Volver a mis perfiles
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <PlanSelector 
              profileId={selectedProfile} 
              profile={(() => {
                const foundProfile = profiles.find(p => p._id === selectedProfile);
                if (foundProfile) {
                  console.log('✅ Perfil encontrado para preview:', {
                    id: foundProfile._id,
                    images: foundProfile.images,
                    imagesCount: foundProfile.images?.length || 0
                  });
                } else {
                  console.warn('⚠️ Perfil no encontrado en lista para preview:', selectedProfile);
                }
                return foundProfile;
              })()}
              onPaymentSuccess={handlePaymentSuccess} 
            />
          </div>
        </div>
      </div>
    );
  }

  // Vista de formulario de RRSS
  if (selectedNetwork) {
    // Usar currentNetwork si está definido, sino usar selectedNetwork
    const displayNetwork = currentNetwork || selectedNetwork;
    
    return (
      <div className="min-h-screen bg-white pt-16 sm:pt-20 pb-20 sm:pb-24 px-0 sm:px-4">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-4 sm:mb-6 px-4 sm:px-0">
            <button
              onClick={handleBack}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Volver a redes sociales
            </button>
          </div>
          <div className="bg-white rounded-none sm:rounded-lg shadow-lg p-4 sm:p-6">
            <div className="mb-6">
              {(() => {
                const network = socialNetworks.find(n => n.id === displayNetwork);
                return network ? (
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-12 h-12 ${network.color} rounded-lg flex items-center justify-center`}>
                      <SocialNetworkLogo network={network.id} className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{network.name}</h2>
                      <p className="text-gray-600">{network.description}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
            <ProfileForm 
              defaultNetwork={selectedNetwork}
              onSuccess={(profileId, profile) => handleProfileCreated(profileId, profile)} 
              onCancel={handleBack}
              onNetworkChange={setCurrentNetwork}
            />
          </div>
        </div>
      </div>
    );
  }

  // Vista principal - Selección de RRSS
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20 pb-20 sm:pb-24 px-0 sm:px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Promociona tu Perfil</h1>
          <p className="text-gray-600">Selecciona la red social que quieres promocionar</p>
        </div>

        {/* Grid de RRSS más utilizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {socialNetworks.map((network) => {
            const profileCount = profiles.filter(p => p.socialNetwork === network.id).length;
            return (
              <button
                key={network.id}
                onClick={() => handleSelectNetwork(network.id)}
                className={`
                  bg-white rounded-xl shadow-md p-8 text-left hover:shadow-lg transition-all
                  hover:scale-105 transform border-2 border-transparent hover:border-primary-200
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 ${network.color} rounded-lg flex items-center justify-center`}>
                    <SocialNetworkLogo network={network.id} className="w-9 h-9 text-white" />
                  </div>
                  {profileCount > 0 && (
                    <span className="bg-primary-100 text-primary-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {profileCount}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{network.name}</h3>
                <p className="text-base text-gray-600 mb-4">{network.description}</p>
                <div className="flex flex-wrap gap-2">
                  {network.stats.map((stat, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {stat}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mis perfiles */}
        {profiles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Mis Perfiles Creados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {profiles.map((profile) => {
                const network = socialNetworks.find(n => n.id === profile.socialNetwork);
                return (
                  <div key={profile._id} className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {network && (
                          <div className={`w-10 h-10 ${network.color} rounded-lg flex items-center justify-center`}>
                            <SocialNetworkLogo network={profile.socialNetwork} className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {profile.profileData.username || 
                             profile.profileData.channelName || 
                             profile.profileData.handle || 
                             profile.profileData.streamerName || 
                             'Perfil'}
                          </h3>
                          <p className="text-sm text-gray-500">{network?.name || profile.socialNetwork}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`font-semibold ${
                          profile.isActive ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {profile.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      {profile.isPaid && profile.paidUntil && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Válido hasta:</span>
                          <span className="text-gray-900">
                            {new Date(profile.paidUntil).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {!profile.isPaid ? (
                      <button
                        onClick={() => {
                          setSelectedProfile(profile._id);
                          setShowPlanSelector(true);
                        }}
                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      >
                        Activar Promoción
                      </button>
                    ) : (
                      <div className="w-full bg-green-50 text-green-700 py-2 px-4 rounded-lg text-center font-medium">
                        Promoción Activa
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
