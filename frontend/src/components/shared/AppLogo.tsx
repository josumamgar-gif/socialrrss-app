'use client';

import SocialBrandMark from '@/components/shared/SocialBrandMark';
import { BRAND_HEADLINE, BRAND_SUBLINE } from '@/lib/brand';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Muestra el nombre completo; si es false, solo isotipo + monograma compacto */
  showText?: boolean;
  /** Isotipo junto al nombre (recomendado en landing y cabeceras) */
  showMark?: boolean;
  /** Línea principal bajo el nombre (estilo hero) */
  showTagline?: boolean;
  /** Segunda línea más pequeña */
  showSubline?: boolean;
  /** Alineación del bloque (landing suele ir centrado) */
  align?: 'start' | 'center';
  className?: string;
}

const textSize: Record<NonNullable<AppLogoProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl sm:text-4xl',
};

const markSize: Record<NonNullable<AppLogoProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
  xl: 'h-14 w-14',
};

export default function AppLogo({
  size = 'md',
  showText = false,
  showMark = false,
  showTagline = false,
  showSubline = false,
  align = 'start',
  className = '',
}: AppLogoProps) {
  const textClass = textSize[size];
  const iconClass = markSize[size];
  const rowAlign =
    align === 'center'
      ? 'flex-col items-center text-center'
      : 'flex-col items-center text-center sm:flex-row sm:items-center sm:justify-start sm:text-left';

  if (!showText) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <SocialBrandMark className={iconClass} />
        <span className={`font-semibold tracking-tight text-primary-600 ${textClass}`}>SR</span>
      </div>
    );
  }

  const wordmark = (
    <span className={`font-semibold tracking-tight ${textClass}`}>
      <span className="text-gray-900">Social</span>
      <span className="text-primary-600">RRSS</span>
    </span>
  );

  if (showMark) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className={`flex gap-2 sm:gap-3 ${rowAlign}`}>
          <SocialBrandMark className={`${iconClass} shrink-0`} />
          <div className="min-w-0">
            {wordmark}
            {showTagline ? (
              <p className="mt-1 max-w-md text-[14px] font-medium leading-snug tracking-tight text-gray-800 sm:text-[15px]">
                {BRAND_HEADLINE}
              </p>
            ) : null}
            {showSubline ? (
              <p className="mt-1 max-w-md text-xs leading-relaxed text-gray-500 sm:text-sm">{BRAND_SUBLINE}</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      {wordmark}
      {showTagline ? (
        <p className="mt-1 max-w-md text-[14px] font-medium leading-snug text-gray-800 sm:text-[15px]">{BRAND_HEADLINE}</p>
      ) : null}
      {showSubline ? (
        <p className="mt-1 max-w-md text-xs leading-relaxed text-gray-500 sm:text-sm">{BRAND_SUBLINE}</p>
      ) : null}
    </div>
  );
}
