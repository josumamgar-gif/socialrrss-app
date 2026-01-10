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
}

export default function WelcomeTutorial({ onClose }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tutorialCompleted = localStorage.getItem('tutorialCompleted');
      if (!tutorialCompleted) {
        setIsVisible(true);
      }
    }
  }, []);

  const steps = [
    {
      title: '¡Bienvenido a Promoción RRSS! 🎉',
      content: [
        'Te damos la bienvenida a tu plataforma para descubrir y promocionar perfiles de redes sociales.',
        'Este tour te guiará por todas las funcionalidades de la aplicación paso a paso.',
        '¡Vamos a explorar juntos cómo funciona!',
      ],
      icon: '👋',
      highlight: null,
    },
    {
      title: '📱 Pestaña Principal - Descubre Perfiles',
      content: [
        'Esta es la sección principal donde explorarás perfiles promocionados.',
        'Aquí verás tarjetas interactivas con información de cada perfil: imágenes, estadísticas y descripción.',
        'Lo primero que verás son los perfiles DEMO - interactúa con ellos para aprender a usar la app.',
        'Una vez completes 3 interacciones con los demos, podrás explorar todos los perfiles reales.',
      ],
      icon: '📱',
      highlight: 'principal',
      features: [
        {
          title: 'Arrastra las Tarjetas',
          description: 'Puedes arrastrar cada tarjeta en cualquier dirección para interactuar con los perfiles.',
          icon: '👆',
        },
        {
          title: 'Gestos Interactivos',
          description: 'Mientras arrastras, verás un overlay de color indicando la acción que realizarás.',
          icon: '🎨',
        },
      ],
    },
    {
      title: '🎯 Gestos y Acciones Disponibles',
      content: [
        'Cada gesto tiene una acción específica. Aquí te explicamos todas las formas de interactuar:',
      ],
      icon: '🎯',
      highlight: null,
      gestures: [
        {
          icon: ArrowLeftIcon,
          color: 'red',
          title: 'Siguiente Perfil',
          text: 'Desliza a la IZQUIERDA o haz clic en el botón rojo',
          description: 'Pasa al siguiente perfil en la lista. Útil para navegar rápidamente.',
          action: 'Muestra el siguiente perfil promocionado',
        },
        {
          icon: ArrowUpIcon,
          color: 'yellow',
          title: 'Ver Detalles',
          text: 'Desliza ARRIBA o haz clic en el botón amarillo',
          description: 'Abre una ventana con toda la información del perfil: imágenes completas, estadísticas detalladas y más.',
          action: 'Abre modal con información completa del perfil',
        },
        {
          icon: ArrowRightIcon,
          color: 'blue',
          title: 'Ir al Enlace',
          text: 'Desliza a la DERECHA o haz clic en el botón azul',
          description: 'Abre el perfil real en su red social en una nueva pestaña.',
          action: 'Visita el perfil en su red social',
        },
        {
          icon: ArrowUturnLeftIcon,
          color: 'green',
          title: 'Retroceder',
          text: 'Haz clic en el botón verde',
          description: 'Vuelve al perfil anterior que habías visto.',
          action: 'Navega hacia atrás en tu historial',
        },
      ],
    },
    {
      title: '🔥 Pestaña Promoción - Promociona tu Perfil',
      content: [
        'En esta sección podrás crear y gestionar tus propios perfiles promocionados.',
        'Primero selecciona la red social que quieres promocionar.',
        'Luego completa el formulario con la información de tu perfil.',
        'Después elige un plan de pago para activar la promoción.',
        '¡Tu perfil aparecerá en la pestaña Principal para que otros usuarios lo descubran!',
      ],
      icon: '🔥',
      highlight: 'promocion',
      features: [
        {
          title: 'Selección de RRSS',
          description: 'Elige entre Instagram, TikTok, YouTube, Facebook, X (Twitter), Twitch y más.',
          icon: '📱',
        },
        {
          title: 'Formularios Personalizados',
          description: 'Cada red social tiene campos específicos: seguidores, videos, suscriptores, etc.',
          icon: '📝',
        },
        {
          title: 'Vista Previa',
          description: 'Antes de pagar, verás exactamente cómo se mostrará tu perfil a otros usuarios.',
          icon: '👁️',
        },
        {
          title: 'Planes de Pago',
          description: 'Elige entre plan Mensual, Anual o Permanente con PayPal, Tarjeta o SEPA.',
          icon: '💳',
        },
      ],
    },
    {
      title: '⚙️ Pestaña Ajustes - Gestiona tu Cuenta',
      content: [
        'Aquí puedes gestionar toda tu información y configuración.',
        'Consulta tus perfiles creados y su estado de promoción.',
        'Revisa tu historial de pagos y planes activos.',
        'Cambia tu información de cuenta si es necesario.',
      ],
      icon: '⚙️',
      highlight: 'ajustes',
    },
    {
      title: '📱 Instalar en Android',
      content: [
        '¡Mejora tu experiencia usando la app como una aplicación nativa en Android!',
        'Puedes instalar esta web app directamente desde tu navegador Chrome.',
        'Una vez instalada, aparecerá como una aplicación normal en tu escritorio.',
      ],
      icon: '🤖',
      highlight: null,
      installInstructions: 'android',
    },
    {
      title: '🍎 Instalar en iOS (iPhone/iPad)',
      content: [
        '¡Mejora tu experiencia usando la app como una aplicación nativa en iOS!',
        'Puedes añadir esta web app a la pantalla de inicio desde Safari.',
        'Una vez añadida, tendrás acceso rápido desde tu escritorio.',
      ],
      icon: '🍎',
      highlight: null,
      installInstructions: 'ios',
    },
    {
      title: '✅ ¡Ya estás listo!',
      content: [
        'Has completado el tour guiado. Ahora conoces todas las funcionalidades.',
        'Recuerda: primero interactúa con los perfiles demo en la pestaña Principal.',
        'Luego puedes crear tu propio perfil en Promoción.',
        '¡Empieza a explorar y promociona tu contenido!',
      ],
      icon: '🚀',
      highlight: null,
    },
  ];

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tutorialCompleted', 'true');
    }
    if (onClose) {
      onClose();
    }
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

  const getInstallInstructions = (platform: 'android' | 'ios') => {
    if (platform === 'android') {
      return {
        platform: 'Android',
        steps: [
          'Abre la app en tu navegador Chrome (es necesario usar Chrome)',
          'Toca el menú de opciones (tres puntos ⋮) en la esquina superior derecha',
          'Busca y selecciona "Añadir a la pantalla de inicio" o "Instalar app"',
          'Si ves "Instalar", tócalo. Si ves "Añadir", también funciona igual',
          'Confirma tocando "Instalar" o "Añadir" en el diálogo que aparece',
          '¡Listo! La app aparecerá en tu escritorio como una aplicación normal',
          'Abre la app desde tu escritorio para una experiencia nativa completa',
        ],
      };
    } else {
      return {
        platform: 'iOS',
        steps: [
          'Abre la app en Safari (es necesario usar Safari, no Chrome)',
          'Toca el botón "Compartir" (cuadrado con flecha hacia arriba) en la parte inferior',
          'Desplázate hacia abajo en el menú de compartir',
          'Busca y toca "Añadir a la pantalla de inicio"',
          'Personaliza el nombre si quieres (opcional)',
          'Toca "Añadir" en la esquina superior derecha',
          '¡Listo! La app aparecerá en tu escritorio con un icono personalizado',
        ],
      };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-none sm:rounded-lg max-w-3xl w-full h-full sm:h-auto sm:max-h-[90vh] shadow-lg border-0 sm:border border-gray-200 animate-fadeIn flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-shrink-0 shadow-xl">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="text-3xl sm:text-4xl flex-shrink-0 drop-shadow-lg">{currentStepData.icon}</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold break-words drop-shadow-md leading-tight">{currentStepData.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/90 hover:text-white transition-colors flex-shrink-0 ml-2 p-2 rounded-full hover:bg-white/20 active:bg-white/30"
            aria-label="Cerrar tutorial"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain scroll-smooth">
          {/* Información principal */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {currentStepData.content.map((text, idx) => (
              <p key={idx} className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed text-justify sm:text-left">
                {text}
              </p>
            ))}
          </div>

          {/* Instrucciones de instalación PWA */}
          {currentStepData.installInstructions && typeof window !== 'undefined' && (currentStepData.installInstructions === 'android' || currentStepData.installInstructions === 'ios') && (
            <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-lg">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{currentStepData.installInstructions === 'android' ? '🤖' : '🍎'}</span>
                Instrucciones paso a paso para {getInstallInstructions(currentStepData.installInstructions as 'android' | 'ios').platform}
              </h3>
              <ol className="space-y-2.5 sm:space-y-3 ml-2 sm:ml-4">
                {getInstallInstructions(currentStepData.installInstructions as 'android' | 'ios').steps.map((step, idx) => (
                  <li key={idx} className="text-sm sm:text-base text-gray-700 leading-relaxed flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md">
                      {idx + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-white/70 rounded-lg border border-primary-200 shadow-sm">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold text-primary-700">💡 Consejo:</span> Una vez instalada, podrás acceder a la app desde tu escritorio como si fuera una aplicación nativa. ¡Mucho más rápido y cómodo! La app se abrirá en pantalla completa sin la barra del navegador.
                </p>
              </div>
            </div>
          )}

          {/* Indicador de sección */}
          {currentStepData.highlight && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <p className="font-semibold text-xs sm:text-sm md:text-base">
                  {currentStepData.highlight === 'principal' && '📍 Encontrarás esto en la pestaña "Principal"'}
                  {currentStepData.highlight === 'promocion' && '📍 Encontrarás esto en la pestaña "Promoción"'}
                  {currentStepData.highlight === 'ajustes' && '📍 Encontrarás esto en la pestaña "Ajustes"'}
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
                        <div className="mt-2 p-2 bg-white/50 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700">✨ {gesture.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Features */}
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
        <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 flex-shrink-0 shadow-lg rounded-b-none sm:rounded-b-lg">
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
