-- =========================================================
-- LixoOn - Sistema de Coleta Inteligente
-- Banco de Dados MySQL / MariaDB
-- Divinópolis/MG
-- =========================================================

CREATE DATABASE IF NOT EXISTS lixoon
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE lixoon;

-- =========================================================
-- TABELAS ESTRUTURAIS
-- =========================================================

-- Regiões oficiais da cidade
CREATE TABLE regioes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao TEXT,
  ativa BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Bairros de Divinópolis (vinculados a regiões)
CREATE TABLE bairros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  regiao_id INT NOT NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  populacao_estimada INT UNSIGNED NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bairros_regioes
    FOREIGN KEY (regiao_id) REFERENCES regioes(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_bairros_regiao (regiao_id),
  INDEX idx_bairros_nome (nome)
) ENGINE=InnoDB;

-- =========================================================
-- TABELAS OPERACIONAIS
-- =========================================================

-- Frota de caminhões
CREATE TABLE caminhoes (
  id VARCHAR(20) PRIMARY KEY,
  placa VARCHAR(20) NOT NULL UNIQUE,
  tipo VARCHAR(80) NOT NULL,
  capacidade_m3 DECIMAL(5,1) NULL COMMENT 'Capacidade em metros cúbicos',
  ano_fabricacao YEAR NULL,
  km_atual INT UNSIGNED DEFAULT 0,
  status ENUM('disponivel', 'em_manutencao', 'em_rota', 'inativo') NOT NULL DEFAULT 'disponivel',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_caminhoes_status (status)
) ENGINE=InnoDB;

-- Motoristas
CREATE TABLE motoristas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  cpf VARCHAR(14) NULL UNIQUE COMMENT 'CPF formatado: 000.000.000-00',
  cnh VARCHAR(20) NULL UNIQUE COMMENT 'Número da CNH',
  cnh_categoria ENUM('B', 'C', 'D', 'E') NULL DEFAULT 'D',
  cnh_validade DATE NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  telefone VARCHAR(30),
  veiculo_id VARCHAR(20),
  status ENUM('ativo', 'inativo', 'ferias', 'manutencao') NOT NULL DEFAULT 'ativo',
  observacao VARCHAR(255),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_motoristas_caminhoes
    FOREIGN KEY (veiculo_id) REFERENCES caminhoes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_motoristas_status (status),
  INDEX idx_motoristas_nome (nome)
) ENGINE=InnoDB;

-- Rotas de coleta
CREATE TABLE rotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  caminhao_id VARCHAR(20),
  motorista_id INT,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  tipo ENUM('domiciliar', 'reciclavel', 'volumoso', 'especial') NOT NULL,
  frequencia ENUM('diaria', 'semanal', 'quinzenal', 'mensal') NOT NULL DEFAULT 'semanal',
  status ENUM('ativa', 'inativa', 'suspensa') NOT NULL DEFAULT 'ativa',
  distancia_km DECIMAL(6,2) NULL COMMENT 'Distância total estimada em km',
  observacoes TEXT,
  eficiencia TINYINT UNSIGNED DEFAULT 0,
  criado_em DATE NOT NULL,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rotas_caminhoes
    FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_rotas_motoristas
    FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_rotas_eficiencia CHECK (eficiencia BETWEEN 0 AND 100),
  INDEX idx_rotas_status (status),
  INDEX idx_rotas_tipo (tipo)
) ENGINE=InnoDB;

-- =========================================================
-- TABELAS DE RELACIONAMENTO (N:N)
-- =========================================================

-- Bairros de cada rota
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
) ENGINE=InnoDB;

-- Dias de operação de cada rota
CREATE TABLE rota_dias (
  rota_id INT NOT NULL,
  dia ENUM('seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom') NOT NULL,
  PRIMARY KEY (rota_id, dia),
  CONSTRAINT fk_rota_dias_rotas
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Pontos de coleta específicos de cada rota
CREATE TABLE rota_pontos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rota_id INT NOT NULL,
  nome VARCHAR(150) NOT NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  ordem INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_rota_pontos_rotas
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
    ON DELETE CASCADE,
  INDEX idx_rota_pontos_rota (rota_id)
) ENGINE=InnoDB;

