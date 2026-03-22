'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface FreeProfileModalProps {
  username: string;
  remainingSpots: number;
  onClose: () => void;
}

export default function FreeProfileModal({ username, remainingSpots, onClose }: FreeProfileModalProps) {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const handleGoPromote = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
      router.push('/promocion');
    }, 300);
  };

  const spotsLabel = remainingSpots > 0
    ? `${remainingSpots} plazas gratis restantes`
    : 'Plazas disponibles';

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-5 transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ease-out ${show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 px-6 pt-8 pb-10">
          {/* Círculos decorativos */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full bg-white/10" />

          {/* Icono */}
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
            <span className="text-3xl">🎁</span>
          </div>

          <h2 className="relative text-[22px] font-black leading-tight text-white">
            ¡Hola {username}!<br />
            <span className="text-white/90">Tu perfil gratis te espera</span>
          </h2>
          <p className="relative mt-2 text-[14px] text-white/80">
            Como parte del lanzamiento, te regalamos <strong className="text-white">30 días gratis</strong> para promocionar tu perfil en SocialRRSS.
          </p>

          {/* Badge de spots */}
          <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="text-[12px] font-semibold text-white">{spotsLabel}</span>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="px-6 py-5">
          {/* Reglas */}
          <div className="mb-5 space-y-3">
            {[
              { icon: '✅', text: '30 días de promoción completamente gratis' },
              { icon: '👤', text: '1 perfil gratuito por usuario registrado' },
              { icon: '🚀', text: 'Acceso a todas las funciones de la plataforma' },
              { icon: '⏳', text: 'Oferta limitada — solo mientras haya plazas' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="mt-px text-[16px] shrink-0">{item.icon}</span>
                <span className="text-[13px] leading-snug text-stone-600">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA principal */}
          <button
            onClick={handleGoPromote}
            className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-[16px] font-black text-white shadow-lg transition active:scale-[0.98]"
          >
            Crear mi perfil gratis →
          </button>

          {/* Skip */}
          <button
            onClick={handleClose}
            className="mt-3 w-full py-2 text-[13px] font-medium text-stone-400 transition hover:text-stone-600"
          >
            Ahora no, lo haré más tarde
          </button>
        </div>
      </div>
    </div>
  );
}
