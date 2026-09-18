
CREATE TABLE cadastro (
    id          INT PRIMARY KEY IDENTITY(1,1),  
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    telefone    VARCHAR(20),
    status      VARCHAR(20) DEFAULT 'ativo',
    observacao  TEXT,
    criado_em   DATETIME DEFAULT GETDATE()
);

-- Índices para melhorar as performance
CREATE INDEX idx_cadastro_email ON cadastro(email);
CREATE INDEX idx_cadastro_status ON cadastro(status);


-- --------------------------------------------
-- 2. INSERT - Inserir novo registro
-- --------------------------------------------
INSERT INTO cadastro (nome, email, telefone, status, observacao)
VALUES ('Henrique da Silva', 'joao@email.com', '(11) 99999-1111', 'ativo', 'Cliente novo');


-- --------------------------------------------
-- 3. SELECT - Listar todos os registros
-- --------------------------------------------
SELECT id, nome, email, telefone, status, observacao, criado_em
FROM cadastro
ORDER BY id DESC;


-- --------------------------------------------
-- 4. SELECT com filtro (WHERE)
-- --------------------------------------------
-- Por ID
SELECT * FROM cadastro WHERE id = 1;

-- Por status
SELECT * FROM cadastro WHERE status = 'ativo';

-- Por nome (parcial)
SELECT * FROM cadastro WHERE nome LIKE '%Silva%';

-- Por e-mail
SELECT * FROM cadastro WHERE email = 'henrique@email.com';


-- --------------------------------------------
-- 5. UPDATE - Atualizar registro
-- --------------------------------------------
UPDATE cadastro
SET nome = 'Henrique  da Silva',
    email = 'henrique.silva@email.com',
    telefone = '(11) 98888-0000',
    status = 'ativo',
    observacao = 'Atualizado'
WHERE id = 1;


-- --------------------------------------------
-- 6. DELETE - Excluir registro
-- --------------------------------------------
DELETE FROM cadastro WHERE id = 1;


-- --------------------------------------------
-- 7. CONSULTAS ÚTEIS
-- --------------------------------------------
-- Contar registros
SELECT COUNT(*) AS total FROM cadastro;

-- Contar por status
SELECT status, COUNT(*) AS qtd
FROM cadastro
GROUP BY status;

-- Últimos 10 cadastros
SELECT TOP 10 * FROM cadastro ORDER BY criado_em DESC;


-- ============================================
-- CAMINHÕES DE COLETA (Monitoramento em tempo real)
-- ============================================

-- --------------------------------------------
-- 8. CRIAR TABELA CAMINHÕES
-- --------------------------------------------
CREATE TABLE caminhoes (
    id                  INT PRIMARY KEY IDENTITY(1,1),
    placa               VARCHAR(20) NOT NULL UNIQUE,
    motorista           VARCHAR(100) NOT NULL,
    lat                 FLOAT NOT NULL,
    lng                 FLOAT NOT NULL,
    status              VARCHAR(20) DEFAULT 'em_rota',
    rota                VARCHAR(100),
    ultima_atualizacao  DATETIME DEFAULT GETDATE()
);

CREATE INDEX idx_caminhoes_status ON caminhoes(status);


-- --------------------------------------------
-- 9. INSERT - Cadastrar caminhão
-- --------------------------------------------
INSERT INTO caminhoes (placa, motorista, lat, lng, status, rota)
VALUES ('ABC-1A23', 'Carlos Souza', -23.5505, -46.6333, 'em_rota', 'Zona Norte');


-- --------------------------------------------
-- 10. UPDATE - Atualizar posição (GPS em tempo real)
-- --------------------------------------------
UPDATE caminhoes
SET lat = -23.5510, lng = -46.6340, ultima_atualizacao = CURRENT_TIMESTAMP
WHERE id = 1;


-- --------------------------------------------
-- 11. SELECT - Caminhões em rota
-- --------------------------------------------
SELECT id, placa, motorista, lat, lng, status, rota, ultima_atualizacao
FROM caminhoes
WHERE status = 'em_rota'
ORDER BY placa;
