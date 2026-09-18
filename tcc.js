    // Função para encontrar o ponto mais próximo de uma referência
    window.encontrarMaisProximo = function() {
      const ref = document.getElementById('referencia-proxima').value.trim();
      if (!ref) {
        alert('Digite um endereço de referência!');
        return;
      }
      const pontos = getPontosDescarte();
      if (pontos.length === 0) {
        alert('Nenhum ponto cadastrado.');
        return;
      }
      // Geocodifica a referência em Divinópolis, MG
      const refDivinopolis = `${ref}, Divinópolis, Minas Gerais, Brasil`;
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(refDivinopolis)}`)
        .then(r => r.json())
        .then(async res => {
          if (!res || res.length === 0) {
            alert('Endereço de referência não encontrado.');
            return;
          }
          const latRef = parseFloat(res[0].lat);
          const lonRef = parseFloat(res[0].lon);
          // Para cada ponto, geocodifica e calcula distância
          let menorDist = Infinity;
          let pontoMaisProx = null;
          let latPonto = null;
          let lonPonto = null;
          for (let i = 0; i < pontos.length; i++) {
            const p = pontos[i];
            const enderecoCompleto = encodeURIComponent(`${p.endereco}, ${p.bairro}, Divinópolis, MG`);
            // eslint-disable-next-line no-await-in-loop
            const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${enderecoCompleto}`);
            // eslint-disable-next-line no-await-in-loop
            const geo = await resp.json();
            if (geo && geo.length > 0) {
              const plat = parseFloat(geo[0].lat);
              const plon = parseFloat(geo[0].lon);
              const dist = Math.sqrt(Math.pow(plat - latRef, 2) + Math.pow(plon - lonRef, 2));
              if (dist < menorDist) {
                menorDist = dist;
                pontoMaisProx = p;
                latPonto = plat;
                lonPonto = plon;
              }
            }
          }
          if (pontoMaisProx && map) {
            map.setView([latPonto, lonPonto], 17);
            const icon = L.icon({
              iconUrl: pontoMaisProx.tipo === 'Vidro' ? 'https://cdn-icons-png.flaticon.com/512/565/565547.png' : 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -28]
            });
            const marker = L.marker([latPonto, lonPonto], { icon }).addTo(map)
              .bindPopup(`<b>${pontoMaisProx.nome}</b><br>${pontoMaisProx.endereco}<br>${pontoMaisProx.bairro}<br>Descarte de ${pontoMaisProx.tipo}`)
              .openPopup();
            setTimeout(() => { map.removeLayer(marker); }, 10000);
          } else {
            alert('Nenhum ponto próximo encontrado.');
          }
        })
        .catch(() => alert('Erro ao buscar localização.'));
    }


// Caminhões Ativos
function getCaminhoesAtivos() {
  // Busca do LocalStorage ou inicia com 5
  return parseInt(localStorage.getItem('caminhoesAtivos') || '5', 10);
}

function setCaminhoesAtivos(valor) {
  localStorage.setItem('caminhoesAtivos', valor);
}

function atualizarCaminhoesAtivos() {
  const ativos = getCaminhoesAtivos();
  document.getElementById('caminhoes-ativos').textContent = ativos;
}

function incrementarCaminhoesAtivos() {
  let ativos = getCaminhoesAtivos();
  ativos++;
  setCaminhoesAtivos(ativos);
  atualizarCaminhoesAtivos();
}

// Latência API (gráfico de linha)
function renderizarLatenciaAPI() {
  const ctx = document.getElementById('latencia-api').getContext('2d');
  const labels = Array.from({length: 12}, (_, i) => `${i+1} min atrás`);
  const data = Array.from({length: 12}, () => (Math.random() * 0.5 + 0.2).toFixed(2));
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '95º Percentil (s)',
        data: data,
        borderColor: '#0074d9',
        backgroundColor: 'rgba(0,116,217,0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Segundos' } }
      }
    }
  });
}

// Coletas por Hora (gráfico de barras)
function renderizarColetasPorHora() {
  const ctx = document.getElementById('coletas-por-hora').getContext('2d');
  const horas = Array.from({length: 12}, (_, i) => `${i+8}h`); // 8h às 19h
  const coletas = Array.from({length: 12}, () => Math.floor(Math.random() * 20) + 10);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: horas,
      datasets: [{
        label: 'Coletas',
        data: coletas,
        backgroundColor: '#2d7a2d'
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Quantidade' } }
      }
    }
  });
}

