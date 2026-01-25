'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { favoritesAPI } from '@/lib/api';
import { Profile } from '@/types';
import ProfileDetail from '@/components/principal/ProfileDetail';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl } from '@/lib/imageUtils';

export default function FavoritosPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollPosition <= 1) {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoritesAPI.getFavorites();
      setFavorites(response.profiles || []);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (removingId) return;
    
    setRemovingId(profileId);
    try {
      await favoritesAPI.removeFavorite(profileId);
      await loadFavorites();
      // Si el perfil eliminado estaba seleccionado, cerrar la vista de detalle
      if (selectedProfile && selectedProfile._id === profileId) {
        setSelectedProfile(null);
      }
    } catch (error) {
      console.error('Error eliminando favorito:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleBack = () => {
    router.push('/ajustes');
  };

  const getNetworkColor = (network: string) => {
    const colors: Record<string, string> = {
      tiktok: 'bg-pink-500',
      youtube: 'bg-red-500',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      facebook: 'bg-blue-600',
      linkedin: 'bg-blue-700',
      twitch: 'bg-purple-600',
      x: 'bg-black',
      otros: 'bg-gray-500',
    };
    return colors[network] || 'bg-gray-500';
  };

  // Si hay un perfil seleccionado, mostrar ProfileDetail
  if (selectedProfile) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <ProfileDetail 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-white px-0 sm:px-4" 
      style={{ 
        height: '-webkit-fill-available',
        width: '100vw', 
        touchAction: 'pan-y', 
        overflow: 'auto', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        WebkitOverflowScrolling: 'touch'
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto w-full min-h-full overflow-x-hidden flex flex-col" style={{ 
        paddingTop: '1rem', 
        paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
        minHeight: '100%'
      }}>
        
        {/* Botón Atrás */}
        <div className="mb-4 px-4 flex-shrink-0">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Atrás</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-6 text-center px-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⭐ Perfiles Favoritos</h1>
          <p className="text-gray-600">Tus perfiles guardados</p>
        </div>

        {/* Contenido */}
        <div className="flex-1 px-4 pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <p className="text-gray-600 text-lg mb-2">No tienes perfiles favoritos aún</p>
              <p className="text-gray-500 text-sm">Marca perfiles con la estrella para guardarlos aquí</p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {favorites.map((profile) => (
                <div
                  key={profile._id}
                  onClick={() => setSelectedProfile(profile)}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Imagen */}
                    <div className="flex-shrink-0">
                      {profile.images && profile.images.length > 0 ? (
                        <img
                          src={getImageUrl(profile.images[0])}
                          alt="Perfil"
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-3xl">📷</span>
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`${getNetworkColor(profile.socialNetwork)} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <SocialNetworkLogo network={profile.socialNetwork} className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {profile.profileData.username ||
                           profile.profileData.channelName ||
                           profile.profileData.handle ||
                           profile.profileData.title ||
                           profile.profileData.streamerName ||
                           profile.profileData.pageName ||
                           profile.profileData.twitterHandle ||
                           'Perfil'}
                        </h3>
                      </div>
                      {profile.profileData.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {profile.profileData.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {profile.profileData.followers && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            👥 {profile.profileData.followers.toLocaleString()}
                          </span>
                        )}
                        {profile.profileData.subscribers && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            👥 {profile.profileData.subscribers.toLocaleString()}
                          </span>
                        )}
                        {profile.profileData.videos && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            🎥 {profile.profileData.videos}
                          </span>
                        )}
                        {profile.profileData.posts && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            📸 {profile.profileData.posts}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={(e) => handleRemoveFavorite(profile._id, e)}
                      disabled={removingId === profile._id}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar de favoritos"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
