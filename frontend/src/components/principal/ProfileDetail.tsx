'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

interface ProfileDetailProps {
  profile: Profile;
  onClose: () => void;
}

export default function ProfileDetail({ profile, onClose }: ProfileDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getNetworkColor = (network: string) => {
    const colors: Record<string, string> = {
      tiktok: 'bg-pink-500',
      youtube: 'bg-red-500',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      facebook: 'bg-blue-600',
      twitch: 'bg-purple-600',
      x: 'bg-black',
      otros: 'bg-gray-500',
    };
    return colors[network] || 'bg-gray-500';
  };

  const getNetworkName = (network: string) => {
    const names: Record<string, string> = {
      tiktok: 'TikTok',
      youtube: 'YouTube',
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitch: 'Twitch',
      x: 'X (Twitter)',
      otros: 'Otros',
    };
    return names[network] || network;
  };

  const images = profile.images && profile.images.length > 0 ? profile.images : [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden" 
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-none sm:rounded-lg max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto sm:overflow-y-auto shadow-lg border-0 sm:border border-gray-200 animate-fadeIn relative z-[10000] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${getNetworkColor(profile.socialNetwork)} text-white p-4 sm:p-6 rounded-none sm:rounded-t-lg flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <SocialNetworkLogo network={profile.socialNetwork} className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-2xl font-bold mb-1 truncate">
                  {profile.profileData.username || 
                   profile.profileData.channelName || 
                   profile.profileData.handle || 
                   profile.profileData.streamerName || 
                   profile.profileData.pageName ||
                   profile.profileData.twitterHandle ||
                   'Perfil'}
                </h2>
                <p className="text-white/90 text-xs sm:text-base truncate">{getNetworkName(profile.socialNetwork)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
            >
              <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-3 sm:p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Imágenes */}
            <div className="space-y-3 sm:space-y-4 order-1 md:order-1">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] sm:aspect-[3/4] max-h-[60vh] sm:max-h-none">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex].startsWith('http') 
                        ? images[currentImageIndex] 
                        : `http://localhost:5000${images[currentImageIndex]}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Imagen';
                      }}
                    />
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                        >
                          <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                        >
                          <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl sm:text-6xl">📷</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${
                        idx === currentImageIndex ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información */}
            <div className="space-y-4 sm:space-y-6 order-2 md:order-2">
              {/* Foto de perfil destacada - Solo en desktop */}
              <div className="hidden md:flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {images.length > 0 ? (
                    <img
                      src={images[0].startsWith('http') ? images[0] : `http://localhost:5000${images[0]}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              {profile.profileData.description && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{profile.profileData.description}</p>
                </div>
              )}

              {/* Estadísticas */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Estadísticas</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {profile.profileData.followers && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Seguidores</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.followers.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.subscribers && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Suscriptores</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.subscribers.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.videos && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Videos</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.videos.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.videoCount && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Videos</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.videoCount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.posts && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Publicaciones</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.posts.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.tweets && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Tweets</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.tweets.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.likes && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Me gusta</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {profile.profileData.likes.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {profile.profileData.game && (
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 col-span-2">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Juego Principal</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{profile.profileData.game}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enlace */}
              {profile.link && (
                <div>
                  <a
                    href={profile.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center block text-sm sm:text-base"
                  >
                    Visitar Perfil →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

