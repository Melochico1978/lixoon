/**
 * Sistema de Cadastro - HTML + JavaScript + SQL
 * Usa SQL.js (SQLite no navegador) para executar queries SQL
 * Mapa de monitoramento em tempo real dos caminhões de coleta
 */

let db = null;
let editandoId = null;
let map = null;
let truckMarkers = {};
let mapUpdateInterval = null;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  carregarLista();
  configurarFormulario();
  initMap();
  initCaminhoes();
  startMapUpdates();
});

async function initDB() {
  try {
    const SQL = await initSqlJs({
      locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
    });
    db = new SQL.Database();

    // Executa o schema SQL (CREATE TABLE)
    db.run(`
      CREATE TABLE IF NOT EXISTS cadastro (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT,
        status TEXT DEFAULT 'ativo',
        observacao TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS caminhoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        placa TEXT NOT NULL UNIQUE,
        motorista TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        status TEXT DEFAULT 'em_rota',
        rota TEXT,
        ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const count = execSQL('SELECT COUNT(*) as c FROM cadastro')[0].c;
    if (count === 0) {
      runSQL(
        "INSERT INTO cadastro (nome, email, telefone, status) VALUES (?, ?, ?, ?)",
        ['João Silva', 'joao@email.com', '(11) 99999-1111', 'ativo']
      );
      runSQL(
        "INSERT INTO cadastro (nome, email, telefone, status) VALUES (?, ?, ?, ?)",
        ['Maria Santos', 'maria@email.com', '(21) 98888-2222', 'ativo']
      );
    }

    const countCaminhoes = execSQL('SELECT COUNT(*) as c FROM caminhoes')[0].c;
    if (countCaminhoes === 0) {
      runSQL(
        "INSERT INTO caminhoes (placa, motorista, lat, lng, status, rota) VALUES (?, ?, ?, ?, ?, ?)",
        ['ABC-1A23', 'Carlos Souza', -23.5505, -46.6333, 'em_rota', 'Zona Norte']
      );
      runSQL(
        "INSERT INTO caminhoes (placa, motorista, lat, lng, status, rota) VALUES (?, ?, ?, ?, ?, ?)",
        ['DEF-4B56', 'Ana Lima', -23.5489, -46.6388, 'em_rota', 'Centro']
      );
      runSQL(
        "INSERT INTO caminhoes (placa, motorista, lat, lng, status, rota) VALUES (?, ?, ?, ?, ?, ?)",
        ['GHI-7C89', 'Roberto Costa', -23.5520, -46.6310, 'em_rota', 'Zona Sul']
      );
    }
  } catch (err) {
    showMsg('Erro ao carregar banco de dados: ' + err.message, 'error');
    document.querySelector('#tbody').innerHTML = '<tr><td colspan="6" class="empty-state">Erro ao conectar. Verifique o console.</td></tr>';
  }
}

function execSQL(sql, params = []) {
  if (!db) return [];
  try {
    const stmt = db.prepare(sql);
    if (params.length) stmt.bind(params);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  } catch (e) {
    console.error('SQL Error:', sql, params, e);
    throw e;
  }
}

function runSQL(sql, params = []) {
  if (!db) return;
  try {
    db.run(sql, params);
  } catch (e) {
    console.error('SQL Run Error:', sql, params, e);
    throw e;
  }
}

function carregarLista() {
  const tbody = document.getElementById('tbody');
  if (!db) return;

  const sql = 'SELECT id, nome, email, telefone, status FROM cadastro ORDER BY id DESC';
  const rows = execSQL(sql);

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Nenhum registro cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr data-id="${r.id}">
      <td>${r.id}</td>
      <td>${escapeHtml(r.nome)}</td>
      <td>${escapeHtml(r.email)}</td>
      <td>${escapeHtml(r.telefone || '-')}</td>
      <td><span class="status status-${r.status}">${r.status}</span></td>
      <td class="actions-cell">
        <button type="button" class="btn-secondary" onclick="editar(${r.id})" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">Editar</button>
        <button type="button" class="btn-danger" onclick="excluir(${r.id})">Excluir</button>
      </td>
    </tr>
  `).join('');
}

function configurarFormulario() {
  const form = document.getElementById('form-cadastro');
  const btnCancelar = document.getElementById('btn-cancelar');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    salvar();
  });

  btnCancelar.addEventListener('click', () => {
    editandoId = null;
    form.reset();
    document.getElementById('status').value = 'ativo';
    btnCancelar.style.display = 'none';
    showMsg('Edição cancelada.', 'success');
  });
}

function salvar() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const status = document.getElementById('status').value;
  const observacao = document.getElementById('observacao').value.trim();

  if (!nome || !email) {
    showMsg('Preencha nome e e-mail.', 'error');
    return;
  }

  try {
    if (editandoId) {
      runSQL(
        'UPDATE cadastro SET nome = ?, email = ?, telefone = ?, status = ?, observacao = ? WHERE id = ?',
        [nome, email, telefone, status, observacao || null, editandoId]
      );
      showMsg('Registro atualizado com sucesso!', 'success');
      editandoId = null;
      document.getElementById('btn-cancelar').style.display = 'none';
    } else {
      runSQL(
        'INSERT INTO cadastro (nome, email, telefone, status, observacao) VALUES (?, ?, ?, ?, ?)',
        [nome, email, telefone, status, observacao || null]
      );
      showMsg('Registro cadastrado com sucesso!', 'success');
    }

    document.getElementById('form-cadastro').reset();
    document.getElementById('status').value = 'ativo';
    carregarLista();
  } catch (err) {
    showMsg('Erro ao salvar: ' + err.message, 'error');
  }
}

