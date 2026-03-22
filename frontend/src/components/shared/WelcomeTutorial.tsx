'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/lib/api';

interface WelcomeTutorialProps {
  onClose?: () => void;
  forceOpen?: boolean;
  onForceOpenChange?: (open: boolean) => void;
  tutorialCompleted?: boolean;
}

export default function WelcomeTutorial({ onClose, forceOpen, onForceOpenChange, tutorialCompleted }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [show, setShow] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (forceOpen === true) { setIsVisible(true); return; }
    if (forceOpen === false) { setIsVisible(false); return; }
    if (forceOpen === undefined) setIsVisible(tutorialCompleted === false);
  }, [forceOpen, tutorialCompleted]);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      const t = setTimeout(() => setShow(true), 30);
      document.body.style.overflow = 'hidden';
      return () => { clearTimeout(t); document.body.style.overflow = 'unset'; };
    } else {
      setShow(false);
      document.body.style.overflow = 'unset';
    }
  }, [isVisible]);

  const handleClose = async () => {
    setShow(false);
    setTimeout(() => setIsVisible(false), 300);
    if (typeof window !== 'undefined' && !forceOpen) {
      localStorage.setItem('tutorialCompleted', 'true');
      if (user?.id) {
        try { await userAPI.markTutorialCompleted(); } catch { /* silent */ }
      }
    }
    onForceOpenChange?.(false);
    if (onClose) await onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else handleClose();
  };

  const handlePrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  if (!isVisible) return null;

  /* ─── Steps ─── */
  const steps = [
    /* 0 — Bienvenida */
    {
      icon: (
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-[1.75rem] bg-primary-100 opacity-60" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary-100">
            <svg className="h-11 w-11 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <line x1="12" y1="7.5" x2="12" y2="2.5" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      ),
      title: `¡Hola${user?.username ? ', ' + user.username : ''}! 👋`,
      subtitle: 'SocialRRSS es el descubridor de creadores en redes sociales. Encuentra perfiles de Instagram, TikTok, YouTube y más — deslizando como Tinder.',
      content: null,
    },
    /* 1 — Gestos */
    {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-blue-50">
          <svg className="h-11 w-11 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l-.001-1.026a3.314 3.314 0 00-.48-1.689L13.2 9.15" />
          </svg>
        </div>
      ),
      title: 'Controla con gestos',
      subtitle: 'Desliza la tarjeta con el dedo o usa los botones de la parte inferior.',
      content: (
        <div className="w-full space-y-2">
          {[
            { icon: <XIcon />, color: 'bg-red-50 text-red-500', label: 'Desliza ← o botón ✕', desc: 'Pasar al siguiente perfil' },
            { icon: <LinkIcon />, color: 'bg-blue-50 text-blue-500', label: 'Desliza → o botón ↗', desc: 'Visitar perfil directamente' },
            { icon: <GalleryIcon />, color: 'bg-amber-50 text-amber-600', label: 'Desliza ↑ o botón imagen', desc: 'Ver todos los detalles del perfil' },
            { icon: <UndoIcon />, color: 'bg-emerald-50 text-emerald-600', label: 'Desliza ↓ o botón ↩', desc: 'Volver al perfil anterior (1 gratis)' },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-3 rounded-xl bg-surface-50 px-3 py-2.5 ring-1 ring-surface-200/60">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${g.color}`}>{g.icon}</div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink">{g.label}</p>
                <p className="text-[11px] text-ink-muted">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    /* 2 — Botones de acción */
    {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-purple-50">
          <svg className="h-11 w-11 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </div>
      ),
      title: 'Botones de acción',
      subtitle: 'En la barra inferior de cada tarjeta tienes 5 botones.',
      content: (
        <div className="w-full space-y-2">
          {[
            { dot: 'bg-red-500',     icon: <XIcon />,      label: '✕  Saltar',          desc: 'Descarta el perfil y muestra el siguiente' },
            { dot: 'bg-gray-400',    icon: <UndoIcon />,   label: '↩  Volver (1 gratis)',desc: 'Recupera el último perfil descartado' },
            { dot: 'bg-primary-500', icon: <StarIcon />,   label: '★  Favorito',         desc: 'Guarda el perfil para visitarlo después' },
            { dot: 'bg-gray-400',    icon: <GalleryIcon />,label: '🖼  Detalles',         desc: 'Abre la ficha completa del perfil' },
            { dot: 'bg-blue-500',    icon: <LinkIcon />,   label: '↗  Visitar',          desc: 'Abre su perfil en la red social' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-3 rounded-xl bg-surface-50 px-3 py-2.5 ring-1 ring-surface-200/60">
              <div className={`h-2 w-2 shrink-0 rounded-full ${b.dot}`} />
              <p className="w-36 shrink-0 text-[13px] font-semibold text-ink">{b.label}</p>
              <p className="text-[11px] leading-snug text-ink-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    /* 3 — Favoritos */
    {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-amber-50">
          <svg className="h-11 w-11 fill-current text-primary-500" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>
      ),
      title: 'Favoritos y Rankings',
      subtitle: 'Guarda los perfiles que más te interesan y consulta los más populares.',
      content: (
        <div className="w-full space-y-3">
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 shrink-0 fill-current text-primary-500" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <div>
                <p className="text-[14px] font-semibold text-ink">Guardar favoritos</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">Pulsa la estrella para guardar perfiles que te interesen. Los encontrarás en <strong>Ajustes → Favoritos</strong>. Ideal para empresas que buscan colaboradores.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-surface-50 p-4 ring-1 ring-surface-200">
            <div className="flex items-start gap-3">
              <span className="text-[18px]">🏆</span>
              <div>
                <p className="text-[14px] font-semibold text-ink">Top 100 Rankings</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">Consulta los perfiles más seguidos por red social y país en la pestaña <strong>Rankings</strong>. El perfil del mes consigue la <strong>licencia permanente gratis</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    /* 4 — Promoción */
    {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-orange-50">
          <svg className="h-11 w-11 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        </div>
      ),
      title: 'Promociona tu perfil',
      subtitle: 'Crea tu ficha completa con estadísticas y aparece en el feed de miles de usuarios.',
      content: (
        <div className="w-full space-y-2.5">
          {[
            { step: '1', color: 'bg-blue-100 text-blue-700', text: 'Ve a la pestaña Promoción y elige tu red social' },
            { step: '2', color: 'bg-purple-100 text-purple-700', text: 'Rellena tu ficha: seguidores, categoría, público objetivo y bio' },
            { step: '3', color: 'bg-orange-100 text-orange-700', text: 'Selecciona un plan (Mensual, Anual o Permanente) y paga' },
            { step: '4', color: 'bg-emerald-100 text-emerald-700', text: 'Tu perfil aparece en el feed y recibes el recibo por email' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 rounded-xl bg-surface-50 px-3 py-2.5 ring-1 ring-surface-200/60">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${s.color}`}>{s.step}</div>
              <p className="text-[13px] leading-snug text-ink">{s.text}</p>
            </div>
          ))}
        </div>
      ),
    },
    /* 5 — ¡Listo! */
    {
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-emerald-50">
          <svg className="h-11 w-11 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      ),
      title: '¡Todo listo!',
      subtitle: 'Practica con los 3 perfiles demo y cuando termines verás los perfiles reales de otros creadores.',
      content: (
        <div className="w-full space-y-2.5">
          <div className="rounded-2xl bg-primary-50 p-4 ring-1 ring-primary-100">
            <p className="text-[13px] font-semibold text-ink">🎯 Tu primer reto</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
              Desliza los <strong>3 perfiles demo</strong> para practicar los gestos. Después aparecerán perfiles reales de creadores de toda España.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-50 p-3 ring-1 ring-surface-200">
            <div className="flex items-center gap-2">
              <span className="text-base">💡</span>
              <p className="text-[12px] text-ink-muted">Si tienes dudas puedes volver a este tutorial desde <strong>Ajustes → Ver tutorial</strong>.</p>
            </div>
          </div>
          <div className="rounded-2xl bg-surface-50 p-3 ring-1 ring-surface-200">
            <div className="flex items-center gap-2">
              <span className="text-base">🔓</span>
              <p className="text-[12px] text-ink-muted">El botón de retroceder es <strong>1 uso gratuito</strong>. Desbloquea usos ilimitados por sólo <strong>0,99 €</strong> de pago único.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${show ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '92dvh' }}
      >
        {/* Handle + Skip */}
        <div className="relative flex shrink-0 items-center justify-center px-6 pt-5 pb-2">
          <div className="h-1 w-10 rounded-full bg-surface-300" />
          <button
            onClick={handleClose}
            className="absolute right-5 text-[13px] font-medium text-ink-muted transition hover:text-ink"
          >
            Saltar
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {/* Icon */}
          <div className="mb-4 flex justify-center">{step.icon}</div>

          {/* Title + subtitle */}
          <h2 className="mb-1.5 text-center text-[21px] font-bold text-ink">{step.title}</h2>
          <p className="mb-5 text-center text-[14px] leading-relaxed text-ink-light">{step.subtitle}</p>

          {/* Step-specific content */}
          {step.content}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-surface-200/80 bg-white px-6 py-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {/* Progress dots */}
          <div className="mb-3 flex items-center justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary-500' : 'w-1.5 bg-surface-300'}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="h-11 w-11 shrink-0 rounded-xl border border-surface-300 text-[13px] font-medium text-ink-muted transition hover:border-ink-muted hover:text-ink disabled:opacity-0"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="flex-1 rounded-xl bg-primary-600 py-3 text-[15px] font-bold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98]"
            >
              {isLast ? '¡Empezar a explorar! 🚀' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Micro-icons ─── */
const XIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const LinkIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);
const GalleryIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
  </svg>
);
const UndoIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);
const StarIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);
