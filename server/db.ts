import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { logger } from './logger';

neonConfig.webSocketConstructor = ws;

// 🚀 CONEXIÓN DIRECTA SIN .ENV - Para máxima compatibilidad Windows
const DATABASE_URL = "postgresql://neondb_owner:npg_VceSDhEN0j7d@ep-green-hall-ad9gvxfc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log('✅ Base de datos configurada con conexión directa (sin .env requerido)');
console.log('📍 Host: ep-green-hall-ad9gvxfc-pooler.c-2.us-east-1.aws.neon.tech');
console.log('🎯 Database: neondb');

// Configuración simple del pool
export let pool = new Pool({ 
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export let db = drizzle({ client: pool, schema });

// Manejo de eventos del pool - simple
pool.on('connect', () => {
  logger.info(`🔗 [${new Date().toLocaleTimeString()}] Nueva conexión establecida al pool de BD`);
});

pool.on('remove', () => {
  logger.info(`🔍 [${new Date().toLocaleTimeString()}] Conexión removida del pool de BD`);
});

pool.on('error', (err) => {
  logger.error('💥 Error en el pool de base de datos:', err);
});

// Test inicial simple
async function testConnection() {
  try {
    const client = await pool.connect();
    logger.info(`📋 [${new Date().toLocaleTimeString()}] ✅ Conexión a la base de datos establecida correctamente`);
    client.release();
  } catch (error: any) {
    logger.error('❌ Error conectando a la base de datos:', error.message);
  }
}

// Probar conexión
testConnection();

// Limpiar conexiones al cerrar la aplicación
process.on('SIGTERM', () => {
  logger.info('Cerrando pool de conexiones...');
  pool.end();
});

process.on('SIGINT', () => {
  logger.info('Cerrando pool de conexiones...');
  pool.end();
  process.exit(0);
});