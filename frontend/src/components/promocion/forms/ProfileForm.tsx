'use client';

import { useState } from 'react';
import { SocialNetwork, ProfileData } from '@/types';
import { profilesAPI } from '@/lib/api';

interface ProfileFormProps {
  onSuccess: (profileId: string) => void;
  onCancel: () => void;
  defaultNetwork?: SocialNetwork;
}

export default function ProfileForm({ onSuccess, onCancel, defaultNetwork }: ProfileFormProps) {
  const [socialNetwork, setSocialNetwork] = useState<SocialNetwork>(defaultNetwork || 'tiktok');
  const [link, setLink] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('socialNetwork', socialNetwork);
      formData.append('link', link);
      formData.append('profileData', JSON.stringify(profileData));
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await profilesAPI.create(formData);
      onSuccess(response.profile._id);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear el perfil');
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (socialNetwork) {
      case 'tiktok':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario de TikTok
              </label>
              <input
                type="text"
                value={profileData.username || ''}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="@usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers || ''}
                onChange={(e) => setProfileData({ ...profileData, followers: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <input
                type="number"
                value={profileData.videos || ''}
                onChange={(e) => setProfileData({ ...profileData, videos: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="500"
              />
            </div>
          </>
        );

      case 'youtube':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Canal
              </label>
              <input
                type="text"
                value={profileData.channelName || ''}
                onChange={(e) => setProfileData({ ...profileData, channelName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Mi Canal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suscriptores
              </label>
              <input
                type="number"
                value={profileData.subscribers || ''}
                onChange={(e) => setProfileData({ ...profileData, subscribers: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <input
                type="number"
                value={profileData.videoCount || ''}
                onChange={(e) => setProfileData({ ...profileData, videoCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="200"
              />
            </div>
          </>
        );

      case 'instagram':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handle (@)
              </label>
              <input
                type="text"
                value={profileData.handle || ''}
                onChange={(e) => setProfileData({ ...profileData, handle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="@usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers || ''}
                onChange={(e) => setProfileData({ ...profileData, followers: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publicaciones
              </label>
              <input
                type="number"
                value={profileData.posts || ''}
                onChange={(e) => setProfileData({ ...profileData, posts: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="500"
              />
            </div>
          </>
        );

      case 'twitch':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Streamer
              </label>
              <input
                type="text"
                value={profileData.streamerName || ''}
                onChange={(e) => setProfileData({ ...profileData, streamerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="StreamerName"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers || ''}
                onChange={(e) => setProfileData({ ...profileData, followers: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Juego Principal
              </label>
              <input
                type="text"
                value={profileData.game || ''}
                onChange={(e) => setProfileData({ ...profileData, game: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Just Chatting"
              />
            </div>
          </>
        );

      case 'facebook':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Página
              </label>
              <input
                type="text"
                value={profileData.pageName || ''}
                onChange={(e) => setProfileData({ ...profileData, pageName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Mi Página"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Me gusta
              </label>
              <input
                type="number"
                value={profileData.likes || ''}
                onChange={(e) => setProfileData({ ...profileData, likes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="10000"
              />
            </div>
          </>
        );

      case 'x':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Handle (@)
              </label>
              <input
                type="text"
                value={profileData.twitterHandle || ''}
                onChange={(e) => setProfileData({ ...profileData, twitterHandle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="@usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers || ''}
                onChange={(e) => setProfileData({ ...profileData, followers: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tweets
              </label>
              <input
                type="number"
                value={profileData.tweets || ''}
                onChange={(e) => setProfileData({ ...profileData, tweets: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="1000"
              />
            </div>
          </>
        );

      default:
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={profileData.title || ''}
                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Título"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Descripción..."
              />
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Red Social *
        </label>
        <select
          value={socialNetwork}
          onChange={(e) => setSocialNetwork(e.target.value as SocialNetwork)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
          <option value="instagram">Instagram</option>
          <option value="twitch">Twitch</option>
          <option value="facebook">Facebook</option>
          <option value="x">X (Twitter)</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enlace del Perfil *
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          placeholder="https://..."
        />
      </div>

      {renderFields()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes (máximo 10)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        {images.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            {images.length} imagen(es) seleccionada(s)
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !link}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : 'Crear Perfil'}
        </button>
      </div>
    </form>
  );
}

