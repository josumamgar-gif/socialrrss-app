'use client';

/** Marca sencilla para la landing: bloque redondeado + red de tres puntos. */
export default function LandingSocialMark({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto ${className}`} aria-hidden>
      <svg
        viewBox="0 0 88 88"
        className="mx-auto h-24 w-24 sm:h-28 sm:w-28"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="landing-mark-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="88" height="88" rx="22" fill="url(#landing-mark-fill)" />
        <line
          x1="28"
          y1="44"
          x2="44"
          y2="30"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <line
          x1="60"
          y1="44"
          x2="44"
          y2="30"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <line
          x1="28"
          y1="44"
          x2="60"
          y2="44"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="28" cy="44" r="7" fill="white" />
        <circle cx="60" cy="44" r="7" fill="white" />
        <circle cx="44" cy="30" r="7" fill="white" />
      </svg>
    </div>
  );
}
