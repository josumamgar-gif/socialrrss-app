'use client';

import { useState } from 'react';
import { Profile } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl, placeholderImage } from '@/lib/imageUtils';

interface ProfilePreviewProps {
  profile: Profile;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getNetworkColor = (network: string) => {
    const colors: Record<string, string> = {
      tiktok: 'bg-pink-500',
      youtube: 'bg-red-500',
      instagram: 'bg-purple-600',
      facebook: 'bg-blue-600',
      linkedin: 'bg-blue-700',
      twitch: 'bg-purple-600',
      x: 'bg-black',
      otros: 'bg-gray-500',
    };
    return colors[network] || 'bg-gray-500';
  };

  // Icono de planeta para "otros"
  const PlanetIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );

  const getProfileTitle = () => {
    return profile.profileData.title ||
           profile.profileData.username || 
           profile.profileData.channelName || 
           profile.profileData.handle || 
           profile.profileData.streamerName || 
           profile.profileData.pageName ||
           profile.profileData.twitterHandle ||
           'Mi Perfil';
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

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Header con título centrado */}
        <div className={`${getNetworkColor(profile.socialNetwork)} h-20 flex items-center justify-center px-4 relative`}>
          {/* Logo a la izquierda */}
          <div className="absolute left-4">
            {profile.socialNetwork === 'otros' ? (
              <PlanetIcon className="w-7 h-7 text-white" />
            ) : (
              <SocialNetworkLogo network={profile.socialNetwork} className="w-7 h-7 text-white" />
            )}
          </div>
          {/* Título centrado */}
          <h2 className="text-white font-bold text-lg text-center flex-1 px-12">
            {getProfileTitle()}
          </h2>
        </div>

        {/* Galería de imágenes */}
        <div className="relative h-80 bg-gray-200">
          {images.length > 0 ? (
            <>
              <img
                key={images[currentImageIndex]}
                src={getImageUrl(images[currentImageIndex])}
                alt={`Preview ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
              
              {/* Controles de navegación si hay múltiples imágenes */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                    aria-label="Imagen anterior"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                    aria-label="Imagen siguiente"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Indicador de imágenes */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Contador de imágenes */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <span className="text-4xl mb-2">📷</span>
              <p className="text-xs text-gray-500">No hay imágenes disponibles</p>
              <p className="text-xs text-gray-400 mt-1">Añade imágenes al crear el perfil</p>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="p-6 pb-6">
          <p className="text-gray-600 mb-4">
            {profile.profileData.description || 'Tu perfil se mostrará así a otros usuarios'}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.profileData.followers && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                👥 {profile.profileData.followers.toLocaleString()} seguidores
              </span>
            )}
            {profile.profileData.videos && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                🎥 {profile.profileData.videos} videos
              </span>
            )}
            {profile.profileData.subscribers && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                👥 {profile.profileData.subscribers.toLocaleString()} suscriptores
              </span>
            )}
            {profile.profileData.posts && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                📸 {profile.profileData.posts} publicaciones
              </span>
            )}
            {profile.profileData.tweets && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                🐦 {profile.profileData.tweets} tweets
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        👁️ Así es como se verá tu perfil promocionado
      </p>
    </div>
  );
}