-- =========================================================
-- TABELAS DE HISTÓRICO E RELATÓRIOS
-- =========================================================

-- Histórico de coletas realizadas
CREATE TABLE historico_coletas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  rota_id INT NOT NULL,
  motorista_id INT NULL,
  caminhao_id VARCHAR(20) NULL,
  data_coleta DATE NOT NULL,
  horario_saida TIME NULL,
  horario_chegada TIME NULL,
  peso_coletado_kg DECIMAL(8,2) NULL COMMENT 'Peso total coletado em kg',
  distancia_percorrida_km DECIMAL(6,2) NULL,
  ocorrencias TEXT NULL COMMENT 'Problemas ou observações da coleta',
  status ENUM('concluida', 'parcial', 'cancelada') NOT NULL DEFAULT 'concluida',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_historico_rotas
    FOREIGN KEY (rota_id) REFERENCES rotas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_historico_motoristas
    FOREIGN KEY (motorista_id) REFERENCES motoristas(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_historico_caminhoes
    FOREIGN KEY (caminhao_id) REFERENCES caminhoes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_historico_data (data_coleta),
  INDEX idx_historico_rota (rota_id)
) ENGINE=InnoDB;

-- Relatórios gerados
CREATE TABLE relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  tipo ENUM('geral', 'rotas', 'motoristas', 'coleta', 'eficiencia') NOT NULL DEFAULT 'geral',
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
  enviado_em TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_relatorios_tipo (tipo),
  INDEX idx_relatorios_data (criado_em)
) ENGINE=InnoDB;

-- Agendamentos de coleta especial (cidadão)
CREATE TABLE agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_solicitante VARCHAR(120) NOT NULL,
  telefone VARCHAR(30) NOT NULL,
  bairro_id INT NOT NULL,
  endereco VARCHAR(200) NOT NULL,
  tipo_residuo ENUM('volumoso', 'reciclavel', 'organico', 'eletronico', 'entulho') NOT NULL,
  horario_preferencial VARCHAR(50) NULL,
  observacoes TEXT NULL,
  status ENUM('pendente', 'agendado', 'concluido', 'cancelado') NOT NULL DEFAULT 'pendente',
  data_agendamento DATE NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_agendamentos_bairros
    FOREIGN KEY (bairro_id) REFERENCES bairros(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_agendamentos_status (status),
  INDEX idx_agendamentos_data (data_agendamento)
) ENGINE=InnoDB;

-- =========================================================
-- DADOS INICIAIS: REGIÕES
-- =========================================================

INSERT INTO regioes (id, nome, descricao) VALUES
(1, 'Central',         'Coração comercial, financeiro e administrativo da cidade'),
(2, 'Sudeste',         'Uma das regiões mais populosas, abriga o Aeroporto Brigadeiro Cabral e a UPA Padre Roberto'),
(3, 'Nordeste',        'Zona de relevância industrial e residencial, com o Distrito Industrial e o Hospital São João de Deus'),
(4, 'Sudoeste',        'Área de expansão urbana recente, com campi universitários (UEMG, UFSJ, CEFET-MG) e o Hospital Municipal'),
(5, 'Oeste/Noroeste',  'Região contígua ao centro estendido, com forte presença residencial');

-- =========================================================
-- DADOS INICIAIS: BAIRROS (66 bairros oficiais)
-- =========================================================

-- Região Central (6 bairros)
INSERT INTO bairros (id, nome, regiao_id) VALUES
(1,  'Centro',                  1),
(2,  'Esplanada',               1),
(3,  'Vila Operária',           1),
(4,  'Dom Pedro II',            1),
(5,  'Francisco Machado Filho', 1),
(6,  'Sidil',                   1);

