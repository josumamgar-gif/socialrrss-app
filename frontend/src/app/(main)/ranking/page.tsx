'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

const DEMO_PROFILES: Profile[] = [
  { _id: 'demo-001', userId: 'demo', socialNetwork: 'instagram', isActive: true, isPaid: true, profileData: { username: 'lauraviajera', followers: 184200, posts: 312, category: 'viajes', description: 'Viajes por el mundo. España 🇪🇸', country: 'España' }, images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'], link: 'https://instagram.com/demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', paidUntil: null, planType: 'lifetime' },
  { _id: 'demo-002', userId: 'demo', socialNetwork: 'tiktok', isActive: true, isPaid: true, profileData: { username: 'miguelbaile', followers: 923000, videos: 445, category: 'entretenimiento', description: 'Bailes y entretenimiento 🕺', country: 'España' }, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'], link: 'https://tiktok.com/@demo', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', paidUntil: null, planType: 'yearly' },
  { _id: 'demo-003', userId: 'demo', socialNetwork: 'instagram', isActive: true, isPaid: true, profileData: { username: 'chefespanol', followers: 312000, posts: 189, category: 'cocina', description: 'Cocina mediterránea 🍳', country: 'España' }, images: ['https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=600&fit=crop&q=80'], link: 'https://instagram.com/chef', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z', paidUntil: null, planType: 'monthly' },
  { _id: 'demo-004', userId: 'demo', socialNetwork: 'youtube', isActive: true, isPaid: true, profileData: { channelName: 'TechReviews ES', subscribers: 95000, videoCount: 312, category: 'tecnologia', description: 'Reviews de tecnología 💻', country: 'España' }, images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'], link: 'https://youtube.com/tech', createdAt: '2024-01-03T00:00:00Z', updatedAt: '2024-01-03T00:00:00Z', paidUntil: null, planType: 'yearly' },
  { _id: 'demo-005', userId: 'demo', socialNetwork: 'x', isActive: true, isPaid: true, profileData: { twitterHandle: '@marketingpro', followers: 67000, tweets: 4500, category: 'negocios', description: 'Marketing digital y negocios 📈', country: 'España' }, images: ['https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop&q=80'], link: 'https://x.com/demo', createdAt: '2024-01-04T00:00:00Z', updatedAt: '2024-01-04T00:00:00Z', paidUntil: null, planType: 'monthly' },
  { _id: 'demo-006', userId: 'demo', socialNetwork: 'tiktok', isActive: true, isPaid: true, profileData: { username: 'fitnessgirl', followers: 481000, videos: 267, category: 'fitness', description: 'Fitness y vida sana 💪', country: 'España' }, images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop&q=80'], link: 'https://tiktok.com/@fitness', createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-01-05T00:00:00Z', paidUntil: null, planType: 'yearly' },
  { _id: 'demo-007', userId: 'demo', socialNetwork: 'facebook', isActive: true, isPaid: true, profileData: { pageName: 'Noticias España Hoy', likes: 245000, followers: 268000, category: 'noticias', description: 'Noticias de actualidad 📰', country: 'España' }, images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=600&fit=crop&q=80'], link: 'https://facebook.com/noticias', createdAt: '2024-01-06T00:00:00Z', updatedAt: '2024-01-06T00:00:00Z', paidUntil: null, planType: 'monthly' },
  { _id: 'demo-008', userId: 'demo', socialNetwork: 'instagram', isActive: true, isPaid: true, profileData: { username: 'modamadrid', followers: 78000, posts: 521, category: 'moda', description: 'Moda y lifestyle desde Madrid 👗', country: 'España' }, images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop&q=80'], link: 'https://instagram.com/moda', createdAt: '2024-01-07T00:00:00Z', updatedAt: '2024-01-07T00:00:00Z', paidUntil: null, planType: 'lifetime' },
];

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
        let combined = [...DEMO_PROFILES];
        try {
          const r = await profilesAPI.getAll();
          const real = (r.profiles || []).filter((p: Profile) => !p._id?.startsWith('demo-'));
          combined = [...combined, ...real];
        } catch { /* silent */ }
        setAllProfiles(combined);
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

  // "User of the Month" = top profile overall
  const userOfMonth = useMemo(() =>
    [...allProfiles].sort((a, b) => getFollowers(b) - getFollowers(a))[0] ?? null,
  [allProfiles]);

  return (
    <div
      className="min-h-[100dvh] bg-surface pb-28"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-1 pb-4">
        <button onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card transition active:scale-90">
          <svg className="h-4.5 w-4.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-ink">Rankings</h1>
          <p className="text-[13px] text-ink-muted">Top 100 perfiles de SocialRRSS</p>
        </div>
      </div>

      {/* User of the Month banner */}
      {userOfMonth && !loading && (
        <div className="mx-4 mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-amber-600 p-4 shadow-[0_8px_30px_rgba(245,158,11,0.3)]">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-lg">🏆</span>
            <span className="text-[12px] font-bold uppercase tracking-wider text-white/80">Perfil del mes</span>
          </div>
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

          {/* Motivational message */}
          <div className="mt-3 rounded-xl bg-white/15 p-3">
            <p className="text-[13px] leading-relaxed text-white">
              🎉 <strong>¡El perfil del mes obtiene la licencia permanente GRATIS!</strong> Sigue creciendo en SocialRRSS y podrías ser el próximo. ¡Tu momento está cerca!
            </p>
          </div>
        </div>
      )}

      {/* Tab selector */}
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

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
        </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <p className="text-[17px] font-semibold text-ink">Sin perfiles aún</p>
          <p className="mt-1 text-[14px] text-ink-muted">Sé el primero en aparecer en este ranking</p>
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
                {/* Rank */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                  isTop3 ? 'bg-primary-50 text-primary-700' : 'bg-surface-100 text-ink-muted'
                }`}>
                  {isTop3 ? medals[idx] : idx + 1}
                </div>

                {/* Avatar */}
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

                {/* Info */}
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

                {/* Count */}
                <div className="text-right shrink-0">
                  <p className={`text-[16px] font-bold ${isTop3 ? 'text-primary-600' : 'text-ink'}`}>
                    {formatCount(count)}
                  </p>
                  <p className="text-[11px] text-ink-muted">seguidores</p>
                </div>
              </button>
            );
          })}

          {/* Motivational footer */}
          <div className="rounded-2xl bg-gradient-to-br from-surface-100 to-white p-5 text-center border border-surface-200 mt-3">
            <p className="text-[20px]">🚀</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">¿Quieres aparecer aquí?</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-light max-w-[260px] mx-auto">
              Crea tu perfil, consigue seguidores y sube posiciones. El perfil #1 del mes obtiene la <strong>licencia permanente gratis</strong>.
            </p>
          </div>
        </div>
      )}

      {selected && <ProfileDetail profile={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