function editar(id) {
  const sql = 'SELECT * FROM cadastro WHERE id = ?';
  const row = execSQL(sql, [id])[0];
  if (!row) return;

  editandoId = id;
  document.getElementById('nome').value = row.nome;
  document.getElementById('email').value = row.email;
  document.getElementById('telefone').value = row.telefone || '';
  document.getElementById('status').value = row.status;
  document.getElementById('observacao').value = row.observacao || '';
  document.getElementById('btn-cancelar').style.display = 'inline-block';
  document.getElementById('nome').focus();
  showMsg('Editando registro #' + id, 'success');
}

function excluir(id) {
  if (!confirm('Excluir este registro?')) return;
  try {
    runSQL('DELETE FROM cadastro WHERE id = ?', [id]);
    showMsg('Registro excluído.', 'success');
    if (editandoId === id) {
      editandoId = null;
      document.getElementById('form-cadastro').reset();
      document.getElementById('btn-cancelar').style.display = 'none';
    }
    carregarLista();
  } catch (err) {
    showMsg('Erro ao excluir: ' + err.message, 'error');
  }
}

function showMsg(texto, tipo = 'success') {
  const el = document.getElementById('msg');
  el.textContent = texto;
  el.className = 'msg show ' + tipo;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => el.classList.remove('show'), 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- MAPA DE MONITORAMENTO (Caminhões de coleta) ----------

function initMap() {
  if (typeof L === 'undefined') return;
  map = L.map('map').setView([-23.5505, -46.6333], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
}

function initCaminhoes() {
  const caminhoes = execSQL('SELECT * FROM caminhoes');
  caminhoes.forEach(c => addTruckMarker(c));
  renderTrucksList();
}

function addTruckMarker(c) {
  if (!map || typeof L === 'undefined') return;
  if (truckMarkers[c.id]) {
    map.removeLayer(truckMarkers[c.id]);
  }
  const icon = L.divIcon({
    className: 'truck-marker',
    html: `<div class="truck-marker-inner" title="${escapeHtml(c.placa)} – ${escapeHtml(c.motorista)}">🚛</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  const marker = L.marker([c.lat, c.lng], { icon })
    .addTo(map)
    .bindPopup(`
      <strong>${escapeHtml(c.placa)}</strong><br>
      Motorista: ${escapeHtml(c.motorista)}<br>
      Rota: ${escapeHtml(c.rota || '-')}<br>
      Status: ${c.status === 'em_rota' ? 'Em rota' : c.status}
    `);
  truckMarkers[c.id] = marker;
}

function renderTrucksList() {
  const el = document.getElementById('trucks-list');
  if (!el) return;
  const rows = execSQL('SELECT * FROM caminhoes ORDER BY placa');
  if (rows.length === 0) {
    el.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">Nenhum caminhão cadastrado.</p>';
    return;
  }
  el.innerHTML = rows.map(c => `
    <div class="truck-item" data-id="${c.id}" title="Clique para centralizar no mapa">
      <div class="truck-icon">🚛</div>
      <div class="truck-info">
        <div class="truck-placa">${escapeHtml(c.placa)}</div>
        <div class="truck-status ${c.status === 'em_rota' ? 'em-rota' : ''}">${escapeHtml(c.motorista)} · ${escapeHtml(c.rota || '-')}</div>
      </div>
    </div>
  `).join('');
  el.querySelectorAll('.truck-item').forEach(item => {
    item.addEventListener('click', () => centerOnTruck(parseInt(item.dataset.id, 10)));
  });
}

function centerOnTruck(id) {
  if (!map) return;
  const rows = execSQL('SELECT lat, lng FROM caminhoes WHERE id = ?', [id]);
  if (rows.length === 0) return;
  const { lat, lng } = rows[0];
  map.setView([lat, lng], 16);
  if (truckMarkers[id]) truckMarkers[id].openPopup();
  document.querySelectorAll('.truck-item').forEach(i => i.classList.remove('active'));
  const el = document.querySelector(`.truck-item[data-id="${id}"]`);
  if (el) el.classList.add('active');
}

function updateTruckPositions() {
  const caminhoes = execSQL('SELECT * FROM caminhoes');
  caminhoes.forEach(c => {
    const deltaLat = (Math.random() - 0.5) * 0.002;
    const deltaLng = (Math.random() - 0.5) * 0.002;
    let lat = c.lat + deltaLat;
    let lng = c.lng + deltaLng;
    lat = Math.max(-23.56, Math.min(-23.54, lat));
    lng = Math.max(-46.65, Math.min(-46.62, lng));
    runSQL('UPDATE caminhoes SET lat = ?, lng = ?, ultima_atualizacao = CURRENT_TIMESTAMP WHERE id = ?', [lat, lng, c.id]);
    const updated = execSQL('SELECT * FROM caminhoes WHERE id = ?', [c.id])[0];
    addTruckMarker(updated);
  });
  renderTrucksList();
}

function startMapUpdates() {
  if (mapUpdateInterval) clearInterval(mapUpdateInterval);
  mapUpdateInterval = setInterval(updateTruckPositions, 4000);
}
