@echo off
echo 🚀 NEMESIS - Comando directo para Windows
echo.
echo 🔧 Usando cross-env para compatibilidad total...
echo.

REM Comando con cross-env
npx cross-env NODE_ENV=development tsx server/index.ts

echo.
echo ⏸️ Servidor detenido. Presiona cualquier tecla para cerrar...
pause