export default function AuthTest() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg text-center">
        <div className="text-8xl mb-6">😊</div>
        <h1 className="text-2xl font-bold text-white mb-4">¡Bienvenido!</h1>
        <p className="text-gray-300 mb-6">
          Sistema de gestión de plantillas funcionando correctamente.
        </p>
        <button 
          onClick={() => window.location.href = '/auth'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}