<?php
require_once 'config.php';
require_once 'auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // Em produção, restrinja para o seu domínio (ex: http://localhost)
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$pdo = getDBConnection();

// Roteamento
$acao = $_GET['acao'] ?? 'dados';

// Rotas Públicas (Não exigem autenticação)
if ($acao === 'login') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    
    $email = $data['email'] ?? '';
    $senha = $data['senha'] ?? '';
    
    $stmt = $pdo->prepare("SELECT id, nome, senha FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($senha, $user['senha'])) {
        $token = generateJWT(['id' => $user['id'], 'nome' => $user['nome']]);
        echo json_encode(['token' => $token, 'nome' => $user['nome']]);
    } else {
        http_response_code(401);
        echo json_encode(['erro' => 'Credenciais inválidas.']);
    }
    exit;
}

// ==============================================
// MIDDLEWARE DE AUTENTICAÇÃO
// A partir daqui, todas as rotas exigem Login
// ==============================================
$usuario_logado = requireAuth();

// ==============================================
// FUNÇÕES AUXILIARES
// ==============================================
function bodyJson(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

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
    $diasStmt = $pdo->prepare("SELECT dia FROM rota_dias WHERE rota_id = ? ORDER BY FIELD(dia, 'seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom')");
    $pontosStmt = $pdo->prepare("SELECT nome FROM rota_pontos WHERE rota_id = ? ORDER BY ordem, id");

    return array_map(function ($rota) use ($bairrosStmt, $diasStmt, $pontosStmt) {
        $bairrosStmt->execute([$rota['id']]);
        $bairros = $bairrosStmt->fetchAll();
        $diasStmt->execute([$rota['id']]);
        $pontosStmt->execute([$rota['id']]);

        return [
            'id' => (int) $rota['id'],
            'nome' => $rota['nome'],
            'bairros' => array_column($bairros, 'nome'),
            'bairroIds' => array_map('intval', array_column($bairros, 'id')),
            'caminhao' => $rota['caminhao_id'],
            'motoristaId' => $rota['motorista_id'] ? (int) $rota['motorista_id'] : null,
            'motorista' => $rota['motorista_nome'] ?: '',
            'dias' => array_column($diasStmt->fetchAll(), 'dia'),
            'horarioInicio' => substr($rota['horario_inicio'], 0, 5),
            'horarioFim' => substr($rota['horario_fim'], 0, 5),
            'tipo' => $rota['tipo'],
            'frequencia' => $rota['frequencia'],
            'status' => $rota['status'],
            'pontos' => array_column($pontosStmt->fetchAll(), 'nome'),
            'observacoes' => $rota['observacoes'],
            'createdAt' => $rota['criado_em'],
            'eficiencia' => (int) $rota['eficiencia'],
        ];
    }, $rotas);
}

function salvarRota(PDO $pdo, array $data): array
{
    $pdo->beginTransaction();

    $id = !empty($data['id']) ? (int) $data['id'] : null;
    $params = [
        ':nome' => $data['nome'] ?? '',
        ':caminhao_id' => $data['caminhao'] ?: null,
        ':motorista_id' => $data['motoristaId'] ?: null,
        ':horario_inicio' => $data['horarioInicio'] ?? '00:00',
        ':horario_fim' => $data['horarioFim'] ?? '00:00',
        ':tipo' => $data['tipo'] ?? 'domiciliar',
        ':frequencia' => $data['frequencia'] ?? 'semanal',
        ':status' => $data['status'] ?? 'ativa',
        ':observacoes' => $data['observacoes'] ?? null,
        ':eficiencia' => $data['eficiencia'] ?? random_int(70, 99),
        ':criado_em' => $data['createdAt'] ?? date('Y-m-d'),
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

    $pdo->prepare("DELETE FROM rota_bairros WHERE rota_id = ?")->execute([$id]);
    $pdo->prepare("DELETE FROM rota_dias WHERE rota_id = ?")->execute([$id]);
    $pdo->prepare("DELETE FROM rota_pontos WHERE rota_id = ?")->execute([$id]);

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
            $pontoStmt->execute([$id, $ponto, $ordem + 1]);
        }
    }

    $pdo->commit();
    return ['id' => $id];
}

function buscarRelatorios(PDO $pdo): array
{
    return $pdo->query("
        SELECT
            id, titulo, tipo, periodo_inicio AS periodoInicio, periodo_fim AS periodoFim,
            destinatario, conteudo, total_rotas AS totalRotas, rotas_ativas AS rotasAtivas,
            total_motoristas AS totalMotoristas, total_caminhoes AS totalCaminhoes,
            eficiencia_media AS eficienciaMedia, status, criado_em AS criadoEm, enviado_em AS enviadoEm
        FROM relatorios
        ORDER BY criado_em DESC, id DESC
    ")->fetchAll();
}

// ==============================================
// ROTAS PROTEGIDAS
// ==============================================
try {
    if ($acao === 'dados') {
        echo json_encode([
            'bairros' => $pdo->query("SELECT id, nome, zona, false AS checked FROM bairros ORDER BY id")->fetchAll(),
            'caminhoes' => $pdo->query("SELECT id, placa, tipo, status FROM caminhoes ORDER BY id")->fetchAll(),
            'motoristas' => $pdo->query("SELECT id, nome, email, telefone, veiculo_id AS veiculo, status, observacao FROM motoristas ORDER BY id")->fetchAll(),
            'rotas' => buscarRotas($pdo),
            'relatorios' => buscarRelatorios($pdo),
        ]);
        exit;
    }

    if ($acao === 'salvar_motorista') {
        $data = bodyJson();
        if (!empty($data['id'])) {
            $stmt = $pdo->prepare("UPDATE motoristas SET nome = ?, email = ?, telefone = ?, veiculo_id = ?, status = ?, observacao = ? WHERE id = ?");
            $stmt->execute([$data['nome'], $data['email'], $data['telefone'], $data['veiculo'] ?: null, $data['status'], $data['observacao'] ?? null, (int) $data['id']]);
            echo json_encode(['id' => (int) $data['id']]);
        } else {
            $stmt = $pdo->prepare("INSERT INTO motoristas (nome, email, telefone, veiculo_id, status, observacao) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$data['nome'], $data['email'], $data['telefone'], $data['veiculo'] ?: null, $data['status'], $data['observacao'] ?? null]);
            echo json_encode(['id' => (int) $pdo->lastInsertId()]);
        }
        exit;
    }

    if ($acao === 'excluir_motorista') {
        $id = (int) ($_GET['id'] ?? 0);
        $pdo->prepare("DELETE FROM motoristas WHERE id = ?")->execute([$id]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($acao === 'salvar_rota') {
        echo json_encode(salvarRota($pdo, bodyJson()));
        exit;
    }

    if ($acao === 'excluir_rota') {
        $id = (int) ($_GET['id'] ?? 0);
        $pdo->prepare("DELETE FROM rotas WHERE id = ?")->execute([$id]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($acao === 'salvar_relatorio') {
        $data = bodyJson();
        $stmt = $pdo->prepare("
            INSERT INTO relatorios
            (titulo, tipo, periodo_inicio, periodo_fim, destinatario, conteudo, total_rotas, rotas_ativas, total_motoristas, total_caminhoes, eficiencia_media, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'salvo')
        ");
        $stmt->execute([
            $data['titulo'],
            $data['tipo'] ?? 'geral',
            $data['periodoInicio'] ?: null,
            $data['periodoFim'] ?: null,
            $data['destinatario'] ?: null,
            $data['conteudo'],
            (int) ($data['totalRotas'] ?? 0),
            (int) ($data['rotasAtivas'] ?? 0),
            (int) ($data['totalMotoristas'] ?? 0),
            (int) ($data['totalCaminhoes'] ?? 0),
            (float) ($data['eficienciaMedia'] ?? 0),
        ]);
        echo json_encode(['id' => (int) $pdo->lastInsertId()]);
        exit;
    }

    if ($acao === 'excluir_relatorio') {
        $id = (int) ($_GET['id'] ?? 0);
        $pdo->prepare("DELETE FROM relatorios WHERE id = ?")->execute([$id]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($acao === 'enviar_relatorio') {
        $id = (int) ($_GET['id'] ?? 0);
        $stmt = $pdo->prepare("UPDATE relatorios SET status = 'enviado', enviado_em = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(404);
    echo json_encode(['erro' => 'Acao nao encontrada.']);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao processar a requisicao.']);
}
