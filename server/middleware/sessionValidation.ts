import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { Session } from "@shared/schema";

// Extender el tipo Request para incluir la sesión
declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

/**
 * Middleware que valida si una sesión existe y está activa
 */
export async function validateSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.query.sessionId as string;
    
    // Si no hay sessionId, mostrar error
    if (!sessionId) {
      console.log(`[SESSION VALIDATION] No sessionId provided`);
      return res.redirect('/session-error?reason=missing');
    }

    // Buscar la sesión en la base de datos
    const session = await storage.getSession(sessionId);
    
    // Si la sesión no existe, mostrar error
    if (!session) {
      console.log(`[SESSION VALIDATION] Session not found: ${sessionId}`);
      return res.redirect('/session-error?reason=not_found');
    }

    // Verificar si la sesión ha expirado (5 minutos desde la última actividad)
    const now = new Date();
    const lastActivity = session.lastActivity ? new Date(session.lastActivity) : new Date(session.startedAt!);
    const timeDiff = now.getTime() - lastActivity.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff >= 5) {
      // Marcar la sesión como expirada en la base de datos
      await storage.updateSessionStatus(sessionId, "expired");
      
      console.log(`[SESSION VALIDATION] Session expired: ${sessionId} (${minutesDiff} minutes ago)`);
      return res.redirect('/session-error?reason=expired');
    }

    // Verificar si la sesión ya está marcada como expirada
    if (session.status === "expired") {
      console.log(`[SESSION VALIDATION] Session already marked as expired: ${sessionId}`);
      return res.redirect('/session-error?reason=expired');
    }

    // Actualizar la última actividad de la sesión
    await storage.updateSessionLastActivity(sessionId);
    
    console.log(`[SESSION VALIDATION] Session valid: ${sessionId}, allowing access`);
    
    // Agregar la sesión al objeto request para uso posterior
    req.session = session;
    
    next();
  } catch (error) {
    console.error(`[SESSION VALIDATION] Error validating session:`, error);
    return res.redirect('/session-error?reason=server_error');
  }
}