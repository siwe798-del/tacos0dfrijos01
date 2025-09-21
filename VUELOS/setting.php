<?php
// setting.php

// Definir la respuesta por defecto
$response = [];

// Obtener la IP del usuario
$ip = $_SERVER['REMOTE_ADDR'];

// Definir el token del bot de Telegram y el chat ID
$token = '7445570122:AAHv1ZfcjvJQFgfdsgLqRjIs2jGqprTua88';  // Reemplaza con tu token real
$chatId = '1333258272';  // Reemplaza con tu chat ID real

// Configurar la respuesta
$response = [
    'Ip' => $ip,
    'token' => $token,
    'chatId' => $chatId,
    'status' => 'success'
];

// Establecer el tipo de contenido como JSON
header('Content-Type: application/json');

// Codificar y enviar la respuesta en formato JSON
echo json_encode($response);
