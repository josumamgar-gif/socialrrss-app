import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Promoción RRSS',
  description: 'Plataforma de promoción de redes sociales',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}


