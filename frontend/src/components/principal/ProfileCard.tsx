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
  onCornerEffectsChange?: (effects: { left: number; right: number; top: number; bottom: number }) => void;
  index: number;
  canGoBack?: boolean;
  currentProfileIndex?: number; // Índice global del perfil actual
}

interface DragAction {
  type: 'left' | 'right' | 'up' | 'down' | 'back' | null;
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
  onCornerEffectsChange,
  index,
  canGoBack = false,
  currentProfileIndex,
}: ProfileCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Detectar si es un perfil demo
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
  const [cornerEffects, setCornerEffects] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const linkOpenedRef = useRef(false); // Prevenir apertura duplicada del enlace
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
  const onGoBackRef = useRef(onGoBack);
  const onShowDetailRef = useRef(onShowDetail);
  const canGoBackRef = useRef(canGoBack);
  const backUsedRef = useRef(backUsed);
  
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
    onGoBackRef.current = onGoBack;
    canGoBackRef.current = canGoBack;
    backUsedRef.current = backUsed;
    onShowDetailRef.current = onShowDetail;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onGoBack, onShowDetail, canGoBack, backUsed]);

  const getActionForPosition = (x: number, y: number, width: number, height: number): DragAction => {
    const threshold = 30; // Threshold reducido para mayor sensibilidad
    
    // Calcular distancia desde el centro
    const distanceFromCenter = Math.sqrt(x * x + y * y);
    const intensity = Math.min(1, distanceFromCenter / threshold);
    
    // Si no ha alcanzado el umbral mínimo, no hay acción (reducido para mayor sensibilidad)
    if (intensity < 0.05) {
      return { type: null, intensity: 0 };
    }
    
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    // Determinar dirección principal - priorizar horizontal sobre vertical
    // Reducir el factor de comparación para que sea más fácil activar gestos horizontales
    if (absX > absY * 0.8) {
      // Movimiento horizontal dominante
      if (x < 0) {
        return { type: 'left', intensity };
      } else if (x > 0) {
        // Derecha - siempre abrir enlace si existe
        return { type: 'right', intensity };
      }
    } else if (absY > absX * 0.8) {
      // Movimiento vertical dominante
      if (y < 0) {
        // Hacia arriba
        return { type: 'up', intensity };
      } else {
        // Hacia abajo - retroceder (y > 0)
        return { type: 'down', intensity };
      }
    }
    
    return { type: null, intensity: 0 };
  };

  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragAction({ type: null, intensity: 0 });
    setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
    if (onCornerEffectsChange) {
      onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
    }
  };

  const resetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsAnimating(false);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
    if (onCornerEffectsChange) {
      onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
    }
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.opacity = '';
      cardRef.current.style.transition = '';
    }
  }, [onCornerEffectsChange]);

  const triggerSwipeAnimation = useCallback((direction: 'left' | 'right', callback: () => void) => {
    setIsAnimating(true);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    // Resetear efectos de esquina inmediatamente
    setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
    if (onCornerEffectsChange) {
      onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
    }
    
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
    card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // Ejecutar callback más rápido para mejor fluidez (antes de que termine la animación visual)
    setTimeout(() => {
      callback();
    }, 150);

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
      // Asegurar que los efectos se reseteen
      setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
      if (onCornerEffectsChange) {
        onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
      }
    }, 450);
  }, [onCornerEffectsChange]); // Añadir dependencia

  const handleMove = useCallback((clientX: number, clientY: number) => {
    // Usar refs para obtener valores actuales sin dependencias
    if (!isDraggingRef.current || isAnimatingRef.current) return;
    
    const currentStartPos = startPosRef.current;
    const deltaX = clientX - currentStartPos.x;
    const deltaY = clientY - currentStartPos.y;
    setPosition({ x: deltaX, y: deltaY });
    
    // Obtener dimensiones del contenedor y viewport
    if (cardRef.current && containerRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const action = getActionForPosition(deltaX, deltaY, cardRect.width, cardRect.height);
      setDragAction(action);
      dragActionRef.current = action; // Actualizar ref inmediatamente
      
      // Calcular distancia a las esquinas para efecto de gradiente
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const distanceToLeft = cardRect.left;
      const distanceToRight = viewportWidth - cardRect.right;
      const distanceToTop = cardRect.top;
      const distanceToBottom = viewportHeight - cardRect.bottom;
      
      // Actualizar estado para efectos de esquina (se usará en el render)
      // Solo mostrar efectos si hay movimiento significativo
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        const cornerEffect = {
          left: Math.max(0, 1 - distanceToLeft / 200),
          right: Math.max(0, 1 - distanceToRight / 200),
          top: Math.max(0, 1 - distanceToTop / 200),
          bottom: Math.max(0, 1 - distanceToBottom / 200),
        };
        setCornerEffects(cornerEffect);
        if (onCornerEffectsChange) {
          onCornerEffectsChange(cornerEffect);
        }
      } else {
        setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
        if (onCornerEffectsChange) {
          onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
        }
      }
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
    const threshold = 30; // Mismo threshold que getActionForPosition (reducido)
    const absX = Math.abs(currentPosition.x);
    const absY = Math.abs(currentPosition.y);

    // Usar refs para obtener valores actuales
    const currentProfileLink = profileLinkRef.current;
    const currentProfile = profileRef.current;
    const currentOnSwipeLeft = onSwipeLeftRef.current;
    const currentOnSwipeRight = onSwipeRightRef.current;
    const currentOnSwipeUp = onSwipeUpRef.current;
    const currentOnShowDetail = onShowDetailRef.current;

    console.log('🔄 handleEnd - dragAction:', currentDragAction, 'position:', currentPosition);

    // Prioridad: usar dragAction si existe y tiene suficiente intensidad (reducido para mayor sensibilidad)
    if (currentDragAction.type && currentDragAction.intensity > 0.05) {
      console.log('✅ Usando dragAction:', currentDragAction.type);
      if (currentDragAction.type === 'left' && currentOnSwipeLeft) {
        // Resetear efectos antes de ejecutar acción
        setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
        if (onCornerEffectsChange) {
          onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
        }
        triggerSwipeAnimation('left', currentOnSwipeLeft);
        return;
      } else if (currentDragAction.type === 'right') {
        console.log('➡️ Ejecutando gesto derecha');
        // Resetear efectos antes de ejecutar acción
        setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
        if (onCornerEffectsChange) {
          onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
        }
        // Para el gesto a la derecha: solo ejecutar onSwipeRight
        // El enlace se abrirá en handleSwipeRight() en principal/page.tsx para evitar duplicados
        if (currentOnSwipeRight) {
          console.log('✅ Ejecutando onSwipeRight');
          // Usar triggerSwipeAnimation para la animación visual
          triggerSwipeAnimation('right', currentOnSwipeRight);
        } else {
          console.warn('⚠️ onSwipeRight no está definido');
          // Si no hay callback, al menos resetear la posición
          resetPosition();
        }
        return;
      } else if (currentDragAction.type === 'up') {
        // Resetear efectos antes de ejecutar acción
        setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
        if (onCornerEffectsChange) {
          onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
        }
        if (currentOnShowDetail) {
          currentOnShowDetail(currentProfile);
        } else if (currentOnSwipeUp) {
          currentOnSwipeUp();
        }
        resetPosition();
        return;
      } else if (currentDragAction.type === 'down') {
        // Gesto hacia abajo - retroceder (igual que el botón)
        const currentOnGoBack = onGoBackRef.current;
        const currentCanGoBack = canGoBackRef.current;
        const currentBackUsed = backUsedRef.current;
        if (currentOnGoBack && currentCanGoBack && !currentBackUsed) {
          // Resetear efectos antes de ejecutar acción
          setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
          if (onCornerEffectsChange) {
            onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
          }
          triggerBackAnimation(currentOnGoBack);
        } else {
          resetPosition();
        }
        return;
      }
    }
    
    // Fallback al sistema basado en posición absoluta (para mayor compatibilidad)
    // Reducir el factor de comparación para que sea más fácil activar gestos horizontales
    if (absX > threshold || absY > threshold) {
      if (absX > absY * 0.8) {
        // Movimiento horizontal dominante
        if (currentPosition.x > threshold) {
          console.log('➡️ Fallback: Ejecutando gesto derecha (posición absoluta)');
          // Derecha - Resetear efectos y ejecutar callback
          setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
          if (onCornerEffectsChange) {
            onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
          }
          // Solo ejecutar el callback para avanzar al siguiente perfil
          // El enlace se abrirá en handleSwipeRight() en principal/page.tsx para evitar duplicados
          if (currentOnSwipeRight) {
            console.log('✅ Ejecutando onSwipeRight (fallback)');
            triggerSwipeAnimation('right', currentOnSwipeRight);
          } else {
            console.warn('⚠️ onSwipeRight no está definido (fallback)');
            resetPosition();
          }
          return;
        } else if (currentPosition.x < -threshold && currentOnSwipeLeft) {
          // Izquierda - Resetear efectos
          setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
          if (onCornerEffectsChange) {
            onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
          }
          triggerSwipeAnimation('left', currentOnSwipeLeft);
          return;
        }
      } else if (absY > absX * 0.8) {
        // Movimiento vertical dominante
        if (currentPosition.y < -threshold) {
          // Hacia arriba - Resetear efectos
          setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
          if (onCornerEffectsChange) {
            onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
          }
          if (currentOnShowDetail) {
            currentOnShowDetail(currentProfile);
          } else if (currentOnSwipeUp) {
            currentOnSwipeUp();
          }
          resetPosition();
          return;
        } else if (currentPosition.y > threshold) {
          // Hacia abajo - retroceder (igual que el botón)
          setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
          if (onCornerEffectsChange) {
            onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
          }
          const currentOnGoBack = onGoBackRef.current;
          const currentCanGoBack = canGoBackRef.current;
          const currentBackUsed = backUsedRef.current;
          if (currentOnGoBack && currentCanGoBack && !currentBackUsed) {
            triggerBackAnimation(currentOnGoBack);
          } else {
            resetPosition();
          }
          return;
        }
      }
    }
    
    // Si no se ejecutó ninguna acción, resetear
    console.log('🔄 Reseteando posición - no se cumplió ningún threshold');
    resetPosition();
  }, [triggerSwipeAnimation, resetPosition, onCornerEffectsChange]); // Solo dependencias estables

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
      backUsedRef.current = false;
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
      down: {
        text: 'Retroceder',
        gradient: 'bg-green-500',
        icon: '↓',
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
    const currentBackUsed = backUsedRef.current;
    const currentCanGoBack = canGoBackRef.current;
    if (isAnimating || currentBackUsed || !currentCanGoBack || !callback) return;
    
    setIsAnimating(true);
    setIsDragging(false);
    setBackUsed(true);
    backUsedRef.current = true;
    setDragAction({ type: null, intensity: 0 });
    // Resetear efectos de esquina inmediatamente
    setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
    if (onCornerEffectsChange) {
      onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
    }
    // Mostrar overlay verde inmediatamente
    setButtonAction({ type: 'back', intensity: 1 });
    
    // PRIMERO: Resetear la posición actual para evitar bugs
    setPosition({ x: 0, y: 0 });
    const card = cardRef.current;
    if (card) {
      // Resetear cualquier transformación previa
      card.style.transform = '';
      card.style.opacity = '';
      card.style.transition = '';
    }
    
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
      
      // Animación hacia atrás (desde abajo hacia el centro - verde)
      // Primero la tarjeta aparece desde atrás
      card.style.transform = 'translate(0, 100px) rotate(0deg)';
      card.style.opacity = '0';
      card.style.transition = 'none';
      
      // Forzar reflow
      card.offsetHeight;
      
      // Animar hacia la posición original (centro) con animación más suave
      card.style.transform = 'translate(0, 0) rotate(0deg)';
      card.style.opacity = '1';
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      // Ejecutar callback ANTES para que el cambio de índice ocurra inmediatamente
      callback();
      
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
        setPosition({ x: 0, y: 0 });
        // Asegurar que los efectos se reseteen
        setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
        if (onCornerEffectsChange) {
          onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
        }
      }, 450);
    });
  };

  const triggerButtonAnimation = (actionType: 'left' | 'right' | 'up', callback: () => void) => {
    // Completamente independiente del arrastre
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsDragging(false);
    setDragAction({ type: null, intensity: 0 });
    // Resetear efectos de esquina inmediatamente
    setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
    if (onCornerEffectsChange) {
      onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
    }
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
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      // Ejecutar callback más rápido para mejor fluidez
      setTimeout(() => {
        callback();
      }, 150);
      
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
        // Asegurar que los efectos se reseteen
        setCornerEffects({ left: 0, right: 0, top: 0, bottom: 0 });
        if (onCornerEffectsChange) {
          onCornerEffectsChange({ left: 0, right: 0, top: 0, bottom: 0 });
        }
      }, 450);
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
      <div ref={containerRef} className="relative w-full mx-auto h-full flex items-center justify-center" style={{ maxWidth: '100%' }}>
        {/* Overlay cuando se hace clic en botón - 100% opaco */}
        {buttonAction.type && buttonActionConfig && (
          <div 
            className={`absolute inset-0 rounded-3xl ${buttonActionConfig.gradient} z-40 pointer-events-none flex items-center justify-center transition-opacity duration-200`}
            style={{ opacity: 1, borderRadius: '24px' }}
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
            className={`absolute inset-0 rounded-3xl ${dragActionConfig.gradient} z-40 pointer-events-none flex items-center justify-center transition-opacity duration-200`}
            style={{ opacity: 1, borderRadius: '24px' }}
          >
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">{dragActionConfig.icon}</div>
              <div className="text-2xl font-bold drop-shadow-lg">{dragActionConfig.text}</div>
            </div>
          </div>
        )}

        <div
          ref={cardRef}
          className="relative w-full bg-white overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-3xl"
            style={{
              borderRadius: '24px',
              border: 'none',
              boxShadow: `
                0 4px 6px rgba(0, 0, 0, 0.1),
                0 10px 20px rgba(0, 0, 0, 0.15),
                0 20px 40px rgba(0, 0, 0, 0.2)
              `,
              height: '100%',
              width: '100%',
              minHeight: 'calc(100vh - 12rem)',
              maxHeight: 'calc(100vh - 12rem)',
            transform: buttonAction.type 
              ? undefined // La transformación de botones se maneja con style inline
              : `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
            transition: isDragging || buttonAction.type ? 'none' : 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
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
          {/* Imagen principal - Ocupa todo el espacio disponible estilo Tinder */}
          <div className="relative w-full h-full bg-gray-200 rounded-3xl overflow-hidden" style={{ height: '100%', minHeight: 'calc(100vh - 12rem)' }}>
            {profile.images && profile.images.length > 0 ? (
              <img
                src={getImageUrl(profile.images[0])}
                alt={profile.profileData.username || 'Perfil'}
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src && img.src.includes('via.placeholder.com')) {
                    img.src = placeholderImage;
                    return;
                  }
                  img.src = placeholderImage;
                }}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
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

            {/* Header con logo de red social - Parte superior izquierda */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className={`${getNetworkColor(profile.socialNetwork)} w-12 h-12 rounded-full flex items-center justify-center shadow-lg`}>
                <SocialNetworkLogo network={profile.socialNetwork} className="w-6 h-6 text-white" />
              </div>
              {/* Etiqueta DEMO */}
              {isDemoProfile && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/50">
                  DEMO
                </span>
              )}
            </div>

            {/* Datos de redes sociales - Pastillas blancas superpuestas en la parte superior derecha */}
            <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10 justify-end">
              {profile.profileData.followers && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  👥 {profile.profileData.followers.toLocaleString()}
                </span>
              )}
              {profile.profileData.subscribers && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  👥 {profile.profileData.subscribers.toLocaleString()}
                </span>
              )}
              {profile.profileData.videos && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  🎥 {profile.profileData.videos.toLocaleString()}
                </span>
              )}
              {profile.profileData.videoCount && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  🎥 {profile.profileData.videoCount.toLocaleString()}
                </span>
              )}
              {profile.profileData.posts && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  📸 {profile.profileData.posts.toLocaleString()}
                </span>
              )}
              {profile.profileData.likes && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  ❤️ {profile.profileData.likes.toLocaleString()}
                </span>
              )}
              {profile.profileData.tweets && (
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-black shadow-lg">
                  🐦 {profile.profileData.tweets.toLocaleString()}
                </span>
              )}
            </div>

            {/* Descripción estilo Tinder - Overlay oscuro grande en la parte inferior, más arriba para que no quede debajo de los botones */}
            <div 
              className="absolute bottom-0 left-0 right-0 z-20"
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 25%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.3) 75%, transparent 100%)',
                paddingTop: '4rem',
                paddingBottom: '9rem', // Más espacio abajo para centrar mejor los botones
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
              }}
            >
              {/* Nombre y red social */}
              <div className="mb-3">
                <h2 className="text-white font-bold text-2xl sm:text-3xl mb-1 drop-shadow-lg">
                  {profile.profileData.username || 
                   profile.profileData.channelName || 
                   profile.profileData.handle || 
                   profile.profileData.streamerName ||
                   profile.profileData.pageName ||
                   profile.profileData.twitterHandle ||
                   'Perfil'}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-white/90 text-sm font-medium">
                    {profile.socialNetwork.charAt(0).toUpperCase() + profile.socialNetwork.slice(1)}
                  </span>
                </div>
              </div>

              {/* Descripción - Más grande y visible, sin límite de líneas para que se vea todo */}
              {profile.profileData.description && (
                <p className="text-white text-base sm:text-lg font-normal leading-relaxed drop-shadow-lg">
                  {profile.profileData.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
