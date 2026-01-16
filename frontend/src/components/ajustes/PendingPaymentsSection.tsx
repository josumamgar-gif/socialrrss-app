'use client';

import { useState, useEffect } from 'react';
import { paymentsAPI } from '@/lib/api';
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function PendingPaymentsSection() {
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resumingId, setResumingId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      const response = await paymentsAPI.getPendingPayments();
      setPendingPayments(response.payments);
    } catch (error) {
      console.error('Error cargando pagos pendientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paymentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pago pendiente?')) {
      return;
    }

    setDeletingId(paymentId);
    try {
      await paymentsAPI.deletePayment(paymentId);
      setPendingPayments(pendingPayments.filter(p => p._id !== paymentId));
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al eliminar pago');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResume = async (paymentId: string) => {
    setResumingId(paymentId);
    try {
      const response = await paymentsAPI.resumePayment(paymentId);
      if (response.resumeUrl) {
        window.location.href = response.resumeUrl;
        return;
      }
      alert(response.message || 'No se pudo reanudar el pago. Vuelve a intentar desde Promoción.');
      window.location.href = '/promocion';
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al reanudar el pago');
    } finally {
      setResumingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (pendingPayments.length === 0) {
    return null; // No mostrar sección si no hay pagos pendientes
  }

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-1">
            ⚠️ Pagos Pendientes
          </h2>
          <p className="text-sm text-yellow-800">
            Tienes {pendingPayments.length} pago(s) pendiente(s). Puedes eliminarlos si no los necesitas.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {pendingPayments.map((payment) => (
          <div
            key={payment._id}
            className="bg-white rounded-lg p-4 border border-yellow-300 flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {payment.planType === 'monthly' && 'Plan Mensual'}
                {payment.planType === 'yearly' && 'Plan Anual'}
                {payment.planType === 'lifetime' && 'Plan Permanente'}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(payment.createdAt).toLocaleDateString()} - {payment.amount.toFixed(2)} {payment.currency}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Método: {payment.paymentMethod}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button
                onClick={() => handleResume(payment._id)}
                disabled={resumingId === payment._id || deletingId === payment._id}
                className="px-3 py-2 text-sm font-medium text-yellow-900 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors disabled:opacity-50"
                title="Reanudar pago pendiente"
              >
                <span className="inline-flex items-center gap-1">
                  <ArrowPathIcon className="h-4 w-4" />
                  Reanudar
                </span>
              </button>
              <button
                onClick={() => handleDelete(payment._id)}
                disabled={deletingId === payment._id || resumingId === payment._id}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Eliminar pago pendiente"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

