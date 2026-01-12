'use client';

import { useState } from 'react';
import { SocialNetwork, ProfileData } from '@/types';
import { profilesAPI } from '@/lib/api';
import { compressImages, formatFileSize } from '@/lib/imageUtils';

interface ProfileFormProps {
  onSuccess: (profileId: string) => void;
  onCancel: () => void;
  defaultNetwork?: SocialNetwork;
  onNetworkChange?: (network: SocialNetwork) => void;
}

export default function ProfileForm({ onSuccess, onCancel, defaultNetwork, onNetworkChange }: ProfileFormProps) {
  const [socialNetwork, setSocialNetwork] = useState<SocialNetwork>(defaultNetwork || 'tiktok');
  const [link, setLink] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');

  // Resetear profileData cuando cambia la red social
  const handleSocialNetworkChange = (network: SocialNetwork) => {
    setSocialNetwork(network);
    setProfileData({}); // Resetear datos al cambiar de red social
    // Notificar al componente padre del cambio
    if (onNetworkChange) {
      onNetworkChange(network);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Validar número total de imágenes (existentes + nuevas)
      const totalImages = images.length + newFiles.length;
      if (totalImages > 3) {
        setError(`Máximo 3 imágenes permitidas. Ya tienes ${images.length} imagen(es).`);
        e.target.value = ''; // Limpiar input
        return;
      }
      
      // Limitar a 3 imágenes máximo
      const filesToAdd = newFiles.slice(0, 3 - images.length);
      
      // Crear previews de los archivos nuevos
      const previewPromises = filesToAdd.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.onerror = () => {
            resolve(''); // Preview vacío si hay error
          };
          reader.readAsDataURL(file);
        });
      });
      
      const newPreviews = await Promise.all(previewPromises);
      
      // Comprimir imágenes nuevas
      setCompressing(true);
      setCompressionProgress({ current: 0, total: filesToAdd.length });
      setError(''); // Limpiar errores anteriores
      
      try {
        const compressedFiles = await compressImages(
          filesToAdd,
          {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.85,
            maxSizeMB: 2,
          },
          (current, total) => {
            setCompressionProgress({ current, total });
          }
        );
        
        // Actualizar previews con las imágenes comprimidas
        const compressedPreviews = await Promise.all(
          compressedFiles.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve(e.target?.result as string);
              };
              reader.onerror = () => {
                resolve('');
              };
              reader.readAsDataURL(file);
            });
          })
        );
        
        // Añadir nuevas imágenes a las existentes (no reemplazar)
        setImages([...images, ...compressedFiles]);
        setImagePreviews([...imagePreviews, ...compressedPreviews.filter(p => p !== '')]);
        setCompressing(false);
        setCompressionProgress({ current: 0, total: 0 });
      } catch (error) {
        console.error('Error comprimiendo imágenes:', error);
        // Si falla la compresión, usar archivos originales
        setImages([...images, ...filesToAdd]);
        setCompressing(false);
        setCompressionProgress({ current: 0, total: 0 });
        setError('Error al comprimir algunas imágenes. Se usarán los archivos originales.');
      }
      
      // Limpiar input para permitir seleccionar el mismo archivo de nuevo
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validación básica
      if (!link || !link.trim()) {
        setError('El enlace del perfil es requerido');
        setLoading(false);
        return;
      }

      // Limpiar profileData: eliminar campos vacíos, undefined, null y strings vacíos
      // Pero mantener valores numéricos válidos (incluyendo 0 si el usuario lo introdujo)
      const cleanedProfileData: Record<string, any> = {};
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string') {
            // Incluir strings no vacíos
            if (value.trim() !== '') {
              cleanedProfileData[key] = value;
            }
          } else if (typeof value === 'number') {
            // Incluir números válidos (no NaN, no infinito, >= 0)
            if (!isNaN(value) && isFinite(value) && value >= 0) {
              cleanedProfileData[key] = value;
            }
          } else {
            // Incluir otros tipos (objetos, arrays, boolean, etc.)
            cleanedProfileData[key] = value;
          }
        }
      });

      // Crear FormData
      const formData = new FormData();
      formData.append('socialNetwork', socialNetwork);
      formData.append('link', link.trim());
      
      // Asegurarse de que profileData sea un string JSON válido
      try {
        const profileDataString = JSON.stringify(cleanedProfileData);
        formData.append('profileData', profileDataString);
      } catch (jsonError) {
        console.error('Error serializando profileData:', jsonError);
        setError('Error al procesar los datos del perfil. Por favor, intenta de nuevo.');
        setLoading(false);
        return;
      }
      
      // Añadir imágenes si existen
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      console.log('📤 Enviando perfil:', { socialNetwork, link, profileData: cleanedProfileData, imagesCount: images.length });
      
      const response = await profilesAPI.create(formData);
      
      console.log('✅ Perfil creado exitosamente:', response);
      
      // Resetear formulario antes de llamar onSuccess
      setLink('');
      setImages([]);
      setImagePreviews([]);
      setProfileData({});
      setError('');
      setLoading(false);
      setCompressing(false);
      setCompressionProgress({ current: 0, total: 0 });
      
      // Llamar onSuccess con el ID del perfil
      if (response && response.profile && response.profile._id) {
        onSuccess(response.profile._id);
      } else {
        throw new Error('El servidor no devolvió un perfil válido');
      }
    } catch (err: any) {
      console.error('❌ Error creando perfil:', err);
      let errorMessage = 'Error al crear el perfil. Por favor, intenta de nuevo.';
      
      if (err.response) {
        // El servidor respondió con un error
        const serverError = err.response.data?.error || err.response.data?.message;
        errorMessage = serverError || `Error ${err.response.status}: No se pudo crear el perfil`;
        console.error('Error del servidor:', err.response.data);
      } else if (err.request) {
        // No se pudo conectar al servidor
        errorMessage = 'No se pudo conectar al servidor. Por favor, verifica tu conexión.';
        console.error('Error de conexión:', err.request);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="@usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, followers: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="1000000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <input
                type="number"
                value={profileData.videos ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, videos: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
                rows={3}
                placeholder="Describe tu perfil de TikTok..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="Mi Canal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suscriptores
              </label>
              <input
                type="number"
                value={profileData.subscribers ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, subscribers: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="50000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <input
                type="number"
                value={profileData.videoCount ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, videoCount: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="200"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
                rows={3}
                placeholder="Describe tu canal de YouTube..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="@usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, followers: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="100000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publicaciones
              </label>
              <input
                type="number"
                value={profileData.posts ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, posts: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
                rows={3}
                placeholder="Describe tu perfil de Instagram..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="StreamerName"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, followers: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="50000"
                min="0"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="Just Chatting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
                rows={3}
                placeholder="Describe tu canal de Twitch..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="Mi Página"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Me gusta
              </label>
              <input
                type="number"
                value={profileData.likes ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, likes: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="10000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
                rows={3}
                placeholder="Describe tu página de Facebook..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="@usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguidores
              </label>
              <input
                type="number"
                value={profileData.followers ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, followers: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="50000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tweets
              </label>
              <input
                type="number"
                value={profileData.tweets ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setProfileData({ ...profileData, tweets: val === '' ? undefined : parseInt(val) || undefined });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
                placeholder="1000"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={profileData.description || ''}
                onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
                rows={3}
                placeholder="Describe tu perfil de X (Twitter)..."
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400 resize-none"
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
          onChange={(e) => handleSocialNetworkChange(e.target.value as SocialNetwork)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400"
          placeholder="https://..."
        />
      </div>

      {renderFields()}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes (máximo 3)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={compressing || loading || images.length >= 3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        
        {compressing && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Comprimiendo imágenes...</span>
              <span>{compressionProgress.current} / {compressionProgress.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(compressionProgress.current / compressionProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
        
        {images.length > 0 && !compressing && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-600 font-medium">
              {images.length} / 3 imagen(es) seleccionada(s)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                    aria-label="Eliminar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded-b-lg">
                    {formatFileSize(images[index]?.size || 0)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Total: {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
            </p>
          </div>
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
          disabled={loading || !link || compressing}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {compressing ? 'Comprimiendo...' : loading ? 'Subiendo...' : 'Crear Perfil'}
        </button>
      </div>
    </form>
  );
}

