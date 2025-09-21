import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { Shield, AlertTriangle } from "lucide-react";

export default function SimpleAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const [botDetected, setBotDetected] = useState(false);
  const [startTime] = useState(Date.now());
  const { login, register, isLoading, isAuthenticated } = usePermanentAuth();

  // Anti-bot detection (menos agresiva)
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    // Solo detectar bots obvios
    const obviousBots = [
      'headlesschrome', 'phantomjs', 'slimerjs', 'crawler', 'scraper',
      'curl/', 'wget/', 'python-requests', 'scrapy/'
    ];
    
    const isObviousBot = obviousBots.some(bot => userAgent.includes(bot));
    const hasWebdriver = (navigator as any).webdriver === true;
    const hasPhantom = (window as any)._phantom !== undefined;
    const hasSelenium = (window as any).document && (window as any).document.$cdc_asdjflasutopfhvcZLmcfl_ !== undefined;
    
    // Solo bloquear si es definitivamente un bot
    if (isObviousBot || hasWebdriver || hasPhantom || hasSelenium) {
      setBotDetected(true);
      console.warn('[SECURITY] Obvious bot detected - access blocked');
      setTimeout(() => {
        setLocation('/');
      }, 1000);
    }
  }, [setLocation]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Solo verificar bots si ya fueron detectados
    if (botDetected) {
      setLocation('/');
      return;
    }

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password, email);
      }
      // El redireccionamiento se maneja automáticamente por el useEffect
      setLocation("/dashboard");
    } catch (error) {
      // Los errores se manejan en el hook de autenticación
      console.error("Auth error:", error);
    }
  };

  if (botDetected) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg border-2 border-red-500">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Acceso Bloqueado
            </h1>
            <p className="text-gray-300 mb-6">
              Se ha detectado comportamiento automatizado. Redirigiendo...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg border border-blue-500">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-gray-400">Sistema de Gestión de Plantillas</p>
          <p className="text-xs text-green-400 mt-2">✓ Sistema protegido anti-bots</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tu usuario"
              required
              data-testid="input-username"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email (opcional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu email"
                data-testid="input-email"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña"
              required
              data-testid="input-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            data-testid="button-submit"
          >
            {isLoading 
              ? (isLogin ? "Iniciando sesión..." : "Creando cuenta...") 
              : (isLogin ? "Iniciar Sesión" : "Crear Cuenta")
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
            }}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            data-testid="button-toggle-mode"
          >
            {isLogin 
              ? "¿No tienes cuenta? Regístrate aquí" 
              : "¿Ya tienes cuenta? Inicia sesión aquí"
            }
          </button>
        </div>
      </div>
    </div>
  );
}