-- Região Sudeste (23 bairros)
INSERT INTO bairros (id, nome, regiao_id) VALUES
(7,  'Aeroporto',               2),
(8,  'Alvorada',                2),
(9,  'Antônio Fonseca',         2),
(10, 'Bom Pastor',              2),
(11, 'Candelária',              2),
(12, 'Dom Cristiano',           2),
(13, 'Dona Quita',              2),
(14, 'Interlagos',              2),
(15, 'Jardim das Oliveiras',    2),
(16, 'Jusa Fonseca',            2),
(17, 'Liberdade',               2),
(18, 'Mangabeiras',             2),
(19, 'Maria Helena',            2),
(20, 'Morro das Antenas',       2),
(21, 'Nações',                  2),
(22, 'Novo Paraíso',            2),
(23, 'Nossa Sra. das Graças',   2),
(24, 'Padre Libério',           2),
(25, 'Paraíso',                 2),
(26, 'Porto Velho',             2),
(27, 'Sagrada Família',         2),
(28, 'Santa Rosa',              2),
(29, 'Santa Tereza',            2);

-- Região Nordeste (11 bairros)
INSERT INTO bairros (id, nome, regiao_id) VALUES
(30, 'Bairro do Carmo',                    3),
(31, 'Cidade Industrial Jovelino Rabelo',   3),
(32, 'Danilo Passos',                       3),
(33, 'Distrito Industrial Jovelino Rabelo', 3),
(34, 'Dr. José Tomaz',                      3),
(35, 'Icaraí',                              3),
(36, 'Manoel Valinhas',                     3),
(37, 'Niterói',                             3),
(38, 'Prolongamento Espírito Santo',        3),
(39, 'São João de Deus',                    3),
(40, 'Vila Romana',                         3);

-- Região Sudoeste (16 bairros)
INSERT INTO bairros (id, nome, regiao_id) VALUES
(41, 'Anchieta',                             4),
(42, 'Belvedere',                            4),
(43, 'Campina Verde',                        4),
(44, 'Catalão',                              4),
(45, 'Conj. Hab. Oswaldo Machado Gontijo',   4),
(46, 'Conj. Hab. Serra Verde',               4),
(47, 'Nova Fortaleza I',                     4),
(48, 'Nova Fortaleza II',                    4),
(49, 'Orion',                                4),
(50, 'Planalto',                             4),
(51, 'Santa Luzia',                          4),
(52, 'São José',                             4),
(53, 'São Judas Tadeu',                      4),
(54, 'São Miguel',                           4),
(55, 'Serra Verde',                          4),
(56, 'Tietê',                                4);

-- Região Oeste / Noroeste (10 bairros)
INSERT INTO bairros (id, nome, regiao_id) VALUES
(57, 'Afonso Pena',          5),
(58, 'Belo Vale',            5),
(59, 'Ipiranga',             5),
(60, 'Jardim Brasília',      5),
(61, 'Jardim Nova América',  5),
(62, 'Rancho Alegre',        5),
(63, 'São Roque',            5),
(64, 'São Sebastião',        5),
(65, 'Vila Belo Horizonte',  5),
(66, 'Vila Santo Antônio',   5);

-- =========================================================
-- DADOS INICIAIS: FROTA
-- =========================================================

INSERT INTO caminhoes (id, placa, tipo, capacidade_m3, ano_fabricacao, status) VALUES
('CAM-001', 'DIV-1234', 'Compactador 15m³',  15.0, 2021, 'disponivel'),
('CAM-002', 'DIV-5678', 'Compactador 20m³',  20.0, 2022, 'disponivel'),
('CAM-003', 'DIV-9012', 'Basculante 10m³',   10.0, 2020, 'disponivel'),
('CAM-004', 'DIV-3456', 'Compactador 15m³',  15.0, 2021, 'disponivel'),
('CAM-005', 'DIV-7890', 'Compactador 15m³',  15.0, 2019, 'em_manutencao'),
('CAM-006', 'DIV-2468', 'Basculante 10m³',   10.0, 2023, 'disponivel'),
('CAM-007', 'DIV-1357', 'Compactador 20m³',  20.0, 2022, 'disponivel'),
('CAM-008', 'DIV-8642', 'Compactador 15m³',  15.0, 2023, 'disponivel');

