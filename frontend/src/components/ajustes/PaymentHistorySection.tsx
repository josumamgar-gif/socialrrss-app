'use client';

import { useState, useEffect } from 'react';
import { paymentsAPI } from '@/lib/api';

export default function PaymentHistorySection() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await paymentsAPI.getHistory();
      setPayments(response.payments);
    } catch (error) {
      console.error('Error cargando pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Historial de Pagos</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-4xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Historial de Pagos</h2>
      {payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {payment.planType === 'monthly' && 'Plan Mensual'}
                    {payment.planType === 'yearly' && 'Plan Anual'}
                    {payment.planType === 'lifetime' && 'Plan Permanente'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(payment.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Método: {payment.paymentMethod === 'paypal' ? 'PayPal' : 'Tarjeta'}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-gray-900">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </p>
                  <span
                    className={`inline-block text-sm px-3 py-1 rounded-full mt-2 ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status === 'completed' ? 'Completado' : 'Fallido'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No hay pagos registrados
        </p>
      )}
    </div>
  );
}

