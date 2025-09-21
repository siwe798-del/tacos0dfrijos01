import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    // Log suspicious 404 attempts
    console.warn('[SECURITY] 404 access attempt:', window.location.pathname);
  }, []);

  const handleRedirect = () => {
    // Redirect to a safe external site
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 text-yellow-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-6xl font-bold text-white mb-4 font-mono">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Página No Encontrada
          </h2>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600 mb-8">
          <p className="text-gray-400 mb-4">
            El recurso solicitado no existe o no tienes permisos para acceder a él.
          </p>
          <div className="text-sm text-gray-500 font-mono bg-gray-700 p-3 rounded">
            Error: Resource not found
            <br />
            Code: HTTP_404_NOT_FOUND
            <br />
            Time: {new Date().toISOString()}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            data-testid="button-redirect-home"
          >
            <Home className="h-5 w-5 mr-2" />
            Ir a Inicio
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            data-testid="button-go-back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Regresar
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-600">
          <p>Si crees que esto es un error, contacta al administrador del sistema</p>
        </div>
      </div>
    </div>
  );
}