// Inicialização
window.onload = function() {
  atualizarCaminhoesAtivos();
  renderizarLatenciaAPI();
  renderizarColetasPorHora();
  // Atualiza caminhões ativos a cada 10 segundos
  setInterval(atualizarCaminhoesAtivos, 10000);

  // Adiciona botão para incrementar
  // (Agora o botão está no HTML, não precisa criar via JS)

  // Mapa de pontos de descarte
  if (document.getElementById('mapa-descarte')) {
    // Funções utilitárias para LocalStorage
    function getPontosDescarte() {
      const dados = localStorage.getItem('pontosDescarte');
      if (dados) return JSON.parse(dados);
      // Pontos iniciais em Divinópolis, MG
      return [
        { tipo: 'Vidro', nome: 'Ecoponto Central', endereco: 'Praça Dom Cristiano, 100', bairro: 'Centro, Divinópolis MG' },
        { tipo: 'Bateria', nome: 'Recicla Baterias', endereco: 'Av. 1º de Junho, 200', bairro: 'Jardim América, Divinópolis MG' },
        { tipo: 'Vidro', nome: 'Ponto Verde', endereco: 'Rua Pernambuco, 50', bairro: 'Vila Nova, Divinópolis MG' },
        { tipo: 'Bateria', nome: 'Baterias Sustentáveis', endereco: 'Rua Minas Gerais, 300', bairro: 'Bela Vista, Divinópolis MG' }
      ];
    }
    function setPontosDescarte(pontos) {
      localStorage.setItem('pontosDescarte', JSON.stringify(pontos));
    }

    // Renderização do mapa e marcadores
    let map = null;
    let markers = [];

    function renderListaPontos() {
      const pontos = getPontosDescarte();
      const listaDiv = document.getElementById('lista-pontos');
      if (!listaDiv) return;
      if (pontos.length === 0) {
        listaDiv.innerHTML = '<em>Nenhum ponto cadastrado.</em>';
        return;
      }
      listaDiv.innerHTML = `<table style="width:100%;border-collapse:collapse;">
        <thead><tr style="background:#e8f5e9;"><th style='padding:6px 4px;'>Nome</th><th>Tipo</th><th>Endereço</th><th>Bairro</th><th>Ações</th></tr></thead>
        <tbody>
        ${pontos.map((p, i) => `<tr><td style='padding:6px 4px;'>${p.nome}</td><td>${p.tipo}</td><td>${p.endereco}</td><td>${p.bairro}</td><td><button onclick="verNoMapa(${i})" style='background:#2E8B57;color:#fff;padding:4px 10px;border:none;border-radius:6px;cursor:pointer;'>Ver no mapa</button></td></tr>`).join('')}
        </tbody></table>`;
    }

    // Função para geocodificar e mostrar no mapa
    window.verNoMapa = function(idx) {
      const pontos = getPontosDescarte();
      const p = pontos[idx];
      if (!p) return;
      const enderecoCompleto = encodeURIComponent(`${p.endereco}, ${p.bairro}, Divinópolis, MG`);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${enderecoCompleto}`)
        .then(r => r.json())
        .then(res => {
          if (res && res.length > 0) {
            const lat = parseFloat(res[0].lat);
            const lon = parseFloat(res[0].lon);
            if (map) {
              map.setView([lat, lon], 17);
              const icon = L.icon({
                iconUrl: p.tipo === 'Vidro' ? 'https://cdn-icons-png.flaticon.com/512/565/565547.png' : 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -28]
              });
              const marker = L.marker([lat, lon], { icon }).addTo(map)
                .bindPopup(`<b>${p.nome}</b><br>${p.endereco}<br>${p.bairro}<br>Descarte de ${p.tipo}`)
                .openPopup();
              setTimeout(() => { map.removeLayer(marker); }, 8000);
            }
          } else {
            alert('Endereço não encontrado no mapa.');
          }
        })
        .catch(() => alert('Erro ao buscar localização.'));
    }

    function renderMapaDescarte() {
      const pontos = getPontosDescarte();
      if (!map) {
        // Centro de Divinópolis, Minas Gerais
        map = L.map('mapa-descarte').setView([-20.1389, -44.8839], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
      }
      // Remove marcadores antigos
      markers.forEach(m => map.removeLayer(m));
      markers = [];
      // Não plota marcadores pois não há lat/lng
      renderListaPontos();
    }

    renderMapaDescarte();

    // Cadastro de novos pontos
    const form = document.getElementById('form-ponto');
    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome-ponto').value.trim();
        const tipo = document.getElementById('tipo-ponto').value;
        const endereco = document.getElementById('endereco-ponto').value.trim();
        const bairro = document.getElementById('bairro-ponto').value.trim();
        if (!nome || !endereco || !bairro) return;
        const pontos = getPontosDescarte();
        pontos.push({ nome, tipo, endereco, bairro });
        setPontosDescarte(pontos);
        renderMapaDescarte();
        form.reset();
      };
    }
  }
};
