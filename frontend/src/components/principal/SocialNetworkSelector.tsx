'use client';

import { SocialNetwork } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

interface SocialNetworkSelectorProps {
  selectedNetwork: 'all' | SocialNetwork;
  onSelect: (network: 'all' | SocialNetwork) => void;
  onClose: () => void;
}

const socialNetworks: { value: 'all' | SocialNetwork; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'otros', label: 'Otras Redes' },
];

export default function SocialNetworkSelector({ selectedNetwork, onSelect, onClose }: SocialNetworkSelectorProps) {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-4 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-4xl mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Selecciona una Red Social</h2>
        <p className="text-gray-600 text-sm sm:text-base">Elige la red social que quieres explorar</p>
      </div>

      {/* Grid de redes sociales */}
      <div className="w-full max-w-4xl grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 px-4">
        {socialNetworks.map((network) => {
          const isSelected = selectedNetwork === network.value;
          const isAll = network.value === 'all';
          
          return (
            <button
              key={network.value}
              onClick={() => {
                onSelect(network.value);
                onClose();
              }}
              className={`
                relative
                flex flex-col items-center justify-center
                p-4 sm:p-6
                rounded-3xl
                transition-all duration-200
                transform hover:scale-105 active:scale-95
                ${isSelected 
                  ? 'bg-gray-900 shadow-xl ring-2 ring-gray-400' 
                  : 'bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300'
                }
              `}
              style={{
                aspectRatio: '1',
              }}
            >
              {/* Contenedor del logo con fondo blanco y bordes redondeados */}
              <div 
                className={`
                  w-16 h-16 sm:w-20 sm:h-20
                  rounded-2xl sm:rounded-3xl
                  flex items-center justify-center
                  mb-3 sm:mb-4
                  ${isAll ? 'bg-gradient-to-br from-gray-500 to-gray-700' : 'bg-white'}
                  ${isSelected && !isAll ? 'ring-2 ring-white' : ''}
                  shadow-sm
                `}
              >
                {isAll ? (
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white" 
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                ) : (
                  <SocialNetworkLogo 
                    network={network.value as SocialNetwork} 
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${isSelected ? 'text-white' : 'text-gray-800'}`}
                  />
                )}
              </div>

              {/* Etiqueta de texto */}
              <span 
                className={`
                  text-xs sm:text-sm font-medium text-center
                  ${isSelected ? 'text-white' : 'text-gray-700'}
                `}
              >
                {network.label}
              </span>

              {/* Indicador de selección */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg 
                    className="w-4 h-4 text-gray-900" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Botón de cerrar */}
      <button
        onClick={onClose}
        className="mt-8 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        Cerrar
      </button>
    </div>
  );
}
