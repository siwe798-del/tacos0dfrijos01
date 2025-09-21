# 🗄️ Configuración de Base de Datos Externa

Esta guía te ayudará a conectar **Nemesis** a tu propia base de datos PostgreSQL externa.

## 🚀 Configuración Rápida

### Opción 1: Script Automático
```bash
node scripts/setup-database.js
```

### Opción 2: Configuración Manual
Copia `.env.example` a `.env` y edita las variables:

```bash
cp .env.example .env
```

## 📝 Métodos de Configuración

### Método 1: URL Completa
```env
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos
```

**Ejemplos:**
```env
# Local
DATABASE_URL=postgresql://postgres:password123@localhost:5432/nemesis_db

# Remoto
DATABASE_URL=postgresql://user:pass@db.ejemplo.com:5432/phishing_db

# Con SSL
DATABASE_URL=postgresql://user:pass@cloud-db.com:5432/db?sslmode=require
```

### Método 2: Variables Individuales
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=nemesis_phishing
```

## 🔧 Configuración Completa

### Variables Requeridas
```env
# Base de datos (escoge UNA opción)
DATABASE_URL=postgresql://...          # OPCIÓN 1
# O
DB_HOST=localhost                      # OPCIÓN 2
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=nemesis_phishing

# Aplicación
NODE_ENV=development
PORT=5000
SESSION_SECRET=tu_clave_secreta_muy_larga
```

### Variables Opcionales
```env
# Notificaciones
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=123456789

# Seguridad
ALLOWED_ORIGINS=https://tu-dominio.com
ENCRYPTION_KEY=clave_cifrado_32_chars

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

## 🏗️ Configuración de Base de Datos

### 1. Crear Base de Datos
```sql
-- Conecta como superusuario y ejecuta:
CREATE DATABASE nemesis_phishing;
CREATE USER nemesis_user WITH ENCRYPTED PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE nemesis_phishing TO nemesis_user;
```

### 2. Configurar Permisos
```sql
-- En la base de datos nemesis_phishing:
GRANT CREATE ON SCHEMA public TO nemesis_user;
GRANT USAGE ON SCHEMA public TO nemesis_user;
```

### 3. Ejecutar Migraciones
```bash
npm run db:push
```

## 🌐 Proveedores Compatibles

### ✅ Probado y Compatible
- **PostgreSQL Local** (versión 12+)
- **Neon Database** (Serverless PostgreSQL)
- **Supabase** (PostgreSQL como servicio)
- **Railway** (PostgreSQL managed)
- **Render** (PostgreSQL managed)

### 🔧 AWS RDS
```env
DATABASE_URL=postgresql://usuario:contraseña@rds-instance.region.rds.amazonaws.com:5432/nemesis
```

### 🔧 Google Cloud SQL
```env
DATABASE_URL=postgresql://usuario:contraseña@google-sql-ip:5432/nemesis
```

### 🔧 Heroku Postgres
```env
DATABASE_URL=postgresql://usuario:contraseña@heroku-host:5432/heroku-database
```

## 🔒 Configuración SSL

### Para Bases de Datos Remotas
```env
# SSL requerido
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# SSL con certificado
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require&sslcert=client-cert.pem&sslkey=client-key.pem&sslrootcert=ca-cert.pem
```

### Variables de Entorno
```env
NODE_ENV=production  # Habilita SSL automáticamente
```

## 🚨 Solución de Problemas

### Error: "Connection Refused"
```bash
# Verifica que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verifica el puerto
netstat -an | grep 5432
```

### Error: "Authentication Failed"
```bash
# Verifica las credenciales
psql -h localhost -p 5432 -U tu_usuario -d tu_base_datos
```

### Error: "Database does not exist"
```sql
-- Crear la base de datos
CREATE DATABASE nemesis_phishing;
```

### Error: "Permission Denied"
```sql
-- Otorgar permisos
GRANT ALL ON DATABASE nemesis_phishing TO tu_usuario;
GRANT CREATE ON SCHEMA public TO tu_usuario;
```

## 📊 Monitoreo de Conexión

### Logs de Conexión
El sistema muestra información de conexión al iniciar:
```
🔗 Conectando a la base de datos...
📍 Host: localhost:5432
🎯 Base de datos: nemesis_phishing
✅ Conexión establecida correctamente
```

### Verificar Estado
```bash
# Ver logs en tiempo real
npm run dev

# Verificar configuración
node -e "console.log(require('./server/config').config)"
```

## 🔄 Migración de Datos

### Desde Replit DB Interna
```bash
# 1. Exportar datos existentes
npm run export-data

# 2. Configurar nueva base de datos
cp .env.example .env
# Editar .env con nueva configuración

# 3. Crear esquema
npm run db:push

# 4. Importar datos
npm run import-data
```

### Backup y Restore
```bash
# Backup
pg_dump DATABASE_URL > backup.sql

# Restore
psql DATABASE_URL < backup.sql
```

## 🎯 Optimización

### Pool de Conexiones
La configuración incluye optimizaciones automáticas:
- **Max conexiones:** 20
- **Timeout inactivo:** 30 segundos
- **Timeout conexión:** 2 segundos

### Índices Recomendados
Las migraciones incluyen índices optimizados para:
- Búsquedas por sesión
- Filtros por template
- Ordenamiento por fecha

---

¿Necesitas ayuda? Revisa los logs de la aplicación o crea un issue con los detalles del error.