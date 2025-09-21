import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Skull, AlertTriangle, Shield, Eye, Wifi, Lock, Users, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
  const [, setLocation] = useLocation();
  const [glitchText, setGlitchText] = useState("ACCESO DENEGADO");
  const [showWarning, setShowWarning] = useState(false);
  const [scanLines, setScanLines] = useState(0);

  // Glitch effect for title
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    const originalText = "ACCESO DENEGADO";
    
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        let glitched = "";
        for (let i = 0; i < originalText.length; i++) {
          if (Math.random() > 0.7) {
            glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          } else {
            glitched += originalText[i];
          }
        }
        setGlitchText(glitched);
        
        setTimeout(() => {
          setGlitchText(originalText);
        }, 100);
      }
    }, 200);

    return () => clearInterval(glitchInterval);
  }, []);

  // Warning flash effect
  useEffect(() => {
    const warningInterval = setInterval(() => {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 200);
    }, 1500);

    return () => clearInterval(warningInterval);
  }, []);

  // Scanning lines animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanLines(prev => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(scanInterval);
  }, []);

  const handleReturn = () => {
    // Redirect to a different site to hide the system
    window.location.href = "https://www.google.com";
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix-like background */}
      <div className="absolute inset-0 opacity-10">
        <div className="text-green-500 text-xs font-mono whitespace-pre-wrap leading-4">
          {Array.from({length: 50}, (_, i) => 
            Array.from({length: 100}, (_, j) => 
              Math.random() > 0.95 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : " "
            ).join("")
          ).join("\n")}
        </div>
      </div>

      {/* Scanning lines effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent h-4 animate-pulse"
        style={{ 
          top: `${scanLines}%`,
          transition: 'top 0.1s linear'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          {/* Skull with glitch effect */}
          <div className="relative mb-8">
            <Skull 
              className={`h-32 w-32 mx-auto transition-all duration-200 ${
                showWarning ? 'text-red-500 scale-110' : 'text-red-600'
              }`} 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Skull 
                className={`h-32 w-32 text-red-400 opacity-50 ${
                  showWarning ? 'animate-ping' : ''
                }`} 
              />
            </div>
          </div>

          {/* Glitched title */}
          <h1 className={`text-6xl font-bold mb-4 font-mono transition-all duration-100 ${
            showWarning ? 'text-red-400 text-shadow-glow' : 'text-red-500'
          }`}>
            {glitchText}
          </h1>

          {/* Warning message */}
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mr-3 animate-pulse" />
              <span className="text-xl font-bold text-white">ALERTA DE SEGURIDAD</span>
            </div>
            
            <p className="text-red-300 text-lg mb-4">
              Intento de acceso no autorizado detectado
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <Eye className="h-4 w-4 mr-2 text-blue-400" />
                <span>Monitoreo Activo</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Wifi className="h-4 w-4 mr-2 text-green-400" />
                <span>IP Registrada</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Lock className="h-4 w-4 mr-2 text-red-400" />
                <span>Sistema Bloqueado</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Database className="h-4 w-4 mr-2 text-purple-400" />
                <span>Evento Logueado</span>
              </div>
            </div>
          </div>

          {/* Warning details */}
          <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-white font-bold mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Detalles del Incidente
            </h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="text-gray-300">
                <span className="text-blue-400">TIMESTAMP:</span> {new Date().toISOString()}
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400">STATUS:</span> <span className="text-red-400">UNAUTHORIZED ACCESS ATTEMPT</span>
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400">ACTION:</span> <span className="text-yellow-400">SECURITY PROTOCOL ACTIVATED</span>
              </div>
              <div className="text-gray-300">
                <span className="text-blue-400">THREAT LEVEL:</span> <span className="text-red-400">HIGH</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Si tienes autorización, contacta al administrador del sistema
            </p>
            
            <Button
              onClick={handleReturn}
              className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 px-8 py-3"
              data-testid="button-return-security"
            >
              <Shield className="h-5 w-5 mr-2" />
              Salir del Sistema
            </Button>
          </div>

          {/* Footer warning */}
          <div className="mt-8 text-xs text-gray-600">
            <p className="flex items-center justify-center">
              <Users className="h-4 w-4 mr-1" />
              Sistema de Seguridad - Todos los accesos son monitoreados
            </p>
          </div>
        </div>
      </div>

      {/* CSS for text shadow glow effect */}
      <style>{`
        .text-shadow-glow {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
      `}</style>
    </div>
  );
}