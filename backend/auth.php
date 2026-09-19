<?php
require_once 'config.php';

// Função simples para gerar um JWT básico (Header.Payload.Signature)
function generateJWT($payload) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['exp'] = time() + (60 * 60 * 24); // Expira em 24h

    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Verifica se o Token JWT é válido
function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    list($header64, $payload64, $signature64) = $parts;

    $signature = hash_hmac('sha256', $header64 . "." . $payload64, JWT_SECRET, true);
    $validSignature64 = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    if (!hash_equals($validSignature64, $signature64)) {
        return false;
    }

    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload64)), true);

    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false; // Expirado
    }

    return $payload;
}

// Middleware de autenticação
function requireAuth() {
    $headers = apache_request_headers();
    $authHeader = $headers['Authorization'] ?? '';

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $payload = verifyJWT($token);
        if ($payload) {
            return $payload; // Retorna os dados do usuário autenticado
        }
    }

    http_response_code(401);
    echo json_encode(['erro' => 'Não autorizado. Faça login para acessar.']);
    exit;
}
