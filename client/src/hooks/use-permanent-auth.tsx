import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getPermanentUserId } from "@/lib/user-id";
import type { User, UserWithMembership } from "@shared/schema";

type AuthContextType = {
  user: UserWithMembership | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  permanentUserId: string;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function PermanentAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<UserWithMembership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [permanentUserId] = useState(() => getPermanentUserId());

  // Cargar estado inicial
  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authState);
    
    if (authState) {
      const savedUsername = localStorage.getItem("username");
      const savedAdminId = localStorage.getItem("adminId");
      const isAdmin = savedUsername === "nemesisdev";
      
      // Para admin usar su ID guardado, para usuarios normales usar permanent ID
      const userId = isAdmin && savedAdminId ? savedAdminId : permanentUserId;
      
      // Obtener datos del usuario si está autenticado
      fetch(`/api/auth/me/${userId}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('User not found');
        })
        .then((userData: UserWithMembership) => {
          setUser(userData);
        })
        .catch(() => {
          // Si falla, limpiar estado de autenticación
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("username");
          localStorage.removeItem("adminId");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [permanentUserId]);

  const login = async (username: string, password: string) => {
    try {
      // Usar endpoint especial para admin para evitar conflictos de ID
      const isAdmin = username === "nemesisdev";
      const endpoint = isAdmin ? "/api/auth/admin-login" : "/api/auth/login";
      const body = isAdmin 
        ? { username, password }
        : { username, password, permanentUserId };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error de login");
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", userData.username);
      
      // Guardar admin ID si es admin
      if (isAdmin) {
        localStorage.setItem("adminId", userData.id);
      }

      toast({
        title: "Login exitoso",
        description: `Bienvenido ${userData.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Error de login",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, permanentUserId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error de registro");
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", userData.username);

      toast({
        title: "Registro exitoso",
        description: `Bienvenido ${userData.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Error de registro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("adminId");
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin: user?.role === "admin" || false,
        permanentUserId,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function usePermanentAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("usePermanentAuth must be used within a PermanentAuthProvider");
  }
  return context;
}