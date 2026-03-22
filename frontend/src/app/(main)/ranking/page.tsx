'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl, placeholderImage } from '@/lib/imageUtils';
import ProfileDetail from '@/components/principal/ProfileDetail';

type Tab = 'spain' | 'instagram' | 'tiktok' | 'facebook' | 'x';

const TAB_CONFIG: { id: Tab; label: string; network?: SocialNetwork; flag?: string }[] = [
  { id: 'spain',     label: '🇪🇸 España',    network: undefined },
  { id: 'instagram', label: 'Instagram',    network: 'instagram' },
  { id: 'tiktok',    label: 'TikTok',       network: 'tiktok' },
  { id: 'facebook',  label: 'Facebook',     network: 'facebook' },
  { id: 'x',         label: 'X',            network: 'x' },
];

const NETWORK_COLORS: Record<string, string> = {
  tiktok: 'bg-pink-500', youtube: 'bg-red-500', instagram: 'bg-purple-600',
  facebook: 'bg-blue-600', linkedin: 'bg-blue-700', twitch: 'bg-purple-600',
  x: 'bg-neutral-900', otros: 'bg-stone-500',
};

function getFollowers(p: Profile): number {
  const d = p.profileData;
  return d.followers ?? d.subscribers ?? d.likes ?? 0;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function getDisplayName(p: Profile): string {
  const d = p.profileData;
  return d.username || d.channelName || d.handle || d.streamerName || d.pageName || d.twitterHandle || 'Perfil';
}

export default function RankingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('spain');
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await profilesAPI.getAll();
        setAllProfiles(r.profiles || []);
      } catch {
        setAllProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProfiles = useMemo(() => {
    const tab = TAB_CONFIG.find((t) => t.id === activeTab);
    let list = allProfiles;
    if (tab?.network) list = list.filter((p) => p.socialNetwork === tab.network);
    return list
      .sort((a, b) => getFollowers(b) - getFollowers(a))
      .slice(0, 100);
  }, [allProfiles, activeTab]);

  const userOfMonth = useMemo(() => {
    if (allProfiles.length === 0) return null;
    return [...allProfiles].sort((a, b) => getFollowers(b) - getFollowers(a))[0] ?? null;
  }, [allProfiles]);

  const hasAnyProfiles = allProfiles.length > 0;

  return (
    <div
      className="min-h-[100dvh] bg-surface pb-28"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center gap-3 px-4 pt-1 pb-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card transition active:scale-90">
          <svg className="h-4.5 w-4.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-ink">Rankings</h1>
          <p className="text-[13px] text-ink-muted">
            {hasAnyProfiles ? 'Top perfiles de SocialRRSS' : 'Listas en preparación'}
          </p>
        </div>
      </div>

      {/* Perfil del mes — siempre visible: premio o estado vacío */}
      {!loading && (
        <div className="mx-4 mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-amber-600 p-4 shadow-[0_8px_30px_rgba(245,158,11,0.3)]">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-lg">🏆</span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-white/80">Perfil del mes</span>
          </div>

          {userOfMonth ? (
            <>
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/30">
                  <img
                    src={userOfMonth.images?.[0] ? getImageUrl(userOfMonth.images[0]) : placeholderImage}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage; }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-bold text-white truncate">{getDisplayName(userOfMonth)}</p>
                  <p className="text-[13px] text-white/80">{formatCount(getFollowers(userOfMonth))} seguidores</p>
                </div>
                <button
                  onClick={() => setSelected(userOfMonth)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white transition active:scale-90"
                >
                  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.641 0-8.58-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 rounded-xl bg-white/15 p-3">
                <p className="text-[13px] leading-relaxed text-white">
                  🎉 <strong>¡El perfil del mes se lleva la membresía total gratis!</strong> Promoción permanente sin pagar más. Sigue creciendo y podrías ser tú el próximo.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-white/15 p-4">
              <p className="text-[15px] font-bold text-white leading-snug">
                El perfil más destacado se lleva la membresía completa GRATIS
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/90">
                Cuando haya creadores promocionándose en SocialRRSS, elegiremos cada mes al #1 de engagement y visibilidad. <strong className="text-white">Licencia permanente de por vida</strong>, sin cuotas: solo por ser el más top.
              </p>
              <Link
                href="/promocion"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[14px] font-bold text-amber-700 shadow transition active:scale-[0.98]"
              >
                Crear mi perfil y optar al premio →
              </Link>
            </div>
          )}
        </div>
      )}

      <div className="mb-4 overflow-x-auto px-4" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="flex gap-2 w-max">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-ink text-white shadow-card'
                  : 'bg-white text-ink-light ring-1 ring-surface-300/60'
              }`}
            >
              {tab.network ? (
                <SocialNetworkLogo network={tab.network} className="h-3.5 w-3.5" />
              ) : null}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-6">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-3xl">📊</div>
          <p className="text-[17px] font-semibold text-ink">Ranking vacío (por ahora)</p>
          <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-ink-muted">
            Los primeros perfiles promocionados aparecerán aquí ordenados por impacto. Sé de los primeros y monopoliza la atención.
          </p>
          <Link
            href="/promocion"
            className="mt-6 rounded-2xl bg-ink px-6 py-3 text-[14px] font-bold text-white transition active:scale-[0.98]"
          >
            Promocionar mi perfil
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-2.5">
          {filteredProfiles.map((profile, idx) => {
            const count = getFollowers(profile);
            const isTop3 = idx < 3;
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <button
                key={profile._id}
                onClick={() => setSelected(profile)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition active:scale-[0.98] ${
                  isTop3
                    ? 'bg-white shadow-card ring-2 ring-primary-200/60'
                    : 'bg-white shadow-soft ring-1 ring-surface-200/60'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                  isTop3 ? 'bg-primary-50 text-primary-700' : 'bg-surface-100 text-ink-muted'
                }`}>
                  {isTop3 ? medals[idx] : idx + 1}
                </div>

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={profile.images?.[0] ? getImageUrl(profile.images[0]) : placeholderImage}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage; }}
                  />
                  <div className={`absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full ${NETWORK_COLORS[profile.socialNetwork] || 'bg-stone-500'}`}>
                    <SocialNetworkLogo network={profile.socialNetwork} className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">{getDisplayName(profile)}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[12px] capitalize text-ink-muted">{profile.socialNetwork}</span>
                    {profile.profileData.category && (
                      <>
                        <span className="text-ink-faint">·</span>
                        <span className="text-[12px] capitalize text-ink-muted">{profile.profileData.category}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-[16px] font-bold ${isTop3 ? 'text-primary-600' : 'text-ink'}`}>
                    {formatCount(count)}
                  </p>
                  <p className="text-[11px] text-ink-muted">seguidores</p>
                </div>
              </button>
            );
          })}

          <div className="rounded-2xl bg-gradient-to-br from-surface-100 to-white p-5 text-center border border-surface-200 mt-3">
            <p className="text-[20px]">🚀</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">¿Quieres aparecer aquí?</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-light max-w-[260px] mx-auto">
              Crea tu perfil y sube posiciones. El <strong>perfil #1 del mes</strong> gana la <strong>membresía total gratis de por vida</strong>.
            </p>
          </div>
        </div>
      )}

      {selected && <ProfileDetail profile={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
