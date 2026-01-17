'use client';

import { useState } from 'react';
import Link from 'next/link';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

export default function SupportSection() {
  const socialNetworks = [
    { 
      name: 'Instagram', 
      network: 'instagram' as const,
      url: 'https://www.instagram.com/social.rrss.oficial/',
      description: 'Síguenos para actualizaciones y contenido exclusivo'
    },
    { 
      name: 'TikTok', 
      network: 'tiktok' as const,
      url: 'https://www.tiktok.com/@socialrrss',
      description: 'Videos y tips para crecer en redes sociales'
    },
    { 
      name: 'YouTube', 
      network: 'youtube' as const,
      url: 'https://www.youtube.com/@socialrrss',
      description: 'Tutoriales y guías paso a paso'
    },
    { 
      name: 'LinkedIn', 
      network: 'linkedin' as const,
      url: 'https://www.linkedin.com/company/socialrrss',
      description: 'Conecta con nosotros profesionalmente'
    },
    { 
      name: 'X (Twitter)', 
      network: 'x' as const,
      url: 'https://twitter.com/socialrrss',
      description: 'Noticias y actualizaciones en tiempo real'
    },
  ];

  const contactEmail = 'oficialsocialrrss@gmail.com';

  return (
    <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-3xl w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Soporte y Contacto
        </h2>
        <p className="text-sm text-gray-600">
          Síguenos en nuestras redes sociales o contáctanos directamente por email
        </p>
      </div>

      {/* Email de contacto */}
      <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">📧 Contacto por Email</h3>
        <a 
          href={`mailto:${contactEmail}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-lg break-all"
        >
          {contactEmail}
        </a>
      </div>

      {/* Redes sociales */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 mb-3">📱 Síguenos en nuestras Redes Sociales</h3>
        {socialNetworks.map((social) => (
          <a
            key={social.network}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary-300 hover:shadow-md"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <SocialNetworkLogo network={social.network} className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{social.name}</h4>
              <p className="text-sm text-gray-600">{social.description}</p>
            </div>
            <svg 
              className="w-5 h-5 text-gray-400 flex-shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

      {/* Mensaje de ayuda */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>¿Necesitas ayuda?</strong> Puedes contactarnos en cualquiera de nuestras redes sociales o por email. 
          Estamos aquí para ayudarte con cualquier pregunta o problema que tengas.
        </p>
      </div>
    </div>
  );
}
