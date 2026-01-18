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
        {/* Contenedor principal con fondo degradado moderno */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50"></div>
          
          {/* Logo original: Redes sociales conectadas con flecha de crecimiento */}
          <svg 
            className={`${iconSize[size]} text-white drop-shadow-lg relative z-10`}
            viewBox="0 0 100 100" 
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Círculo base de Instagram (esquina superior izquierda) */}
            <circle cx="25" cy="25" r="8" fill="white" opacity="0.95">
              <animate attributeName="opacity" values="0.95;0.7;0.95" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="20" y="20" width="10" height="10" rx="2" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
            
            {/* Círculo de TikTok (esquina superior derecha) */}
            <circle cx="75" cy="25" r="7" fill="white" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <path d="M70 25 L75 20 L80 25 L75 30 Z" fill="white" opacity="0.7" />
            
            {/* Círculo de YouTube (esquina inferior izquierda) */}
            <path d="M20 70 L30 65 L30 75 L20 70 Z" fill="white" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.65;0.9" dur="1.8s" repeatCount="indefinite" />
            </path>
            <rect x="18" y="63" width="14" height="14" rx="1" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
            
            {/* Círculo de LinkedIn (esquina inferior derecha) */}
            <rect x="70" y="68" width="10" height="10" rx="1" fill="white" opacity="0.85">
              <animate attributeName="opacity" values="0.85;0.6;0.85" dur="2.1s" repeatCount="indefinite" />
            </rect>
            <circle cx="72" cy="70" r="1.5" fill="white" opacity="0.7" />
            <rect x="74" y="70" width="5" height="1.5" rx="0.5" fill="white" opacity="0.7" />
            <rect x="74" y="73" width="5" height="1.5" rx="0.5" fill="white" opacity="0.7" />
            
            {/* Flecha de crecimiento/promoción en el centro */}
            <path 
              d="M45 35 L55 45 L50 45 L50 60 L40 60 L40 45 L35 45 Z" 
              fill="white" 
              opacity="1"
              className="drop-shadow-md"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-3; 0,0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
            
            {/* Líneas de conexión entre redes sociales */}
            <line x1="33" y1="25" x2="45" y2="35" stroke="white" strokeWidth="1.5" opacity="0.4" strokeDasharray="2,2" />
            <line x1="67" y1="25" x2="55" y2="35" stroke="white" strokeWidth="1.5" opacity="0.4" strokeDasharray="2,2" />
            <line x1="25" y1="33" x2="40" y2="45" stroke="white" strokeWidth="1.5" opacity="0.4" strokeDasharray="2,2" />
            <line x1="75" y1="32" x2="60" y2="45" stroke="white" strokeWidth="1.5" opacity="0.4" strokeDasharray="2,2" />
            
            {/* Partículas de crecimiento alrededor */}
            <circle cx="50" cy="20" r="2" fill="white" opacity="0.6">
              <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="50" r="1.5" fill="white" opacity="0.5">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="20" cy="50" r="1.5" fill="white" opacity="0.5">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="1.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="80" r="2" fill="white" opacity="0.6">
              <animate attributeName="r" values="2;3;2" dur="1.1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
      
      {showText && (
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
          Explora
        </h1>
      )}
    </div>
  );
}
