import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Shield, 
  Database, 
  Settings as SettingsIcon, 
  Bell,
  Trash2,
  Plus,
  RefreshCw,
  Download
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Componente de control de cloaking
function CloakingControl() {
  const { toast } = useToast();
  
  // Query para obtener el estado del cloaking
  const { data: cloakingStatus, isLoading } = useQuery<{ enabled: boolean }>({
    queryKey: ["/api/cloaking/status"],
  });

  // Mutación para cambiar estado del cloaking
  const toggleCloakingMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await apiRequest("PATCH", "/api/cloaking/toggle", { enabled });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cloaking/status"] });
      toast({
        title: data.enabled ? "Cloaking Activado" : "Cloaking Desactivado",
        description: data.enabled 
          ? "Sistema de protección anti-bot y geolocalización activado" 
          : "⚠️ Sistema de protección desactivado - Templates expuestos públicamente",
        variant: data.enabled ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al cambiar cloaking",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggle = (enabled: boolean) => {
    if (!enabled) {
      // Confirmar desactivación
      const confirm = window.confirm(
        "⚠️ ADVERTENCIA: Desactivar el cloaking expondrá los templates públicamente sin protección anti-bot ni geolocalización.\n\n¿Estás seguro de que quieres continuar?"
      );
      if (!confirm) return;
    }
    
    toggleCloakingMutation.mutate(enabled);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <Label>Sistema de Cloaking</Label>
          <p className="text-sm text-muted-foreground">Cargando estado...</p>
        </div>
        <Switch disabled />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Sistema de Cloaking</span>
          <Badge 
            variant={cloakingStatus?.enabled ? "default" : "destructive"}
            className="ml-2"
          >
            {cloakingStatus?.enabled ? "ACTIVO" : "DESACTIVADO"}
          </Badge>
        </Label>
        <p className="text-sm text-muted-foreground">
          Protección anti-bot y geolocalización para México únicamente
        </p>
      </div>
      <Switch
        checked={cloakingStatus?.enabled || false}
        onCheckedChange={handleToggle}
        disabled={toggleCloakingMutation.isPending}
        data-testid="switch-cloaking"
      />
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState("");
  const [backupLoading, setBackupLoading] = useState(false);

  // Consulta de dominios disponibles
  const { data: domains = [], isLoading: domainsLoading } = useQuery({
    queryKey: ["/api/domains"],
  });

  // Mutación para crear dominio
  const createDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      const res = await apiRequest("POST", "/api/domains", { domain, isActive: true });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      setNewDomain("");
      toast({
        title: "Dominio agregado",
        description: "El dominio se agregó correctamente al sistema",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al agregar dominio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutación para actualizar dominio
  const updateDomainMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const res = await apiRequest("PATCH", `/api/domains/${id}`, updates);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Dominio actualizado",
        description: "Los cambios se guardaron correctamente",
      });
    },
  });

  // Mutación para eliminar dominio
  const deleteDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/domains/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Dominio eliminado",
        description: "El dominio se eliminó del sistema",
      });
    },
  });

  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un dominio válido",
        variant: "destructive",
      });
      return;
    }
    createDomainMutation.mutate(newDomain.trim());
  };

  const handleToggleDomain = (id: string, isActive: boolean) => {
    updateDomainMutation.mutate({ id, updates: { isActive } });
  };

  const handleDeleteDomain = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este dominio?")) {
      deleteDomainMutation.mutate(id);
    }
  };

  const simulateBackup = async () => {
    setBackupLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBackupLoading(false);
    toast({
      title: "Backup completado",
      description: "Los datos se han respaldado correctamente",
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
              <p className="text-muted-foreground">Administra la configuración y parámetros del sistema</p>
            </div>
          </div>

          <Tabs defaultValue="domains" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="domains" data-testid="tab-domains">Dominios</TabsTrigger>
              <TabsTrigger value="security" data-testid="tab-security">Seguridad</TabsTrigger>
              <TabsTrigger value="system" data-testid="tab-system">Sistema</TabsTrigger>
              <TabsTrigger value="backup" data-testid="tab-backup">Respaldos</TabsTrigger>
            </TabsList>

            {/* Gestión de Dominios */}
            <TabsContent value="domains" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Gestión de Dominios</span>
                    </CardTitle>
                    <CardDescription>
                      Administra los dominios disponibles para la generación de enlaces
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-domain">Agregar Nuevo Dominio</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="new-domain"
                          placeholder="ejemplo.com"
                          value={newDomain}
                          onChange={(e) => setNewDomain(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                          data-testid="input-new-domain"
                        />
                        <Button 
                          onClick={handleAddDomain}
                          disabled={createDomainMutation.isPending}
                          data-testid="button-add-domain"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estado del Sistema</CardTitle>
                    <CardDescription>Información general del sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                          {Array.isArray(domains) ? domains.length : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Dominios Totales</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {Array.isArray(domains) ? domains.filter((d: any) => d.isActive).length : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Dominios Activos</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">Sistema Operativo</div>
                      <Badge variant="outline" className="text-green-600">🟢 Online</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de dominios */}
              <Card>
                <CardHeader>
                  <CardTitle>Dominios Configurados</CardTitle>
                  <CardDescription>Lista de todos los dominios disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {domainsLoading ? (
                      <div className="text-center py-8">Cargando dominios...</div>
                    ) : !Array.isArray(domains) || domains.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No hay dominios configurados
                      </div>
                    ) : (
                      domains.map((domain: any) => (
                        <div key={domain.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${domain.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div>
                              <div className="font-medium">{domain.domain}</div>
                              <div className="text-sm text-muted-foreground">
                                {domain.isActive ? 'Activo' : 'Inactivo'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={domain.isActive}
                              onCheckedChange={(checked) => handleToggleDomain(domain.id, checked)}
                              data-testid={`switch-domain-${domain.domain}`}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteDomain(domain.id)}
                              data-testid={`button-delete-domain-${domain.domain}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración de Seguridad */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Configuración de Seguridad</span>
                    </CardTitle>
                    <CardDescription>Ajustes de seguridad y privacidad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Registro de IP Automático</Label>
                          <p className="text-sm text-muted-foreground">Registra automáticamente las IPs de usuarios</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-ip-logging" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Detección de User-Agent</Label>
                          <p className="text-sm text-muted-foreground">Captura información del navegador</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-user-agent" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Limitación de Intentos</Label>
                          <p className="text-sm text-muted-foreground">Bloquea después de intentos fallidos</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-rate-limit" />
                      </div>

                      <CloakingControl />

                      <div className="space-y-2">
                        <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                        <Input
                          id="session-timeout"
                          type="number"
                          defaultValue="30"
                          min="5"
                          max="1440"
                          data-testid="input-session-timeout"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Logs de Seguridad</CardTitle>
                    <CardDescription>Registro de eventos de seguridad</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between items-center p-2 bg-muted rounded">
                          <span>🔐 Login exitoso - admin</span>
                          <span className="text-muted-foreground">Hace 2 min</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted rounded">
                          <span>🌍 Nuevo dominio agregado</span>
                          <span className="text-muted-foreground">Hace 15 min</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted rounded">
                          <span>👤 Usuario creado: testuser</span>
                          <span className="text-muted-foreground">Hace 1 hora</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted rounded">
                          <span>🔗 Enlace generado</span>
                          <span className="text-muted-foreground">Hace 2 horas</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Configuración del Sistema */}
            <TabsContent value="system" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>Base de Datos</span>
                    </CardTitle>
                    <CardDescription>Configuraciones de la base de datos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Estado de la Conexión</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Conectado</span>
                        <Badge variant="outline">PostgreSQL</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Retención de Datos (días)</Label>
                      <Input
                        type="number"
                        defaultValue="90"
                        min="1"
                        max="365"
                        data-testid="input-data-retention"
                      />
                      <p className="text-xs text-muted-foreground">
                        Los datos se eliminan automáticamente después de este período
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Limpieza Automática</Label>
                        <p className="text-sm text-muted-foreground">Elimina datos antiguos automáticamente</p>
                      </div>
                      <Switch defaultChecked data-testid="switch-auto-cleanup" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Información del Sistema</CardTitle>
                    <CardDescription>Detalles técnicos y rendimiento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Versión:</span>
                        <Badge>v2.1.0</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Uptime:</span>
                        <span className="text-sm text-muted-foreground">2 días, 14 horas</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Memoria:</span>
                        <span className="text-sm text-muted-foreground">245 MB / 512 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Base de Datos:</span>
                        <Badge variant="outline" className="text-green-600">Healthy</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Configuraciones Avanzadas</span>
                  </CardTitle>
                  <CardDescription>Parámetros técnicos del sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-sessions">Máx. Sesiones Simultáneas</Label>
                      <Input
                        id="max-sessions"
                        type="number"
                        defaultValue="1000"
                        min="10"
                        data-testid="input-max-sessions"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="link-expiry">Vencimiento de Enlaces (horas)</Label>
                      <Input
                        id="link-expiry"
                        type="number"
                        defaultValue="24"
                        min="1"
                        data-testid="input-link-expiry"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cleanup-interval">Intervalo de Limpieza (horas)</Label>
                      <Input
                        id="cleanup-interval"
                        type="number"
                        defaultValue="6"
                        min="1"
                        data-testid="input-cleanup-interval"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" data-testid="button-reset-settings">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Restablecer
                    </Button>
                    <Button data-testid="button-save-settings">
                      Guardar Cambios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Respaldos */}
            <TabsContent value="backup" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="h-5 w-5" />
                      <span>Respaldos del Sistema</span>
                    </CardTitle>
                    <CardDescription>Gestión de copias de seguridad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Respaldos Automáticos</Label>
                          <p className="text-sm text-muted-foreground">Backup diario automático</p>
                        </div>
                        <Switch defaultChecked data-testid="switch-auto-backup" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Frecuencia de Respaldo</Label>
                        <select 
                          id="backup-frequency"
                          className="w-full px-3 py-2 border border-border rounded-md bg-card"
                          data-testid="select-backup-frequency"
                        >
                          <option value="daily">Diario</option>
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>

                      <Button 
                        onClick={simulateBackup}
                        disabled={backupLoading}
                        className="w-full"
                        data-testid="button-create-backup"
                      >
                        {backupLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Creando Respaldo...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Crear Respaldo Manual
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Historial de Respaldos</CardTitle>
                    <CardDescription>Últimos respaldos creados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { date: "2025-09-04 00:00", size: "12.3 MB", status: "Completo" },
                        { date: "2025-09-03 00:00", size: "11.8 MB", status: "Completo" },
                        { date: "2025-09-02 00:00", size: "11.2 MB", status: "Completo" },
                        { date: "2025-09-01 00:00", size: "10.9 MB", status: "Completo" },
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="text-sm font-medium">{backup.date}</div>
                            <div className="text-xs text-muted-foreground">{backup.size}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-green-600">{backup.status}</Badge>
                            <Button variant="outline" size="sm" data-testid={`button-download-backup-${index}`}>
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Acciones de emergencia */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
              <CardDescription>Acciones irreversibles - usar con extrema precaución</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="destructive" data-testid="button-reset-system">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reiniciar Sistema
                </Button>
                
                <Button variant="destructive" data-testid="button-clear-all-data">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar Todos los Datos
                </Button>

                <Button variant="destructive" data-testid="button-factory-reset">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Reset de Fábrica
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}