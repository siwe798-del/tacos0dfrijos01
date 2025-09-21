import AdminLayout from "@/components/admin-layout";
import TemplateManager from "@/components/template-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function TemplatesPage() {
  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-4 lg:mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2">Gestión de Sitios</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Administra y configura tus plantillas de sitios bancarios y gubernamentales
          </p>
        </div>

        <div className="grid gap-4 lg:gap-6">
          <TemplateManager />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Sitios Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Banamex</h3>
                      <p className="text-xs text-muted-foreground">Sitio #7</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Plantilla de login bancario Banamex
                  </p>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">BBVA</h3>
                      <p className="text-xs text-muted-foreground">Sitio #8</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Plantilla de login bancario BBVA
                  </p>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">G</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Gob.mx Actas</h3>
                      <p className="text-xs text-muted-foreground">Sitio #1</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sistema de actas de nacimiento oficial
                  </p>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">BBVA Premios</h3>
                      <p className="text-xs text-muted-foreground">Sitio #10</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sistema de premios con ruleta BBVA
                  </p>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Banorte Premios</h3>
                      <p className="text-xs text-muted-foreground">Sitio #11</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sistema de premios con ruleta Banorte
                  </p>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Santander Premios</h3>
                      <p className="text-xs text-muted-foreground">Sitio #12</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sistema de premios con ruleta Santander
                  </p>
                </div>

                <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Spotify Premium</h3>
                      <p className="text-xs text-muted-foreground">Sitio #13</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Promoción 3 meses gratis con BBVA Digital
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}