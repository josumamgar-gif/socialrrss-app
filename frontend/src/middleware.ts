import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // En desarrollo, no aplicar CSP estricto para evitar conflictos con hot reload
  // En producción, aplicar CSP completo
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Temporalmente deshabilitar CSP estricto para resolver problemas
  // TODO: Re-habilitar CSP cuando se resuelvan los problemas de evaluación
  return response;

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - _next/webpack-hmr (hot module replacement)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)',
  ],
};
