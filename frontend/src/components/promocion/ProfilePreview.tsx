'use client';

import { Profile } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

interface ProfilePreviewProps {
  profile: Profile;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {
  const getNetworkColor = (network: string) => {
    const colors: Record<string, string> = {
      tiktok: 'bg-pink-500',
      youtube: 'bg-red-500',
      instagram: 'bg-purple-600',
      facebook: 'bg-blue-600',
      twitch: 'bg-purple-600',
      x: 'bg-black',
      otros: 'bg-gray-500',
    };
    return colors[network] || 'bg-gray-500';
  };

  // Obtener URL base del API
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${imagePath}`;
  };

  // Icono de planeta para "otros"
  const PlanetIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Header con logo */}
        <div className={`${getNetworkColor(profile.socialNetwork)} h-16 flex items-center justify-center gap-2`}>
          {profile.socialNetwork === 'otros' ? (
            <PlanetIcon className="w-6 h-6 text-white" />
          ) : (
            <SocialNetworkLogo network={profile.socialNetwork} className="w-6 h-6 text-white" />
          )}
          <h2 className="text-white font-bold text-lg">
            {profile.profileData.title ||
             profile.profileData.username || 
             profile.profileData.channelName || 
             profile.profileData.handle || 
             profile.profileData.streamerName || 
             profile.profileData.pageName ||
             profile.profileData.twitterHandle ||
             'Mi Perfil'}
          </h2>
        </div>

        {/* Imagen */}
        <div className="relative h-64 bg-gray-200">
          {profile.images && profile.images.length > 0 ? (
            <img
              src={getImageUrl(profile.images[0])}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Imagen';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">📷</span>
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

