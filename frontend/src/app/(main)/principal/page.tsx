'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI, userAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import ProfileCard from '@/components/principal/ProfileCard';
import ProfileDetail from '@/components/principal/ProfileDetail';
import SocialNetworkSelector from '@/components/principal/SocialNetworkSelector';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import UndoSubscriptionModal from '@/components/principal/UndoSubscriptionModal';

const FAVORITES_KEY = (userId: string) => `favorites_${userId}`;
const UNDO_KEY = 'undoSubscribed';

export default function PrincipalPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [cornerEffects, setCornerEffects] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [backUsed, setBackUsed] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'all' | SocialNetwork>('all');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [discardedProfiles, setDiscardedProfiles] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavStar, setShowFavStar] = useState<string | null>(null);
  const [undoSubscribed, setUndoSubscribed] = useState(false);
  const [showUndoModal, setShowUndoModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) { router.replace('/login'); return; }
    }
  }, [router]);

  // Load favorites + undo subscription from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = FAVORITES_KEY(user?.id || 'guest');
      const stored = localStorage.getItem(key);
      setFavorites(stored ? JSON.parse(stored) : []);
      setUndoSubscribed(localStorage.getItem(UNDO_KEY) === 'true');
    }
  }, [user?.id]);

  const saveFavorites = (favs: string[]) => {
    if (typeof window !== 'undefined') {
      const key = FAVORITES_KEY(user?.id || 'guest');
      localStorage.setItem(key, JSON.stringify(favs));
      setFavorites(favs);
    }
  };

  const toggleFavorite = (profileId: string) => {
    const next = favorites.includes(profileId)
      ? favorites.filter((f) => f !== profileId)
      : [...favorites, profileId];
    saveFavorites(next);
    setShowFavStar(profileId);
    setTimeout(() => setShowFavStar(null), 1000);
  };

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        // 3 polished demo profiles — shown first for the tutorial
        const demoProfiles: Profile[] = [
          {
            _id: 'demo-001',
            userId: 'demo',
            socialNetwork: 'instagram' as SocialNetwork,
            isActive: true,
            isPaid: true,
            profileData: {
              handle: '@lauraexplora',
              followers: 24800,
              following: 512,
              posts: 143,
              engagementRate: 4.2,
              category: 'viajes',
              language: 'es',
              country: 'España',
              accountType: 'creator',
              acceptsSponsorships: true,
              priceRange: '150 € – 400 € / post',
              description: '✈️ Viajera empedernida, fotógrafa amateur y adicta al café. Comparto rincones secretos de España y el mundo cada semana.',
            },
            images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop&q=80'],
            link: 'https://instagram.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidUntil: null,
            planType: 'monthly',
          },
          {
            _id: 'demo-002',
            userId: 'demo',
            socialNetwork: 'tiktok' as SocialNetwork,
            isActive: true,
            isPaid: true,
            profileData: {
              username: '@migueldance_es',
              followers: 183500,
              videos: 278,
              totalLikes: 3200000,
              engagementRate: 8.7,
              category: 'entretenimiento',
              language: 'es',
              country: 'España',
              acceptsSponsorships: true,
              priceRange: '300 € – 900 € / vídeo',
              description: '🕺 Coreógrafo y creador de contenido. Mis challenges virales llegan a millones. Colaboro con marcas de moda y lifestyle.',
            },
            images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&q=80'],
            link: 'https://tiktok.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidUntil: null,
            planType: 'yearly',
          },
          {
            _id: 'demo-003',
            userId: 'demo',
            socialNetwork: 'youtube' as SocialNetwork,
            isActive: true,
            isPaid: true,
            profileData: {
              channelName: 'TechReviews ES',
              subscribers: 95400,
              videoCount: 312,
              totalViews: 8200000,
              avgViews: 26000,
              category: 'tecnologia',
              language: 'es',
              country: 'España',
              acceptsSponsorships: true,
              priceRange: '500 € – 2000 € / integración',
              description: '💻 Reviews de tecnología sin filtros. Análisis en profundidad de smartphones, portátiles y gadgets. Más de 8M de visualizaciones acumuladas.',
            },
            images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop&q=80'],
            link: 'https://youtube.com',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paidUntil: null,
            planType: 'lifetime',
          },
        ];

        // Solo 3 perfiles tutorial (cliente). Los reales vienen de la API cuando existan.
        const activeDemos = demoProfiles.filter(p => !discardedProfiles.includes(p._id));

        let realProfiles: Profile[] = [];
        try {
          const response = await profilesAPI.getAll();
          realProfiles = (response.profiles || []).filter(
            (p: Profile) => !discardedProfiles.includes(String(p._id))
          );
        } catch { /* silent */ }

        const available = [
          ...activeDemos,
          ...[...realProfiles].sort(() => Math.random() - 0.5),
        ];

        if (available.length === 0) { setProfiles([]); setLoading(false); return; }
        setProfiles(available);
      } catch { setProfiles([]); } finally { setLoading(false); }
    };
    loadProfiles();
  }, [user, discardedProfiles]);

  useEffect(() => {
    const load = async () => {
      if (user?.id) {
        try {
          const r = await userAPI.getDiscardedProfiles();
          setDiscardedProfiles(r.discardedProfiles || []);
        } catch {
          const stored = localStorage.getItem(`viewedProfiles_${user.id}`);
          setDiscardedProfiles(stored ? JSON.parse(stored) : []);
        }
      }
    };
    load();
  }, [user?.id]);

  const markViewed = async (profileId: string) => {
    if (user?.id) {
      try { await userAPI.discardProfile(profileId); } catch { /* silent */ }
    }
    if (typeof window !== 'undefined') {
      const key = `viewedProfiles_${user?.id || 'guest'}`;
      const stored = localStorage.getItem(key);
      const arr: string[] = stored ? JSON.parse(stored) : [];
      if (!arr.includes(profileId)) localStorage.setItem(key, JSON.stringify([...arr, profileId]));
    }
    setDiscardedProfiles(prev => prev.includes(profileId) ? prev : [...prev, profileId]);
  };

  const filteredProfiles = useMemo(() => {
    let a = profiles.filter(p => !discardedProfiles.includes(p._id));
    if (selectedNetwork !== 'all') a = a.filter(p => p.socialNetwork === selectedNetwork);
    return a;
  }, [profiles, selectedNetwork, discardedProfiles]);

  useEffect(() => { setCurrentIndex(0); setHistory([]); }, [selectedNetwork]);

  useEffect(() => {
    if (filteredProfiles.length > 0 && currentIndex >= filteredProfiles.length) {
      setCurrentIndex(0); setHistory([]);
    }
  }, [filteredProfiles.length, currentIndex]);

  const advance = () => {
    const remaining = profiles.filter(p => !discardedProfiles.includes(p._id));
    if (remaining.length === 0) { setProfiles([]); return; }
    if (currentIndex < filteredProfiles.length - 1) setCurrentIndex(c => c + 1);
    else setCurrentIndex(0);
  };

  const handleSwipeLeft = async () => {
    const p = filteredProfiles[currentIndex];
    if (!p) return;
    await markViewed(p._id);
    setHistory([]);
    setBackUsed(false);
    advance();
  };

  const handleSwipeRight = async () => {
    const p = filteredProfiles[currentIndex];
    if (!p) return;
    await markViewed(p._id);
    const isDemo = p._id?.startsWith('demo-') || (p.userId as any)?.username === 'demo';
    if (!isDemo && p.link) window.open(p.link, '_blank');
    setHistory([]);
    setBackUsed(false);
    advance();
  };

  const handleSwipeUp = () => {
    const p = filteredProfiles[currentIndex];
    if (p) setSelectedProfile(p);
  };

  const handleGoBack = () => {
    if (history.length === 0) return;
    if (undoSubscribed) {
      // Ya suscrito → deshacer directamente
      setCurrentIndex(history[history.length - 1]);
      setHistory(prev => prev.slice(0, -1));
    } else {
      // Siempre mostrar modal de pago si no está suscrito
      setShowUndoModal(true);
    }
  };

  if (showNetworkSelector) {
    return (
      <SocialNetworkSelector
        selectedNetwork={selectedNetwork}
        onSelect={(n) => { setSelectedNetwork(n); setShowNetworkSelector(false); }}
        onClose={() => setShowNetworkSelector(false)}
      />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
      </div>
    );
  }

  if (filteredProfiles.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-surface px-6">
        <button
          onClick={() => setShowNetworkSelector(true)}
          className="absolute left-5 top-[max(1.25rem,env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card transition active:scale-95"
          style={{ zIndex: 200 }}
        >
          {selectedNetwork === 'all' ? (
            <svg className="h-5 w-5 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          ) : (
            <SocialNetworkLogo network={selectedNetwork} className="h-5 w-5 text-ink" />
          )}
        </button>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-200">
            <svg className="h-8 w-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-ink">No hay perfiles</h2>
          <p className="mb-6 text-[15px] leading-relaxed text-ink-light max-w-[260px]">Has visto todos los perfiles disponibles. Vuelve más tarde.</p>
          <button onClick={() => setShowNetworkSelector(true)} className="rounded-xl bg-primary-600 px-6 py-3 text-[15px] font-semibold text-white shadow-soft transition hover:bg-primary-700 active:scale-[0.98]">
            Cambiar filtro
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = filteredProfiles[currentIndex];
  const isFavorited = currentProfile ? favorites.includes(currentProfile._id) : false;

  return (
    <div className="fixed inset-0 bg-surface">
      {/* Corner gradient effects */}
      {(cornerEffects.left > 0 || cornerEffects.right > 0 || cornerEffects.top > 0 || cornerEffects.bottom > 0) && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 20,
            background: `
              radial-gradient(circle at 0% 50%, rgba(239,68,68,${cornerEffects.left * 0.22}) 0%, transparent 30%),
              radial-gradient(circle at 100% 50%, rgba(59,130,246,${cornerEffects.right * 0.22}) 0%, transparent 30%),
              radial-gradient(circle at 50% 0%, rgba(245,158,11,${cornerEffects.top * 0.22}) 0%, transparent 30%),
              radial-gradient(circle at 50% 100%, rgba(34,197,94,${cornerEffects.bottom * 0.22}) 0%, transparent 30%)
            `,
          }}
        />
      )}

      {/* Filter button — top left */}
      <button
        onClick={() => setShowNetworkSelector(true)}
        className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-card backdrop-blur-sm transition active:scale-95"
        style={{ top: 'max(1rem, env(safe-area-inset-top))', zIndex: 300 }}
      >
        {selectedNetwork === 'all' ? (
          <svg className="h-5 w-5 text-ink-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        ) : (
          <SocialNetworkLogo network={selectedNetwork} className="h-5 w-5 text-ink" />
        )}
      </button>

      {/* Card stack */}
      {filteredProfiles.length > 0 && (
        <div
          className="profile-card-container absolute inset-x-3 bottom-[max(7.5rem,calc(env(safe-area-inset-bottom)+7rem))]"
          style={{ top: 'max(4rem, calc(env(safe-area-inset-top) + 3.5rem))', touchAction: 'none' }}
        >
          {filteredProfiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => (
            <div
              key={`${profile._id}-${currentIndex}`}
              className="absolute inset-0"
              style={{
                zIndex: 10 - idx,
                opacity: idx === 0 ? 1 : Math.max(0.35, 0.7 - idx * 0.2),
                transform: idx === 0 ? 'none' : `translateY(${idx * 6}px) scale(${1 - idx * 0.03})`,
                transition: idx > 0 ? 'opacity 0.35s ease, transform 0.35s ease' : undefined,
              }}
            >
              <ProfileCard
                profile={profile}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
                onGoBack={handleGoBack}
                onShowDetail={(p) => setSelectedProfile(p)}
                onCornerEffectsChange={setCornerEffects}
                index={idx}
                canGoBack={history.length > 0 && idx === 0}
                currentProfileIndex={currentIndex + idx}
              />
            </div>
          ))}
        </div>
      )}

      {/* Favorite toast */}
      {showFavStar && (
        <div
          className="pointer-events-none fixed left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
          style={{ top: 'max(5rem, calc(env(safe-area-inset-top) + 4.5rem))', zIndex: 500 }}
        >
          {favorites.includes(showFavStar) ? '★ Añadido a favoritos' : '☆ Eliminado de favoritos'}
        </div>
      )}

      {/* Action buttons */}
      {filteredProfiles.length > 0 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center gap-3 px-5"
          style={{ bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom) + 5rem))', zIndex: 400 }}
        >
          {/* Skip — red */}
          <ActionBtn
            onClick={() => { if (!isAnimating) { setIsAnimating(true); handleSwipeLeft(); setTimeout(() => setIsAnimating(false), 300); } }}
            disabled={isAnimating}
            size="lg"
            color="red"
            label="Saltar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </ActionBtn>

          {/* Undo — requiere suscripción */}
          <ActionBtn
            onClick={() => { if (!isAnimating) { setIsAnimating(true); handleGoBack(); setTimeout(() => setIsAnimating(false), 300); } }}
            disabled={isAnimating}
            size="sm"
            color={undoSubscribed ? 'gray' : 'amber'}
            label={undoSubscribed ? 'Volver' : '€ Volver'}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </ActionBtn>

          {/* Star / Favorites */}
          <ActionBtn
            onClick={() => { if (currentProfile) toggleFavorite(currentProfile._id); }}
            disabled={false}
            size="sm"
            color={isFavorited ? 'amber' : 'gray'}
            label="Favorito"
          >
            <svg className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </ActionBtn>

          {/* Details — up */}
          <ActionBtn
            onClick={() => { if (!isAnimating) { setIsAnimating(true); handleSwipeUp(); setTimeout(() => setIsAnimating(false), 300); } }}
            disabled={isAnimating}
            size="sm"
            color="gray"
            label="Detalles"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </ActionBtn>

          {/* Visit / Link — blue */}
          <ActionBtn
            onClick={() => { if (!isAnimating) { setIsAnimating(true); handleSwipeRight(); setTimeout(() => setIsAnimating(false), 300); } }}
            disabled={isAnimating}
            size="lg"
            color="blue"
            label="Visitar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </ActionBtn>
        </div>
      )}

      {/* Profile detail modal */}
      {selectedProfile && (
        <ProfileDetail
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* Undo subscription modal */}
      {showUndoModal && (
        <UndoSubscriptionModal
          onSubscribe={() => {
            setUndoSubscribed(true);
            setShowUndoModal(false);
            // Execute the undo action after subscribing
            if (history.length > 0) {
              setCurrentIndex(history[history.length - 1]);
              setHistory(prev => prev.slice(0, -1));
            }
          }}
          onClose={() => setShowUndoModal(false)}
        />
      )}
    </div>
  );
}

/* ─── Reusable action button ─── */
interface ActionBtnProps {
  onClick: () => void;
  disabled: boolean;
  size: 'sm' | 'lg';
  color: 'red' | 'blue' | 'gray' | 'amber';
  label: string;
  children: React.ReactNode;
}

const colorMap = {
  red:   'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.4)]',
  blue:  'bg-blue-500 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]',
  amber: 'bg-primary-500 text-white shadow-[0_4px_14px_rgba(245,158,11,0.4)]',
  gray:  'bg-white text-ink shadow-card ring-1 ring-surface-300/50',
};

function ActionBtn({ onClick, disabled, size, color, label, children }: ActionBtnProps) {
  const sz = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClick(); }}
      disabled={disabled}
      aria-label={label}
      className={`flex ${sz} items-center justify-center rounded-full transition active:scale-90 disabled:opacity-30 ${colorMap[color]}`}
    >
      {children}
    </button>
  );
}
