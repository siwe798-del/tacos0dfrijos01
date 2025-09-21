/**
 * Configuración centralizada de la aplicación
 * Maneja todas las variables de entorno y configuraciones
 */

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}

export interface AppConfig {
  database: DatabaseConfig;
  server: {
    port: number;
    nodeEnv: string;
    appUrl: string;
  };
  auth: {
    sessionSecret: string;
    replId?: string;
    issuerUrl: string;
    replitDomains?: string[];
  };
  notifications: {
    telegramBotToken?: string;
    telegramChatId?: string;
    webhookUrl?: string;
  };
  security: {
    allowedOrigins: string[];
    encryptionKey?: string;
  };
  logging: {
    level: string;
    file?: string;
  };
}

/**
 * Obtiene la configuración de la base de datos
 */
function getDatabaseConfig(): DatabaseConfig {
  // Opción 1: URL completa de conexión
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      url: process.env.DATABASE_URL,
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: process.env.NODE_ENV === 'production'
    };
  }

  // Opción 2: Variables individuales
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432');
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME || 'nemesis_system';

  if (!password) {
    throw new Error(
      "DATABASE_URL or DB_PASSWORD must be set. Check your .env file."
    );
  }

  const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  return {
    url,
    host,
    port,
    user,
    password,
    database,
    ssl: process.env.NODE_ENV === 'production'
  };
}

/**
 * Configuración completa de la aplicación
 */
export const config: AppConfig = {
  database: getDatabaseConfig(),
  
  server: {
    port: parseInt(process.env.PORT || '5000'),
    nodeEnv: process.env.NODE_ENV || 'development',
    appUrl: process.env.APP_URL || 'http://localhost:5000'
  },

  auth: {
    sessionSecret: process.env.SESSION_SECRET || 'change-this-secret-key',
    replId: process.env.REPL_ID,
    issuerUrl: process.env.ISSUER_URL || 'https://replit.com/oidc',
    replitDomains: process.env.REPLIT_DOMAINS?.split(',') || []
  },

  notifications: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    webhookUrl: process.env.WEBHOOK_URL
  },

  security: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    encryptionKey: process.env.ENCRYPTION_KEY
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE
  }
};

/**
 * Valida que todas las configuraciones requeridas estén presentes
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Validar base de datos
  if (!config.database.password && !process.env.DATABASE_URL) {
    errors.push('DATABASE_URL or DB_PASSWORD is required');
  }

  // Validar sesión
  if (config.auth.sessionSecret === 'change-this-secret-key') {
    console.warn('⚠️  Warning: Using default SESSION_SECRET. Set a secure secret in production.');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    throw new Error('Invalid configuration. Check your .env file.');
  }

  console.log('✅ Configuration validated successfully');
}

/**
 * Muestra la configuración actual (sin datos sensibles)
 */
export function logConfig(): void {
  console.log('📋 Configuration loaded:');
  console.log(`   📍 Database Host: ${config.database.host}:${config.database.port}`);
  console.log(`   🎯 Database Name: ${config.database.database}`);
  console.log(`   🌐 Server Port: ${config.server.port}`);
  console.log(`   🔒 Environment: ${config.server.nodeEnv}`);
  console.log(`   🔐 SSL Enabled: ${config.database.ssl}`);
}