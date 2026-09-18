# Guia de Importação de CSV - Motoristas

## Como Importar Motoristas via CSV

### Formato do Arquivo
O arquivo CSV deve conter as seguintes colunas (em qualquer ordem):
- **nome** (obrigatório) - Nome completo do motorista
- **email** (opcional) - Email válido do motorista
- **telefone** (opcional) - Telefone de contato
- **veiculo** (opcional) - ID ou placa do veículo
- **status** (opcional) - Status do motorista (ativo, inativo, ferias, manutencao)
- **observacao** (opcional) - Observações adicionais

### Passos para Importar

1. **Acesse a aba "Motoristas"** no sistema
2. **Clique no botão "Importar CSV"** (ícone de arquivo com seta)
3. **Selecione o arquivo CSV** do seu computador
4. **Aguarde a validação** - O sistema verificará se os dados estão corretos
5. **Confirme a importação** - Se tudo estiver correto, os motoristas serão adicionados

### Validações
O sistema valida automaticamente:
- ✓ Nome deve ter pelo menos 3 caracteres
- ✓ Email deve ser válido (formato: usuario@dominio.com)
- ✓ Status deve ser um dos valores permitidos
- ✓ Cada linha deve conter pelo menos um nome

### Exemplos

#### CSV Mínimo (apenas nome)
```csv
nome
João Silva
Maria Santos
```

#### CSV Completo
```csv
nome,email,telefone,veiculo,status,observacao
João Silva,joao@empresa.com,(37) 98765-4321,Caminhão A,ativo,Motorista experiente
Maria Santos,maria@empresa.com,(37) 99876-5432,Caminhão B,ativo,
```

### Tratamento de Erros
Se houver erros na validação:
- A importação será cancelada
- Uma mensagem indicará qual linha tem problemas
- Corrija o arquivo CSV e tente novamente

### Dicas
- Use separador de vírgula (,) entre os campos
- Se um campo contiver vírgula, coloque-o entre aspas
- Deixe campos em branco se não tiver informações
- Salve o arquivo como .csv ou .txt com separador por vírgula
