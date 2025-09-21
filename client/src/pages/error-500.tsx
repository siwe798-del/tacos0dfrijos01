import { useEffect } from "react";
import { ServerCrash, AlertCircle, RefreshCw } from "lucide-react";

export default function Error500() {
  useEffect(() => {
    // Log server errors
    console.error('[SYSTEM] 500 Server error encountered:', window.location.pathname);
  }, []);

  const handleRedirect = () => {
    window.location.href = "https://www.google.com";
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-orange-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <ServerCrash className="h-24 w-24 text-orange-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-6xl font-bold text-orange-400 mb-4 font-mono">500</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            Error Interno del Servidor
          </h2>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 border-2 border-orange-500 mb-8">
          <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-orange-300 mb-4">
            Se ha producido un error interno en el servidor. El sistema está experimentando dificultades técnicas.
          </p>
          <div className="text-sm text-gray-400 font-mono bg-gray-800 p-3 rounded border border-orange-500">
            Error: Internal Server Error
            <br />
            Code: HTTP_500_INTERNAL_ERROR
            <br />
            Time: {new Date().toISOString()}
            <br />
            Status: Service Temporarily Unavailable
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            data-testid="button-refresh-page"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Intentar de Nuevo
          </button>
          
          <button
            onClick={handleRedirect}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            data-testid="button-redirect-home"
          >
            <ServerCrash className="h-5 w-5 mr-2" />
            Salir del Sistema
          </button>
        </div>

        <div className="mt-8 text-xs text-orange-400">
          <p>🔧 Los administradores han sido notificados del problema</p>
        </div>
      </div>
    </div>
  );
}