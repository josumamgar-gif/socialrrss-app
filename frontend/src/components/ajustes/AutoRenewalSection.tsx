'use client';

import { useState, useEffect } from 'react';
import { profilesAPI } from '@/lib/api';

export default function AutoRenewalSection() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await profilesAPI.getMyProfiles();
      // Solo mostrar perfiles con planes limitados (monthly o yearly), no lifetime
      const limitedPlans = (response.profiles || []).filter(
        (p: any) => p.planType === 'monthly' || p.planType === 'yearly'
      );
      setProfiles(limitedPlans);
    } catch (error) {
      console.error('Error cargando perfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRenewal = async (profileId: string, currentStatus: boolean) => {
    // Aquí implementarías la lógica para deshabilitar/habilitar renovación automática
    // Por ahora, solo mostramos la interfaz
    alert('Funcionalidad de renovación automática próximamente disponible');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl w-full mx-auto">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Renovación Automática
        </h2>
        <p className="text-sm text-gray-600">
        Gestiona la renovación automática de tus planes con duración limitada. 
        Los planes permanentes no tienen renovación.
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-center">
            No tienes perfiles con planes de duración limitada.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {profile.profileData?.username ||
                    profile.profileData?.channelName ||
                    profile.profileData?.handle ||
                    'Perfil'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {profile.planType === 'monthly' ? 'Plan Mensual' : 'Plan Anual'}
                  {profile.paidUntil && (
                    <span className="ml-2">
                      - Válido hasta:{' '}
                      {new Date(profile.paidUntil).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={true} // Por ahora siempre activo
                  onChange={() => handleToggleRenewal(profile._id, true)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> La funcionalidad de renovación automática estará disponible próximamente. 
          Por ahora, los planes se renuevan automáticamente al finalizar su período.
        </p>
      </div>
    </div>
  );
}

