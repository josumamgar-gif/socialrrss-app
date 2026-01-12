'use client';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function AppLogo({ size = 'md', showText = false, className = '' }: AppLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const iconSize = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Fondo con gradiente chill y efecto de profundidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-2xl shadow-lg transform rotate-3 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 rounded-2xl shadow-lg transform -rotate-3 opacity-60"></div>
        
        {/* Contenedor principal con gradiente vibrante */}
        <div className="relative w-full h-full bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
          {/* Efecto de brillo animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
          
          {/* Icono de fuego/llama chill mejorado */}
          <svg 
            className={`${iconSize[size]} text-white drop-shadow-lg relative z-10`}
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            {/* Llama principal más estilizada */}
            <path 
              d="M12 22C12 22 7 17 7 12C7 9.5 8.5 7.5 10 6.5C10 6.5 9 4.5 10 3.5C10.8 2.8 11.5 3.2 11.5 4.5C11.5 3.5 12.5 2.5 13.5 3.5C14 4 13.2 5.2 12 6C13.2 7.2 14.5 8.5 14.5 10.5C14.5 13 12 17 12 22Z" 
              fill="currentColor"
              opacity="1"
            />
            {/* Llama secundaria */}
            <path 
              d="M10 20C10 20 6.5 16 6.5 12C6.5 10.5 7.5 9 8.5 8.2C8.5 8.2 7.8 6.5 8.5 5.8C9 5.3 9.5 5.7 9.5 6.8C9.5 6 10.2 5.3 10.8 6C11.2 6.4 10.8 7.2 10 7.8C10.8 8.8 11.5 9.8 11.5 11C11.5 13 10 16 10 20Z" 
              fill="currentColor"
              opacity="0.8"
            />
            {/* Chispas decorativas más visibles */}
            <circle cx="15" cy="8" r="1.2" fill="currentColor" opacity="0.9" />
            <circle cx="17" cy="10" r="1" fill="currentColor" opacity="0.7" />
            <circle cx="16" cy="12.5" r="0.8" fill="currentColor" opacity="0.6" />
            <circle cx="14.5" cy="6" r="0.6" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      </div>
      
      {showText && (
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Promoción RRSS
        </h1>
      )}
    </div>
  );
}
