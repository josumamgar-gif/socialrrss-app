'use client';

import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUturnLeftIcon,
  HomeIcon,
  FireIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface WelcomeTutorialProps {
  onClose?: () => void;
  forceOpen?: boolean; // Permite forzar la apertura del tutorial
  onForceOpenChange?: (open: boolean) => void; // Callback cuando se cierra manualmente
  tutorialCompleted?: boolean; // Estado del tutorial desde el layout
}

interface StepData {
  title: string;
  content: string[];
  icon: 'home' | 'gestures' | 'promote' | 'ready';
  highlight: 'principal' | 'promocion' | 'ajustes' | null;
  gestures?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    title: string;
    text: string;
    description: string;
    action: string;
  }>;
  features?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export default function WelcomeTutorial({ onClose, forceOpen, onForceOpenChange, tutorialCompleted }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Si forceOpen es true, mostrar el tutorial forzadamente
      if (forceOpen === true) {
        console.log('🎯 Tutorial forzado a abrir');
        setIsVisible(true);
        return;
      }

      // Si forceOpen es false explícitamente, ocultar
      if (forceOpen === false) {
        console.log('🚫 Tutorial forzado a cerrar');
        setIsVisible(false);
        return;
      }

      // Si forceOpen es undefined, usar el estado pasado desde el layout
      if (forceOpen === undefined) {
        const shouldShow = tutorialCompleted === false;
        console.log('📚 Estado tutorial - completado:', tutorialCompleted, 'debe mostrarse:', shouldShow);
        setIsVisible(shouldShow);
      }
    }
  }, [forceOpen, tutorialCompleted]);

  const steps: StepData[] = [
    {
      title: 'Bienvenido a Explora',
      content: [
        'Explora perfiles y promociona los tuyos. Arrastra las tarjetas en cualquier dirección para interactuar.',
      ],
      icon: 'home',
      highlight: null,
    },
    {
      title: 'Gestos Rápidos',
      content: [
        'Usa los botones inferiores o arrastra las tarjetas:',
      ],
      icon: 'gestures',
      highlight: null,
      gestures: [
        {
          icon: ArrowLeftIcon,
          color: 'red',
          title: 'Siguiente',
          text: 'Izquierda / Botón rojo',
          description: 'Pasa al siguiente perfil',
          action: '',
        },
        {
          icon: ArrowUpIcon,
          color: 'yellow',
          title: 'Detalles',
          text: 'Arriba / Botón amarillo',
          description: 'Ver información completa',
          action: '',
        },
        {
          icon: ArrowRightIcon,
          color: 'blue',
          title: 'Enlace',
          text: 'Derecha / Botón azul',
          description: 'Visitar perfil en su red social',
          action: '',
        },
        {
          icon: ArrowUturnLeftIcon,
          color: 'green',
          title: 'Retroceder',
          text: 'Botón verde',
          description: 'Volver al perfil anterior',
          action: '',
        },
      ],
    },
    {
      title: 'Promociona tu Perfil',
      content: [
        'Crea y gestiona tus perfiles promocionados. Elige una red social, completa el formulario y selecciona un plan.',
      ],
      icon: 'promote',
      highlight: 'promocion',
    },
    {
      title: 'Todo listo',
      content: [
        'Empieza explorando los perfiles demo y luego crea el tuyo en Promoción.',
      ],
      icon: 'ready',
      highlight: null,
    },
  ];

  const handleClose = () => {
    console.log('🎯 Tutorial terminando...');
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      // Solo marcar como completado si no fue forzado a abrir (es decir, es la primera vez)
      if (!forceOpen) {
        console.log('✅ Marcando tutorial como completado');
        localStorage.setItem('tutorialCompleted', 'true');
      } else {
        console.log('ℹ️ Tutorial forzado - no marcar como completado');
      }
    }
    if (onForceOpenChange) {
      onForceOpenChange(false);
    }
    if (onClose) {
      console.log('📞 Ejecutando callback onClose');
      onClose();
    }
    console.log('🏁 Tutorial cerrado completamente');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Prevenir scroll del body cuando el tutorial está abierto
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-700',
        icon: 'text-red-600',
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        icon: 'text-yellow-600',
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: 'text-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-700',
        icon: 'text-green-600',
      },
    };
    return colors[color] || { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', icon: 'text-gray-600' };
  };


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full h-auto max-h-[95vh] shadow-lg border border-gray-200 animate-fadeIn flex flex-col overflow-hidden my-auto">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white px-4 py-3 sm:px-6 sm:py-5 flex items-center justify-between flex-shrink-0 shadow-xl">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0 drop-shadow-lg">
              {currentStepData.icon === 'home' && <HomeIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
              {currentStepData.icon === 'gestures' && <InformationCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
              {currentStepData.icon === 'promote' && <FireIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
              {currentStepData.icon === 'ready' && <Cog6ToothIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold break-words drop-shadow-md leading-tight">{currentStepData.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/90 hover:text-white transition-colors flex-shrink-0 ml-2 p-1.5 sm:p-2 rounded-full hover:bg-white/20 active:bg-white/30"
            aria-label="Cerrar tutorial"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-4 py-3 sm:px-6 sm:py-6 flex-1 overflow-y-auto overscroll-contain scroll-smooth">
          {/* Información principal */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {currentStepData.content.map((text, idx) => (
              <p key={idx} className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify sm:text-left">
                {text}
              </p>
            ))}
          </div>

          {/* Indicador de sección */}
          {currentStepData.highlight !== null && currentStepData.highlight !== undefined && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <p className="font-semibold text-xs sm:text-sm md:text-base">
                  {currentStepData.highlight === 'principal' && '💡 Encontrarás esto en la pestaña "Principal"'}
                  {currentStepData.highlight === 'promocion' && '💡 Encontrarás esto en la pestaña "Promoción"'}
                  {currentStepData.highlight === 'ajustes' && '💡 Encontrarás esto en la pestaña "Ajustes"'}
                </p>
              </div>
            </div>
          )}

          {/* Gestos */}
          {currentStepData.gestures && (
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Acciones Disponibles:</h3>
              {currentStepData.gestures.map((gesture, idx) => {
                const Icon = gesture.icon;
                const colors = getColorClasses(gesture.color);
                return (
                  <div key={idx} className={`${colors.bg} rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 ${colors.border}`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`${colors.icon} flex-shrink-0`}>
                        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`${colors.text} font-bold text-base sm:text-lg mb-1`}>{gesture.title}</h4>
                        <p className="text-sm sm:text-base text-gray-700 mb-2">{gesture.text}</p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{gesture.description}</p>
                        {gesture.action && (
                          <div className="mt-2 p-2 bg-white/50 rounded-lg">
                            <p className="text-xs font-semibold text-gray-700">💡 {gesture.action}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Features - Solo se muestra si existe */}
          {currentStepData.features && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {currentStepData.features.map((feature, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{feature.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm text-gray-600">Paso {currentStep + 1} de {steps.length}</span>
              <span className="text-xs sm:text-sm font-semibold text-primary-600">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between gap-2 flex-shrink-0 shadow-lg rounded-b-none sm:rounded-b-lg">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          
          <div className="flex gap-1 sm:gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-primary-600 w-4 sm:w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
          >
            {currentStep === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
            {currentStep < steps.length - 1 && <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
