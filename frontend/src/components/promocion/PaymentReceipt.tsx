'use client';

import { useState } from 'react';
import { Profile } from '@/types';
import { CheckCircleIcon, EnvelopeIcon, EyeIcon } from '@heroicons/react/24/outline';
import { paymentsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import MyProfilesGallery from '@/components/ajustes/MyProfilesGallery';

interface PaymentReceiptProps {
  payment: {
    _id: string;
    amount: number;
    planType: string;
    paymentMethod: string;
    createdAt: string;
  };
  profile: Profile;
  onClose: () => void;
  onViewProfile: () => void;
}

export default function PaymentReceipt({ payment, profile, onClose, onViewProfile }: PaymentReceiptProps) {
  const user = useAuthStore((state) => state.user);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlanName = (planType: string) => {
    const names: Record<string, string> = {
      monthly: 'Plan Mensual',
      yearly: 'Plan Anual',
      lifetime: 'Plan Permanente',
    };
    return names[planType] || planType;
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    try {
      await paymentsAPI.sendReceipt(payment._id);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch (error: any) {
      console.error('Error enviando email:', error);
      alert(error.response?.data?.error || 'Error al enviar el recibo por email');
    } finally {
      setSendingEmail(false);
    }
  };

  if (showProfileEditor) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Ver/Editar Perfil</h2>
              <button
                onClick={() => setShowProfileEditor(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            <MyProfilesGallery />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-600">Tu pago se ha procesado correctamente</p>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Recibo de Pago</h3>
            <p className="text-sm text-gray-500">ID: {payment._id.slice(-8)}</p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Perfil:</span>
              <span className="font-semibold text-gray-900">
                {profile.profileData?.username || profile.profileData?.channelName || 'Mi Perfil'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold text-gray-900">{getPlanName(payment.planType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Método de pago:</span>
              <span className="font-semibold text-gray-900 capitalize">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-semibold text-gray-900">{formatDate(payment.createdAt)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">{payment.amount.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail || emailSent}
            className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold transition-colors"
          >
            <EnvelopeIcon className="w-5 h-5" />
            {sendingEmail ? 'Enviando...' : emailSent ? '✓ Enviado' : 'Enviar Recibo por Email'}
          </button>
          <button
            onClick={() => setShowProfileEditor(true)}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
          >
            <EyeIcon className="w-5 h-5" />
            Ver/Editar Perfil
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
