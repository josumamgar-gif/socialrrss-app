'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { supportAPI } from '@/lib/api';

export default function SupportSection() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      setError('Por favor, completa todos los campos requeridos');
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await supportAPI.sendMessage({
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        email: formData.email.trim() || undefined,
      });
      
      setSuccess(true);
      setFormData({ subject: '', message: '', email: '' });
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-none sm:rounded-lg shadow p-4 sm:p-6 max-w-3xl w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Atención al Cliente
        </h2>
        <p className="text-sm text-gray-600">
        ¿Tienes alguna pregunta o problema? Contáctanos y te responderemos lo antes posible.
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✅ Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asunto *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="Ej: Problema con el pago, Pregunta sobre planes..."
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tu Email (opcional)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
            placeholder="Describe tu consulta o problema..."
            disabled={loading}
            required
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Para solicitudes de reembolso de planes permanentes, 
            por favor incluye el ID de tu pago y el motivo de la solicitud. 
            Los reembolsos se evalúan caso por caso.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
          <span>{loading ? 'Enviando...' : 'Enviar Mensaje'}</span>
        </button>
      </form>
    </div>
  );
}

