<?php
// Configurações do Banco de Dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'lixoon');
define('DB_USER', 'root');
define('DB_PASS', '');

// Chave secreta para assinatura dos Tokens JWT
define('JWT_SECRET', 'chave-secreta-lixoon-tcc-2026-muito-segura');

// Retorna conexão PDO
function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao conectar no banco de dados.']);
        exit;
    }
}
