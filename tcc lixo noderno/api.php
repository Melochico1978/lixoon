<?php
/**
 * LixoOn — API REST
 * Endpoints para gerenciamento de rotas, motoristas e relatórios.
 * --------------------------------------------------
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

// Preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// =========================================================
// Conexão com o banco (credenciais isoladas)
// =========================================================

$config = require __DIR__ . '/config.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset={$config['charset']}",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao conectar no banco de dados.']);
    exit;
}

// =========================================================
// Helpers
// =========================================================

function bodyJson(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function sanitize(?string $value): ?string
{
    return $value !== null ? trim(strip_tags($value)) : null;
}

// =========================================================
// Funções de Negócio
// =========================================================

function buscarRotas(PDO $pdo): array
{
    $sql = "
        SELECT
            r.*,
            c.placa,
            m.nome AS motorista_nome
        FROM rotas r
        LEFT JOIN caminhoes c ON c.id = r.caminhao_id
        LEFT JOIN motoristas m ON m.id = r.motorista_id
        ORDER BY r.id
    ";

    $rotas = $pdo->query($sql)->fetchAll();

    $bairrosStmt = $pdo->prepare("
        SELECT b.id, b.nome
        FROM rota_bairros rb
        INNER JOIN bairros b ON b.id = rb.bairro_id
        WHERE rb.rota_id = ?
        ORDER BY b.nome
    ");
    $diasStmt   = $pdo->prepare("SELECT dia FROM rota_dias WHERE rota_id = ? ORDER BY FIELD(dia, 'seg','ter','qua','qui','sex','sab','dom')");
    $pontosStmt = $pdo->prepare("SELECT nome FROM rota_pontos WHERE rota_id = ? ORDER BY ordem, id");

    return array_map(function ($rota) use ($bairrosStmt, $diasStmt, $pontosStmt) {
        $bairrosStmt->execute([$rota['id']]);
        $bairros = $bairrosStmt->fetchAll();
        $diasStmt->execute([$rota['id']]);
        $pontosStmt->execute([$rota['id']]);

        return [
            'id'            => (int) $rota['id'],
            'nome'          => $rota['nome'],
            'bairros'       => array_column($bairros, 'nome'),
            'bairroIds'     => array_map('intval', array_column($bairros, 'id')),
            'caminhao'      => $rota['caminhao_id'],
            'motoristaId'   => $rota['motorista_id'] ? (int) $rota['motorista_id'] : null,
            'motorista'     => $rota['motorista_nome'] ?: '',
            'dias'          => array_column($diasStmt->fetchAll(), 'dia'),
            'horarioInicio' => substr($rota['horario_inicio'], 0, 5),
            'horarioFim'    => substr($rota['horario_fim'], 0, 5),
            'tipo'          => $rota['tipo'],
            'frequencia'    => $rota['frequencia'],
            'status'        => $rota['status'],
            'pontos'        => array_column($pontosStmt->fetchAll(), 'nome'),
            'observacoes'   => $rota['observacoes'],
            'createdAt'     => $rota['criado_em'],
            'eficiencia'    => (int) $rota['eficiencia'],
        ];
    }, $rotas);
}

function salvarRota(PDO $pdo, array $data): array
{
    $pdo->beginTransaction();

    $id = !empty($data['id']) ? (int) $data['id'] : null;
    $params = [
        ':nome'           => sanitize($data['nome'] ?? ''),
        ':caminhao_id'    => $data['caminhao'] ?: null,
        ':motorista_id'   => $data['motoristaId'] ?: null,
        ':horario_inicio' => $data['horarioInicio'] ?? '00:00',
        ':horario_fim'    => $data['horarioFim'] ?? '00:00',
        ':tipo'           => $data['tipo'] ?? 'domiciliar',
        ':frequencia'     => $data['frequencia'] ?? 'semanal',
        ':status'         => $data['status'] ?? 'ativa',
        ':observacoes'    => sanitize($data['observacoes'] ?? null),
        ':eficiencia'     => $data['eficiencia'] ?? random_int(70, 99),
        ':criado_em'      => $data['createdAt'] ?? date('Y-m-d'),
    ];

    if ($id) {
        $params[':id'] = $id;
        $stmt = $pdo->prepare("
            UPDATE rotas
            SET nome = :nome, caminhao_id = :caminhao_id, motorista_id = :motorista_id,
                horario_inicio = :horario_inicio, horario_fim = :horario_fim, tipo = :tipo,
                frequencia = :frequencia, status = :status, observacoes = :observacoes,
                eficiencia = :eficiencia, criado_em = :criado_em
            WHERE id = :id
        ");
        $stmt->execute($params);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO rotas
            (nome, caminhao_id, motorista_id, horario_inicio, horario_fim, tipo, frequencia, status, observacoes, eficiencia, criado_em)
            VALUES
            (:nome, :caminhao_id, :motorista_id, :horario_inicio, :horario_fim, :tipo, :frequencia, :status, :observacoes, :eficiencia, :criado_em)
        ");
        $stmt->execute($params);
        $id = (int) $pdo->lastInsertId();
    }

    // Limpar relacionamentos antigos
    $pdo->prepare("DELETE FROM rota_bairros WHERE rota_id = ?")->execute([$id]);
    $pdo->prepare("DELETE FROM rota_dias    WHERE rota_id = ?")->execute([$id]);
    $pdo->prepare("DELETE FROM rota_pontos  WHERE rota_id = ?")->execute([$id]);

    // Inserir novos relacionamentos
    $bairroStmt = $pdo->prepare("INSERT INTO rota_bairros (rota_id, bairro_id) VALUES (?, ?)");
    foreach (($data['bairroIds'] ?? []) as $bairroId) {
        $bairroStmt->execute([$id, (int) $bairroId]);
    }

    $diaStmt = $pdo->prepare("INSERT INTO rota_dias (rota_id, dia) VALUES (?, ?)");
    foreach (($data['dias'] ?? []) as $dia) {
        $diaStmt->execute([$id, $dia]);
    }

    $pontoStmt = $pdo->prepare("INSERT INTO rota_pontos (rota_id, nome, ordem) VALUES (?, ?, ?)");
    foreach (($data['pontos'] ?? []) as $ordem => $ponto) {
        if (trim($ponto) !== '') {
            $pontoStmt->execute([$id, sanitize($ponto), $ordem + 1]);
        }
    }

    $pdo->commit();
    return ['id' => $id];
}

function buscarRelatorios(PDO $pdo): array
{
    return $pdo->query("
        SELECT
            id, titulo, tipo,
            periodo_inicio   AS periodoInicio,
            periodo_fim      AS periodoFim,
            destinatario, conteudo,
            total_rotas      AS totalRotas,
            rotas_ativas     AS rotasAtivas,
            total_motoristas AS totalMotoristas,
            total_caminhoes  AS totalCaminhoes,
            eficiencia_media AS eficienciaMedia,
            status,
            criado_em        AS criadoEm,
            enviado_em       AS enviadoEm
        FROM relatorios
        ORDER BY criado_em DESC, id DESC
    ")->fetchAll();
}

// =========================================================
// Roteamento
// =========================================================

$acao = filter_input(INPUT_GET, 'acao', FILTER_SANITIZE_SPECIAL_CHARS) ?? 'dados';

try {
    switch ($acao) {

        case 'dados':
            echo json_encode([
                'bairros'    => $pdo->query("
                    SELECT b.id, b.nome, r.nome AS zona, false AS checked
                    FROM bairros b
                    LEFT JOIN regioes r ON r.id = b.regiao_id
                    WHERE b.ativo = 1
                    ORDER BY r.id, b.nome
                ")->fetchAll(),
                'caminhoes'  => $pdo->query("SELECT id, placa, tipo, status FROM caminhoes ORDER BY id")->fetchAll(),
                'motoristas' => $pdo->query("SELECT id, nome, email, telefone, veiculo_id AS veiculo, status, observacao FROM motoristas ORDER BY id")->fetchAll(),
                'rotas'      => buscarRotas($pdo),
                'relatorios' => buscarRelatorios($pdo),
            ]);
            break;

        case 'salvar_motorista':
            $data = bodyJson();
            if (!empty($data['id'])) {
                $stmt = $pdo->prepare("UPDATE motoristas SET nome = ?, email = ?, telefone = ?, veiculo_id = ?, status = ?, observacao = ? WHERE id = ?");
                $stmt->execute([
                    sanitize($data['nome']),
                    sanitize($data['email']),
                    sanitize($data['telefone']),
                    $data['veiculo'] ?: null,
                    $data['status'],
                    sanitize($data['observacao'] ?? null),
                    (int) $data['id']
                ]);
                echo json_encode(['id' => (int) $data['id']]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO motoristas (nome, email, telefone, veiculo_id, status, observacao) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    sanitize($data['nome']),
                    sanitize($data['email']),
                    sanitize($data['telefone']),
                    $data['veiculo'] ?: null,
                    $data['status'],
                    sanitize($data['observacao'] ?? null)
                ]);
                echo json_encode(['id' => (int) $pdo->lastInsertId()]);
            }
            break;

        case 'excluir_motorista':
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id) { http_response_code(400); echo json_encode(['erro' => 'ID inválido']); break; }
            $pdo->prepare("DELETE FROM motoristas WHERE id = ?")->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        case 'salvar_rota':
            echo json_encode(salvarRota($pdo, bodyJson()));
            break;

        case 'excluir_rota':
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id) { http_response_code(400); echo json_encode(['erro' => 'ID inválido']); break; }
            $pdo->prepare("DELETE FROM rotas WHERE id = ?")->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        case 'salvar_relatorio':
            $data = bodyJson();
            $stmt = $pdo->prepare("
                INSERT INTO relatorios
                (titulo, tipo, periodo_inicio, periodo_fim, destinatario, conteudo, total_rotas, rotas_ativas, total_motoristas, total_caminhoes, eficiencia_media, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'salvo')
            ");
            $stmt->execute([
                sanitize($data['titulo']),
                $data['tipo'] ?? 'geral',
                $data['periodoInicio'] ?: null,
                $data['periodoFim'] ?: null,
                sanitize($data['destinatario'] ?: null),
                $data['conteudo'],
                (int) ($data['totalRotas'] ?? 0),
                (int) ($data['rotasAtivas'] ?? 0),
                (int) ($data['totalMotoristas'] ?? 0),
                (int) ($data['totalCaminhoes'] ?? 0),
                (float) ($data['eficienciaMedia'] ?? 0),
            ]);
            echo json_encode(['id' => (int) $pdo->lastInsertId()]);
            break;

        case 'excluir_relatorio':
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id) { http_response_code(400); echo json_encode(['erro' => 'ID inválido']); break; }
            $pdo->prepare("DELETE FROM relatorios WHERE id = ?")->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        case 'enviar_relatorio':
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
            if (!$id) { http_response_code(400); echo json_encode(['erro' => 'ID inválido']); break; }
            $pdo->prepare("UPDATE relatorios SET status = 'enviado', enviado_em = NOW() WHERE id = ?")->execute([$id]);
            echo json_encode(['ok' => true]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['erro' => 'Ação não encontrada.']);
    }

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao processar a requisição.']);
}
