'use client';

export default function AppBanner() {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-center">
          {/* Logo Explora adaptado - estilo del logo original con borde y sombra */}
          <h1 
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              color: '#374151',
              WebkitTextStroke: '1.5px #000000',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Explora
          </h1>
        </div>
      </div>
    </div>
  );
}
