/**
 * Sistema optimizado de logging para prevenir saturación de consola
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableTimestamp: boolean;
  maxLineLength: number;
  rateLimitMs: number;
}

class OptimizedLogger {
  private config: LogConfig;
  private lastLogTimes: Map<string, number> = new Map();
  private logCounts: Map<string, number> = new Map();

  constructor(config: Partial<LogConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableTimestamp: true,
      maxLineLength: 120,
      rateLimitMs: 1000, // Máximo 1 log idéntico por segundo
      ...config
    };
  }

  private shouldLog(level: LogLevel, message: string): boolean {
    // Verificar nivel de log
    if (level > this.config.level) {
      return false;
    }

    // Rate limiting para mensajes repetitivos
    const now = Date.now();
    const lastTime = this.lastLogTimes.get(message) || 0;
    
    if (now - lastTime < this.config.rateLimitMs) {
      const count = this.logCounts.get(message) || 0;
      this.logCounts.set(message, count + 1);
      return false;
    }

    this.lastLogTimes.set(message, now);
    const suppressedCount = this.logCounts.get(message) || 0;
    if (suppressedCount > 0) {
      this.logCounts.delete(message);
      // Mostrar cuántos logs se suprimieron
      this._logToConsole(level, `${message} (${suppressedCount} mensajes similares suprimidos)`);
      return false;
    }

    return true;
  }

  private _logToConsole(level: LogLevel, message: string): void {
    if (!this.config.enableConsole) return;

    // Truncar mensajes largos
    if (message.length > this.config.maxLineLength) {
      message = message.substring(0, this.config.maxLineLength - 3) + "...";
    }

    // Formatear mensaje
    const timestamp = this.config.enableTimestamp 
      ? `[${new Date().toISOString().substring(11, 19)}] `
      : '';

    const prefix = {
      [LogLevel.ERROR]: '❌',
      [LogLevel.WARN]: '⚠️ ',
      [LogLevel.INFO]: '📋',
      [LogLevel.DEBUG]: '🔍'
    }[level];

    const formattedMessage = `${prefix} ${timestamp}${message}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.log(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR, message)) {
      this._logToConsole(LogLevel.ERROR, message);
      if (error && this.config.level >= LogLevel.DEBUG) {
        console.error(error);
      }
    }
  }

  warn(message: string): void {
    if (this.shouldLog(LogLevel.WARN, message)) {
      this._logToConsole(LogLevel.WARN, message);
    }
  }

  info(message: string): void {
    if (this.shouldLog(LogLevel.INFO, message)) {
      this._logToConsole(LogLevel.INFO, message);
    }
  }

  debug(message: string): void {
    if (this.shouldLog(LogLevel.DEBUG, message)) {
      this._logToConsole(LogLevel.DEBUG, message);
    }
  }

  // Método especial para logs de alta frecuencia
  periodic(key: string, level: LogLevel, message: string): void {
    const now = Date.now();
    const lastTime = this.lastLogTimes.get(`periodic_${key}`) || 0;
    
    // Logs periódicos cada 5 segundos máximo
    if (now - lastTime > 5000) {
      this.lastLogTimes.set(`periodic_${key}`, now);
      this._logToConsole(level, message);
    }
  }

  // Limpiar cache de rate limiting periódicamente
  cleanup(): void {
    const now = Date.now();
    const cutoff = now - (this.config.rateLimitMs * 10); // Limpiar logs más antiguos de 10x el rate limit
    
    const entries = Array.from(this.lastLogTimes.entries());
    for (const [key, time] of entries) {
      if (time < cutoff) {
        this.lastLogTimes.delete(key);
        this.logCounts.delete(key);
      }
    }
  }
}

// Configurar logger basado en NODE_ENV
const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;

export const logger = new OptimizedLogger({
  level: logLevel,
  enableConsole: true,
  enableTimestamp: true,
  maxLineLength: 120,
  rateLimitMs: isDevelopment ? 500 : 2000 // Más restrictivo en producción
});

// Limpiar cache cada 5 minutos
setInterval(() => {
  logger.cleanup();
}, 5 * 60 * 1000);

// Función de compatibilidad para reemplazar console.log
export const log = logger.info.bind(logger);
export const logError = logger.error.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logDebug = logger.debug.bind(logger);