// Genera un ID único y permanente para cada usuario basado en características del dispositivo
function generateDeviceFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.platform,
    navigator.cookieEnabled,
    navigator.hardwareConcurrency || 1,
    canvas.toDataURL()
  ].join('|');
  
  // Generar hash simple del fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }
  
  // Convertir a string único de 8 caracteres
  return Math.abs(hash).toString(36).substring(0, 8).toUpperCase();
}

export function getPermanentUserId(): string {
  const STORAGE_KEY = 'permanent_user_id';
  
  // Verificar si ya existe un ID almacenado
  let userId = localStorage.getItem(STORAGE_KEY);
  
  if (!userId) {
    // Generar nuevo ID basado en características del dispositivo + componente aleatorio
    const deviceId = generateDeviceFingerprint();
    const timestamp = Date.now().toString(36);
    const randomComponent = Math.random().toString(36).substring(2, 8); // 6 caracteres aleatorios adicionales
    userId = `USR${deviceId}${timestamp.slice(-3)}${randomComponent}`;
    
    // Almacenar de manera permanente
    localStorage.setItem(STORAGE_KEY, userId);
  }
  
  return userId;
}

// Función para resetear el ID (solo para depuración, no usar en producción)
export function resetUserId(): void {
  localStorage.removeItem('permanent_user_id');
}