'use client';

import { useState, useEffect } from 'react';
import PaymentReceipt from '@/components/promocion/PaymentReceipt';
import { paymentsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { profilesAPI } from '@/lib/api';
import { Profile, SocialNetwork } from '@/types';
import ProfileForm from '@/components/promocion/forms/ProfileForm';
import PlanSelector from '@/components/promocion/PlanSelector';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';

interface SocialNetworkOption {
  id: SocialNetwork;
  name: string;
  gradient: string;
  iconBg: string;
  description: string;
}

const socialNetworks: SocialNetworkOption[] = [
  { id: 'instagram', name: 'Instagram', gradient: 'from-purple-500 via-pink-500 to-orange-400', iconBg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', description: 'Red social visual' },
  { id: 'tiktok', name: 'TikTok', gradient: 'from-neutral-900 to-neutral-800', iconBg: 'bg-neutral-900', description: 'Videos cortos' },
  { id: 'youtube', name: 'YouTube', gradient: 'from-red-600 to-red-500', iconBg: 'bg-red-600', description: 'Plataforma de video' },
  { id: 'linkedin', name: 'LinkedIn', gradient: 'from-blue-700 to-blue-600', iconBg: 'bg-blue-700', description: 'Red profesional' },
  { id: 'facebook', name: 'Facebook', gradient: 'from-blue-600 to-blue-500', iconBg: 'bg-blue-600', description: 'Red social' },
  { id: 'x', name: 'X', gradient: 'from-neutral-900 to-neutral-800', iconBg: 'bg-neutral-900', description: 'Microblogging' },
  { id: 'twitch', name: 'Twitch', gradient: 'from-purple-600 to-purple-500', iconBg: 'bg-purple-600', description: 'Streaming en vivo' },
  { id: 'otros', name: 'Otras', gradient: 'from-stone-500 to-stone-400', iconBg: 'bg-stone-500', description: 'Otras plataformas' },
];

export default function PromocionPage() {
  const user = useAuthStore((state) => state.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<SocialNetwork | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<{ payment: any; profile: Profile } | null>(null);

  useEffect(() => {
    if (user) {
      loadProfiles();
    } else {
      setLoading(false);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const PayerID = params.get('PayerID');
      const paypalSuccess = params.get('paypal_success');

      if (token && PayerID) {
        handlePayPalReturn(token, PayerID);
      } else if (paypalSuccess === 'true') {
        const paymentData = localStorage.getItem('lastPayment');
        if (paymentData) {
          try {
            const parsed = JSON.parse(paymentData);
            const paidProfile = profiles.find(p => p._id === parsed.profileId);
            if (paidProfile) {
              setPaymentReceipt({ payment: parsed, profile: paidProfile });
            }
            localStorage.removeItem('lastPayment');
          } catch { /* silent */ }
        }
        loadProfiles();
        window.history.replaceState({}, '', '/promocion');
      }
    }
  }, [user]);

  const handlePayPalReturn = async (token: string, PayerID: string) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('paymentId');

      if (paymentId) {
        const captureResult: any = await paymentsAPI.captureOrder(token);

        const paymentData = localStorage.getItem('lastPayment');
        if (paymentData) {
          try {
            const parsed = JSON.parse(paymentData);
            const paidProfile = profiles.find(p => p._id === parsed.profileId) || profileData;
            if (paidProfile) {
              setPaymentReceipt({
                payment: { ...parsed, _id: captureResult?.paymentId || paymentId },
                profile: paidProfile,
              });
            }
            localStorage.removeItem('lastPayment');
          } catch { /* silent */ }
        }
      }

      loadProfiles();
      window.history.replaceState({}, '', '/promocion');
    } catch { /* silent */ }
  };

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await profilesAPI.getMyProfiles();
      setProfiles(response.profiles || []);
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  };

  const handleProfileCreated = async (profileId: string, createdProfile?: Profile) => {
    if (!profileId) return;

    try {
      if (createdProfile) {
        setProfileData(createdProfile);
        setProfiles(prev => {
          const exists = prev.find(p => p._id === createdProfile._id);
          if (exists) return prev.map(p => p._id === createdProfile._id ? createdProfile : p);
          return [createdProfile, ...prev];
        });
      } else {
        await loadProfiles();
      }

      setSelectedNetwork(null);
      setSelectedProfile(profileId);
      setShowPlanSelector(true);
    } catch {
      setSelectedNetwork(null);
      setSelectedProfile(profileId);
      setShowPlanSelector(true);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    const paidProfile = profiles.find(p => p._id === selectedProfile) || profileData;
    if (paidProfile) {
      const receiptData = { ...paymentData, profileId: selectedProfile };
      localStorage.setItem('lastPayment', JSON.stringify(receiptData));
      setPaymentReceipt({ payment: receiptData, profile: paidProfile });
    }
    setShowPlanSelector(false);
    setSelectedProfile(null);
    loadProfiles();
  };

  const handleBack = () => {
    setSelectedNetwork(null);
    setSelectedProfile(null);
    setShowPlanSelector(false);
  };

  // Plan selector view
  if (showPlanSelector && selectedProfile) {
    return (
      <>
        <div className="fixed inset-0 bg-surface overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="mx-auto flex h-full max-w-lg flex-col">
            <div className="flex items-center px-5 py-4">
              <button onClick={handleBack} className="flex items-center gap-1.5 text-sm font-medium text-ink-light hover:text-ink transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-[max(7rem,calc(env(safe-area-inset-bottom)+6rem))]" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
              <PlanSelector
                profileId={selectedProfile}
                profile={(() => {
                  const found = profiles.find(p => p._id === selectedProfile);
                  if (!found && profileData && profileData._id === selectedProfile) return profileData;
                  return found;
                })()}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
        {paymentReceipt && (
          <PaymentReceipt
            payment={paymentReceipt.payment}
            profile={paymentReceipt.profile}
            onClose={() => { setPaymentReceipt(null); setSelectedProfile(null); setShowPlanSelector(false); }}
            onViewProfile={() => {}}
          />
        )}
      </>
    );
  }

  // Profile form view
  if (selectedNetwork) {
    const displayNetwork = currentNetwork || selectedNetwork;
    const networkInfo = socialNetworks.find(n => n.id === displayNetwork);

    return (
      <>
        <div
          className="fixed inset-0 bg-surface overflow-auto"
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          <div className="mx-auto max-w-lg px-5 py-4">
            <button onClick={handleBack} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-light hover:text-ink transition">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>

            {networkInfo && (
              <div className="mb-6 flex items-center gap-3">
                <div className={`${networkInfo.iconBg} flex h-11 w-11 items-center justify-center rounded-xl`}>
                  <SocialNetworkLogo network={networkInfo.id} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">{networkInfo.name}</h2>
                  <p className="text-[13px] text-ink-light">{networkInfo.description}</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white p-5 shadow-card">
              <ProfileForm
                defaultNetwork={selectedNetwork}
                onSuccess={(profileId, profile) => handleProfileCreated(profileId, profile)}
                onCancel={handleBack}
                onNetworkChange={setCurrentNetwork}
              />
            </div>
          </div>
        </div>
        {paymentReceipt && (
          <PaymentReceipt
            payment={paymentReceipt.payment}
            profile={paymentReceipt.profile}
            onClose={() => { setPaymentReceipt(null); setSelectedProfile(null); setSelectedNetwork(null); }}
            onViewProfile={() => {}}
          />
        )}
      </>
    );
  }

  // Main view - Network selection
  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-surface-300 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] bg-surface px-5 pb-[max(7rem,calc(env(safe-area-inset-bottom)+6rem))] pt-6"
      style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
    >
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Promoción</h1>
          <p className="mt-1 text-[15px] text-ink-light">Elige una red social para promocionar tu perfil</p>
        </div>

        {/* Social network grid */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          {socialNetworks.map((network) => {
            const profileCount = profiles.filter(p => p.socialNetwork === network.id).length;
            return (
              <button
                key={network.id}
                onClick={() => { setSelectedNetwork(network.id); setCurrentNetwork(network.id); }}
                className="group relative flex flex-col items-start rounded-2xl bg-white p-4 shadow-soft ring-1 ring-surface-300/50 transition active:scale-[0.97] hover:shadow-card"
              >
                <div className={`${network.iconBg} mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105`}>
                  <SocialNetworkLogo network={network.id} className="h-5 w-5 text-white" />
                </div>
                <span className="text-[15px] font-semibold text-ink">{network.name}</span>
                <span className="text-[12px] text-ink-muted">{network.description}</span>
                {profileCount > 0 && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                    {profileCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* My profiles */}
        {profiles.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-ink">Mis perfiles</h2>
            <div className="space-y-3">
              {profiles.map((profile) => {
                const network = socialNetworks.find(n => n.id === profile.socialNetwork);
                return (
                  <div key={profile._id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-surface-300/50">
                    {network && (
                      <div className={`${network.iconBg} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl`}>
                        <SocialNetworkLogo network={profile.socialNetwork} className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-ink">
                        {profile.profileData.username || profile.profileData.channelName || profile.profileData.handle || profile.profileData.streamerName || 'Perfil'}
                      </p>
                      <p className="text-[12px] text-ink-muted">
                        {profile.isActive ? 'Activo' : 'Inactivo'}
                        {profile.isPaid && profile.paidUntil && ` · Hasta ${new Date(profile.paidUntil).toLocaleDateString()}`}
                      </p>
                    </div>
                    {!profile.isPaid ? (
                      <button
                        onClick={() => { setSelectedProfile(profile._id); setShowPlanSelector(true); }}
                        className="shrink-0 rounded-xl bg-primary-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-primary-700 active:scale-95"
                      >
                        Activar
                      </button>
                    ) : (
                      <span className="shrink-0 rounded-xl bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Activo
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {paymentReceipt && (
        <PaymentReceipt
          payment={paymentReceipt.payment}
          profile={paymentReceipt.profile}
          onClose={() => { setPaymentReceipt(null); setSelectedProfile(null); setShowPlanSelector(false); setSelectedNetwork(null); }}
          onViewProfile={() => {}}
        />
      )}
    </div>
  );
}
