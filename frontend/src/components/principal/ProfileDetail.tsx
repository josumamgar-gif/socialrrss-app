'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl, placeholderImage } from '@/lib/imageUtils';

interface ProfileDetailProps {
  profile: Profile;
  onClose: () => void;
}

const NET_COLORS: Record<string, string> = {
  tiktok:    'bg-pink-500',
  youtube:   'bg-red-500',
  instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
  facebook:  'bg-blue-600',
  linkedin:  'bg-blue-700',
  twitch:    'bg-purple-600',
  x:         'bg-neutral-900',
  otros:     'bg-stone-500',
};

const NET_NAMES: Record<string, string> = {
  tiktok: 'TikTok', youtube: 'YouTube', instagram: 'Instagram',
  facebook: 'Facebook', linkedin: 'LinkedIn', twitch: 'Twitch', x: 'X', otros: 'Otros',
};

const CATEGORY_LABELS: Record<string, string> = {
  moda: '👗 Moda', viajes: '✈️ Viajes', tecnologia: '💻 Tecnología', gaming: '🎮 Gaming',
  fitness: '💪 Fitness', cocina: '🍳 Cocina', lifestyle: '🌟 Lifestyle',
  negocios: '💼 Negocios', educacion: '📚 Educación', musica: '🎵 Música',
  arte: '🎨 Arte', deportes: '⚽ Deportes', entretenimiento: '🎬 Entretenimiento',
  belleza: '💄 Belleza', finanzas: '📈 Finanzas', mascotas: '🐾 Mascotas',
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function ProfileDetail({ profile, onClose }: ProfileDetailProps) {
  const [show, setShow] = useState(false);

  const d = profile.profileData;
  const images = profile.images?.length > 0 ? profile.images : [];
  const avatarSrc = images.length > 0 ? getImageUrl(images[0]) : null;
  const profileName = d.username || d.channelName || d.handle || d.streamerName || d.pageName || d.twitterHandle || 'Perfil';
  const netName = NET_NAMES[profile.socialNetwork] || profile.socialNetwork;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => setShow(true), 20);
    return () => { clearTimeout(t); document.body.style.overflow = 'unset'; };
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const mainStats = [
    d.followers    != null && { label: 'Seguidores',   value: fmt(d.followers),   icon: '👥' },
    d.subscribers  != null && { label: 'Suscriptores', value: fmt(d.subscribers), icon: '🔔' },
    d.following    != null && { label: 'Siguiendo',    value: fmt(d.following),   icon: '➕' },
    d.posts        != null && { label: 'Posts',        value: fmt(d.posts),       icon: '🖼' },
    (d.videos ?? d.videoCount) != null && { label: 'Vídeos', value: fmt((d.videos ?? d.videoCount)!), icon: '🎬' },
    d.tweets       != null && { label: 'Tweets',       value: fmt(d.tweets),      icon: '💬' },
    d.likes        != null && { label: 'Me gusta',     value: fmt(d.likes),       icon: '👍' },
    d.totalViews   != null && { label: 'Vistas',       value: fmt(d.totalViews),  icon: '👁' },
    d.avgViews     != null && { label: 'Media/vídeo',  value: fmt(d.avgViews),    icon: '📊' },
    d.avgViewers   != null && { label: 'Espectadores', value: fmt(d.avgViewers),  icon: '📺' },
  ].filter(Boolean) as { label: string; value: string; icon: string }[];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      onClick={handleClose}
    >
      <div
        className={`flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ease-out ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        style={{ maxHeight: '82dvh', marginBottom: 'calc(3.75rem + env(safe-area-inset-bottom))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header compacto ── */}
        <div className="flex items-center gap-4 px-5 pt-5 pb-4 shrink-0">
          {/* Avatar pequeño */}
          <div className="relative shrink-0">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={profileName}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-surface-200"
                onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage; }}
              />
            ) : (
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${NET_COLORS[profile.socialNetwork] || 'bg-stone-200'}`}>
                <SocialNetworkLogo network={profile.socialNetwork} className="h-8 w-8 text-white" />
              </div>
            )}
            {/* Badge de red social sobre el avatar */}
            <div className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg shadow ${NET_COLORS[profile.socialNetwork] || 'bg-stone-500'}`}>
              <SocialNetworkLogo network={profile.socialNetwork} className="h-3.5 w-3.5 text-white" />
            </div>
          </div>

          {/* Info principal */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-[18px] font-bold leading-tight text-ink truncate">{profileName}</h2>
              {d.verified && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shrink-0">✓</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white ${NET_COLORS[profile.socialNetwork] || 'bg-stone-500'}`}>
                {netName}
              </span>
              {d.country && (
                <span className="text-[12px] text-ink-muted">📍 {d.country}</span>
              )}
              {d.category && (
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                  {CATEGORY_LABELS[d.category] || d.category}
                </span>
              )}
            </div>
          </div>

          {/* Cerrar */}
          <button
            onClick={handleClose}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition active:scale-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Separador ── */}
        <div className="mx-5 h-px bg-stone-100 shrink-0" />

        {/* ── Contenido scrollable ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

          {/* Descripción — PROTAGONISTA */}
          {d.description && (
            <div>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">Sobre este perfil</p>
              <p className="text-[15px] leading-relaxed text-stone-700">{d.description}</p>
            </div>
          )}

          {/* Estadísticas */}
          {mainStats.length > 0 && (
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">Estadísticas</p>
              <div className="grid grid-cols-3 gap-2">
                {mainStats.slice(0, 9).map((s) => (
                  <div key={s.label} className="flex flex-col items-center rounded-2xl bg-stone-50 py-3 px-1 ring-1 ring-stone-100">
                    <span className="text-[16px]">{s.icon}</span>
                    <span className="mt-1 text-[17px] font-bold text-stone-800 leading-tight">{s.value}</span>
                    <span className="mt-0.5 text-[10px] text-stone-400 text-center leading-tight">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Métricas extra */}
          {(d.engagementRate != null || d.game || d.industry || d.accountType || d.language) && (
            <div className="flex flex-wrap gap-2">
              {d.engagementRate != null && (
                <Chip label={`📈 ${d.engagementRate.toFixed(1)}% engagement`} color="bg-emerald-50 text-emerald-700 ring-emerald-200" />
              )}
              {d.game      && <Chip label={`🎮 ${d.game}`}      color="bg-purple-50 text-purple-700 ring-purple-200" />}
              {d.industry  && <Chip label={`💼 ${d.industry}`}  color="bg-blue-50 text-blue-700 ring-blue-200" />}
              {d.language  && <Chip label={`🌐 ${d.language}`}  color="bg-sky-50 text-sky-700 ring-sky-200" />}
              {d.accountType && <Chip label={d.accountType}     color="bg-stone-100 text-stone-600 ring-stone-200" />}
            </div>
          )}

          {/* Colaboraciones */}
          {d.acceptsSponsorships && (
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[18px]">🤝</span>
                <span className="text-[14px] font-bold text-amber-800">Acepta colaboraciones</span>
              </div>
              {d.priceRange && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] text-amber-700">💰 Precio:</span>
                  <span className="text-[13px] font-semibold text-amber-800">{d.priceRange}</span>
                </div>
              )}
              {d.targetAudience && (
                <div className="flex items-start gap-2">
                  <span className="text-[12px] text-amber-700 shrink-0">👥 Audiencia:</span>
                  <span className="text-[12px] text-amber-700">{d.targetAudience}</span>
                </div>
              )}
            </div>
          )}

          {/* Contacto */}
          {(d.contactEmail || d.website) && (
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400">Contacto</p>
              <div className="flex flex-col gap-2">
                {d.contactEmail && (
                  <a
                    href={`mailto:${d.contactEmail}`}
                    className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-100 transition active:bg-stone-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-200 shrink-0">
                      <svg className="h-4 w-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-medium text-stone-700 truncate">{d.contactEmail}</span>
                  </a>
                )}
                {d.website && (
                  <a
                    href={d.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 ring-1 ring-stone-100 transition active:bg-stone-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-200 shrink-0">
                      <svg className="h-4 w-4 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-medium text-stone-700 truncate">{d.website}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CTA visitar */}
          {profile.link && (
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 py-4 text-[15px] font-bold text-white shadow transition active:scale-[0.98] active:bg-stone-800"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Visitar en {netName}
            </a>
          )}

          <div style={{ height: 'max(1rem, env(safe-area-inset-bottom))' }} />
        </div>
      </div>
    </div>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ring-1 ${color}`}>
      {label}
    </span>
  );
}
