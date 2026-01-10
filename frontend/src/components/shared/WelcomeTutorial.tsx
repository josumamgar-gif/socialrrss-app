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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-5 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{currentStepData.icon}</div>
            <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/90 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información principal */}
          <div className="space-y-4 mb-6">
            {currentStepData.content.map((text, idx) => (
              <p key={idx} className="text-lg text-gray-700 leading-relaxed">
                {text}
              </p>
            ))}
          </div>

          {/* Indicador de sección */}
          {currentStepData.highlight && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <InformationCircleIcon className="h-5 w-5" />
                <p className="font-semibold">
                  {currentStepData.highlight === 'principal' && '📍 Encontrarás esto en la pestaña "Principal"'}
                  {currentStepData.highlight === 'promocion' && '📍 Encontrarás esto en la pestaña "Promoción"'}
                  {currentStepData.highlight === 'ajustes' && '📍 Encontrarás esto en la pestaña "Ajustes"'}
                </p>
              </div>
            </div>
          )}

          {/* Gestos */}
          {currentStepData.gestures && (
            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acciones Disponibles:</h3>
              {currentStepData.gestures.map((gesture, idx) => {
                const Icon = gesture.icon;
                const colors = getColorClasses(gesture.color);
                return (
                  <div key={idx} className={`${colors.bg} rounded-xl p-4 border-2 ${colors.border}`}>
                    <div className="flex items-start gap-4">
                      <div className={`${colors.icon} flex-shrink-0`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`${colors.text} font-bold text-lg mb-1`}>{gesture.title}</h4>
                        <p className="text-gray-700 mb-2">{gesture.text}</p>
                        <p className="text-gray-600 text-sm mb-2">{gesture.description}</p>
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
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {currentStepData.features.map((feature, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Paso {currentStep + 1} de {steps.length}</span>
              <span className="text-sm font-semibold text-primary-600">
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

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-2xl">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Anterior
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-primary-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Comenzar' : 'Siguiente'}
            {currentStep < steps.length - 1 && <ArrowRightIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
