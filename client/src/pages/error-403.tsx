import { useEffect } from "react";
import { Shield, Lock, AlertTriangle } from "lucide-react";

export default function Error403() {
  useEffect(() => {
    // Log unauthorized access attempts
    console.warn('[SECURITY] 403 Unauthorized access attempt:', window.location.pathname);
  }, []);

  const handleRedirect = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-screen bg-red-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="relative">
            <Shield className="h-24 w-24 text-red-500 mx-auto mb-6" />
            <Lock className="h-12 w-12 text-red-400 absolute top-6 left-1/2 transform -translate-x-1/2" />
          </div>
          <h1 className="text-6xl font-bold text-red-400 mb-4 font-mono">403</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Acceso Prohibido
          </h2>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-red-500 mb-8">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <p className="text-red-300 mb-4 font-semibold">
            No tienes autorización para acceder a este recurso
          </p>
          <div className="text-sm text-gray-400 font-mono bg-gray-800 p-3 rounded border border-red-500">
            Error: Forbidden Access
            <br />
            Code: HTTP_403_FORBIDDEN
            <br />
            Time: {new Date().toISOString()}
            <br />
            Status: Access Denied
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRedirect}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            data-testid="button-redirect-home"
          >
            <Shield className="h-5 w-5 mr-2" />
            Salir del Sistema
          </button>
        </div>

        <div className="mt-8 text-xs text-red-400">
          <p>⚠️ Intento de acceso no autorizado registrado</p>
        </div>
      </div>
    </div>
  );
}