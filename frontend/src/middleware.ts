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
  } else {
    // CSP estricto en producción
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.paypalobjects.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://api.stripe.com https://api.socialrrss.com https://*.vercel.app wss:",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.paypal.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "worker-src 'self' blob: 'unsafe-eval'",
    ].join('; ');

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Content-Security-Policy', cspHeader);
  }

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
