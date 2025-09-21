# Script de PowerShell para iniciar Nemesis en Windows
Write-Host "🚀 Iniciando Nemesis en Windows..." -ForegroundColor Green
Write-Host "📋 Usando cross-env para compatibilidad..." -ForegroundColor Cyan
Write-Host ""

# Mostrar información
Write-Host "📋 Configuración:" -ForegroundColor Cyan
Write-Host "   🔒 Environment: development" -ForegroundColor White
Write-Host "   🌐 Port: 5000" -ForegroundColor White
Write-Host "   🛠️  Tool: cross-env" -ForegroundColor White
Write-Host ""

# Ejecutar el servidor con cross-env
Write-Host "🔄 Ejecutando servidor..." -ForegroundColor Yellow
npx cross-env NODE_ENV=development tsx server/index.ts