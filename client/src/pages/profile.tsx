import AdminLayout from "@/components/admin-layout";
import TelegramConfig from "@/components/telegram-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Settings, Home } from "lucide-react";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user } = usePermanentAuth();

  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="space-y-4 lg:space-y-6 max-w-4xl">
          {/* Header */}
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
                <div className="flex items-center space-x-3">
                  <User className="h-6 lg:h-8 w-6 lg:w-8 text-primary" />
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Perfil de Usuario</h1>
                    <p className="text-sm lg:text-base text-muted-foreground mt-2">Administra tu información personal y configuración</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Información del Usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>Tu información de cuenta actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nombre de Usuario</Label>
                  <Input
                    id="username"
                    value={user?.username || ""}
                    disabled
                    data-testid="input-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || "No configurado"}
                    disabled
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rol</Label>
                  <div>
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estado de Membresía</Label>
                  <div>
                    {user?.membershipType ? (
                      <Badge variant="outline" className="text-green-600">
                        {user.membershipType === '7_days' ? '7 días' :
                         user.membershipType === '15_days' ? '15 días' :
                         user.membershipType === '30_days' ? '30 días' : 
                         user.membershipType}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        Sin membresía
                      </Badge>
                    )}
                  </div>
                </div>

                {user?.membershipEndDate && (
                  <div className="space-y-2">
                    <Label>Vencimiento de Membresía</Label>
                    <Input
                      value={new Date(user.membershipEndDate).toLocaleDateString('es-ES')}
                      disabled
                      data-testid="input-membership-end"
                    />
                  </div>
                )}

                <div className="pt-4">
                  <Button variant="outline" disabled data-testid="button-edit-profile">
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas del Usuario */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Actividad</CardTitle>
                <CardDescription>Tu actividad en el sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-center space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xl lg:text-2xl font-bold text-blue-500">0</div>
                    <div className="text-xs lg:text-sm text-muted-foreground">Enlaces Generados</div>
                  </div>
                  <div className="text-center space-y-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xl lg:text-2xl font-bold text-green-500">0</div>
                    <div className="text-xs lg:text-sm text-muted-foreground">Sesiones Activas</div>
                  </div>
                  <div className="text-center space-y-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xl lg:text-2xl font-bold text-purple-500">0</div>
                    <div className="text-xs lg:text-sm text-muted-foreground">Formularios Completados</div>
                  </div>
                  <div className="text-center space-y-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-xl lg:text-2xl font-bold text-orange-500">
                      {user?.createdAt ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                    </div>
                    <div className="text-xs lg:text-sm text-muted-foreground">Días Registrado</div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <h4 className="font-medium">Cuenta creada</h4>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No disponible'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuración de Telegram - Componente principal */}
          <TelegramConfig />

          {/* Configuración Adicional */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración Adicional</CardTitle>
              <CardDescription>Otras opciones de configuración</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" disabled data-testid="button-change-password" className="w-full">
                  <span className="hidden sm:inline">Cambiar Contraseña</span>
                  <span className="sm:hidden">Contraseña</span>
                </Button>
                <Button variant="outline" disabled data-testid="button-export-data" className="w-full">
                  <span className="hidden sm:inline">Exportar Datos</span>
                  <span className="sm:hidden">Exportar</span>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-destructive mb-2">Zona de Peligro</h4>
                <Button variant="destructive" disabled data-testid="button-delete-account" className="w-full sm:w-auto">
                  Eliminar Cuenta
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}