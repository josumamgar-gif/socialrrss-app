'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { compressImages, getImageUrl } from '@/lib/imageUtils';

export default function MyProfilesGallery() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estados para edición
  const [editData, setEditData] = useState<{
    profileData: Record<string, any>;
    link: string;
    images: File[];
    imagePreviews: string[];
  } | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getMyProfiles();
      // Solo mostrar perfiles pagados/activos
      const activeProfiles = (response.profiles || []).filter(
        (p: Profile) => p.isPaid || p.isActive
      );
      setProfiles(activeProfiles);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (profile: Profile) => {
    setEditingId(profile._id);
    setEditData({
      profileData: { ...profile.profileData },
      link: profile.link,
      images: [], // Nuevas imágenes a subir
      imagePreviews: profile.images || [], // Imágenes existentes (solo URLs)
    });
    setError(null);
    setSuccess(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData(null);
    setError(null);
    setSuccess(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, profileId: string) => {
    if (!e.target.files || !editData) return;

    const newFiles = Array.from(e.target.files);
    const totalImages = editData.images.length + editData.imagePreviews.length + newFiles.length;
    
    if (totalImages > 3) {
      setError('Máximo 3 imágenes permitidas');
      return;
    }

    const filesToAdd = newFiles.slice(0, 3 - editData.imagePreviews.length - editData.images.length);
    
    try {
      const compressedFiles = await compressImages(filesToAdd, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        maxSizeMB: 2,
      });

      const previews = await Promise.all(
        compressedFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
          });
        })
      );

      setEditData({
        ...editData,
        images: [...editData.images, ...compressedFiles],
        imagePreviews: [...editData.imagePreviews, ...previews.filter(p => p !== '')],
      });
      e.target.value = '';
    } catch (err) {
      setError('Error al procesar imágenes');
    }
  };

  const removeImage = (index: number) => {
    if (!editData) return;
    // Las imágenes existentes están primero en imagePreviews, luego las nuevas
    const existingCount = editData.imagePreviews.length - editData.images.length;
    
    if (index < existingCount) {
      // Eliminar imagen existente (solo del preview, no se puede eliminar realmente sin backend)
      const newPreviews = [...editData.imagePreviews];
      newPreviews.splice(index, 1);
      setEditData({ ...editData, imagePreviews: newPreviews });
    } else {
      // Eliminar imagen nueva
      const newImages = [...editData.images];
      const newPreviews = [...editData.imagePreviews];
      const newIndex = index - existingCount;
      newImages.splice(newIndex, 1);
      newPreviews.splice(index, 1);
      setEditData({ ...editData, images: newImages, imagePreviews: newPreviews });
    }
  };

  const handleSave = async (profileId: string) => {
    if (!editData) return;

    setSavingId(profileId);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('profileData', JSON.stringify(editData.profileData));
      formData.append('link', editData.link);
      
      editData.images.forEach((file) => {
        formData.append('images', file);
      });

      await profilesAPI.update(profileId, formData);
      setSuccess('Perfil actualizado exitosamente');
      await loadProfiles();
      setTimeout(() => {
        cancelEdit();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar el perfil');
    } finally {
      setSavingId(null);
    }
  };


  const getNetworkColor = (network: SocialNetwork) => {
    const colors: Record<SocialNetwork, string> = {
      instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
      tiktok: 'bg-black',
      youtube: 'bg-red-600',
      facebook: 'bg-blue-600',
      linkedin: 'bg-blue-700',
      x: 'bg-black',
      twitch: 'bg-purple-600',
      otros: 'bg-gray-600',
    };
    return colors[network] || 'bg-gray-600';
  };


  if (loading) {
    return (
      <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No tienes perfiles contratados aún</p>
          <Link
            href="/promocion"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
          >
            Crear mi primer perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Perfiles Contratados</h2>
        <p className="text-gray-600">Gestiona y edita tus perfiles promocionados</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => {
          const isEditing = editingId === profile._id;
          const currentEditData = isEditing && editData ? editData : null;

          return (
            <div
              key={profile._id}
              className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Header */}
              <div className={`${getNetworkColor(profile.socialNetwork)} h-16 flex items-center justify-center gap-2 px-4`}>
                <SocialNetworkLogo network={profile.socialNetwork} className="w-6 h-6 text-white" />
                <h3 className="text-white font-bold text-lg flex-1 truncate">
                  {profile.profileData?.username ||
                   profile.profileData?.channelName ||
                   profile.profileData?.handle ||
                   profile.profileData?.title ||
                   'Mi Perfil'}
                </h3>
                {!isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(profile)}
                      className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      title="Editar perfil"
                    >
                      <PencilIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-4">
                {isEditing && currentEditData ? (
                  <div className="space-y-4">
                    {/* Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enlace
                      </label>
                      <input
                        type="url"
                        value={currentEditData.link}
                        onChange={(e) => setEditData({ ...currentEditData, link: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 text-sm"
                      />
                    </div>

                    {/* Campos dinámicos según red social */}
                    <div className="space-y-3">
                      {Object.entries(currentEditData.profileData).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          {typeof value === 'number' ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => {
                                const newData = { ...currentEditData.profileData };
                                newData[key] = e.target.value ? parseInt(e.target.value) : undefined;
                                setEditData({ ...currentEditData, profileData: newData });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 text-sm"
                            />
                          ) : (
                            <input
                              type="text"
                              value={value || ''}
                              onChange={(e) => {
                                const newData = { ...currentEditData.profileData };
                                newData[key] = e.target.value;
                                setEditData({ ...currentEditData, profileData: newData });
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Imágenes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imágenes ({currentEditData.imagePreviews.length}/3)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, profile._id)}
                        disabled={currentEditData.imagePreviews.length >= 3 || savingId === profile._id}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                      />
                      {currentEditData.imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {currentEditData.imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative">
                              <img
                                src={preview.startsWith('data:') ? preview : getImageUrl(preview)}
                                alt={`Preview ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleSave(profile._id)}
                        disabled={savingId === profile._id}
                        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
                      >
                        <CheckIcon className="h-4 w-4" />
                        {savingId === profile._id ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={savingId === profile._id}
                        className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-sm font-medium"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Vista de solo lectura */}
                    <div className="mb-4">
                      {profile.images && profile.images.length > 0 ? (
                        <img
                          src={getImageUrl(profile.images[0])}
                          alt="Perfil"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">📷</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold">Enlace:</span>{' '}
                        <a href={profile.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {profile.link}
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Estado:</span>{' '}
                        <span className={profile.isActive ? 'text-green-600' : 'text-gray-500'}>
                          {profile.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                      {profile.planType && (
                        <p className="text-gray-600">
                          <span className="font-semibold">Plan:</span>{' '}
                          {profile.planType === 'monthly' ? 'Mensual' :
                           profile.planType === 'yearly' ? 'Anual' :
                           profile.planType === 'lifetime' ? 'Permanente' : profile.planType}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
