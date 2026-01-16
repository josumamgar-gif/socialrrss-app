'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Profile } from '@/types';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import SocialNetworkLogo from '@/components/shared/SocialNetworkLogo';
import { getImageUrl, placeholderImage } from '@/lib/imageUtils';

interface ProfileCardProps {
  profile: Profile;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onGoBack?: () => void;
  onShowDetail?: (profile: Profile) => void;
  index: number;
  canGoBack?: boolean;
  currentProfileIndex?: number; // Índice global del perfil actual
}

interface DragAction {
  type: 'left' | 'right' | 'up' | 'back' | null;
  intensity: number; // 0-1
}

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="relative flex items-center">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-50">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
        </div>
      )}
    </div>
  );
}

export default function ProfileCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onGoBack,
  onShowDetail,
  index,
  canGoBack = false,
  currentProfileIndex,
}: ProfileCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragAction, setDragAction] = useState<DragAction>({ type: null, intensity: 0 });
  const [buttonAction, setButtonAction] = useState<DragAction>({ type: null, intensity: 0 });
  const [backUsed, setBackUsed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs para valores que cambian frecuentemente
  const positionRef = useRef(position);
  const startPosRef = useRef(startPos);
  const dragActionRef = useRef(dragAction);
  const isDraggingRef = useRef(isDragging);
  const isAnimatingRef = useRef(isAnimating);
  
  // Refs para callbacks y props que pueden cambiar
  const profileLinkRef = useRef(profile.link);
  const profileRef = useRef(profile);
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  const onSwipeUpRef = useRef(onSwipeUp);
  const onShowDetailRef = useRef(onShowDetail);
  
  // Actualizar refs en useEffect para evitar problemas con React
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  useEffect(() => {
    startPosRef.current = startPos;
  }, [startPos]);
  useEffect(() => {
    dragActionRef.current = dragAction;
  }, [dragAction]);
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
  useEffect(() => {
    profileLinkRef.current = profile.link;
    profileRef.current = profile;
  }, [profile.link, profile._id]);
  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
    onSwipeRightRef.current = onSwipeRight;
    onSwipeUpRef.current = onSwipeUp;
    onShowDetailRef.current = onShowDetail;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onShowDetail]);

  const getActionForPosition = (x: number, y: number, width: number, height: number): DragAction => {
    const threshold = 40; // Reducir threshold para mayor sensibilidad
    
    // Calcular distancia desde el centro
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const intensity = Math.min(1, distanceFromCenter / threshold);
    
    // Si no ha alcanzado el umbral, no hay acción
    if (intensity < 0.15) {
      return { type: null, intensity: 0 };
    }
    
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    // Determinar dirección principal - priorizar horizontal sobre vertical
    if (absX > absY * 1.1) {
      // Movimiento horizontal dominante
      if (x < 0) {
        return { type: 'left', intensity };
      } else if (x > 0) {
        // Derecha - siempre abrir enlace si existe
        return { type: 'right', intensity };
      }
    } else if (absY > absX * 1.1 && y < 0) {
      // Movimiento vertical hacia arriba dominante
      return { type: 'up', intensity };
    }
    
    return { type: null, intensity: 0 };
  };

  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragAction({ type: null, intensity: 0 });
  };

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsAnimating(false);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.opacity = '';
      cardRef.current.style.transition = '';
    }
  }, []);

  const triggerSwipeAnimation = useCallback((direction: 'left' | 'right', callback: () => void) => {
    setIsAnimating(true);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    
    const card = cardRef.current;
    if (!card) {
      setIsAnimating(false);
      return;
    }

    // Usar ref para obtener la posición actual
    const currentPosition = positionRef.current;
    const translateX = direction === 'left' ? '-100vw' : '100vw';
    
    // Optimizar para animaciones fluidas
    card.style.willChange = 'transform, opacity';
    card.style.transform = `translate(${translateX}, ${currentPosition.y}px) rotate(${direction === 'left' ? '-30deg' : '30deg'})`;
    card.style.opacity = '0';
    card.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)';

    // Ejecutar callback más rápido para mejor fluidez (antes de que termine la animación visual)
    setTimeout(() => {
      callback();
    }, 100);

    // Resetear estilos después de la animación
    setTimeout(() => {
      if (card) {
        card.style.transform = '';
        card.style.opacity = '';
        card.style.transition = '';
        card.style.willChange = '';
      }
      setPosition({ x: 0, y: 0 });
      setIsAnimating(false);
    }, 250);
  }, []); // Sin dependencias - usa ref para posición

  const handleMove = useCallback((clientX: number, clientY: number) => {
    // Usar refs para obtener valores actuales sin dependencias
    if (!isDraggingRef.current || isAnimatingRef.current) return;
    
    const currentStartPos = startPosRef.current;
    const deltaX = clientX - currentStartPos.x;
    const deltaY = clientY - currentStartPos.y;
    setPosition({ x: deltaX, y: deltaY });
    
    // Obtener dimensiones del contenedor
    if (cardRef.current && containerRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const action = getActionForPosition(deltaX, deltaY, cardRect.width, cardRect.height);
      setDragAction(action);
    }
  }, []); // Sin dependencias - usa refs

  const handleEnd = useCallback(() => {
    // Usar refs para obtener valores actuales sin dependencias
    if (!isDraggingRef.current || isAnimatingRef.current) {
      setIsDragging(false);
      return;
    }
    
    const currentPosition = positionRef.current;
    const currentDragAction = dragActionRef.current;
    const threshold = 40; // Mismo threshold que getActionForPosition
    const absX = Math.abs(currentPosition.x);
    const absY = Math.abs(currentPosition.y);

    // Usar refs para obtener valores actuales
    const currentProfileLink = profileLinkRef.current;
    const currentProfile = profileRef.current;
    const currentOnSwipeLeft = onSwipeLeftRef.current;
    const currentOnSwipeRight = onSwipeRightRef.current;
    const currentOnSwipeUp = onSwipeUpRef.current;
    const currentOnShowDetail = onShowDetailRef.current;

    // Prioridad: usar dragAction si existe y tiene suficiente intensidad
    if (currentDragAction.type && currentDragAction.intensity > 0.15) {
      if (currentDragAction.type === 'left' && currentOnSwipeLeft) {
        triggerSwipeAnimation('left', currentOnSwipeLeft);
        return;
      } else if (currentDragAction.type === 'right') {
        // Para el gesto a la derecha, SIEMPRE abrir el enlace si existe
        if (currentProfileLink) {
          // Abrir enlace en nueva pestaña
          const linkWindow = window.open(currentProfileLink, '_blank');
          if (!linkWindow) {
            // Si no se pudo abrir (bloqueador de popups), intentar redirigir directamente
            window.location.href = currentProfileLink;
          }
        }
        // Luego ejecutar el callback si existe
        if (currentOnSwipeRight) {
          triggerSwipeAnimation('right', currentOnSwipeRight);
        } else {
          resetPosition();
        }
        return;
      } else if (currentDragAction.type === 'up') {
        if (currentOnShowDetail) {
          currentOnShowDetail(currentProfile);
        } else if (currentOnSwipeUp) {
          currentOnSwipeUp();
        }
        resetPosition();
        return;
      }
    }
    
    // Fallback al sistema basado en posición absoluta (para mayor compatibilidad)
    if (absX > threshold || absY > threshold) {
      if (absX > absY * 1.1) {
        // Movimiento horizontal dominante
        if (currentPosition.x > threshold) {
          // Derecha - ABRIR ENLACE SIEMPRE PRIMERO
          if (currentProfileLink) {
            const linkWindow = window.open(currentProfileLink, '_blank');
            if (!linkWindow) {
              window.location.href = currentProfileLink;
            }
          }
          if (currentOnSwipeRight) {
            triggerSwipeAnimation('right', currentOnSwipeRight);
          } else {
            resetPosition();
          }
          return;
        } else if (currentPosition.x < -threshold && currentOnSwipeLeft) {
          // Izquierda
          triggerSwipeAnimation('left', currentOnSwipeLeft);
          return;
        }
      } else if (absY > absX * 1.1 && currentPosition.y < -threshold) {
        // Movimiento hacia arriba dominante
        if (currentOnShowDetail) {
          currentOnShowDetail(currentProfile);
        } else if (currentOnSwipeUp) {
          currentOnSwipeUp();
        }
        resetPosition();
        return;
      }
    }
    
    // Si no se ejecutó ninguna acción, resetear
    resetPosition();
  }, [triggerSwipeAnimation, resetPosition]); // Solo dependencias estables

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || isAnimatingRef.current) return;
      handleMove(e.clientX, e.clientY);
    };
    
    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      handleEnd();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || isAnimatingRef.current) return;
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const target = e.target as HTMLElement;
      if (!target.closest('button')) {
        e.stopPropagation();
      }
      handleEnd();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]); // Solo isDragging como dependencia

  // Resetear backUsed cada vez que cambia el perfil actual visible
  // Se resetea cuando cambias de perfil (avanzar o retroceder)
  // Usamos currentProfileIndex para saber cuándo cambias a un nuevo perfil
  useEffect(() => {
    // Solo resetear para la tarjeta activa (index === 0) y cuando cambia el perfil actual
    if (index === 0) {
      setBackUsed(false);
    }
  }, [currentProfileIndex]);

  const getNetworkColor = (network: string) => {
    const colors: Record<string, string> = {
      tiktok: 'bg-pink-500',
      youtube: 'bg-red-500',
      instagram: 'bg-purple-600',
      facebook: 'bg-blue-600',
      linkedin: 'bg-blue-700',
      twitch: 'bg-purple-600',
      x: 'bg-black',
      otros: 'bg-gray-500',
    };
    return colors[network] || 'bg-gray-500';
  };

  const getActionConfig = (action: DragAction | null) => {
    const activeAction = action || dragAction;
    if (!activeAction || !activeAction.type) return null;
    
    const configs = {
      left: {
        text: 'Siguiente Perfil',
        gradient: 'bg-red-500',
        icon: '←',
      },
      right: {
        text: 'Ir al Enlace',
        gradient: 'bg-blue-500',
        icon: '→',
      },
      up: {
        text: 'Ver Detalles',
        gradient: 'bg-yellow-500',
        icon: '↑',
      },
      back: {
        text: 'Retroceder',
        gradient: 'bg-green-500',
        icon: '↩',
      },
    };
    
    return configs[activeAction.type];
  };

  const triggerBackAnimation = (callback: () => void) => {
    // Solo funciona si no se ha usado y está disponible
    if (isAnimating || backUsed || !canGoBack || !callback) return;
    
    setIsAnimating(true);
    setBackUsed(true);
    // Mostrar overlay verde inmediatamente
    setButtonAction({ type: 'back', intensity: 1 });
    
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) {
        setIsAnimating(false);
        setButtonAction({ type: null, intensity: 0 });
        return;
      }

      // Optimizar para animaciones fluidas
      card.style.willChange = 'transform, opacity';
      
      // Animación hacia atrás (desde abajo/derecha hacia el centro)
      // Primero la tarjeta aparece desde atrás
      card.style.transform = 'translate(100px, 100px) rotate(15deg)';
      card.style.opacity = '0';
      card.style.transition = 'none';
      
      // Forzar reflow
      card.offsetHeight;
      
      // Animar hacia la posición original (centro) con animación más rápida
      card.style.transform = 'translate(0, 0) rotate(0deg)';
      card.style.opacity = '1';
      card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Ejecutar callback más rápido para mejor fluidez
      setTimeout(() => {
        callback();
      }, 120);
      
      // Resetear después de la animación
      setTimeout(() => {
        if (card) {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.transition = '';
          card.style.willChange = '';
        }
        setButtonAction({ type: null, intensity: 0 });
        setIsAnimating(false);
      }, 300);
    });
  };

  const triggerButtonAnimation = (actionType: 'left' | 'right' | 'up', callback: () => void) => {
    // Completamente independiente del arrastre
    if (isAnimating) return;
    
    setIsAnimating(true);
    // Mostrar overlay inmediatamente al hacer clic
    setButtonAction({ type: actionType, intensity: 1 });
    
    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) {
        setIsAnimating(false);
        setButtonAction({ type: null, intensity: 0 });
        return;
      }

      const translateX = actionType === 'left' ? '-100vw' : actionType === 'right' ? '100vw' : '0';
      const translateY = actionType === 'up' ? '-100vh' : '0';
      const rotation = actionType === 'left' ? '-30deg' : actionType === 'right' ? '30deg' : '0';
      
      // Optimizar para animaciones fluidas
      card.style.willChange = 'transform, opacity';
      card.style.transform = `translate(${translateX}, ${translateY}) rotate(${rotation})`;
      card.style.opacity = '0';
      card.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Ejecutar callback más rápido para mejor fluidez
      setTimeout(() => {
        callback();
      }, 120);
      
      // Resetear después de la animación
      setTimeout(() => {
        if (card) {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.transition = '';
          card.style.willChange = '';
        }
        setButtonAction({ type: null, intensity: 0 });
        setIsAnimating(false);
      }, 300);
    });
  };

  // Lógica independiente: overlay de botón o overlay de arrastre
  const buttonActionConfig = buttonAction.type ? getActionConfig(buttonAction) : null;
  const dragActionConfig = isDragging && dragAction.type && dragAction.intensity > 0.3 ? getActionConfig(dragAction) : null;
  const actionConfig = buttonActionConfig || dragActionConfig;
  
  // Rotación solo para arrastre (no para botones)
  const rotation = isDragging && dragAction.type ? 
    (dragAction.type === 'left' ? -Math.min(dragAction.intensity * 15, 15) :
     dragAction.type === 'right' ? Math.min(dragAction.intensity * 15, 15) : 0) :
    position.x * 0.1;

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-md mx-auto">
        {/* Overlay cuando se hace clic en botón - 100% opaco */}
        {buttonAction.type && buttonActionConfig && (
          <div 
            className={`absolute inset-0 rounded-lg ${buttonActionConfig.gradient} z-40 pointer-events-none flex items-center justify-center transition-opacity duration-200`}
            style={{ opacity: 1 }}
          >
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">{buttonActionConfig.icon}</div>
              <div className="text-2xl font-bold drop-shadow-lg">{buttonActionConfig.text}</div>
            </div>
          </div>
        )}

        {/* Overlay cuando se arrastra - 100% opaco */}
        {isDragging && dragActionConfig && dragAction.intensity > 0.3 && (
          <div 
            className={`absolute inset-0 rounded-lg ${dragActionConfig.gradient} z-40 pointer-events-none flex items-center justify-center transition-opacity duration-200`}
            style={{ opacity: 1 }}
          >
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">{dragActionConfig.icon}</div>
              <div className="text-2xl font-bold drop-shadow-lg">{dragActionConfig.text}</div>
            </div>
          </div>
        )}

        <div
          ref={cardRef}
          className="relative w-full bg-white overflow-hidden cursor-grab active:cursor-grabbing select-none"
            style={{
              borderRadius: '24px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: `
                0 0 0 1px rgba(0, 0, 0, 0.05),
                0 2px 4px rgba(0, 0, 0, 0.1),
                0 8px 16px rgba(0, 0, 0, 0.15),
                0 16px 32px rgba(0, 0, 0, 0.2),
                0 32px 64px rgba(0, 0, 0, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                inset 0 -1px 0 rgba(0, 0, 0, 0.05)
              `,
            transform: buttonAction.type 
              ? undefined // La transformación de botones se maneja con style inline
              : `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
            transition: isDragging || buttonAction.type ? 'none' : 'transform 0.08s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1000 - index,
            touchAction: isDragging ? 'none' : 'auto', // Solo bloquear gestos cuando se está arrastrando
            willChange: isDragging ? 'transform' : 'auto',
          }}
          onMouseDown={(e) => {
            // Solo iniciar arrastre si no es un botón y no hay animación activa
            const target = e.target as HTMLElement;
            if (target.closest('button')) return; // No iniciar arrastre si se hace clic en un botón
            if (e.button === 0 && !isAnimating && !buttonAction.type) {
              handleStart(e.clientX, e.clientY);
            }
          }}
          onTouchStart={(e) => {
            // Solo iniciar arrastre si no es un botón y no hay animación activa
            const target = e.target as HTMLElement;
            if (target.closest('button')) return; // No iniciar arrastre si se toca un botón
            if (e.touches[0] && !isAnimating && !buttonAction.type) {
              // NO prevenir aquí, dejar que los botones funcionen
              handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
        >
          {/* Header con color según red social */}
          <div className={`${getNetworkColor(profile.socialNetwork)} h-16 flex items-center justify-center gap-2`}>
            <div className="text-white">
              <SocialNetworkLogo network={profile.socialNetwork} className="w-6 h-6" />
            </div>
            <h2 className="text-white font-bold text-lg">
              {profile.profileData.username || 
               profile.profileData.channelName || 
               profile.profileData.handle || 
               profile.profileData.streamerName ||
               profile.profileData.pageName ||
               profile.profileData.twitterHandle ||
               'Perfil'}
            </h2>
          </div>

          {/* Imagen */}
          <div className="relative h-64 bg-gray-200">
            {profile.images && profile.images.length > 0 ? (
              <img
                src={getImageUrl(profile.images[0])}
                alt={profile.profileData.username || 'Perfil'}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  // Prevenir que intente cargar via.placeholder.com
                  if (img.src && img.src.includes('via.placeholder.com')) {
                    img.src = placeholderImage;
                    return;
                  }
                  // Si falla cualquier otra imagen, usar placeholder
                  img.src = placeholderImage;
                }}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  // Si por alguna razón se carga via.placeholder.com, reemplazarlo
                  if (img.src && img.src.includes('via.placeholder.com')) {
                    img.src = placeholderImage;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-6xl">📷</span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="p-6 pb-24">
            <p className="text-gray-600 mb-4 line-clamp-3">
              {profile.profileData.description || 'Sin descripción'}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.profileData.followers && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  👥 {profile.profileData.followers.toLocaleString()}
                </span>
              )}
              {profile.profileData.subscribers && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  👥 {profile.profileData.subscribers.toLocaleString()}
                </span>
              )}
              {profile.profileData.videos && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  🎥 {profile.profileData.videos.toLocaleString()}
                </span>
              )}
              {profile.profileData.videoCount && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  🎥 {profile.profileData.videoCount.toLocaleString()}
                </span>
              )}
              {profile.profileData.posts && (
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  📸 {profile.profileData.posts.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 px-4 md:space-x-4 bg-white/95 backdrop-blur-sm py-3 rounded-t-xl border-t border-gray-200 pointer-events-auto" style={{ touchAction: 'auto', zIndex: 9999 }}>
            <Tooltip text="Siguiente Perfil">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!isAnimating && onSwipeLeft) {
                    triggerButtonAnimation('left', onSwipeLeft);
                  }
                }}
                onMouseUp={(e) => e.currentTarget.blur()}
                disabled={isAnimating}
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-105 active:scale-95"
                style={{ touchAction: 'auto', pointerEvents: 'auto' }}
                aria-label="Siguiente Perfil"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
            </Tooltip>

            <Tooltip text="Ver Detalles">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!isAnimating) {
                    triggerButtonAnimation('up', () => {
                      const currentOnShowDetail = onShowDetailRef.current;
                      const currentProfile = profileRef.current;
                      if (currentOnShowDetail) {
                        currentOnShowDetail(currentProfile);
                      }
                    });
                  }
                }}
                onMouseUp={(e) => e.currentTarget.blur()}
                disabled={isAnimating}
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-105 active:scale-95"
                style={{ touchAction: 'auto', pointerEvents: 'auto' }}
                aria-label="Ver Detalles"
              >
                <ArrowUpIcon className="h-6 w-6" />
              </button>
            </Tooltip>

            <Tooltip text={backUsed ? "Ya retrocediste" : "Retroceder"}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!isAnimating && !backUsed && canGoBack && onGoBack) {
                    triggerBackAnimation(onGoBack);
                  }
                }}
                onMouseUp={(e) => e.currentTarget.blur()}
                disabled={isAnimating || backUsed || !canGoBack}
                className={`${
                  backUsed || !canGoBack
                    ? 'bg-gradient-to-br from-gray-400 to-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                } text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-105 active:scale-95`}
                style={{ touchAction: 'auto', pointerEvents: 'auto' }}
                aria-label="Retroceder"
              >
                <ArrowUturnLeftIcon className="h-6 w-6" />
              </button>
            </Tooltip>

            <Tooltip text="Ir al Enlace">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!isAnimating && onSwipeRight) {
                    // SIEMPRE abrir enlace primero
                    if (profile.link) {
                      const linkWindow = window.open(profile.link, '_blank');
                      if (!linkWindow) {
                        window.location.href = profile.link;
                      }
                    }
                    triggerButtonAnimation('right', onSwipeRight);
                  }
                }}
                onMouseUp={(e) => e.currentTarget.blur()}
                disabled={isAnimating}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-12 h-12 flex items-center justify-center transform hover:scale-105 active:scale-95"
                style={{ touchAction: 'auto', pointerEvents: 'auto' }}
                aria-label="Ir al Enlace"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}
