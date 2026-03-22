'use client';

import { SocialNetwork } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

interface SocialNetworkSelectorProps {
  selectedNetwork: 'all' | SocialNetwork;
  onSelect: (network: 'all' | SocialNetwork) => void;
  onClose: () => void;
}

const socialNetworks: { value: 'all' | SocialNetwork; label: string; iconBg: string }[] = [
  { value: 'all', label: 'Todas', iconBg: 'bg-stone-600' },
  { value: 'instagram', label: 'Instagram', iconBg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400' },
  { value: 'tiktok', label: 'TikTok', iconBg: 'bg-neutral-900' },
  { value: 'youtube', label: 'YouTube', iconBg: 'bg-red-600' },
  { value: 'linkedin', label: 'LinkedIn', iconBg: 'bg-blue-700' },
  { value: 'facebook', label: 'Facebook', iconBg: 'bg-blue-600' },
  { value: 'x', label: 'X', iconBg: 'bg-neutral-900' },
  { value: 'twitch', label: 'Twitch', iconBg: 'bg-purple-600' },
  { value: 'otros', label: 'Otras', iconBg: 'bg-stone-500' },
];

export default function SocialNetworkSelector({ selectedNetwork, onSelect, onClose }: SocialNetworkSelectorProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="animate-slideUp w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-6 sm:rounded-3xl"
        style={{ maxHeight: '85dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-surface-300 sm:hidden" />

        <h2 className="mb-1 text-lg font-bold text-ink">Filtrar por red social</h2>
        <p className="mb-5 text-[13px] text-ink-muted">Elige qué perfiles quieres explorar</p>

        <div className="grid grid-cols-3 gap-2.5">
          {socialNetworks.map((network) => {
            const isSelected = selectedNetwork === network.value;
            const isAll = network.value === 'all';

            return (
              <button
                key={network.value}
                onClick={() => {
                  onSelect(network.value);
                  onClose();
                }}
                className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition active:scale-95 ${
                  isSelected
                    ? 'bg-primary-50 ring-2 ring-primary-400'
                    : 'bg-surface hover:bg-surface-200'
                }`}
              >
                <div className={`${network.iconBg} flex h-11 w-11 items-center justify-center rounded-xl`}>
                  {isAll ? (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  ) : (
                    <SocialNetworkLogo network={network.value as SocialNetwork} className="h-5 w-5 text-white" />
                  )}
                </div>
                <span className={`text-[12px] font-medium ${isSelected ? 'text-primary-700' : 'text-ink-light'}`}>
                  {network.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-surface-200 py-3 text-[15px] font-medium text-ink-light transition hover:bg-surface-300 active:scale-[0.98]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
