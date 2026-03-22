'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Profile } from '@/types';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl, placeholderImage } from '@/lib/imageUtils';

interface ProfileCardProps {
  profile: Profile;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onGoBack?: () => void;
  onShowDetail?: (profile: Profile) => void;
  onCornerEffectsChange?: (effects: { left: number; right: number; top: number; bottom: number }) => void;
  index: number;
  canGoBack?: boolean;
  currentProfileIndex?: number;
}

interface DragAction {
  type: 'left' | 'right' | 'up' | 'down' | 'back' | null;
  intensity: number;
}

export default function ProfileCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onGoBack,
  onShowDetail,
  onCornerEffectsChange,
  index,
  canGoBack = false,
  currentProfileIndex,
}: ProfileCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDemoProfile = (() => {
    const userIdObj = profile.userId as any;
    return userIdObj?.username === 'demo' || userIdObj?._id === '000000000000000000000000' || profile._id?.toString().startsWith('demo-');
  })();
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragAction, setDragAction] = useState<DragAction>({ type: null, intensity: 0 });
  const [buttonAction, setButtonAction] = useState<DragAction>({ type: null, intensity: 0 });
  const [backUsed, setBackUsed] = useState(false);
  const linkOpenedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef(position);
  const startPosRef = useRef(startPos);
  const dragActionRef = useRef(dragAction);
  const isDraggingRef = useRef(isDragging);
  const isAnimatingRef = useRef(isAnimating);
  const profileRef = useRef(profile);
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  const onSwipeUpRef = useRef(onSwipeUp);
  const onGoBackRef = useRef(onGoBack);
  const onShowDetailRef = useRef(onShowDetail);
  const canGoBackRef = useRef(canGoBack);
  const backUsedRef = useRef(backUsed);

  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { startPosRef.current = startPos; }, [startPos]);
  useEffect(() => { dragActionRef.current = dragAction; }, [dragAction]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
    onSwipeRightRef.current = onSwipeRight;
    onSwipeUpRef.current = onSwipeUp;
    onGoBackRef.current = onGoBack;
    canGoBackRef.current = canGoBack;
    backUsedRef.current = backUsed;
    onShowDetailRef.current = onShowDetail;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onGoBack, onShowDetail, canGoBack, backUsed]);

  const getActionForPosition = (x: number, y: number): DragAction => {
    const threshold = 30;
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const intensity = Math.min(1, distanceFromCenter / threshold);

    if (intensity < 0.05) return { type: null, intensity: 0 };

    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX > absY * 0.8) {
      if (x < 0) return { type: 'left', intensity };
      if (x > 0) return { type: 'right', intensity };
    } else if (absY > absX * 0.8) {
      if (y < 0) return { type: 'up', intensity };
      return { type: 'down', intensity };
    }

    return { type: null, intensity: 0 };
  };

  const resetEffects = useCallback(() => {
    if (onCornerEffectsChange) onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
  }, [onCornerEffectsChange]);

  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragAction({ type: null, intensity: 0 });
    resetEffects();
  };

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsAnimating(false);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    resetEffects();
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.opacity = '';
      cardRef.current.style.transition = '';
    }
  }, [resetEffects]);

  const triggerSwipeAnimation = useCallback((direction: 'left' | 'right', callback: () => void) => {
    setIsAnimating(true);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    resetEffects();

    const card = cardRef.current;
    if (!card) { setIsAnimating(false); return; }

    const currentPosition = positionRef.current;
    const translateX = direction === 'left' ? '-100vw' : '100vw';

    card.style.willChange = 'transform, opacity';
    card.style.transform = `translate(${translateX}, ${currentPosition.y}px) rotate(${direction === 'left' ? '-20deg' : '20deg'})`;
    card.style.opacity = '0';
    card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease';

    setTimeout(() => callback(), 150);

    setTimeout(() => {
      if (card) {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.transition = '';
        card.style.willChange = '';
      }
      setPosition({ x: 0, y: 0 });
      setIsAnimating(false);
      resetEffects();
    }, 450);
  }, [resetEffects]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDraggingRef.current || isAnimatingRef.current) return;

    const currentStartPos = startPosRef.current;
    const deltaX = clientX - currentStartPos.x;
    const deltaY = clientY - currentStartPos.y;
    setPosition({ x: deltaX, y: deltaY });

    if (cardRef.current) {
      const action = getActionForPosition(deltaX, deltaY);
      setDragAction(action);
      dragActionRef.current = action;

      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const rect = cardRef.current.getBoundingClientRect();
        const cornerEffect = {
          left: Math.max(0, 1 - rect.left / 200),
          right: Math.max(0, 1 - (vw - rect.right) / 200),
          top: Math.max(0, 1 - rect.top / 200),
          bottom: Math.max(0, 1 - (vh - rect.bottom) / 200),
        };
        if (onCornerEffectsChange) onCornerEffectsChange(cornerEffect);
      } else {
        resetEffects();
      }
    }
  }, [onCornerEffectsChange, resetEffects]);

  const triggerBackAnimation = useCallback((callback: () => void) => {
    if (isAnimating || backUsedRef.current || !canGoBackRef.current) return;

    setIsAnimating(true);
    setIsDragging(false);
    setBackUsed(true);
    backUsedRef.current = true;
    setDragAction({ type: null, intensity: 0 });
    resetEffects();
    setButtonAction({ type: 'back', intensity: 1 });
    setPosition({ x: 0, y: 0 });

    const card = cardRef.current;
    if (card) {
      card.style.transform = '';
      card.style.opacity = '';
      card.style.transition = '';
    }

    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) {
        setIsAnimating(false);
        setButtonAction({ type: null, intensity: 0 });
        return;
      }

      card.style.willChange = 'transform, opacity';
      card.style.transform = 'translate(0, 80px)';
      card.style.opacity = '0';
      card.style.transition = 'none';
      card.offsetHeight;
      card.style.transform = 'translate(0, 0)';
      card.style.opacity = '1';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease';

      callback();

      setTimeout(() => {
        if (card) {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.transition = '';
          card.style.willChange = '';
        }
        setButtonAction({ type: null, intensity: 0 });
        setIsAnimating(false);
        setPosition({ x: 0, y: 0 });
        resetEffects();
      }, 450);
    });
  }, [isAnimating, resetEffects]);

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current || isAnimatingRef.current) {
      setIsDragging(false);
      return;
    }

    const currentPosition = positionRef.current;
    const currentDragAction = dragActionRef.current;
    const threshold = 30;

    const currentOnSwipeLeft = onSwipeLeftRef.current;
    const currentOnSwipeRight = onSwipeRightRef.current;
    const currentOnShowDetail = onShowDetailRef.current;
    const currentOnSwipeUp = onSwipeUpRef.current;
    const currentProfile = profileRef.current;

    if (currentDragAction.type && currentDragAction.intensity > 0.05) {
      resetEffects();

      if (currentDragAction.type === 'left' && currentOnSwipeLeft) {
        triggerSwipeAnimation('left', currentOnSwipeLeft);
        return;
      }
      if (currentDragAction.type === 'right' && currentOnSwipeRight) {
        triggerSwipeAnimation('right', currentOnSwipeRight);
        return;
      }
      if (currentDragAction.type === 'up') {
        if (currentOnShowDetail) currentOnShowDetail(currentProfile);
        else if (currentOnSwipeUp) currentOnSwipeUp();
        resetPosition();
        return;
      }
      if (currentDragAction.type === 'down') {
        const goBack = onGoBackRef.current;
        if (goBack && canGoBackRef.current && !backUsedRef.current) {
          triggerBackAnimation(goBack);
        } else {
          resetPosition();
        }
        return;
      }
    }

    const absX = Math.abs(currentPosition.x);
    const absY = Math.abs(currentPosition.y);

    if (absX > threshold || absY > threshold) {
      resetEffects();

      if (absX > absY * 0.8) {
        if (currentPosition.x > threshold && currentOnSwipeRight) {
          triggerSwipeAnimation('right', currentOnSwipeRight);
          return;
        }
        if (currentPosition.x < -threshold && currentOnSwipeLeft) {
          triggerSwipeAnimation('left', currentOnSwipeLeft);
          return;
        }
      } else if (absY > absX * 0.8) {
        if (currentPosition.y < -threshold) {
          if (currentOnShowDetail) currentOnShowDetail(currentProfile);
          else if (currentOnSwipeUp) currentOnSwipeUp();
          resetPosition();
          return;
        }
        if (currentPosition.y > threshold) {
          const goBack = onGoBackRef.current;
          if (goBack && canGoBackRef.current && !backUsedRef.current) {
            triggerBackAnimation(goBack);
          } else {
            resetPosition();
          }
          return;
        }
      }
    }

    resetPosition();
  }, [triggerSwipeAnimation, resetPosition, resetEffects, triggerBackAnimation]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || isAnimatingRef.current) return;
      handleMove(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      handleEnd();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isAnimatingRef.current) return;
      if (!(e.target as HTMLElement).closest('button')) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      if (!(e.target as HTMLElement).closest('button')) e.stopPropagation();
      handleEnd();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  useEffect(() => {
    if (index === 0) {
      setBackUsed(false);
      backUsedRef.current = false;
    }
  }, [currentProfileIndex, index]);

  const getNetworkColor = (network: string) => {
    const colors: Record<string, string> = {
      tiktok: 'bg-pink-500', youtube: 'bg-red-500', instagram: 'bg-purple-600',
      facebook: 'bg-blue-600', linkedin: 'bg-blue-700', twitch: 'bg-purple-600',
      x: 'bg-neutral-900', otros: 'bg-stone-500',
    };
    return colors[network] || 'bg-stone-500';
  };

  const actionLabel = (() => {
    const active = buttonAction.type || (isDragging && dragAction.intensity > 0.3 ? dragAction.type : null);
    if (!active) return null;
    const labels: Record<string, { text: string; color: string }> = {
      left: { text: 'Siguiente', color: 'bg-red-500' },
      right: { text: 'Me gusta', color: 'bg-blue-500' },
      up: { text: 'Detalles', color: 'bg-primary-500' },
      down: { text: 'Volver', color: 'bg-emerald-500' },
      back: { text: 'Volver', color: 'bg-emerald-500' },
    };
    return labels[active] || null;
  })();

  const rotation = isDragging ? position.x * 0.08 : 0;

  return (
    <div ref={containerRef} className="relative flex h-full w-full items-center justify-center">
      {/* Action overlay */}
      {actionLabel && (
        <div className={`absolute inset-0 z-40 flex items-center justify-center rounded-3xl ${actionLabel.color} pointer-events-none transition-opacity duration-200`}>
          <span className="text-2xl font-bold text-white drop-shadow-lg">{actionLabel.text}</span>
        </div>
      )}

      <div
        ref={cardRef}
        className="relative h-full w-full cursor-grab select-none overflow-hidden rounded-3xl bg-white shadow-float active:cursor-grabbing"
        style={{
          transform: buttonAction.type ? undefined : `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          transition: isDragging || buttonAction.type ? 'none' : 'transform 0.15s ease',
          zIndex: 1000 - index,
          touchAction: isDragging ? 'none' : 'auto',
          willChange: isDragging ? 'transform' : 'auto',
        }}
        onMouseDown={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          if (e.button === 0 && !isAnimating && !buttonAction.type) handleStart(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          if (e.touches[0] && !isAnimating && !buttonAction.type) handleStart(e.touches[0].clientX, e.touches[0].clientY);
        }}
      >
        {/* Image */}
        <div className="relative h-full w-full bg-surface-200">
          {profile.images && profile.images.length > 0 ? (
            <img
              src={getImageUrl(profile.images[0])}
              alt={profile.profileData.username || 'Perfil'}
              className="h-full w-full object-cover pointer-events-none"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = placeholderImage;
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-muted">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}

          {/* Network badge */}
          <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
            <div className={`${getNetworkColor(profile.socialNetwork)} flex h-9 w-9 items-center justify-center rounded-full shadow-card`}>
              <SocialNetworkLogo network={profile.socialNetwork} className="h-4.5 w-4.5 text-white" />
            </div>
            {isDemoProfile && (
              <span className="rounded-full bg-primary-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">
                Demo
              </span>
            )}
          </div>

          {/* Stats pills */}
          <div className="absolute right-4 top-4 z-10 flex flex-wrap justify-end gap-1.5">
            {profile.profileData.followers != null && (
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-soft backdrop-blur-sm">
                {profile.profileData.followers.toLocaleString()} seguidores
              </span>
            )}
            {profile.profileData.subscribers != null && (
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-soft backdrop-blur-sm">
                {profile.profileData.subscribers.toLocaleString()} subs
              </span>
            )}
          </div>

          {/* Bottom info overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-6 pt-20"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)',
            }}
          >
            <h2 className="mb-1 text-xl font-bold text-white drop-shadow-lg">
              {profile.profileData.username ||
                profile.profileData.channelName ||
                profile.profileData.handle ||
                profile.profileData.streamerName ||
                profile.profileData.pageName ||
                profile.profileData.twitterHandle ||
                'Perfil'}
            </h2>
            <p className="mb-2 text-[13px] font-medium text-white/70">
              {profile.socialNetwork.charAt(0).toUpperCase() + profile.socialNetwork.slice(1)}
            </p>
            {profile.profileData.description && (
              <p className="line-clamp-3 text-[14px] leading-relaxed text-white/90">
                {profile.profileData.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
