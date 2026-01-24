'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PÁGINA DE PRUEBA
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Si ves esto, el routing funciona correctamente
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-sm text-gray-500">
            Fecha: {new Date().toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            User Agent: {typeof window !== 'undefined' ? navigator.userAgent : 'Server Side'}
          </p>
        </div>
      </div>
    </div>
  );
}