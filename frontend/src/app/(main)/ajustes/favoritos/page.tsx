'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl, placeholderImage } from '@/lib/imageUtils';
import ProfileDetail from '@/components/principal/ProfileDetail';

const FAVORITES_KEY = (userId: string) => `favorites_${userId}`;

const NETWORK_COLORS: Record<string, string> = {
  tiktok: 'bg-pink-500', youtube: 'bg-red-500', instagram: 'bg-purple-600',
  facebook: 'bg-blue-600', linkedin: 'bg-blue-700', twitch: 'bg-purple-600',
  x: 'bg-neutral-900', otros: 'bg-stone-500',
};

export default function FavoritosPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = FAVORITES_KEY(user?.id || 'guest');
      const stored = localStorage.getItem(key);
      setFavoriteIds(stored ? JSON.parse(stored) : []);
    }
  }, [user?.id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const demoProfiles: Profile[] = [
          { _id: 'demo-001', userId: 'demo', socialNetwork: 'instagram', isActive: true, isPaid: false, profileData: { username: 'demo_foto', followers: 12400, posts: 87, description: 'Fotografía de viajes y naturaleza.' }, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'], link: 'https://instagram.com/demo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), paidUntil: null, planType: null },
          { _id: 'demo-002', userId: 'demo', socialNetwork: 'tiktok', isActive: true, isPaid: false, profileData: { username: 'demo_dance', followers: 48200, videos: 134, description: 'Bailes y tendencias.' }, images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'], link: 'https://tiktok.com/@demo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), paidUntil: null, planType: null },
          { _id: 'demo-003', userId: 'demo', socialNetwork: 'youtube', isActive: true, isPaid: false, profileData: { channelName: 'TechReviews ES', subscribers: 95000, videoCount: 312, description: 'Reviews de tecnología.' }, images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'], link: 'https://youtube.com/demo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), paidUntil: null, planType: null },
        ];

        let all = [...demoProfiles];
        try {
          const r = await profilesAPI.getAll();
          const real = (r.profiles || []).filter((p: Profile) => !p._id?.startsWith('demo-'));
          all = [...all, ...real];
        } catch { /* silent */ }

        setProfiles(all.filter((p) => favoriteIds.includes(p._id)));
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    };
    if (favoriteIds.length > 0) load();
    else setLoading(false);
  }, [favoriteIds]);

  const removeFavorite = (id: string) => {
    const next = favoriteIds.filter((f) => f !== id);
    if (typeof window !== 'undefined') {
      const key = FAVORITES_KEY(user?.id || 'guest');
      localStorage.setItem(key, JSON.stringify(next));
    }
    setFavoriteIds(next);
    setProfiles((p) => p.filter((pr) => pr._id !== id));
  };

  const getDisplayName = (p: Profile) =>
    p.profileData.username || p.profileData.channelName || p.profileData.handle ||
    p.profileData.streamerName || p.profileData.pageName || p.profileData.twitterHandle || 'Perfil';

  const formatCount = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);

  const getMainStat = (p: Profile) => {
    const d = p.profileData;
    if (d.followers) return { label: 'seg', value: formatCount(d.followers) };
    if (d.subscribers) return { label: 'subs', value: formatCount(d.subscribers) };
    if (d.likes) return { label: 'likes', value: formatCount(d.likes) };
    return null;
  };

  return (
    <div
      className="min-h-[100dvh] bg-surface px-4 pb-28"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3 pt-1">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card transition active:scale-90"
        >
          <svg className="h-4.5 w-4.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div>
          <h1 className="text-[20px] font-bold text-ink">Favoritos</h1>
          <p className="text-[13px] text-ink-muted">{favoriteIds.length} perfiles guardados</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-200">
            <svg className="h-8 w-8 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <h2 className="mb-2 text-[17px] font-semibold text-ink">Sin favoritos aún</h2>
          <p className="max-w-[240px] text-[14px] leading-relaxed text-ink-muted">
            Toca la estrella ★ al explorar perfiles para guardarlos aquí y visitarlos cuando quieras.
          </p>
          <button
            onClick={() => router.push('/principal')}
            className="mt-6 rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98]"
          >
            Explorar perfiles
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((p) => {
            const stat = getMainStat(p);
            return (
              <div
                key={p._id}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-surface-200/60"
              >
                {/* Thumbnail */}
                <button onClick={() => setSelected(p)} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src={p.images?.[0] ? getImageUrl(p.images[0]) : placeholderImage}
                    alt={getDisplayName(p)}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage; }}
                  />
                  <div className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full ${NETWORK_COLORS[p.socialNetwork] || 'bg-stone-500'}`}>
                    <SocialNetworkLogo network={p.socialNetwork} className="h-3 w-3 text-white" />
                  </div>
                </button>

                {/* Info */}
                <button onClick={() => setSelected(p)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-[15px] font-semibold text-ink">{getDisplayName(p)}</p>
                  <p className="text-[12px] capitalize text-ink-muted">{p.socialNetwork}</p>
                  {stat && (
                    <p className="mt-0.5 text-[12px] font-medium text-primary-600">
                      {stat.value} {stat.label}
                    </p>
                  )}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition active:scale-90"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => removeFavorite(p._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition active:scale-90"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <ProfileDetail profile={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