-- =========================================================
-- DADOS INICIAIS: MOTORISTAS
-- =========================================================

INSERT INTO motoristas (id, nome, cnh_categoria, email, telefone, veiculo_id, status) VALUES
(1, 'João Silva',       'D', 'joao@coletadivinopolis.com.br',     '(37) 99999-1111', 'CAM-001', 'ativo'),
(2, 'Maria Santos',     'D', 'maria@coletadivinopolis.com.br',    '(37) 99999-2222', 'CAM-002', 'ativo'),
(3, 'Carlos Oliveira',  'D', 'carlos@coletadivinopolis.com.br',   '(37) 99999-3333', 'CAM-003', 'ferias'),
(4, 'Ana Costa',        'D', 'ana@coletadivinopolis.com.br',      '(37) 99999-4444', 'CAM-004', 'ativo'),
(5, 'Pedro Martins',    'D', 'pedro@coletadivinopolis.com.br',    '(37) 99999-5555', 'CAM-005', 'ativo'),
(6, 'Beatriz Lima',     'D', 'beatriz@coletadivinopolis.com.br',  '(37) 99999-6666', 'CAM-006', 'ativo'),
(7, 'Ricardo Souza',    'D', 'ricardo@coletadivinopolis.com.br',  '(37) 99999-7777', 'CAM-007', 'manutencao'),
(8, 'Fernanda Alves',   'D', 'fernanda@coletadivinopolis.com.br', '(37) 99999-8888', 'CAM-008', 'ativo');

-- =========================================================
-- DADOS INICIAIS: ROTAS DE EXEMPLO
-- =========================================================

INSERT INTO rotas
  (id, nome, caminhao_id, motorista_id, horario_inicio, horario_fim, tipo, frequencia, status, observacoes, eficiencia, criado_em)
VALUES
  (1, 'Rota Centro - Região Central',    'CAM-001', 1, '06:00:00', '10:00:00', 'domiciliar', 'semanal',  'ativa',   'Evitar ruas estreitas após as 08:00',               92, '2024-01-15'),
  (2, 'Rota Nordeste',                   'CAM-002', 2, '07:30:00', '12:00:00', 'reciclavel', 'semanal',  'ativa',   'Coleta seletiva - atenção aos materiais',            85, '2024-01-10'),
  (3, 'Rota Sudeste',                    'CAM-003', 4, '08:00:00', '14:00:00', 'domiciliar', 'diaria',   'ativa',   'Grande volume às segundas-feiras',                   78, '2024-01-05'),
  (4, 'Rota Sudoeste - Fim de Semana',   'CAM-004', 5, '09:00:00', '15:00:00', 'volumoso',   'semanal',  'ativa',   'Apenas móveis e eletrodomésticos',                   65, '2024-01-20'),
  (5, 'Rota Especial - Centro Histórico','CAM-006', 6, '22:00:00', '02:00:00', 'especial',   'semanal',  'inativa', 'Coleta noturna - centro fechado durante o dia',      95, '2024-01-25');

-- Rota 1: Centro, Esplanada, Vila Operária
INSERT INTO rota_bairros (rota_id, bairro_id) VALUES
(1, 1), (1, 2), (1, 3);

-- Rota 2: Niterói, Danilo Passos, Manoel Valinhas
INSERT INTO rota_bairros (rota_id, bairro_id) VALUES
(2, 37), (2, 32), (2, 36);

-- Rota 3: Bom Pastor, Mangabeiras, Santa Rosa
INSERT INTO rota_bairros (rota_id, bairro_id) VALUES
(3, 10), (3, 18), (3, 28);

-- Rota 4: Belvedere, Catalão, Planalto
INSERT INTO rota_bairros (rota_id, bairro_id) VALUES
(4, 42), (4, 44), (4, 50);

-- Rota 5: Centro
INSERT INTO rota_bairros (rota_id, bairro_id) VALUES
(5, 1);

