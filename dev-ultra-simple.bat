@echo off
title Nemesis - Conexion Directa
echo.
echo =======================================
echo   NEMESIS - CONEXION DIRECTA SIMPLE
echo =======================================
echo.
echo 🚀 Iniciando sin .env (conexion hardcodeada)
echo 💡 Para Windows - Sin variables de entorno
echo.

REM Ejecutar directamente sin variables
tsx server/index.ts

echo.
echo ⏸️ Presiona cualquier tecla para salir...
pause