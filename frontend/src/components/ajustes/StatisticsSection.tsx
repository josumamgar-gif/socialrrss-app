'use client';

import { useState, useEffect } from 'react';
import { profilesAPI } from '@/lib/api';

export default function StatisticsSection() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Por ahora, obtenemos los perfiles y simulamos estadísticas
      // En el futuro, esto vendrá de un endpoint específico de estadísticas
      const response = await profilesAPI.getMyProfiles();
      const profiles = response.profiles || [];
      
      // Estadísticas simuladas (aquí deberías conectarte a un endpoint real de estadísticas)
      const totalProfiles = profiles.length;
      const activeProfiles = profiles.filter((p: any) => p.isActive).length;
      
      setStats({
        totalProfiles,
        activeProfiles,
        totalViews: 0, // Esto vendrá del backend
        totalClicks: 0,
        totalSwipes: 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-5xl w-full mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Estadísticas</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-5xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Estadísticas de Interacciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-w-4xl mx-auto">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{stats?.totalProfiles || 0}</div>
          <div className="text-sm text-blue-700 mt-1">Total de Perfiles</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">{stats?.activeProfiles || 0}</div>
          <div className="text-sm text-green-700 mt-1">Perfiles Activos</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-900">{stats?.totalViews || 0}</div>
          <div className="text-sm text-purple-700 mt-1">Visualizaciones</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-900">{stats?.totalClicks || 0}</div>
          <div className="text-sm text-orange-700 mt-1">Clics</div>
        </div>
        
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <div className="text-2xl font-bold text-pink-900">{stats?.totalSwipes || 0}</div>
          <div className="text-sm text-pink-700 mt-1">Swipes</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          Las estadísticas detalladas de interacciones se actualizarán próximamente. 
          Pronto podrás ver información sobre visualizaciones, clics y swipes de tus perfiles promocionados.
        </p>
      </div>
    </div>
  );
}

