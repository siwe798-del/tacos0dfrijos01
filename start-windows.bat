@echo off
echo 🚀 Iniciando Nemesis en Windows...
echo.
echo 📋 Usando cross-env para compatibilidad...
echo.

REM Usar cross-env para Windows
npx cross-env NODE_ENV=development tsx server/index.ts

echo.
echo ⏸️  Presiona cualquier tecla para cerrar...
pause