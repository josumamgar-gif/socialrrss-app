'use client';

export default function AppBanner() {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-center">
          {/* Logo Explora - SVG adaptado del logo original */}
          <svg 
            viewBox="0 0 200 60" 
            className="h-8 sm:h-10 w-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="48"
              fontWeight="bold"
              fill="#374151"
              stroke="#000000"
              strokeWidth="1.5"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Explora
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
