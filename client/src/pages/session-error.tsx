import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Search, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionErrorPage() {
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setReason(urlParams.get("reason") || "unknown");
  }, []);

  const getErrorInfo = () => {
    switch (reason) {
      case "missing":
        return {
          title: "Enlace Inválido",
          description: "El enlace al que intentas acceder no contiene la información necesaria.",
          icon: Search,
          color: "text-yellow-500"
        };
      case "not_found":
        return {
          title: "Sesión No Encontrada",
          description: "La sesión a la que intentas acceder no existe o ha sido eliminada.",
          icon: Search,
          color: "text-red-500"
        };
      case "expired":
        return {
          title: "Sesión Expirada",
          description: "Esta sesión ha expirado por seguridad. Las sesiones son válidas por 5 minutos.",
          icon: Clock,
          color: "text-orange-500"
        };
      case "server_error":
        return {
          title: "Error del Servidor",
          description: "Ha ocurrido un error interno del servidor. Intenta nuevamente más tarde.",
          icon: Server,
          color: "text-red-600"
        };
      default:
        return {
          title: "Error Desconocido",
          description: "Ha ocurrido un error inesperado.",
          icon: AlertTriangle,
          color: "text-gray-500"
        };
    }
  };

  const errorInfo = getErrorInfo();
  const IconComponent = errorInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <IconComponent className={`w-8 h-8 ${errorInfo.color}`} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {errorInfo.description}
          </p>

          {/* Action Button */}
          <Button
            onClick={() => window.close()}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
            data-testid="button-close-window"
          >
            Cerrar Ventana
          </Button>

          {/* Additional info for expired sessions */}
          {reason === "expired" && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Nota:</strong> Por razones de seguridad, las sesiones expiran automáticamente después de 5 minutos de inactividad.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Si crees que esto es un error, contacta al soporte técnico
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-orange-50 to-red-100 opacity-50"></div>
      </div>
    </div>
  );
}