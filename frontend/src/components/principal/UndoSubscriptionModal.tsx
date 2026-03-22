'use client';

import { useEffect, useState } from 'react';

interface UndoSubscriptionModalProps {
  onSubscribe: () => void;
  onClose: () => void;
}

export default function UndoSubscriptionModal({ onSubscribe, onClose }: UndoSubscriptionModalProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { const t = setTimeout(() => setShow(true), 20); return () => clearTimeout(t); }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 280);
  };

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulate payment processing for the €0.99 subscription
    // In production: integrate with PayPal/Stripe for €0.99 one-time unlock
    try {
      // Save undo subscription permanently for this user
      if (typeof window !== 'undefined') {
        localStorage.setItem('undoSubscribed', 'true');
      }
      await new Promise((r) => setTimeout(r, 800)); // simulated delay
      setShow(false);
      setTimeout(onSubscribe, 280);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg rounded-t-3xl bg-white px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-surface-300" />

        {/* Icon */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </div>
            <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-[12px] font-bold text-white shadow">
              ∞
            </div>
          </div>
          <h2 className="text-[22px] font-bold text-ink">Retroceder ilimitado</h2>
          <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-ink-light">
            ¿Te arrepentiste de pasar ese perfil? Desbloquea el botón de retroceso <strong>para siempre</strong> con un único pago de por vida.
          </p>
        </div>

        {/* Price card */}
        <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-5 text-center text-white shadow-[0_8px_30px_rgba(245,158,11,0.3)]">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-primary-100">Pago único · Para siempre</p>
          <div className="mt-2 flex items-baseline justify-center gap-1">
            <span className="text-[48px] font-black leading-none">0,99</span>
            <span className="text-[24px] font-bold">€</span>
          </div>
          <p className="mt-1 text-[13px] text-primary-100">Sin suscripciones ni cargos adicionales</p>
        </div>

        {/* Features */}
        <div className="mb-5 space-y-2">
          {[
            'Retroceder ilimitado en todos los perfiles',
            'Desbloqueado permanentemente para tu cuenta',
            'Sin renovaciones automáticas',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-3 w-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-[14px] text-ink">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="mb-2 w-full rounded-2xl bg-primary-600 py-4 text-[16px] font-bold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Procesando…
            </span>
          ) : 'Desbloquear por 0,99 €'}
        </button>
        <button
          onClick={handleClose}
          className="w-full py-3 text-[14px] font-medium text-ink-muted transition hover:text-ink"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