INSERT INTO rota_dias (rota_id, dia) VALUES
(1, 'seg'), (1, 'qua'), (1, 'sex'),
(2, 'ter'), (2, 'qui'),
(3, 'seg'), (3, 'ter'), (3, 'qua'), (3, 'qui'), (3, 'sex'),
(4, 'sab'),
(5, 'qua');

INSERT INTO rota_pontos (rota_id, nome, ordem) VALUES
(1, 'Praça do Santuário',         1),
(1, 'Av. Getúlio Vargas',         2),
(1, 'Rua São Paulo',              3),
(2, 'Av. Pará',                   1),
(2, 'Rua Amazonas',               2),
(2, 'Praça da Liberdade',         3),
(3, 'Av. Antônio Olímpio',        1),
(3, 'Rua Goiás',                  2),
(3, 'Praça do Belvedere',         3),
(4, 'Av. Faria Tavares',          1),
(4, 'Rua das Flores',             2),
(4, 'Condomínio Jardins',         3),
(5, 'Praça da Catedral',          1),
(5, 'Rua Cel. João Notini',       2),
(5, 'Mercado Municipal',          3);

-- =========================================================
-- VIEWS ÚTEIS
-- =========================================================

-- Vista completa de rotas com todos os dados agregados
CREATE VIEW vw_rotas_completas AS
SELECT
  r.id,
  r.nome,
  r.tipo,
  r.frequencia,
  r.status,
  r.horario_inicio,
  r.horario_fim,
  c.id       AS caminhao_id,
  c.placa    AS caminhao_placa,
  c.tipo     AS caminhao_tipo,
  m.id       AS motorista_id,
  m.nome     AS motorista_nome,
  m.telefone AS motorista_telefone,
  GROUP_CONCAT(DISTINCT b.nome ORDER BY b.nome SEPARATOR ', ')
    AS bairros,
  GROUP_CONCAT(DISTINCT rd.dia ORDER BY FIELD(rd.dia, 'seg','ter','qua','qui','sex','sab','dom') SEPARATOR ', ')
    AS dias,
  r.eficiencia,
  r.observacoes,
  r.criado_em,
  r.atualizado_em
FROM rotas r
LEFT JOIN caminhoes   c  ON c.id  = r.caminhao_id
LEFT JOIN motoristas  m  ON m.id  = r.motorista_id
LEFT JOIN rota_bairros rb ON rb.rota_id = r.id
LEFT JOIN bairros     b  ON b.id  = rb.bairro_id
LEFT JOIN rota_dias   rd ON rd.rota_id  = r.id
GROUP BY r.id;

-- Resumo de bairros por região
CREATE VIEW vw_bairros_por_regiao AS
SELECT
  reg.nome   AS regiao,
  reg.descricao,
  COUNT(b.id) AS total_bairros,
  GROUP_CONCAT(b.nome ORDER BY b.nome SEPARATOR ', ') AS bairros
FROM regioes reg
LEFT JOIN bairros b ON b.regiao_id = reg.id AND b.ativo = TRUE
GROUP BY reg.id, reg.nome, reg.descricao
ORDER BY reg.id;

-- Dashboard: indicadores rápidos
CREATE VIEW vw_dashboard AS
SELECT
  (SELECT COUNT(*) FROM rotas WHERE status = 'ativa')                AS rotas_ativas,
  (SELECT COUNT(*) FROM rotas WHERE status = 'inativa')              AS rotas_inativas,
  (SELECT COUNT(*) FROM motoristas WHERE status = 'ativo')           AS motoristas_ativos,
  (SELECT COUNT(*) FROM caminhoes WHERE status = 'disponivel')       AS caminhoes_disponiveis,
  (SELECT COUNT(*) FROM caminhoes WHERE status = 'em_manutencao')    AS caminhoes_manutencao,
  (SELECT COUNT(*) FROM bairros WHERE ativo = TRUE)                  AS total_bairros,
  (SELECT ROUND(AVG(eficiencia), 1) FROM rotas WHERE status = 'ativa') AS eficiencia_media;
