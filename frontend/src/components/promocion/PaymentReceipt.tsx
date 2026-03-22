'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types';
import { paymentsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface PaymentReceiptProps {
  payment: {
    _id: string;
    amount: number;
    planType: string;
    paymentMethod: string;
    createdAt: string;
  };
  profile: Profile;
  onClose: () => void;
  onViewProfile: () => void;
}

const PLAN_NAMES: Record<string, string> = {
  monthly: 'Plan Mensual',
  yearly: 'Plan Anual',
  lifetime: 'Plan Permanente',
};

const METHOD_LABELS: Record<string, string> = {
  paypal: 'PayPal',
  card: 'Tarjeta',
  sepa: 'Débito SEPA',
  stripe: 'Stripe',
};

export default function PaymentReceipt({ payment, profile, onClose }: PaymentReceiptProps) {
  const user = useAuthStore((s) => s.user);
  const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'error' | 'idle'>('idle');
  const [show, setShow] = useState(false);

  // Animate in
  useEffect(() => { const t = setTimeout(() => setShow(true), 20); return () => clearTimeout(t); }, []);

  // Auto-send email on mount if payment._id is real
  useEffect(() => {
    const isRealId = payment._id && !payment._id.startsWith('demo') && payment._id.length > 8;
    if (isRealId) sendEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendEmail = async () => {
    if (emailStatus === 'sending' || emailStatus === 'sent') return;
    setEmailStatus('sending');
    try {
      await paymentsAPI.sendReceipt(payment._id);
      setEmailStatus('sent');
    } catch {
      setEmailStatus('error');
    }
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 280);
  };

  const getDisplayName = () =>
    profile.profileData?.username ||
    profile.profileData?.channelName ||
    profile.profileData?.handle ||
    profile.profileData?.streamerName ||
    profile.profileData?.pageName ||
    'Mi Perfil';

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg rounded-t-3xl bg-white px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '92dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-surface-300" />

        {/* Success icon */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-9 w-9 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-[22px] font-bold text-ink">¡Pago completado!</h2>
          <p className="mt-1 text-[14px] text-ink-light">Tu perfil ya está activo en SocialRRSS</p>

          {/* Email status banner */}
          <div className={`mt-3 flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold ${
            emailStatus === 'sent'    ? 'bg-emerald-50 text-emerald-700' :
            emailStatus === 'sending' ? 'bg-blue-50 text-blue-600' :
            emailStatus === 'error'   ? 'bg-red-50 text-red-600' :
            'bg-surface-100 text-ink-muted'
          }`}>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {emailStatus === 'sent'    ? `Recibo enviado a ${user?.email || 'tu email'}` :
             emailStatus === 'sending' ? 'Enviando recibo por email…' :
             emailStatus === 'error'   ? 'No se pudo enviar el email' :
             'Preparando recibo…'}
          </div>
        </div>

        {/* Receipt card */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-surface-200 bg-surface-50">
          {/* Header */}
          <div className="border-b border-surface-200 bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted">Recibo de pago</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">#{payment._id.slice(-8).toUpperCase()}</p>
          </div>

          {/* Details */}
          <div className="divide-y divide-surface-200">
            <ReceiptRow label="Perfil" value={getDisplayName()} />
            <ReceiptRow label="Red social" value={profile.socialNetwork.charAt(0).toUpperCase() + profile.socialNetwork.slice(1)} />
            <ReceiptRow label="Plan" value={PLAN_NAMES[payment.planType] || payment.planType} />
            <ReceiptRow label="Método" value={METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod} />
            <ReceiptRow label="Fecha" value={formatDate(payment.createdAt)} small />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-ink px-4 py-4">
            <span className="text-[14px] font-semibold text-white/80">Total pagado</span>
            <span className="text-[26px] font-bold text-white">
              {payment.amount?.toFixed(2) ?? '—'} €
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {emailStatus === 'error' && (
            <button
              onClick={sendEmail}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary-200 bg-primary-50 py-3.5 text-[15px] font-semibold text-primary-700 transition active:scale-[0.98]"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Reenviar recibo al email
            </button>
          )}
          <button
            onClick={handleClose}
            className="w-full rounded-2xl bg-primary-600 py-4 text-[16px] font-bold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98]"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <span className="text-[13px] text-ink-muted">{label}</span>
      <span className={`text-right font-semibold text-ink ${small ? 'text-[12px]' : 'text-[14px]'}`}>{value}</span>
    </div>
  );
}
