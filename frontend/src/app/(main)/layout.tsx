'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import WelcomeTutorial from '@/components/shared/WelcomeTutorial';
import FreeProfileModal from '@/components/shared/FreeProfileModal';
import { useAuthStore } from '@/store/authStore';
import { getAuthToken } from '@/lib/auth';
import { authAPI } from '@/lib/api';

const CompassIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary-600' : 'text-ink-muted'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.5}>
    {active ? (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.36 5.64l-2.05 5.47-5.47 2.05 2.05-5.47 5.47-2.05z" />
    ) : (
      <>
        <circle cx="12" cy="12" r="9" />
        <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" opacity="0.6" />
      </>
    )}
  </svg>
);

const RocketIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary-600' : 'text-ink-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary-600' : 'text-ink-muted'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke={active ? 'none' : 'currentColor'} strokeWidth={1.5}>
    {active ? (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </>
    )}
  </svg>
);

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentPathname = usePathname();
  const [tutorialCompleted, setTutorialCompleted] = useState(true);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [freeSpots, setFreeSpots] = useState(200);
  const { setUser, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadTutorialStatus = async () => {
      const token = getAuthToken();
      if (token && user?.id) {
        try {
          const { userAPI } = await import('@/lib/api');
          const response = await userAPI.getTutorialStatus();
          setTutorialCompleted(response.tutorialCompleted);
          if (response.tutorialCompleted) {
            localStorage.setItem('tutorialCompleted', 'true');
          }
        } catch {
          const tutorialDone = localStorage.getItem('tutorialCompleted') === 'true';
          setTutorialCompleted(tutorialDone);
        }
      } else {
        const tutorialDone = localStorage.getItem('tutorialCompleted') === 'true';
        setTutorialCompleted(tutorialDone);
      }
    };

    loadTutorialStatus();

    // Mostrar modal de perfil gratis si el usuario se acaba de registrar
    if (localStorage.getItem('showFreeProfileModal') === 'true') {
      // Pequeño delay para que el tutorial no colisione
      const modalTimer = setTimeout(async () => {
        try {
          const { pricingAPI } = await import('@/lib/api');
          const data = await pricingAPI.getPlans();
          if (data.freePromotionAvailable) {
            setFreeSpots(data.remainingFreeSpots ?? 200);
            setShowFreeModal(true);
          }
        } catch {
          setShowFreeModal(true);
        }
        localStorage.removeItem('showFreeProfileModal');
      }, 1200);
      return () => clearTimeout(modalTimer);
    }

    const token = getAuthToken();
    if (token && !isAuthenticated && !user) {
      authAPI.getMe()
        .then((response) => {
          setUser(response.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          router.replace('/login');
        });
    }
  }, [isAuthenticated, user, setUser, router]);

  const TrophyIcon = ({ active }: { active: boolean }) => (
    <svg className={`h-6 w-6 ${active ? 'text-primary-600' : 'text-ink-muted'}`} fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke={active ? 'none' : 'currentColor'} strokeWidth={1.5}>
      {active ? (
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      )}
    </svg>
  );

  const tabs = [
    { name: 'Explorar', href: '/principal', Icon: CompassIcon },
    { name: 'Rankings', href: '/ranking', Icon: TrophyIcon },
    { name: 'Promoción', href: '/promocion', Icon: RocketIcon },
    { name: 'Ajustes', href: '/ajustes', Icon: UserIcon },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface">
      <WelcomeTutorial
        tutorialCompleted={tutorialCompleted}
        onClose={async () => {
          setTutorialCompleted(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tutorialCompleted', 'true');
          }
          const token = getAuthToken();
          if (token && user?.id) {
            try {
              const { userAPI } = await import('@/lib/api');
              await userAPI.markTutorialCompleted();
            } catch { /* silent */ }
          }
        }}
      />

      {showFreeModal && (
        <FreeProfileModal
          username={user?.username || 'nuevo usuario'}
          remainingSpots={freeSpots}
          onClose={() => setShowFreeModal(false)}
        />
      )}

      {/* Content — no overflow-hidden so pages can scroll freely */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-300/60 bg-white/95 backdrop-blur-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex h-[3.75rem] max-w-lg items-center justify-around px-1">
          {tabs.map((tab) => {
            const active = currentPathname === tab.href || currentPathname.startsWith(tab.href + '/');
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-opacity active:opacity-70"
              >
                <tab.Icon active={active} />
                <span className={`text-[9px] font-semibold tracking-tight ${active ? 'text-primary-600' : 'text-ink-muted'}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
