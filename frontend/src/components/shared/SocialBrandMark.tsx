'use client';

import { useId } from 'react';

/**
 * Isotipo: presencia + conexión (nodo central y anillos suaves).
 * IDs únicos para poder repetir el icono en la misma página sin colisiones.
 */
export default function SocialBrandMark({
  className = 'h-12 w-12',
  'aria-hidden': ariaHidden = true,
}: {
  className?: string;
  'aria-hidden'?: boolean;
}) {
  const raw = useId().replace(/:/g, '');
  const g1 = `socialBrandGrad-${raw}`;
  const g2 = `socialBrandGradSoft-${raw}`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <defs>
        <linearGradient id={g1} x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" />
          <stop offset="0.55" stopColor="#0284c7" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id={g2} x1="6" y1="10" x2="42" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0ea5e9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0369a1" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" stroke={`url(#${g2})`} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="14" stroke={`url(#${g1})`} strokeWidth="1.25" strokeOpacity="0.45" />
      <circle cx="24" cy="24" r="6" fill={`url(#${g1})`} />
      <circle cx="34" cy="14" r="2" fill={`url(#${g1})`} opacity="0.9" />
      <circle cx="12" cy="30" r="1.5" fill={`url(#${g1})`} opacity="0.55" />
    </svg>
  );
}
