import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Send, MessageCircle, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function TelegramConfig() {
  const { user } = usePermanentAuth();
  const { toast } = useToast();
  const [telegramChatId, setTelegramChatId] = useState("");
  const [notifications, setNotifications] = useState(false);

  // Cargar configuración actual del usuario
  useEffect(() => {
    if (user) {
      setTelegramChatId(user.telegramChatId || "");
      setNotifications(user.telegramNotifications || false);
    }
  }, [user]);

  // Mutación para actualizar configuración de Telegram
  const updateTelegramMutation = useMutation({
    mutationFn: async (data: { telegramChatId: string; telegramNotifications: boolean }) => {
      const res = await apiRequest("POST", `/api/users/${user?.id}/telegram`, data);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/auth/me", user?.id], updatedUser);
      toast({
        title: "¡Configuración actualizada!",
        description: "Tu configuración de Telegram se ha guardado correctamente.",
      });
    },
    onError: (error: any) => {
      let errorMessage = "No se pudo actualizar la configuración de Telegram";
      
      if (error.message) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.code === 'INVALID_CHAT_ID_FORMAT') {
            errorMessage = "❌ " + errorData.error;
          } else if (errorData.code === 'CHAT_NOT_FOUND') {
            errorMessage = "🤖 " + errorData.error;
          } else {
            errorMessage = errorData.error || errorData.message || errorMessage;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error de configuración",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Mutación para probar conexión
  const testTelegramMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/users/${user?.id}/telegram/test`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Mensaje enviado!",
        description: "Revisa tu Telegram para confirmar la conexión.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el mensaje de prueba",
        variant: "destructive",
      });
    },
  });

  // Mutación para probar notificaciones del sistema
  const testNotificationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/telegram/test-notification");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "¡Notificación de prueba enviada!",
        description: "Revisa tu Telegram para ver la notificación de ejemplo con datos reales.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error en prueba de notificación",
        description: error.message || "No se pudo enviar la notificación de prueba",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateTelegramMutation.mutate({
      telegramChatId: telegramChatId.trim(),
      telegramNotifications: notifications,
    });
  };

  const handleTest = () => {
    testTelegramMutation.mutate();
  };

  const handleTestNotification = () => {
    testNotificationMutation.mutate();
  };

  const isConfigured = user?.telegramChatId && user?.telegramNotifications;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <div>
            <CardTitle>Notificaciones de Telegram</CardTitle>
            <CardDescription>Recibe alertas en tiempo real sobre la actividad de tus paginas</CardDescription>
          </div>
          {isConfigured && (
            <Badge variant="outline" className="text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Configurado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información sobre cómo obtener el Chat ID */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <p className="font-medium">¿Cómo obtener tu Chat ID de Telegram?</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Abre Telegram y busca <strong>@panelnemesisbot</strong></li>
              <li>Envía cualquier mensaje al bot (ejemplo: "hola")</li>
              <li>El bot te responderá con tu Chat ID</li>
              <li>Copia ese número y pégalo aquí abajo</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Campo Chat ID */}
        <div className="space-y-2">
          <Label htmlFor="telegram-chat-id">Chat ID de Telegram</Label>
          <div className="flex space-x-2">
            <Input
              id="telegram-chat-id"
              type="text"
              placeholder="Ejemplo: 123456789 (solo números)"
              value={telegramChatId}
              onChange={(e) => {
                // Solo permitir números, espacios y el signo menos
                const value = e.target.value.replace(/[^-0-9\s]/g, '');
                setTelegramChatId(value);
              }}
              data-testid="input-telegram-chat-id"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open('https://t.me/panelnemesisbot', '_blank')}
              data-testid="button-open-telegram-bot"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Abrir Bot
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>Importante:</strong> El Chat ID debe ser solo números. Obtén el tuyo enviando cualquier mensaje a @panelnemesisbot.
          </p>
        </div>

        {/* Switch de notificaciones */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="telegram-notifications">Recibir Notificaciones</Label>
            <p className="text-sm text-muted-foreground">
              Activa las notificaciones para recibir alertas de actividad
            </p>
          </div>
          <Switch
            id="telegram-notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
            disabled={!telegramChatId.trim()}
            data-testid="switch-telegram-notifications"
          />
        </div>

        {/* Información sobre qué tipo de notificaciones */}
        {notifications && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Recibirás notificaciones cuando:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 🚨 Alguien acceda a uno de tus templates</li>
              <li>• ✅ Se complete un formulario en tus páginas</li>
              <li>• 📊 Haya actividad importante en tu panel</li>
              <li>• ⚡ Ocurran eventos críticos del sistema</li>
            </ul>
            <div className="mt-3 pt-3 border-t">
              <h5 className="font-medium text-xs mb-2">Tipos de prueba disponibles:</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Probar Conexión</strong>: Envía un mensaje básico de confirmación</li>
                <li>• <strong>Probar Notificación</strong>: Envía una notificación completa con datos de ejemplo</li>
              </ul>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={updateTelegramMutation.isPending || !telegramChatId.trim()}
            data-testid="button-save-telegram-config"
          >
            {updateTelegramMutation.isPending ? (
              "Guardando..."
            ) : (
              "Guardar Configuración"
            )}
          </Button>

          {telegramChatId.trim() && (
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testTelegramMutation.isPending || !user?.telegramChatId}
              data-testid="button-test-telegram"
            >
              <Send className="w-4 h-4 mr-2" />
              {testTelegramMutation.isPending ? "Enviando..." : "Probar Conexión"}
            </Button>
          )}

          {isConfigured && (
            <Button
              variant="secondary"
              onClick={handleTestNotification}
              disabled={testNotificationMutation.isPending}
              data-testid="button-test-notification"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {testNotificationMutation.isPending ? "Enviando..." : "Probar Notificación"}
            </Button>
          )}
        </div>

        {/* Estado de configuración */}
        {user?.telegramChatId && (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Telegram configurado correctamente
              </span>
            </div>
            <Badge variant="outline" className="text-green-600">
              Chat ID: {user.telegramChatId}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}