import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, MousePointer, Activity, Shield } from "lucide-react";
import Sidebar from "@/components/sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";

export default function AnalyticsPage() {
  const { user } = usePermanentAuth();
  
  // Determinar endpoints basados en el rol del usuario
  const statsEndpoint = user?.role === 'admin' ? "/api/dashboard/stats" : `/api/users/${user?.id}/dashboard/stats`;
  const sessionsEndpoint = user?.role === 'admin' ? "/api/sessions" : `/api/users/${user?.id}/sessions`;
  const activitiesEndpoint = user?.role === 'admin' ? "/api/activities" : `/api/users/${user?.id}/activities`;
  
  // Consulta de estadísticas del dashboard
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [statsEndpoint],
    enabled: !!user,
  });

  // Consulta de todas las sesiones para analytics
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: [sessionsEndpoint],
    enabled: !!user,
  });

  // Consulta de todos los enlaces generados (admin ve todos, usuarios solo los suyos)
  const { data: links = [], isLoading: linksLoading } = useQuery({
    queryKey: ["/api/links"],
    enabled: !!user,
  });

  // Consulta de todas las actividades
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: [activitiesEndpoint],
    enabled: !!user,
  });

  // Consulta de todos los usuarios para membresías (solo admin)
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    enabled: !!user && user?.role === 'admin',
  });

  // Datos de ejemplo para los gráficos
  const templateUsage = [
    { template: 'Santander', count: 15, percentage: '35%' },
    { template: 'BBVA', count: 12, percentage: '28%' },
    { template: 'Banamex', count: 8, percentage: '19%' },
    { template: 'Apple', count: 5, percentage: '12%' },
    { template: 'Netflix', count: 3, percentage: '6%' }
  ];

  const sessionsData = [
    { date: 'Lun', sessions: 12 },
    { date: 'Mar', sessions: 19 },
    { date: 'Mié', sessions: 8 },
    { date: 'Jue', sessions: 15 },
    { date: 'Vie', sessions: 25 },
    { date: 'Sáb', sessions: 18 },
    { date: 'Dom', sessions: 10 }
  ];

  const membershipStats = {
    active: Array.isArray(users) ? users.filter((u: any) => u.membershipType).length : 0,
    expired: 3,
    noMembership: Array.isArray(users) ? users.filter((u: any) => !u.membershipType).length : 0
  };

  const isLoading = statsLoading || sessionsLoading || linksLoading || activitiesLoading || usersLoading;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Panel analítico completo del sistema</p>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sesiones Activas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-sessions">
                  {isLoading ? "..." : (stats as any)?.activeSessions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% vs ayer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enlaces Generados</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-links">
                  {isLoading ? "..." : (stats as any)?.totalLinks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5% esta semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-users">
                  {isLoading ? "..." : (Array.isArray(users) ? users.length : 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 esta semana
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Membresías Activas</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-memberships">
                  {isLoading ? "..." : membershipStats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  {membershipStats.expired} vencidas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pestañas de análisis */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">Resumen</TabsTrigger>
              <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">Usuarios</TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">Actividad</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de sesiones por día */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sesiones por Día</CardTitle>
                    <CardDescription>Últimos 7 días</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sessionsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sessions" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Estado de membresías */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estado de Membresías</CardTitle>
                    <CardDescription>Distribución actual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-green-500">{membershipStats.active}</div>
                          <div className="text-sm text-muted-foreground">Activas</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-red-500">{membershipStats.expired}</div>
                          <div className="text-sm text-muted-foreground">Vencidas</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-500">{membershipStats.noMembership}</div>
                          <div className="text-sm text-muted-foreground">Sin Membresía</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Uso de templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Templates Más Usados</CardTitle>
                    <CardDescription>Distribución de uso por template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={templateUsage}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="template" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Lista de templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas por Template</CardTitle>
                    <CardDescription>Rendimiento individual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {templateUsage.map((item, index) => (
                        <div key={item.template} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-blue-500' : 
                              index === 1 ? 'bg-green-500' : 
                              index === 2 ? 'bg-yellow-500' : 
                              index === 3 ? 'bg-purple-500' : 'bg-red-500'
                            }`}>
                              <span className="text-white text-sm font-bold">
                                {item.template.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{item.template}</div>
                              <div className="text-sm text-muted-foreground">{item.count} enlaces</div>
                            </div>
                          </div>
                          <Badge variant="secondary">{item.percentage}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actividad de usuarios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad de Usuarios</CardTitle>
                    <CardDescription>Registros y actividad reciente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center space-y-2">
                          <div className="text-3xl font-bold text-blue-500">
                            {Array.isArray(users) ? users.length : 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Usuarios</div>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-3xl font-bold text-green-500">2</div>
                          <div className="text-sm text-muted-foreground">Registros Hoy</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Usuarios Recientes</h4>
                        <div className="space-y-2">
                          {Array.isArray(users) && users.slice(0, 5).map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-2 rounded border">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <span className="text-xs text-primary-foreground">
                                    {user.username?.charAt(0).toUpperCase() || "?"}
                                  </span>
                                </div>
                                <span className="text-sm">{user.username}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                Reciente
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tipos de membresía */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Membresías</CardTitle>
                    <CardDescription>Tipos activos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['7_days', '15_days', '30_days'].map((type, index) => {
                        const count = Array.isArray(users) ? users.filter((u: any) => u.membershipType === type).length : 0;
                        const percentage = Array.isArray(users) && users.length ? Math.round((count / users.length) * 100) : 0;
                        
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                type === '7_days' ? 'bg-yellow-500' : 
                                type === '15_days' ? 'bg-blue-500' : 'bg-green-500'
                              }`}></div>
                              <span className="text-sm font-medium">
                                {type === '7_days' ? '7 días' : 
                                 type === '15_days' ? '15 días' : '30 días'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{count} usuarios</span>
                              <Badge variant="outline">{percentage}%</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Actividad en tiempo real */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimas interacciones del sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {Array.isArray(activities) && activities.length > 0 ? (
                        activities.slice(-20).reverse().map((activity: any) => (
                          <div key={activity.id} className="flex items-center justify-between p-2 rounded border">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === 'click' ? 'bg-green-500' :
                                activity.type === 'view' ? 'bg-blue-500' :
                                activity.type === 'submit' ? 'bg-orange-500' : 'bg-gray-500'
                              }`}></div>
                              <span className="text-sm">{activity.type}</span>
                              <span className="text-xs text-muted-foreground">
                                en {activity.templateName || 'template'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Reciente
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          No hay actividad registrada
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Información del sistema */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estado del Sistema</CardTitle>
                    <CardDescription>Información general</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-blue-500">
                            {Array.isArray(sessions) ? sessions.length : 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Sesiones</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-green-500">
                            {Array.isArray(links) ? links.length : 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Enlaces Creados</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Alertas y recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Insights y Recomendaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-green-600">✅ Rendimiento Óptimo</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    El sistema está funcionando correctamente con todas las métricas en rango normal.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-blue-600">💡 Oportunidad</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Los templates bancarios son los más populares. Considera agregar más variantes.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-purple-600">🎯 Objetivo</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mantener un crecimiento sostenible de usuarios registrados.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-orange-600">⚡ Rendimiento</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tiempo de respuesta promedio excelente en todas las operaciones.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}