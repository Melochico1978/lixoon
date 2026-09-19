<?php
/**
 * LixoOn — Configuração do Banco de Dados
 * ⚠️  NÃO versione este arquivo com credenciais reais.
 *     Em produção, use variáveis de ambiente.
 */

return [
    'db_host' => getenv('DB_HOST') ?: 'localhost',
    'db_name' => getenv('DB_NAME') ?: 'lixoon',
    'db_user' => getenv('DB_USER') ?: 'root',
    'db_pass' => getenv('DB_PASS') ?: '',
    'charset' => 'utf8mb4',
];
