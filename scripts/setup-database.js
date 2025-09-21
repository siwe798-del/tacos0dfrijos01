#!/usr/bin/env node

/**
 * Script para configurar la conexión a base de datos externa
 * Ayuda a crear el archivo .env con la configuración correcta
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('🚀 Configuración de Base de Datos Externa');
  console.log('==========================================\n');

  console.log('Este script te ayudará a configurar la conexión a tu base de datos PostgreSQL.\n');

  // Preguntar el método de configuración
  console.log('¿Cómo prefieres configurar la base de datos?');
  console.log('1. URL completa de conexión');
  console.log('2. Datos individuales (host, puerto, usuario, etc.)');
  
  const method = await question('\nElige una opción (1 o 2): ');

  let envContent = '';

  if (method === '1') {
    // Método 1: URL completa
    console.log('\n📝 Configuración con URL completa');
    console.log('Ejemplo: postgresql://usuario:contraseña@host:puerto/base_de_datos\n');
    
    const databaseUrl = await question('Ingresa la URL de tu base de datos: ');
    
    envContent = `# =============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# =============================================================================

# URL completa de conexión a PostgreSQL
DATABASE_URL=${databaseUrl}

`;
  } else if (method === '2') {
    // Método 2: Datos individuales
    console.log('\n📝 Configuración con datos individuales\n');
    
    const host = await question('Host de la base de datos (ej: localhost): ');
    const port = await question('Puerto (por defecto 5432): ') || '5432';
    const user = await question('Usuario de la base de datos: ');
    const password = await question('Contraseña: ');
    const database = await question('Nombre de la base de datos: ');

    envContent = `# =============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# =============================================================================

# Configuración individual de base de datos
DB_HOST=${host}
DB_PORT=${port}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}

`;
  } else {
    console.log('❌ Opción no válida. Ejecuta el script nuevamente.');
    rl.close();
    return;
  }

  // Configuración adicional
  console.log('\n⚙️ Configuración adicional\n');
  
  const sessionSecret = await question('Clave secreta para sesiones (deja vacío para generar automáticamente): ');
  const nodeEnv = await question('Entorno (development/production) [development]: ') || 'development';
  const port = await question('Puerto de la aplicación [5000]: ') || '5000';

  // Generar clave secreta si no se proporcionó
  const secret = sessionSecret || Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  envContent += `# =============================================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# =============================================================================

# Entorno de ejecución
NODE_ENV=${nodeEnv}

# Puerto de la aplicación
PORT=${port}

# Clave secreta para sesiones
SESSION_SECRET=${secret}

# =============================================================================
# CONFIGURACIÓN DE NOTIFICACIONES (OPCIONAL)
# =============================================================================

# Telegram Bot (para notificaciones)
# TELEGRAM_BOT_TOKEN=tu_bot_token
# TELEGRAM_CHAT_ID=tu_chat_id

# =============================================================================
# CONFIGURACIÓN DE SEGURIDAD
# =============================================================================

# Dominios permitidos para CORS
ALLOWED_ORIGINS=http://localhost:3000,https://tu-dominio.com

# =============================================================================
# CONFIGURACIÓN DE LOGGING
# =============================================================================

# Nivel de logging (error, warn, info, debug)
LOG_LEVEL=info
`;

  // Crear archivo .env
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    const overwrite = await question('\n⚠️  El archivo .env ya existe. ¿Sobrescribir? (s/n): ');
    if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'y') {
      console.log('❌ Operación cancelada.');
      rl.close();
      return;
    }
  }

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Archivo .env creado correctamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Verifica que tu base de datos PostgreSQL esté en funcionamiento');
  console.log('2. Ejecuta: npm run db:push');
  console.log('3. Inicia la aplicación: npm run dev');
  
  console.log('\n💡 Consejos:');
  console.log('- Asegúrate de que la base de datos exista antes de ejecutar la aplicación');
  console.log('- El usuario debe tener permisos para crear tablas');
  console.log('- Para bases de datos remotas, verifica que el puerto esté abierto');

  rl.close();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };