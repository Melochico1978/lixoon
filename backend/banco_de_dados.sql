CREATE DATABASE IF NOT EXISTS lixoon
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE lixoon;

CREATE TABLE bairros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  zona VARCHAR(50) NOT NULL
);

CREATE TABLE caminhoes (
  id VARCHAR(20) PRIMARY KEY,
  placa VARCHAR(20) NOT NULL UNIQUE,
  tipo VARCHAR(80) NOT NULL,
  status ENUM('disponivel', 'em_manutencao', 'em_rota', 'inativo') NOT NULL DEFAULT 'disponivel'
);

CREATE TABLE motoristas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  telefone VARCHAR(30),
  veiculo_id VARCHAR(20),
  status ENUM('ativo', 'inativo', 'ferias', 'manutencao') NOT NULL DEFAULT 'ativo',
  observacao VARCHAR(255),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_motoristas_caminhoes
    FOREIGN KEY (veiculo_id) REFERENCES caminhoes(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE rotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  caminhao_id VARCHAR(20),
  motorista_id INT,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  tipo ENUM('domiciliar', 'reciclavel', 'volumoso', 'especial') NOT NULL,
  frequencia ENUM('diaria', 'semanal', 'quinzenal', 'mensal') NOT NULL DEFAULT 'semanal',
  status ENUM('ativa', 'inativa') NOT NULL DEFAULT 'ativa',
  observacoes TEXT,
  eficiencia TINYINT UNSIGNED DEFAULT 0,
  criado_em DATE NOT NULL,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rotas_caminhoes
    FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_rotas_motoristas
    FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT chk_rotas_eficiencia CHECK (eficiencia BETWEEN 0 AND 100)
);

CREATE TABLE rota_bairros (
  rota_id INT NOT NULL,
  bairro_id INT NOT NULL,
  PRIMARY KEY (rota_id, bairro_id),
  CONSTRAINT fk_rota_bairros_rotas
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_rota_bairros_bairros
    FOREIGN KEY (bairro_id) REFERENCES bairros(id)
    ON DELETE CASCADE
);

CREATE TABLE rota_dias (
  rota_id INT NOT NULL,
  dia ENUM('seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom') NOT NULL,
  PRIMARY KEY (rota_id, dia),
  CONSTRAINT fk_rota_dias_rotas
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
    ON DELETE CASCADE
);

CREATE TABLE rota_pontos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rota_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  ordem INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_rota_pontos_rotas
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
    ON DELETE CASCADE
);

CREATE TABLE relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  tipo ENUM('geral', 'rotas', 'motoristas', 'coleta') NOT NULL DEFAULT 'geral',
  periodo_inicio DATE,
  periodo_fim DATE,
  destinatario VARCHAR(150),
  conteudo TEXT NOT NULL,
  total_rotas INT NOT NULL DEFAULT 0,
  rotas_ativas INT NOT NULL DEFAULT 0,
  total_motoristas INT NOT NULL DEFAULT 0,
  total_caminhoes INT NOT NULL DEFAULT 0,
  eficiencia_media DECIMAL(5,2) NOT NULL DEFAULT 0,
  status ENUM('salvo', 'enviado') NOT NULL DEFAULT 'salvo',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  enviado_em TIMESTAMP NULL DEFAULT NULL
);

INSERT INTO bairros (id, nome, zona) VALUES
(1, 'Centro', 'Central'),
(2, 'Sao Sebastiao', 'Norte'),
(3, 'Santa Rosa', 'Sul'),
(4, 'Esplanada', 'Sul'),
(5, 'Jardim Belvedere', 'Leste'),
(6, 'Niteroi', 'Leste'),
(7, 'Sao Luiz', 'Oeste'),
(8, 'Cidade Jardim', 'Oeste'),
(9, 'Eldorado', 'Norte'),
(10, 'Danilo Passos', 'Norte'),
(11, 'Bom Pastor', 'Leste'),
(12, 'Alto Sao Paulo', 'Leste'),
(13, 'Interlagos', 'Oeste'),
(14, 'Manoel Valinhas', 'Oeste'),
(15, 'Padre Liberio', 'Norte'),
(16, 'Sagrada Familia', 'Norte'),
(17, 'Mangabeiras', 'Sul'),
(18, 'Jardinopolis', 'Sul'),
(19, 'Vila Romana', 'Leste'),
(20, 'Catalao', 'Oeste');

INSERT INTO caminhoes (id, placa, tipo, status) VALUES
('CAM-001', 'DIV-1234', 'Compactor 15m3', 'disponivel'),
('CAM-002', 'DIV-5678', 'Compactor 20m3', 'disponivel'),
('CAM-003', 'DIV-9012', 'Basculante 10m3', 'disponivel'),
('CAM-004', 'DIV-3456', 'Compactor 15m3', 'disponivel'),
('CAM-005', 'DIV-7890', 'Compactor 15m3', 'em_manutencao'),
('CAM-006', 'DIV-2468', 'Basculante 10m3', 'disponivel'),
('CAM-007', 'DIV-1357', 'Compactor 20m3', 'disponivel'),
('CAM-008', 'DIV-8642', 'Compactor 15m3', 'disponivel');

INSERT INTO motoristas (id, nome, email, telefone, veiculo_id, status, observacao) VALUES
(1, 'Joao Silva', 'joao@coletadivinopolis.com.br', '(37) 99999-1111', 'CAM-001', 'ativo', NULL),
(2, 'Maria Santos', 'maria@coletadivinopolis.com.br', '(37) 99999-2222', 'CAM-002', 'ativo', NULL),
(3, 'Carlos Oliveira', 'carlos@coletadivinopolis.com.br', '(37) 99999-3333', 'CAM-003', 'ferias', NULL),
(4, 'Ana Costa', 'ana@coletadivinopolis.com.br', '(37) 99999-4444', 'CAM-004', 'ativo', NULL),
(5, 'Pedro Martins', 'pedro@coletadivinopolis.com.br', '(37) 99999-5555', 'CAM-005', 'ativo', NULL),
(6, 'Beatriz Lima', 'beatriz@coletadivinopolis.com.br', '(37) 99999-6666', 'CAM-006', 'ativo', NULL),
(7, 'Ricardo Souza', 'ricardo@coletadivinopolis.com.br', '(37) 99999-7777', 'CAM-007', 'manutencao', NULL),
(8, 'Fernanda Alves', 'fernanda@coletadivinopolis.com.br', '(37) 99999-8888', 'CAM-008', 'ativo', NULL);

INSERT INTO rotas
(id, nome, caminhao_id, motorista_id, horario_inicio, horario_fim, tipo, frequencia, status, observacoes, eficiencia, criado_em)
VALUES
(1, 'Rota Centro - Zona Sul', 'CAM-001', 1, '06:00:00', '10:00:00', 'domiciliar', 'semanal', 'ativa', 'Evitar ruas estreitas apos as 08:00', 92, '2024-01-15'),
(2, 'Rota Zona Norte', 'CAM-002', 2, '07:30:00', '12:00:00', 'reciclavel', 'semanal', 'ativa', 'Coleta seletiva - atencao aos materiais', 85, '2024-01-10'),
(3, 'Rota Zona Leste', 'CAM-003', 4, '08:00:00', '14:00:00', 'domiciliar', 'diaria', 'ativa', 'Grande volume as segundas-feiras', 78, '2024-01-05'),
(4, 'Rota Volumosos - Fim de Semana', 'CAM-004', 5, '09:00:00', '15:00:00', 'volumoso', 'semanal', 'ativa', 'Apenas moveis e eletrodomesticos', 65, '2024-01-20'),
(5, 'Rota Especial - Centro Historico', 'CAM-006', 6, '22:00:00', '02:00:00', 'especial', 'semanal', 'inativa', 'Coleta noturna - centro fechado durante o dia', 95, '2024-01-25');

INSERT INTO rota_bairros (rota_id, bairro_id) VALUES
(1, 1), (1, 3), (1, 4),
(2, 2), (2, 9), (2, 10),
(3, 5), (3, 6), (3, 11),
(4, 7), (4, 8), (4, 13),
(5, 1);

INSERT INTO rota_dias (rota_id, dia) VALUES
(1, 'seg'), (1, 'qua'), (1, 'sex'),
(2, 'ter'), (2, 'qui'),
(3, 'seg'), (3, 'ter'), (3, 'qua'), (3, 'qui'), (3, 'sex'),
(4, 'sab'),
(5, 'qua');

INSERT INTO rota_pontos (rota_id, nome, ordem) VALUES
(1, 'Praca do Santuario', 1),
(1, 'Av. Getulio Vargas', 2),
(1, 'Rua Sao Paulo', 3),
(2, 'Av. Para', 1),
(2, 'Rua Amazonas', 2),
(2, 'Praca da Liberdade', 3),
(3, 'Av. Antonio Olimpio', 1),
(3, 'Rua Goias', 2),
(3, 'Praca do Belvedere', 3),
(4, 'Av. Faria Tavares', 1),
(4, 'Rua das Flores', 2),
(4, 'Cond. Jardins', 3),
(5, 'Praca da Catedral', 1),
(5, 'Rua Coronel Joao Notini', 2),
(5, 'Mercado Municipal', 3);

CREATE VIEW vw_rotas_completas AS
SELECT
  r.id,
  r.nome,
  r.tipo,
  r.frequencia,
  r.status,
  r.horario_inicio,
  r.horario_fim,
  c.id AS caminhao,
  c.placa,
  m.nome AS motorista,
  GROUP_CONCAT(DISTINCT b.nome ORDER BY b.nome SEPARATOR ', ') AS bairros,
  GROUP_CONCAT(DISTINCT rd.dia ORDER BY FIELD(rd.dia, 'seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom') SEPARATOR ', ') AS dias,
  r.eficiencia
FROM rotas r
LEFT JOIN caminhoes c ON c.id = r.caminhao_id
LEFT JOIN motoristas m ON m.id = r.motorista_id
LEFT JOIN rota_bairros rb ON rb.rota_id = r.id
LEFT JOIN bairros b ON b.id = rb.bairro_id
LEFT JOIN rota_dias rd ON rd.rota_id = r.id
GROUP BY r.id, r.nome, r.tipo, r.frequencia, r.status, r.horario_inicio, r.horario_fim, c.id, c.placa, m.nome, r.eficiencia;
