export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-8">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Logo simple sin componentes externos */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="mt-4 text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Explora
          </h2>
        </div>

        {/* Título y descripción */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Bienvenido
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-12">
          Descubre perfiles increíbles y promociona los tuyos
        </p>

        {/* Botones de acción */}
        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-center"
          >
            Iniciar Sesión
          </a>

          <a
            href="/register"
            className="block w-full bg-white text-blue-600 border-2 border-blue-600 py-4 px-6 rounded-xl hover:bg-blue-50 font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-center"
          >
            Crear Cuenta
          </a>
        </div>

        {/* Enlace de prueba */}
        <div className="mt-8">
          <a
            href="/test"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Ir a página de prueba
          </a>
        </div>
      </div>
    </div>
  );
}

