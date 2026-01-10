'use client';

import { Profile } from '@/types';
import { ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

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

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Header */}
        <div className={`${getNetworkColor(profile.socialNetwork)} h-16 flex items-center justify-center`}>
          <h2 className="text-white font-bold text-lg">
            {profile.profileData.username || 
             profile.profileData.channelName || 
             profile.profileData.handle || 
             profile.profileData.streamerName || 
             profile.profileData.pageName ||
             profile.profileData.twitterHandle ||
             'Perfil'}
          </h2>
        </div>

        {/* Imagen */}
        <div className="relative h-64 bg-gray-200">
          {profile.images && profile.images.length > 0 ? (
            <img
              src={profile.images[0].startsWith('http') ? profile.images[0] : `http://localhost:5000${profile.images[0]}`}
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
        <div className="p-6 pb-20">
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

        {/* Botones de acción (solo visual) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 px-4">
          <div className="bg-red-500 text-white p-3 rounded-md shadow-sm">
            <ArrowLeftIcon className="h-6 w-6" />
          </div>
          <div className="bg-yellow-500 text-white p-3 rounded-md shadow-sm">
            <ArrowUpIcon className="h-6 w-6" />
          </div>
          <div className="bg-green-500 text-white p-3 rounded-md shadow-sm">
            <ArrowUturnLeftIcon className="h-6 w-6" />
          </div>
          <div className="bg-blue-500 text-white p-3 rounded-md shadow-sm">
            <ArrowRightIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        👁️ Así es como se verá tu perfil promocionado
      </p>
    </div>
  );
}

