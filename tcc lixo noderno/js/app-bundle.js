
    // Sistema de Gerenciamento de Rotas
    let map;
    let routeMarkers = {};
    let routeLines = {};
    let routes = [];
    let relatorios = [];
    let agendamentos = [];
    let usandoBanco = false;
    let editingRouteId = null;
    
    // Bairros de Divinópolis - Regiões Oficiais
    let bairrosDivinopolis = [
      // Região Central
      { id: 1, nome: "Centro", zona: "Central", checked: false },
      { id: 2, nome: "Esplanada", zona: "Central", checked: false },
      { id: 3, nome: "Vila Operária", zona: "Central", checked: false },
      { id: 4, nome: "Dom Pedro II", zona: "Central", checked: false },
      { id: 5, nome: "Francisco Machado Filho", zona: "Central", checked: false },
      { id: 6, nome: "Sidil", zona: "Central", checked: false },
      // Região Sudeste
      { id: 7, nome: "Aeroporto", zona: "Sudeste", checked: false },
      { id: 8, nome: "Alvorada", zona: "Sudeste", checked: false },
      { id: 9, nome: "Antônio Fonseca", zona: "Sudeste", checked: false },
      { id: 10, nome: "Bom Pastor", zona: "Sudeste", checked: false },
      { id: 11, nome: "Candelária", zona: "Sudeste", checked: false },
      { id: 12, nome: "Dom Cristiano", zona: "Sudeste", checked: false },
      { id: 13, nome: "Dona Quita", zona: "Sudeste", checked: false },
      { id: 14, nome: "Interlagos", zona: "Sudeste", checked: false },
      { id: 15, nome: "Jardim das Oliveiras", zona: "Sudeste", checked: false },
      { id: 16, nome: "Jusa Fonseca", zona: "Sudeste", checked: false },
      { id: 17, nome: "Liberdade", zona: "Sudeste", checked: false },
      { id: 18, nome: "Mangabeiras", zona: "Sudeste", checked: false },
      { id: 19, nome: "Maria Helena", zona: "Sudeste", checked: false },
      { id: 20, nome: "Morro das Antenas", zona: "Sudeste", checked: false },
      { id: 21, nome: "Nações", zona: "Sudeste", checked: false },
      { id: 22, nome: "Novo Paraíso", zona: "Sudeste", checked: false },
      { id: 23, nome: "Nossa Senhora das Graças", zona: "Sudeste", checked: false },
      { id: 24, nome: "Padre Libério", zona: "Sudeste", checked: false },
      { id: 25, nome: "Paraíso", zona: "Sudeste", checked: false },
      { id: 26, nome: "Porto Velho", zona: "Sudeste", checked: false },
      { id: 27, nome: "Sagrada Família", zona: "Sudeste", checked: false },
      { id: 28, nome: "Santa Rosa", zona: "Sudeste", checked: false },
      { id: 29, nome: "Santa Tereza", zona: "Sudeste", checked: false },
      // Região Nordeste
      { id: 30, nome: "Bairro do Carmo", zona: "Nordeste", checked: false },
      { id: 31, nome: "Cidade Industrial Jovelino Rabelo", zona: "Nordeste", checked: false },
      { id: 32, nome: "Danilo Passos", zona: "Nordeste", checked: false },
      { id: 33, nome: "Distrito Industrial Jovelino Rabelo", zona: "Nordeste", checked: false },
      { id: 34, nome: "Dr. José Tomaz", zona: "Nordeste", checked: false },
      { id: 35, nome: "Icaraí", zona: "Nordeste", checked: false },
      { id: 36, nome: "Manoel Valinhas", zona: "Nordeste", checked: false },
      { id: 37, nome: "Niterói", zona: "Nordeste", checked: false },
      { id: 38, nome: "Prolongamento Espírito Santo", zona: "Nordeste", checked: false },
      { id: 39, nome: "São João de Deus", zona: "Nordeste", checked: false },
      { id: 40, nome: "Vila Romana", zona: "Nordeste", checked: false },
      // Região Sudoeste
      { id: 41, nome: "Anchieta", zona: "Sudoeste", checked: false },
      { id: 42, nome: "Belvedere", zona: "Sudoeste", checked: false },
      { id: 43, nome: "Campina Verde", zona: "Sudoeste", checked: false },
      { id: 44, nome: "Catalão", zona: "Sudoeste", checked: false },
      { id: 45, nome: "Conj. Hab. Oswaldo Machado Gontijo", zona: "Sudoeste", checked: false },
      { id: 46, nome: "Conj. Hab. Serra Verde", zona: "Sudoeste", checked: false },
      { id: 47, nome: "Nova Fortaleza I", zona: "Sudoeste", checked: false },
      { id: 48, nome: "Nova Fortaleza II", zona: "Sudoeste", checked: false },
      { id: 49, nome: "Orion", zona: "Sudoeste", checked: false },
      { id: 50, nome: "Planalto", zona: "Sudoeste", checked: false },
      { id: 51, nome: "Santa Luzia", zona: "Sudoeste", checked: false },
      { id: 52, nome: "São José", zona: "Sudoeste", checked: false },
      { id: 53, nome: "São Judas Tadeu", zona: "Sudoeste", checked: false },
      { id: 54, nome: "São Miguel", zona: "Sudoeste", checked: false },
      { id: 55, nome: "Serra Verde", zona: "Sudoeste", checked: false },
      { id: 56, nome: "Tietê", zona: "Sudoeste", checked: false },
      // Região Oeste / Noroeste
      { id: 57, nome: "Afonso Pena", zona: "Oeste/Noroeste", checked: false },
      { id: 58, nome: "Belo Vale", zona: "Oeste/Noroeste", checked: false },
      { id: 59, nome: "Ipiranga", zona: "Oeste/Noroeste", checked: false },
      { id: 60, nome: "Jardim Brasília", zona: "Oeste/Noroeste", checked: false },
      { id: 61, nome: "Jardim Nova América", zona: "Oeste/Noroeste", checked: false },
      { id: 62, nome: "Rancho Alegre", zona: "Oeste/Noroeste", checked: false },
      { id: 63, nome: "São Roque", zona: "Oeste/Noroeste", checked: false },
      { id: 64, nome: "São Sebastião", zona: "Oeste/Noroeste", checked: false },
      { id: 65, nome: "Vila Belo Horizonte", zona: "Oeste/Noroeste", checked: false },
      { id: 66, nome: "Vila Santo Antônio", zona: "Oeste/Noroeste", checked: false }
    ];
    
    // Caminhões disponíveis
    let caminhoes = [
      { id: 'CAM-001', placa: 'DIV-1234', tipo: 'Compactor 15m³', status: 'disponivel' },
      { id: 'CAM-002', placa: 'DIV-5678', tipo: 'Compactor 20m³', status: 'disponivel' },
      { id: 'CAM-003', placa: 'DIV-9012', tipo: 'Basculante 10m³', status: 'disponivel' },
      { id: 'CAM-004', placa: 'DIV-3456', tipo: 'Compactor 15m³', status: 'disponivel' },
      { id: 'CAM-005', placa: 'DIV-7890', tipo: 'Compactor 15m³', status: 'em_manutencao' },
      { id: 'CAM-006', placa: 'DIV-2468', tipo: 'Basculante 10m³', status: 'disponivel' }
    ];
    
    // Motoristas disponíveis
    let motoristas = [
      { id: 1, nome: 'João Silva', status: 'ativo' },
      { id: 2, nome: 'Maria Santos', status: 'ativo' },
      { id: 3, nome: 'Carlos Oliveira', status: 'ferias' },
      { id: 4, nome: 'Ana Costa', status: 'ativo' },
      { id: 5, nome: 'Pedro Martins', status: 'ativo' },
      { id: 6, nome: 'Beatriz Lima', status: 'ativo' },
      { id: 7, nome: 'Ricardo Souza', status: 'manutencao' },
      { id: 8, nome: 'Fernanda Alves', status: 'ativo' }
    ];
    
    // Rotas de exemplo
    const rotasExemplo = [
      {
        id: 1,
        nome: "Rota Centro - Zona Sul",
        bairros: ["Centro", "Esplanada", "Vila Operária"],
        caminhao: "CAM-001",
        motorista: "João Silva",
        dias: ["seg", "qua", "sex"],
        horarioInicio: "06:00",
        horarioFim: "10:00",
        tipo: "domiciliar",
        frequencia: "semanal",
        status: "ativa",
        pontos: ["Praça do Santuário", "Av. Getúlio Vargas", "Rua São Paulo"],
        observacoes: "Evitar ruas estreitas após as 08:00",
        createdAt: "2024-01-15",
        eficiencia: 92
      },
      {
        id: 2,
        nome: "Rota Zona Norte",
        bairros: ["Niterói", "Danilo Passos", "Manoel Valinhas"],
        caminhao: "CAM-002",
        motorista: "Maria Santos",
        dias: ["ter", "qui"],
        horarioInicio: "07:30",
        horarioFim: "12:00",
        tipo: "reciclavel",
        frequencia: "semanal",
        status: "ativa",
        pontos: ["Av. Pará", "Rua Amazonas", "Praça da Liberdade"],
        observacoes: "Coleta seletiva - atenção aos materiais",
        createdAt: "2024-01-10",
        eficiencia: 85
      },
      {
        id: 3,
        nome: "Rota Zona Leste",
        bairros: ["Bom Pastor", "Mangabeiras", "Santa Rosa"],
        caminhao: "CAM-003",
        motorista: "Ana Costa",
        dias: ["seg", "ter", "qua", "qui", "sex"],
        horarioInicio: "08:00",
        horarioFim: "14:00",
        tipo: "domiciliar",
        frequencia: "diaria",
        status: "ativa",
        pontos: ["Av. Antônio Olímpio", "Rua Goiás", "Praça do Belvedere"],
        observacoes: "Grande volume às segundas-feiras",
        createdAt: "2024-01-05",
        eficiencia: 78
      },
      {
        id: 4,
        nome: "Rota Volumosos - Fim de Semana",
        bairros: ["Belvedere", "Catalão", "Planalto"],
        caminhao: "CAM-004",
        motorista: "Pedro Martins",
        dias: ["sab"],
        horarioInicio: "09:00",
        horarioFim: "15:00",
        tipo: "volumoso",
        frequencia: "semanal",
        status: "ativa",
        pontos: ["Av. Faria Tavares", "Rua das Flores", "Cond. Jardins"],
        observacoes: "Apenas móveis e eletrodomésticos",
        createdAt: "2024-01-20",
        eficiencia: 65
      },
      {
        id: 5,
        nome: "Rota Especial - Centro Histórico",
        bairros: ["Centro"],
        caminhao: "CAM-006",
        motorista: "Beatriz Lima",
        dias: ["qua"],
        horarioInicio: "22:00",
        horarioFim: "02:00",
        tipo: "especial",
        frequencia: "semanal",
        status: "inativa",
        pontos: ["Praça da Catedral", "Rua Coronel João Notini", "Mercado Municipal"],
        observacoes: "Coleta noturna - centro fechado durante o dia",
        createdAt: "2024-01-25",
        eficiencia: 95
      }
    ];

    async function chamarApi(acao, opcoes = {}) {
      const resposta = await fetch(`api.php?acao=${acao}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opcoes
      });

      if (!resposta.ok) {
        throw new Error('Falha na comunicação com o banco de dados');
      }

      return resposta.json();
    }

    async function carregarDadosDoBanco() {
      try {
        const dados = await chamarApi('dados');
        bairrosDivinopolis = dados.bairros || bairrosDivinopolis;
        caminhoes = dados.caminhoes || caminhoes;
        motoristas = dados.motoristas || motoristas;
        drivers = dados.motoristas || [];
        routes = dados.rotas || [];
        relatorios = dados.relatorios || [];
        usandoBanco = true;
      } catch (erro) {
        usandoBanco = false;
        routes = [...rotasExemplo];
        relatorios = [];
      }
    }

    function atualizarEstatisticasRotas() {
      document.getElementById('active-routes').textContent = routes.filter(r => r.status === 'ativa').length;
      document.getElementById('live-count').textContent = routes.filter(r => r.status === 'ativa').length;
      atualizarResumoRelatorio();
    }

    function calcularDadosRelatorio() {
      const totalRotas = routes.length;
      const rotasAtivas = routes.filter(r => r.status === 'ativa').length;
      const totalMotoristas = drivers.length || motoristas.length;
      const totalCaminhoes = caminhoes.length;
      const eficienciaMedia = totalRotas
        ? Math.round(routes.reduce((total, rota) => total + (Number(rota.eficiencia) || 0), 0) / totalRotas)
        : 0;

      return { totalRotas, rotasAtivas, totalMotoristas, totalCaminhoes, eficienciaMedia };
    }

    function atualizarResumoRelatorio() {
      const totalRotasEl = document.getElementById('rel-total-rotas');
      if (!totalRotasEl) return;

      const dados = calcularDadosRelatorio();
      totalRotasEl.textContent = dados.totalRotas;
      document.getElementById('rel-rotas-ativas').textContent = dados.rotasAtivas;
      document.getElementById('rel-total-motoristas').textContent = dados.totalMotoristas;
      document.getElementById('rel-eficiencia').textContent = `${dados.eficienciaMedia}%`;
    }

    function montarConteudoRelatorio(formData) {
      const dados = calcularDadosRelatorio();
      const rotasPorTipo = routes.reduce((acc, rota) => {
        acc[rota.tipo] = (acc[rota.tipo] || 0) + 1;
        return acc;
      }, {});

      const linhasTipos = Object.entries(rotasPorTipo)
        .map(([tipo, total]) => `- ${getTipoColetaTexto(tipo)}: ${total}`)
        .join('\n') || '- Nenhuma rota cadastrada';

      return [
        `Relatório: ${formData.get('titulo')}`,
        `Tipo: ${formData.get('tipo')}`,
        `Período: ${formData.get('periodoInicio') || 'não informado'} até ${formData.get('periodoFim') || 'não informado'}`,
        '',
        `Total de rotas: ${dados.totalRotas}`,
        `Rotas ativas: ${dados.rotasAtivas}`,
        `Motoristas cadastrados: ${dados.totalMotoristas}`,
        `Caminhões cadastrados: ${dados.totalCaminhoes}`,
        `Eficiência média: ${dados.eficienciaMedia}%`,
        '',
        'Rotas por tipo:',
        linhasTipos
      ].join('\n');
    }

    function toggleTrucksPanel() {
      const panel = document.getElementById('trucksPanel');
      const button = panel.querySelector('.panel-toggle');
      const subtitle = document.getElementById('trucksPanelSubtitle');
      const isMinimized = panel.classList.toggle('minimized');

      button.title = isMinimized ? 'Expandir painel' : 'Minimizar painel';
      button.setAttribute('aria-label', button.title);
      subtitle.textContent = isMinimized ? 'Painel minimizado' : 'Clique para mais detalhes';
    }

    function entrarNoSistema() {
      document.getElementById('telaInicial').classList.add('oculta');

      if (map) {
        setTimeout(() => map.invalidateSize(), 400);
      }
    }

    // Inicialização do Sistema
    document.addEventListener('DOMContentLoaded', async function() {
      // Controle do Menu e Backdrop
      const menuToggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('sidebar');
      const sidebarBackdrop = document.getElementById('sidebarBackdrop');
      
      function toggleSidebar() {
        if (!sidebar) return;
        const isActive = sidebar.classList.toggle('active');
        if (sidebarBackdrop) {
          sidebarBackdrop.classList.toggle('active', isActive);
        }
      }

      if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleSidebar();
        });
      }
      
      if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => {
          if (sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
          }
        });
      }
      
      // Fechar menu ao clicar fora (em mobile)
      document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && 
            sidebar && 
            !sidebar.contains(e.target) && 
            menuToggle && 
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
          toggleSidebar();
        }
      });
      
      // Inicializar Central de Notificações
      initNotifications();

      // Inicializar Configurações do Sistema
      initSystemSettings();
      
      // Carregar dados iniciais
      await carregarDadosDoBanco();

      // Inicializar Mapa para Divinópolis/MG
      initMap();

      loadInitialData();
      loadRoutes();
      loadBairros();
      loadCaminhoesSelect();
      loadMotoristasSelect();
      
      // Configurar formulário de rotas
      setupRouteForm();
      
      // Configurar formulário de motoristas
      setupDriverForm();

      // Configurar formulário de relatórios
      setupRelatorioForm();
      
      // Configurar formulário de agendamentos
      setupAgendamentoForm();
      
      // Configurar busca
      setupSearch();
    });
    
    // Sistema de Mapa - DIVINÓPOLIS
    function initMap() {
      // Coordenadas de Divinópolis, Minas Gerais
      const divinopolisCenter = [-20.1389, -44.8833];
      
      // Criar mapa centralizado em Divinópolis
      map = L.map('map').setView(divinopolisCenter, 13);
      
      // Tile layer personalizada (estilo escuro)
      activeTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '©OpenStreetMap, ©CartoDB',
        maxZoom: 19,
      }).addTo(map);
      
      // Adicionar controle de localização, se o plugin estiver carregado
      if (L.control.locate) {
        L.control.locate({
          position: 'bottomright',
          drawCircle: true,
          follow: true,
          setView: true,
          keepCurrentZoomLevel: true,
          markerStyle: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.8
          },
          locateOptions: {
            maxZoom: 16,
            watch: true,
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000
          }
        }).addTo(map);
      }
      
      // Adicionar marcador do centro de Divinópolis
      L.marker(divinopolisCenter)
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 0.5rem;">
            <div style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem;">📍 Centro de Divinópolis</div>
            <div style="font-size: 0.875rem; color: #666; margin-bottom: 0.5rem;">Sistema de Gerenciamento de Rotas</div>
            <div style="font-size: 0.875rem;">
              <div>Total de Rotas: ${routes.length}</div>
              <div>Caminhões Ativos: ${caminhoes.filter(c => c.status === 'disponivel').length}</div>
              <div>Bairros Cobertos: ${bairrosDivinopolis.length}</div>
            </div>
          </div>
        `);
    }
    
    // Carregar dados iniciais
    function loadInitialData() {
      // Atualizar estatísticas
      atualizarEstatisticasRotas();
      
      // Carregar lista de caminhões no painel
      loadTrucksPanel();
    }
    
    // Carregar bairros no formulário
    function loadBairros() {
      const container = document.getElementById('bairros-container');
      container.innerHTML = '';
      
      // Agrupar bairros por zona
      const bairrosPorZona = {};
      bairrosDivinopolis.forEach(bairro => {
        if (!bairrosPorZona[bairro.zona]) {
          bairrosPorZona[bairro.zona] = [];
        }
        bairrosPorZona[bairro.zona].push(bairro);
      });
      
      // Criar cards para cada zona
      Object.keys(bairrosPorZona).forEach(zona => {
        const zonaCard = document.createElement('div');
        zonaCard.style.marginBottom = '1rem';
        
        let bairrosHTML = `
          <div style="font-weight: 600; color: var(--primary); margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(0,200,81,0.1); border-radius: var(--radius-sm);">
            <i class="fas fa-map-marker-alt"></i> Zona ${zona}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        `;
        
        bairrosPorZona[zona].forEach(bairro => {
          bairrosHTML += `
            <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.03); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s ease;" 
                   onmouseover="this.style.background='rgba(255,255,255,0.05)'" 
                   onmouseout="this.style.background='rgba(255,255,255,0.03)'">
              <input type="checkbox" name="bairros" value="${bairro.id}" id="bairro-${bairro.id}" 
                     onchange="toggleBairro(${bairro.id})">
              <span>${bairro.nome}</span>
            </label>
          `;
        });
        
        bairrosHTML += '</div>';
        zonaCard.innerHTML = bairrosHTML;
        container.appendChild(zonaCard);
      });
    }
    
    // Carregar caminhões no select
    function loadCaminhoesSelect() {
      const select = document.getElementById('rota-caminhao');
      select.innerHTML = '<option value="">Selecione um caminhão</option>';
      
      caminhoes.forEach(caminhao => {
        const statusText = caminhao.status === 'disponivel' ? 'Disponível' : 
                          caminhao.status === 'em_manutencao' ? 'Em Manutenção' : 'Indisponível';
        const statusClass = caminhao.status === 'disponivel' ? 'status-active' : 'status-inactive';
        
        const option = document.createElement('option');
        option.value = caminhao.id;
        option.textContent = `${caminhao.placa} - ${caminhao.tipo} (${statusText})`;
        option.dataset.status = caminhao.status;
        
        if (caminhao.status !== 'disponivel') {
          option.disabled = true;
        }
        
        select.appendChild(option);
      });
    }
    
    // Carregar motoristas no select
    function loadMotoristasSelect() {
      const select = document.getElementById('rota-motorista');
      select.innerHTML = '<option value="">Selecione um motorista</option>';
      
      motoristas.forEach(motorista => {
        const statusText = motorista.status === 'ativo' ? 'Ativo' : 
                          motorista.status === 'ferias' ? 'Férias' : 'Manutenção';
        const statusClass = motorista.status === 'ativo' ? 'status-active' : 'status-inactive';
        
        const option = document.createElement('option');
        option.value = motorista.id;
        option.textContent = `${motorista.nome} (${statusText})`;
        option.dataset.status = motorista.status;
        
        if (motorista.status !== 'ativo') {
          option.disabled = true;
        }
        
        select.appendChild(option);
      });
    }
    
    // Carregar painel de caminhões
    function loadTrucksPanel() {
      const trucksList = document.getElementById('trucksList');
      trucksList.innerHTML = '';

      const rotasAtivas = routes.filter(rota => rota.status === 'ativa');

      if (rotasAtivas.length === 0) {
        trucksList.innerHTML = `
          <div style="padding: 1rem; color: var(--gray-400); text-align: center;">
            Nenhuma rota em execução no momento.
          </div>
        `;
        return;
      }
      
      rotasAtivas.forEach(rota => {
        const truckItem = document.createElement('div');
        truckItem.className = 'truck-item';
        truckItem.dataset.id = rota.id;
        
        const caminhao = caminhoes.find(c => c.id === rota.caminhao);
        const motorista = motoristas.find(m => m.id === rota.motoristaId) || { nome: rota.motorista };
        
        truckItem.innerHTML = `
          <div class="truck-icon">
            <i class="fas fa-route"></i>
          </div>
          <div class="truck-info">
            <div class="truck-placa">${rota.nome}</div>
            <div class="truck-status">
              <div class="status-dot online"></div>
              <span>${rota.status === 'ativa' ? 'Em execução' : 'Pausada'}</span>
            </div>
            <div class="truck-distance">
              ${rota.bairros.slice(0, 2).join(', ')} • <span class="truck-eta">${rota.horarioInicio} - ${rota.horarioFim}</span>
            </div>
          </div>
          <i class="fas fa-chevron-right" style="color: var(--gray-400);"></i>
        `;
        
        truckItem.addEventListener('click', () => {
          // Remover classe active de todos
          document.querySelectorAll('.truck-item').forEach(item => {
            item.classList.remove('active');
          });
          
          // Adicionar classe active ao item clicado
          truckItem.classList.add('active');
          
          // Mostrar detalhes da rota
          showRouteDetails(rota);
          
          // Destacar rota no mapa
          highlightRouteOnMap(rota);
        });
        
        trucksList.appendChild(truckItem);
        
        // Adicionar marcador da rota no mapa
        addRouteMarker(rota);
      });
    }
    
    // Adicionar marcador de rota no mapa
    function addRouteMarker(rota) {
      // Coordenadas aproximadas para cada bairro
      const bairroCoords = {
        "Centro": [-20.139, -44.883],
        "São Sebastião": [-20.130, -44.890],
        "Santa Rosa": [-20.145, -44.875],
        "Esplanada": [-20.150, -44.880],
        "Jardim Belvedere": [-20.125, -44.895],
        "Niterói": [-20.120, -44.900],
        "São Luiz": [-20.135, -44.870],
        "Cidade Jardim": [-20.140, -44.865],
        "Eldorado": [-20.115, -44.885],
        "Danilo Passos": [-20.110, -44.890],
        "Bom Pastor": [-20.155, -44.895],
        "Alto São Paulo": [-20.160, -44.900],
        "Interlagos": [-20.130, -44.860],
        "Manoel Valinhas": [-20.125, -44.855],
        "Padre Libério": [-20.120, -44.880],
        "Sagrada Família": [-20.115, -44.875],
        "Mangabeiras": [-20.165, -44.890],
        "Jardinópolis": [-20.170, -44.885],
        "Vila Romana": [-20.145, -44.910],
        "Catalão": [-20.135, -44.915]
      };
      
      // Usar coordenadas do primeiro bairro
      const primeiroBairro = rota.bairros[0];
      const coords = bairroCoords[primeiroBairro] || [-20.1389, -44.8833];
      
      // Remover marcador existente
      if (routeMarkers[rota.id]) {
        map.removeLayer(routeMarkers[rota.id]);
      }
      
      // Criar ícone personalizado para rota
      const iconColor = rota.status === 'ativa' ? '#00C851' : '#FF4757';
      const icon = L.divIcon({
        html: `
          <div class="truck-marker">
            <div class="truck-marker-inner" style="background: ${iconColor};">
              <i class="fas fa-route"></i>
            </div>
          </div>
        `,
        className: 'truck-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      
      // Adicionar marcador
      const marker = L.marker(coords, { icon }).addTo(map);
      
      // Adicionar popup
      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 0.5rem; min-width: 250px;">
          <div style="font-weight: 600; font-size: 1rem; margin-bottom: 0.25rem; color: ${iconColor};">${rota.nome}</div>
          <div style="font-size: 0.875rem; color: #666; margin-bottom: 0.5rem;">
            <i class="fas fa-truck"></i> ${rota.caminhao} • <i class="fas fa-user"></i> ${rota.motorista}
          </div>
          <div style="margin-bottom: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span style="padding: 0.25rem 0.5rem; background: ${iconColor}; color: white; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">
                ${rota.status === 'ativa' ? 'ATIVA' : 'INATIVA'}
              </span>
              <span style="font-size: 0.875rem;">${rota.horarioInicio} - ${rota.horarioFim}</span>
            </div>
          </div>
          <div style="font-size: 0.875rem;">
            <div><strong>Bairros:</strong> ${rota.bairros.slice(0, 3).join(', ')}${rota.bairros.length > 3 ? '...' : ''}</div>
            <div><strong>Dias:</strong> ${rota.dias.map(d => d.substring(0,3)).join(', ')}</div>
            <div><strong>Tipo:</strong> ${getTipoColetaTexto(rota.tipo)}</div>
          </div>
          <button onclick="showRouteDetails(${rota.id})" 
                  style="margin-top: 0.5rem; padding: 0.5rem; background: ${iconColor}; color: white; border: none; border-radius: 4px; width: 100%; cursor: pointer; font-size: 0.875rem;">
            <i class="fas fa-info-circle"></i> Ver Detalhes
          </button>
        </div>
      `);
      
      // Salvar referência
      routeMarkers[rota.id] = marker;
      
      // Evento de clique
      marker.on('click', () => {
        showRouteDetails(rota);
      });
    }
    
    // Destacar rota no mapa
    function highlightRouteOnMap(rota) {
      // Limpar destaque anterior
      if (routeLines[rota.id]) {
        map.removeLayer(routeLines[rota.id]);
      }
      
      // Coordenadas para a rota (simuladas)
      const routeCoordinates = [
        [-20.139, -44.883],  // Centro
        [-20.145, -44.875],  // Santa Rosa
        [-20.150, -44.880],  // Esplanada
        [-20.155, -44.875]   // Volta ao centro
      ];
      
      // Criar linha da rota
      const routeLine = L.polyline(routeCoordinates, {
        color: rota.status === 'ativa' ? '#00C851' : '#FF4757',
        weight: 4,
        opacity: 0.7,
        dashArray: rota.status === 'ativa' ? null : '10, 10'
      }).addTo(map);
      
      // Salvar referência
      routeLines[rota.id] = routeLine;
      
      // Ajustar zoom para mostrar a rota
      map.fitBounds(routeLine.getBounds());
    }
    
    // Mostrar todas as rotas no mapa
    function showAllRoutes() {
      // Limpar todas as linhas
      Object.values(routeLines).forEach(line => {
        map.removeLayer(line);
      });
      routeLines = {};
      
      // Adicionar todas as rotas
      routes.forEach(rota => {
        addRouteMarker(rota);
      });
      
      // Ajustar zoom para mostrar todas as rotas
      const bounds = L.latLngBounds(
        [-20.170, -44.920],
        [-20.110, -44.850]
      );
      map.fitBounds(bounds);
    }
    
    // Mostrar apenas rotas ativas
    function showActiveRoutes() {
      // Limpar todas as linhas
      Object.values(routeLines).forEach(line => {
        map.removeLayer(line);
      });
      routeLines = {};
      
      // Adicionar apenas rotas ativas
      routes.filter(rota => rota.status === 'ativa').forEach(rota => {
        addRouteMarker(rota);
      });
    }
    
    // Carregar rotas
    function loadRoutes() {
      if (!routes.length) {
        routes = [...rotasExemplo];
      }
      renderRoutesTable();
      renderRoutesCards();
    }
    
    // Renderizar tabela de rotas
    function renderRoutesTable() {
      const tbody = document.getElementById('routesTable');
      
      if (routes.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 3rem; color: var(--gray-400);">
              <div style="margin-bottom: 1rem; font-size: 3rem; color: var(--gray-600);">
                <i class="fas fa-route"></i>
              </div>
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Nenhuma rota cadastrada</div>
              <div>Cadastre sua primeira rota acima.</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = routes.map(rota => {
        const statusClass = rota.status === 'ativa' ? 'status-active' : 
                           rota.status === 'inativa' ? 'status-inactive' :
                           rota.status === 'pendente' ? 'status-pending' : 'status-completed';
        
        const statusText = rota.status === 'ativa' ? 'Ativa' : 
                          rota.status === 'inativa' ? 'Inativa' : 'Pendente';
        
        return `
          <tr>
            <td style="font-weight: 600; color: var(--gray-300);">ROTA-${rota.id.toString().padStart(3, '0')}</td>
            <td>
              <div style="font-weight: 600;">${rota.nome}</div>
              <div style="font-size: 0.75rem; color: var(--gray-400);">Criada em: ${rota.createdAt}</div>
            </td>
            <td>
              <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                ${rota.bairros.slice(0, 3).map(bairro => `
                  <span style="background: rgba(0,200,81,0.1); color: var(--primary); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                    ${bairro}
                  </span>
                `).join('')}
                ${rota.bairros.length > 3 ? `<span style="font-size: 0.75rem; color: var(--gray-400);">+${rota.bairros.length - 3}</span>` : ''}
              </div>
            </td>
            <td>${rota.caminhao}</td>
            <td>
              <div>${rota.horarioInicio} - ${rota.horarioFim}</div>
              <div style="font-size: 0.75rem; color: var(--gray-400);">
                ${rota.dias.map(d => d.substring(0,3)).join(', ')}
              </div>
            </td>
            <td>
              <span class="status-badge ${statusClass}">
                ${statusText}
              </span>
              <div style="font-size: 0.75rem; color: var(--gray-400); margin-top: 0.25rem;">
                Eficiência: ${rota.eficiencia}%
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" onclick="showRouteDetails(${rota.id})">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editRoute(${rota.id})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteRoute(${rota.id})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
    
    // Renderizar cards de rotas
    function renderRoutesCards() {
      const container = document.getElementById('routesCards');
      container.innerHTML = '';
      
      routes.forEach(rota => {
        const statusColor = rota.status === 'ativa' ? 'var(--primary)' : 
                           rota.status === 'inativa' ? 'var(--danger)' : 'var(--warning)';
        
        const card = document.createElement('div');
        card.className = 'route-card';
        card.style.borderLeftColor = statusColor;
        card.dataset.id = rota.id;
        
        card.innerHTML = `
          <div class="route-header">
            <div class="route-title">${rota.nome}</div>
            <div class="route-actions">
              <button class="action-btn view" onclick="showRouteDetails(${rota.id})">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn edit" onclick="editRoute(${rota.id})">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </div>
          
          <div class="route-info">
            <div class="route-stat">
              <i class="fas fa-truck"></i>
              <span>${rota.caminhao}</span>
            </div>
            <div class="route-stat">
              <i class="fas fa-user"></i>
              <span>${rota.motorista}</span>
            </div>
            <div class="route-stat">
              <i class="fas fa-clock"></i>
              <span>${rota.horarioInicio} - ${rota.horarioFim}</span>
            </div>
            <div class="route-stat">
              <i class="fas fa-chart-line"></i>
              <span>Eficiência: ${rota.eficiencia}%</span>
            </div>
          </div>
          
          <div class="route-preview">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">
              <i class="fas fa-map-marker-alt"></i> Bairros atendidos:
            </div>
            <div class="route-points">
              ${rota.bairros.slice(0, 5).map(bairro => `
                <span class="route-point">${bairro}</span>
              `).join('')}
              ${rota.bairros.length > 5 ? `<span class="route-point">+${rota.bairros.length - 5}</span>` : ''}
            </div>
            
            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
              <span class="status-badge ${rota.status === 'ativa' ? 'status-active' : 'status-inactive'}">
                ${rota.status === 'ativa' ? 'Ativa' : 'Inativa'}
              </span>
              <button class="btn btn-outline" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;" 
                      onclick="showRouteOnMap(${rota.id})">
                <i class="fas fa-map"></i> Ver no Mapa
              </button>
            </div>
          </div>
        `;
        
        container.appendChild(card);
      });
    }
    
    // Configurar formulário de rotas
    function setupRouteForm() {
      const form = document.getElementById('form-rota');
      const cancelBtn = document.getElementById('btn-cancelar-rota');
      
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        saveRoute();
      });
      
      cancelBtn.addEventListener('click', function() {
        resetRouteForm();
        showNotification('Ação cancelada', 'Formulário de rota reinicializado.', 'info');
      });
    }
    
    // Salvar rota
    async function saveRoute() {
      const form = document.getElementById('form-rota');
      const formData = new FormData(form);
      
      // Coletar dados do formulário
      const bairrosSelecionados = Array.from(document.querySelectorAll('input[name="bairros"]:checked'))
        .map(cb => {
          const bairroId = parseInt(cb.value);
          const bairro = bairrosDivinopolis.find(b => b.id === bairroId);
          return bairro ? bairro.nome : '';
        })
        .filter(nome => nome !== '');

      const bairroIdsSelecionados = Array.from(document.querySelectorAll('input[name="bairros"]:checked'))
        .map(cb => parseInt(cb.value));
      
      const diasSelecionados = Array.from(document.querySelectorAll('input[name="dias"]:checked'))
        .map(cb => cb.value);

      const motoristaId = parseInt(formData.get('rota-motorista'));
      const motoristaSelecionado = motoristas.find(m => m.id === motoristaId);
      
      const novaRota = {
        id: editingRouteId || null,
        nome: formData.get('rota-nome'),
        bairros: bairrosSelecionados,
        bairroIds: bairroIdsSelecionados,
        caminhao: formData.get('rota-caminhao'),
        motoristaId: motoristaId,
        motorista: motoristaSelecionado ? motoristaSelecionado.nome : formData.get('rota-motorista'),
        dias: diasSelecionados,
        horarioInicio: formData.get('rota-horario-inicio'),
        horarioFim: formData.get('rota-horario-fim'),
        tipo: formData.get('rota-tipo'),
        frequencia: formData.get('rota-frequencia'),
        status: 'ativa',
        pontos: formData.get('rota-pontos') ? formData.get('rota-pontos').split('\n').filter(p => p.trim() !== '') : [],
        observacoes: formData.get('rota-observacoes'),
        createdAt: new Date().toISOString().split('T')[0],
        eficiencia: Math.floor(Math.random() * 30) + 70 // Simulação
      };

      if (usandoBanco) {
        try {
          await chamarApi('salvar_rota', {
            method: 'POST',
            body: JSON.stringify(novaRota)
          });
          await carregarDadosDoBanco();
          showNotification('Sucesso!', editingRouteId ? 'Rota atualizada no banco de dados.' : 'Rota cadastrada no banco de dados.', 'success');
        } catch (erro) {
          showNotification('Erro', 'Não foi possível salvar a rota no banco de dados.', 'error');
          return;
        }
      } else {
        novaRota.id = editingRouteId || (routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1);
      
        if (editingRouteId) {
          // Atualizar rota existente
          const index = routes.findIndex(r => r.id === editingRouteId);
          routes[index] = novaRota;
          showNotification('Sucesso!', 'Rota atualizada com sucesso.', 'success');
        } else {
          // Adicionar nova rota
          routes.push(novaRota);
          showNotification('Sucesso!', 'Rota cadastrada com sucesso.', 'success');
        }
      }
      
      // Atualizar interface
      resetRouteForm();
      renderRoutesTable();
      renderRoutesCards();
      loadTrucksPanel();
      if (!usandoBanco) {
        addRouteMarker(novaRota);
      }
      
      // Atualizar estatísticas
      atualizarEstatisticasRotas();
    }
    
    // Resetar formulário de rota
    function resetRouteForm() {
      document.getElementById('form-rota').reset();
      document.querySelectorAll('input[name="bairros"]').forEach(cb => {
        cb.checked = false;
      });
      editingRouteId = null;
    }
    
    // Editar rota
    function editRoute(id) {
      const rota = routes.find(r => r.id === id);
      if (!rota) return;
      
      // Preencher formulário
      document.getElementById('rota-nome').value = rota.nome;
      document.getElementById('rota-caminhao').value = rota.caminhao;
      document.getElementById('rota-motorista').value = rota.motoristaId || rota.motorista;
      document.getElementById('rota-horario-inicio').value = rota.horarioInicio;
      document.getElementById('rota-horario-fim').value = rota.horarioFim;
      document.getElementById('rota-tipo').value = rota.tipo;
      document.getElementById('rota-frequencia').value = rota.frequencia;
      document.getElementById('rota-pontos').value = rota.pontos.join('\n');
      document.getElementById('rota-observacoes').value = rota.observacoes || '';
      
      // Selecionar dias
      document.querySelectorAll('input[name="dias"]').forEach(cb => {
        cb.checked = rota.dias.includes(cb.value);
      });
      
      // Selecionar bairros
      document.querySelectorAll('input[name="bairros"]').forEach(cb => {
        const bairroId = parseInt(cb.value);
        const bairro = bairrosDivinopolis.find(b => b.id === bairroId);
        cb.checked = bairro && rota.bairros.includes(bairro.nome);
      });
      
      // Salvar ID em edição
      editingRouteId = id;
      
      // Mostrar tab de cadastro
      showTab('cadastro-rotas');
      
      showNotification('Edição', 'Preencha os dados e salve as alterações.', 'info');
    }
    
    // Deletar rota
    async function deleteRoute(id) {
      if (confirm('Tem certeza que deseja excluir esta rota?')) {
        if (usandoBanco) {
          try {
            await chamarApi(`excluir_rota&id=${id}`, { method: 'DELETE' });
            await carregarDadosDoBanco();
          } catch (erro) {
            showNotification('Erro', 'Não foi possível excluir a rota do banco de dados.', 'error');
            return;
          }
        } else {
          routes = routes.filter(r => r.id !== id);
        }
        
        // Remover do mapa
        if (routeMarkers[id]) {
          map.removeLayer(routeMarkers[id]);
          delete routeMarkers[id];
        }
        
        if (routeLines[id]) {
          map.removeLayer(routeLines[id]);
          delete routeLines[id];
        }
        
        // Atualizar interface
        renderRoutesTable();
        renderRoutesCards();
        loadTrucksPanel();
        
        // Atualizar estatísticas
        atualizarEstatisticasRotas();
        
        showNotification('Excluído!', 'Rota removida com sucesso.', 'success');
      }
    }
    
    // Mostrar detalhes da rota
    function showRouteDetails(rotaId) {
      let rota;
      if (typeof rotaId === 'object') {
        rota = rotaId;
      } else {
        rota = routes.find(r => r.id === rotaId);
      }
      
      if (!rota) return;
      
      const modal = document.getElementById('routeModal');
      const details = document.getElementById('routeDetails');
      
      const statusColor = rota.status === 'ativa' ? '#00C851' : 
                         rota.status === 'inativa' ? '#FF4757' : '#FFA502';
      
      const tipoTexto = getTipoColetaTexto(rota.tipo);
      const diasTexto = rota.dias.map(d => getDiaSemanaTexto(d)).join(', ');
      
      details.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, ${statusColor}, #9B51E0); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white;">
              <i class="fas fa-route"></i>
            </div>
            <div>
              <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem;">${rota.nome}</div>
              <div style="font-size: 0.875rem; color: var(--gray-400);">${tipoTexto} • Criada em: ${rota.createdAt}</div>
            </div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.25rem;">Caminhão</div>
                <div style="font-size: 1rem; font-weight: 600;">${rota.caminhao}</div>
              </div>
              <div>
                <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.25rem;">Motorista</div>
                <div style="font-size: 1rem; font-weight: 600;">${rota.motorista}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Status</div>
            <div style="font-size: 1rem; font-weight: 600; color: ${statusColor};">${rota.status === 'ativa' ? 'Ativa' : 'Inativa'}</div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Eficiência</div>
            <div style="font-size: 1rem; font-weight: 600;">${rota.eficiencia}%</div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Horário</div>
            <div style="font-size: 1rem; font-weight: 600;">${rota.horarioInicio} - ${rota.horarioFim}</div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem;">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Frequência</div>
            <div style="font-size: 1rem; font-weight: 600;">${rota.frequencia === 'diaria' ? 'Diária' : 
                                                          rota.frequencia === 'semanal' ? 'Semanal' : 
                                                          rota.frequencia === 'quinzenal' ? 'Quinzenal' : 'Mensal'}</div>
          </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Dias da Semana</div>
          <div style="font-size: 1rem; font-weight: 600;">${diasTexto}</div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Bairros Atendidos (${rota.bairros.length})</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${rota.bairros.map(bairro => `
              <span style="background: rgba(0,200,81,0.1); color: var(--primary); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.875rem;">
                ${bairro}
              </span>
            `).join('')}
          </div>
        </div>
        
        ${rota.observacoes ? `
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">Observações</div>
            <div style="font-size: 0.95rem; white-space: pre-line;">${rota.observacoes}</div>
          </div>
        ` : ''}
        
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-primary" style="flex: 1;" onclick="editRoute(${rota.id}); closeRouteModal()">
            <i class="fas fa-edit"></i>
            Editar Rota
          </button>
          <button class="btn btn-outline" style="flex: 1;" onclick="showRouteOnMap(${rota.id}); closeRouteModal()">
            <i class="fas fa-map"></i>
            Ver no Mapa
          </button>
        </div>
      `;
      
      modal.classList.add('active');
    }
    
    // Fechar modal de rota
    function closeRouteModal() {
      document.getElementById('routeModal').classList.remove('active');
    }
    
    // Mostrar rota no mapa
    function showRouteOnMap(rotaId) {
      const rota = routes.find(r => r.id === rotaId);
      if (!rota) return;
      
      // Destacar rota no mapa
      highlightRouteOnMap(rota);
      
      // Mostrar tab de monitoramento
      showTab('monitoramento');
    }
    
    // Pré-visualizar rota
    function previewRoute() {
      const form = document.getElementById('form-rota');
      const formData = new FormData(form);
      
      // Coletar dados
      const bairrosSelecionados = Array.from(document.querySelectorAll('input[name="bairros"]:checked'))
        .map(cb => {
          const bairroId = parseInt(cb.value);
          const bairro = bairrosDivinopolis.find(b => b.id === bairroId);
          return bairro ? bairro.nome : '';
        })
        .filter(nome => nome !== '');
      
      const diasSelecionados = Array.from(document.querySelectorAll('input[name="dias"]:checked'))
        .map(cb => cb.value);
      
      if (bairrosSelecionados.length === 0) {
        showNotification('Atenção', 'Selecione pelo menos um bairro.', 'error');
        return;
      }
      
      const modal = document.getElementById('previewModal');
      const preview = document.getElementById('routePreview');
      
      const tipoTexto = getTipoColetaTexto(formData.get('rota-tipo'));
      const diasTexto = diasSelecionados.map(d => getDiaSemanaTexto(d)).join(', ');
      const frequenciaTexto = formData.get('rota-frequencia') === 'diaria' ? 'Diária' :
                             formData.get('rota-frequencia') === 'semanal' ? 'Semanal' :
                             formData.get('rota-frequencia') === 'quinzenal' ? 'Quinzenal' : 'Mensal';
      
      preview.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; color: white;">
              <i class="fas fa-route"></i>
            </div>
            <div>
              <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem;">${formData.get('rota-nome') || 'Nova Rota'}</div>
              <div style="font-size: 0.875rem; color: var(--gray-400);">Pré-visualização</div>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 0.75rem;">
            <div style="font-size: 0.75rem; color: var(--gray-400); margin-bottom: 0.25rem;">Horário</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${formData.get('rota-horario-inicio') || '--:--'} - ${formData.get('rota-horario-fim') || '--:--'}</div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 0.75rem;">
            <div style="font-size: 0.75rem; color: var(--gray-400); margin-bottom: 0.25rem;">Frequência</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${frequenciaTexto}</div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 0.75rem;">
            <div style="font-size: 0.75rem; color: var(--gray-400); margin-bottom: 0.25rem;">Tipo de Coleta</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${tipoTexto}</div>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.03); border-radius: 10px; padding: 0.75rem;">
            <div style="font-size: 0.75rem; color: var(--gray-400); margin-bottom: 0.25rem;">Dias</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${diasTexto || 'Nenhum selecionado'}</div>
          </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.875rem; color: var(--gray-400); margin-bottom: 0.5rem;">
            Bairros Selecionados (${bairrosSelecionados.length})
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${bairrosSelecionados.map(bairro => `
              <span style="background: rgba(0,200,81,0.1); color: var(--primary); padding: 0.5rem 0.75rem; border-radius: 6px; font-size: 0.875rem;">
                ${bairro}
              </span>
            `).join('')}
            ${bairrosSelecionados.length === 0 ? 
              '<span style="color: var(--gray-400); font-style: italic;">Nenhum bairro selecionado</span>' : ''}
          </div>
        </div>
        
        <div style="background: rgba(255, 165, 2, 0.05); border: 1px solid rgba(255, 165, 2, 0.2); border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--warning); margin-bottom: 0.5rem;">
            <i class="fas fa-info-circle"></i>
            <span style="font-weight: 600;">Estatísticas Estimadas</span>
          </div>
          <div style="font-size: 0.875rem; color: var(--gray-300);">
            <div>• Distância aproximada: ${(bairrosSelecionados.length * 3.5).toFixed(1)} km</div>
            <div>• Tempo estimado: ${(bairrosSelecionados.length * 12)} minutos</div>
            <div>• Capacidade necessária: ${(bairrosSelecionados.length * 0.8).toFixed(1)} toneladas</div>
            <div>• Caminhões necessários: ${Math.ceil(bairrosSelecionados.length / 5)}</div>
          </div>
        </div>
        
        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="closePreviewModal()">
            <i class="fas fa-times"></i>
            Fechar
          </button>
          <button class="btn btn-primary" style="flex: 1;" onclick="saveRoute(); closePreviewModal()">
            <i class="fas fa-check"></i>
            Confirmar e Salvar
          </button>
        </div>
      `;
      
      modal.classList.add('active');
    }
    
    // Fechar modal de pré-visualização
    function closePreviewModal() {
      document.getElementById('previewModal').classList.remove('active');
    }
    
    // Funções auxiliares
    function getTipoColetaTexto(tipo) {
      const tipos = {
        'domiciliar': 'Resíduo Domiciliar',
        'reciclavel': 'Material Reciclável',
        'seletiva': 'Coleta Seletiva',
        'volumoso': 'Móveis/Volumoso',
        'especial': 'Coleta Especial'
      };
      return tipos[tipo] || tipo;
    }
    
    function getDiaSemanaTexto(dia) {
      const dias = {
        'seg': 'Segunda-feira',
        'ter': 'Terça-feira',
        'qua': 'Quarta-feira',
        'qui': 'Quinta-feira',
        'sex': 'Sexta-feira',
        'sab': 'Sábado',
        'dom': 'Domingo'
      };
      return dias[dia] || dia;
    }
    
    function toggleBairro(id) {
      const checkbox = document.getElementById(`bairro-${id}`);
      const bairro = bairrosDivinopolis.find(b => b.id === id);
      if (bairro) {
        bairro.checked = checkbox.checked;
      }
    }
    
    function selectAllBairros() {
      const checkboxes = document.querySelectorAll('input[name="bairros"]');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      
      checkboxes.forEach(cb => {
        cb.checked = !allChecked;
        const bairroId = parseInt(cb.value);
        const bairro = bairrosDivinopolis.find(b => b.id === bairroId);
        if (bairro) {
          bairro.checked = !allChecked;
        }
      });
      
      showNotification(allChecked ? 'Desmarcados' : 'Selecionados', 
                      `Todos os bairros foram ${allChecked ? 'desmarcados' : 'selecionados'}.`, 
                      'info');
    }
    
    function loadDivinopolisTemplate() {
      // Preencher com dados de exemplo
      document.getElementById('rota-nome').value = 'Rota Divinópolis - Centro Expandido';
      document.getElementById('rota-horario-inicio').value = '06:00';
      document.getElementById('rota-horario-fim').value = '12:00';
      document.getElementById('rota-tipo').value = 'domiciliar';
      document.getElementById('rota-frequencia').value = 'semanal';
      
      // Selecionar alguns bairros centrais
      const bairrosCentrais = [1, 2, 3, 4, 5]; // IDs dos bairros centrais
      document.querySelectorAll('input[name="bairros"]').forEach(cb => {
        const bairroId = parseInt(cb.value);
        cb.checked = bairrosCentrais.includes(bairroId);
        
        const bairro = bairrosDivinopolis.find(b => b.id === bairroId);
        if (bairro) {
          bairro.checked = bairrosCentrais.includes(bairroId);
        }
      });
      
      // Selecionar dias úteis
      document.querySelectorAll('input[name="dias"]').forEach(cb => {
        cb.checked = ['seg', 'ter', 'qua', 'qui', 'sex'].includes(cb.value);
      });
      
      showNotification('Template carregado', 'Modelo de rota para Divinópolis carregado com sucesso.', 'success');
    }
    
    function filterRoutes(filter) {
      let filteredRoutes = [...routes];
      
      if (filter === 'active') {
        filteredRoutes = filteredRoutes.filter(r => r.status === 'ativa');
      } else if (filter === 'inactive') {
        filteredRoutes = filteredRoutes.filter(r => r.status === 'inativa');
      }
      
      // Atualizar tabela com rotas filtradas
      const tbody = document.getElementById('routesTable');
      // ... código para atualizar a tabela ...
      
      showNotification('Filtro aplicado', `${filteredRoutes.length} rotas encontradas.`, 'info');
    }
    
    function showRouteOptimization() {
      showNotification('Otimização', 'Sistema de otimização de rotas em desenvolvimento.', 'info');
    }
    
    function showMapLegend() {
      const legendHtml = `
        <div style="background: rgba(13, 27, 42, 0.95); padding: 1rem; border-radius: 10px; max-width: 250px;">
          <div style="font-weight: 600; margin-bottom: 0.75rem; color: var(--primary);">
            <i class="fas fa-layer-group"></i> Legenda do Mapa
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 12px; height: 12px; background: #00C851; border-radius: 50%;"></div>
            <span style="font-size: 0.875rem;">Rotas Ativas</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 12px; height: 12px; background: #FF4757; border-radius: 50%;"></div>
            <span style="font-size: 0.875rem;">Rotas Inativas</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 12px; height: 12px; background: #3A86FF; border-radius: 50%;"></div>
            <span style="font-size: 0.875rem;">Caminhões em Rota</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <div style="width: 12px; height: 12px; background: #FFA502; border-radius: 50%; border: 2px solid #FFA502;"></div>
            <span style="font-size: 0.875rem;">Pontos de Coleta</span>
          </div>
          <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: var(--gray-400);">
            <i class="fas fa-info-circle"></i> Clique nos ícones para mais informações
          </div>
        </div>
      `;
      
      // Adicionar legenda ao mapa
      const legend = L.control({ position: 'bottomleft' });
      legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = legendHtml;
        return div;
      };
      legend.addTo(map);
      
      // Remover após 10 segundos
      setTimeout(() => {
        legend.remove();
      }, 10000);
    }
    
    // Sistema de abas
    function showTab(tabName) {
      // Esconder todas as abas
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Remover classe active de todas as tabs
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Remover classe active de todos os itens do menu
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Mostrar aba selecionada
      document.getElementById(`tab-${tabName}`).classList.add('active');
      
      // Ativar tab correspondente
      const tabElement = document.querySelector(`.tab[onclick*="${tabName}"]`);
      if (tabElement) {
        tabElement.classList.add('active');
      }
      
      // Ativar item do menu correspondente
      const navItem = document.querySelector(`.nav-item[onclick*="${tabName}"]`);
      if (navItem) {
        navItem.classList.add('active');
      }
      
      // Fechar menu no mobile
      if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('active');
      }

      if (tabName === 'relatorios') {
        atualizarResumoRelatorio();
        renderRelatoriosTable();
      }
    }
    
    // Configurar busca
    function setupSearch() {
      const searchInput = document.getElementById('searchInput');
      searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length < 2) {
          loadRoutes();
          return;
        }
        
        // Filtrar rotas
        const filteredRoutes = routes.filter(rota => 
          rota.nome.toLowerCase().includes(searchTerm) ||
          rota.bairros.some(bairro => bairro.toLowerCase().includes(searchTerm)) ||
          rota.caminhao.toLowerCase().includes(searchTerm) ||
          rota.motorista.toLowerCase().includes(searchTerm)
        );
        
        // Atualizar visualização
        if (filteredRoutes.length > 0) {
          const tempRoutes = [...routes];
          routes = filteredRoutes;
          renderRoutesTable();
          renderRoutesCards();
          routes = tempRoutes;
        }
      });
    }

    function setupRelatorioForm() {
      const form = document.getElementById('form-relatorio');
      if (!form) return;

      atualizarResumoRelatorio();
      renderRelatoriosTable();

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await salvarRelatorio();
      });
    }

    async function salvarRelatorio() {
      const form = document.getElementById('form-relatorio');
      const formData = new FormData(form);
      const dados = calcularDadosRelatorio();
      const relatorio = {
        titulo: formData.get('titulo'),
        tipo: formData.get('tipo'),
        periodoInicio: formData.get('periodoInicio'),
        periodoFim: formData.get('periodoFim'),
        destinatario: formData.get('destinatario'),
        conteudo: montarConteudoRelatorio(formData),
        ...dados,
        status: 'salvo',
        criadoEm: new Date().toISOString()
      };

      if (usandoBanco) {
        try {
          await chamarApi('salvar_relatorio', {
            method: 'POST',
            body: JSON.stringify(relatorio)
          });
          await carregarDadosDoBanco();
          showNotification('Sucesso!', 'Relatório salvo no banco de dados.', 'success');
        } catch (erro) {
          showNotification('Erro', 'Não foi possível salvar o relatório no banco de dados.', 'error');
          return;
        }
      } else {
        relatorio.id = relatorios.length > 0 ? Math.max(...relatorios.map(r => r.id)) + 1 : 1;
        relatorios.unshift(relatorio);
        showNotification('Sucesso!', 'Relatório salvo localmente.', 'success');
      }

      form.reset();
      renderRelatoriosTable();
    }

    function renderRelatoriosTable() {
      const tbody = document.getElementById('relatoriosTable');
      if (!tbody) return;

      atualizarResumoRelatorio();

      if (relatorios.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 3rem; color: var(--gray-400);">
              Nenhum relatório salvo. Gere o primeiro relatório acima.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = relatorios.map(relatorio => {
        const periodo = `${relatorio.periodoInicio || '-'} até ${relatorio.periodoFim || '-'}`;
        const criadoEm = relatorio.criadoEm ? new Date(relatorio.criadoEm).toLocaleString('pt-BR') : '-';
        const statusClass = relatorio.status === 'enviado' ? 'status-completed' : 'status-pending';
        const statusText = relatorio.status === 'enviado' ? 'Enviado' : 'Salvo';

        return `
          <tr>
            <td style="font-weight: 600; color: var(--gray-300);">#${relatorio.id}</td>
            <td>
              <div style="font-weight: 600;">${relatorio.titulo}</div>
              <div style="font-size: 0.75rem; color: var(--gray-400);">${relatorio.destinatario || 'Sem destinatário'}</div>
            </td>
            <td>${relatorio.tipo}</td>
            <td>${periodo}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${criadoEm}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn view" onclick="verRelatorio(${relatorio.id})" title="Ver relatório">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn send" onclick="enviarRelatorio(${relatorio.id})" title="Enviar relatório">
                  <i class="fas fa-paper-plane"></i>
                </button>
                <button class="action-btn delete" onclick="excluirRelatorio(${relatorio.id})" title="Excluir relatório">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function previewRelatorio() {
      const form = document.getElementById('form-relatorio');
      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const modal = document.getElementById('previewModal');
      const preview = document.getElementById('routePreview');
      preview.innerHTML = `<pre style="white-space: pre-wrap; color: var(--gray-200); line-height: 1.6;">${montarConteudoRelatorio(formData)}</pre>`;
      modal.classList.add('active');
    }

    function verRelatorio(id) {
      const relatorio = relatorios.find(r => Number(r.id) === Number(id));
      if (!relatorio) return;

      const modal = document.getElementById('previewModal');
      const preview = document.getElementById('routePreview');
      preview.innerHTML = `<pre style="white-space: pre-wrap; color: var(--gray-200); line-height: 1.6;">${relatorio.conteudo}</pre>`;
      modal.classList.add('active');
    }

    async function enviarRelatorio(id) {
      const relatorio = relatorios.find(r => Number(r.id) === Number(id));
      if (!relatorio) return;

      if (!relatorio.destinatario && !confirm('Este relatório não tem destinatário. Deseja marcar como enviado mesmo assim?')) {
        return;
      }

      if (usandoBanco) {
        try {
          await chamarApi(`enviar_relatorio&id=${id}`, { method: 'POST' });
          await carregarDadosDoBanco();
        } catch (erro) {
          showNotification('Erro', 'Não foi possível enviar o relatório.', 'error');
          return;
        }
      } else {
        relatorio.status = 'enviado';
        relatorio.enviadoEm = new Date().toISOString();
      }

      renderRelatoriosTable();
      showNotification('Enviado!', 'Relatório marcado como enviado.', 'success');
    }

    async function excluirRelatorio(id) {
      if (!confirm('Tem certeza que deseja excluir este relatório?')) return;

      if (usandoBanco) {
        try {
          await chamarApi(`excluir_relatorio&id=${id}`, { method: 'DELETE' });
          await carregarDadosDoBanco();
        } catch (erro) {
          showNotification('Erro', 'Não foi possível excluir o relatório.', 'error');
          return;
        }
      } else {
        relatorios = relatorios.filter(r => Number(r.id) !== Number(id));
      }

      renderRelatoriosTable();
      showNotification('Excluído!', 'Relatório removido com sucesso.', 'success');
    }
    
    // Sistema de Cadastro de Motoristas (mantido do código anterior)
    let editingId = null;
    let drivers = [];
    
    function loadDriversData() {
      if (!drivers.length) {
        drivers = [
          { id: 1, nome: 'João Silva', email: 'joao@coletadivinopolis.com.br', telefone: '(37) 99999-1111', veiculo: 'CAM-001', status: 'ativo' },
          { id: 2, nome: 'Maria Santos', email: 'maria@coletadivinopolis.com.br', telefone: '(37) 99999-2222', veiculo: 'CAM-002', status: 'ativo' },
          { id: 3, nome: 'Carlos Oliveira', email: 'carlos@coletadivinopolis.com.br', telefone: '(37) 99999-3333', veiculo: 'CAM-003', status: 'ferias' },
          { id: 4, nome: 'Ana Costa', email: 'ana@coletadivinopolis.com.br', telefone: '(37) 99999-4444', veiculo: 'CAM-004', status: 'ativo' },
          { id: 5, nome: 'Pedro Martins', email: 'pedro@coletadivinopolis.com.br', telefone: '(37) 99999-5555', veiculo: 'CAM-005', status: 'ativo' },
          { id: 6, nome: 'Beatriz Lima', email: 'beatriz@coletadivinopolis.com.br', telefone: '(37) 99999-6666', veiculo: 'CAM-006', status: 'ativo' },
          { id: 7, nome: 'Ricardo Souza', email: 'ricardo@coletadivinopolis.com.br', telefone: '(37) 99999-7777', veiculo: 'CAM-007', status: 'manutencao' },
          { id: 8, nome: 'Fernanda Alves', email: 'fernanda@coletadivinopolis.com.br', telefone: '(37) 99999-8888', veiculo: 'CAM-008', status: 'ativo' }
        ];
      }

      motoristas = drivers;
      
      renderDriversTable();
    }
    
    function setupDriverForm() {
      const form = document.getElementById('form-cadastro');
      const cancelBtn = document.getElementById('btn-cancelar');
      
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const driver = {
          id: editingId,
          nome: formData.get('nome'),
          email: formData.get('email'),
          telefone: formData.get('telefone'),
          veiculo: formData.get('veiculo'),
          status: formData.get('status'),
          observacao: formData.get('observacao')
        };

        if (usandoBanco) {
          try {
            await chamarApi('salvar_motorista', {
              method: 'POST',
              body: JSON.stringify(driver)
            });
            await carregarDadosDoBanco();
            showNotification('Sucesso!', editingId ? 'Motorista atualizado no banco de dados.' : 'Motorista cadastrado no banco de dados.', 'success');
          } catch (erro) {
            showNotification('Erro', 'Não foi possível salvar o motorista no banco de dados.', 'error');
            return;
          }
        } else {
        
          if (editingId) {
            // Editar
            const index = drivers.findIndex(d => d.id === editingId);
            drivers[index] = { ...drivers[index], ...driver };
            showNotification('Sucesso!', 'Motorista atualizado com sucesso.', 'success');
          } else {
            // Novo
            driver.id = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
            drivers.push(driver);
            showNotification('Sucesso!', 'Motorista cadastrado com sucesso.', 'success');
          }

          motoristas = drivers;
        }
        
        // Limpar formulário
        form.reset();
        cancelBtn.style.display = 'none';
        editingId = null;
        
        // Atualizar tabela
        renderDriversTable();
        
        // Atualizar select de motoristas
        loadMotoristasSelect();
      });
      
      cancelBtn.addEventListener('click', function() {
        document.getElementById('form-cadastro').reset();
        this.style.display = 'none';
        editingId = null;
      });
      
      // Carregar dados iniciais
      loadDriversData();
    }
    
    function renderDriversTable() {
      const tbody = document.getElementById('tbody');
      atualizarResumoRelatorio();
      
      if (drivers.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 3rem; color: var(--gray-400);">
              <div style="margin-bottom: 1rem; font-size: 3rem; color: var(--gray-600);">
                <i class="fas fa-users"></i>
              </div>
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Nenhum motorista cadastrado</div>
              <div>Comece cadastrando um novo motorista acima.</div>
            </td>
          </tr>
        `;
        return;
      }
      
      tbody.innerHTML = drivers.map(driver => `
        <tr>
          <td style="font-weight: 600; color: var(--gray-300);">#${driver.id}</td>
          <td>
            <div style="font-weight: 600;">${driver.nome}</div>
            <div style="font-size: 0.75rem; color: var(--gray-400);">${driver.observacao || 'Sem observações'}</div>
          </td>
          <td>${driver.email}</td>
          <td>${driver.telefone}</td>
          <td>${driver.veiculo || '-'}</td>
          <td>
            <span class="status-badge ${driver.status === 'ativo' ? 'status-active' : 'status-inactive'}">
              ${driver.status === 'ativo' ? 'Ativo' : 
                driver.status === 'inativo' ? 'Inativo' : 
                driver.status === 'ferias' ? 'Férias' : 'Manutenção'}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit" onclick="editDriver(${driver.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" onclick="deleteDriver(${driver.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
    
    function editDriver(id) {
      const driver = drivers.find(d => d.id === id);
      if (!driver) return;
      
      // Preencher formulário
      document.getElementById('nome').value = driver.nome;
      document.getElementById('email').value = driver.email;
      document.getElementById('telefone').value = driver.telefone;
      document.getElementById('veiculo').value = driver.veiculo;
      document.getElementById('status').value = driver.status;
      document.getElementById('observacao').value = driver.observacao || '';
      
      // Mostrar botão cancelar
      document.getElementById('btn-cancelar').style.display = 'flex';
      
      // Salvar ID em edição
      editingId = id;
      
      // Mostrar tab de cadastro
      showTab('cadastro');
      
      showNotification('Edição', 'Preencha os dados e salve as alterações.', 'info');
    }
    
    async function deleteDriver(id) {
      if (confirm('Tem certeza que deseja excluir este motorista?')) {
        if (usandoBanco) {
          try {
            await chamarApi(`excluir_motorista&id=${id}`, { method: 'DELETE' });
            await carregarDadosDoBanco();
          } catch (erro) {
            showNotification('Erro', 'Não foi possível excluir o motorista do banco de dados.', 'error');
            return;
          }
        } else {
          drivers = drivers.filter(d => d.id !== id);
          motoristas = drivers;
        }
        renderDriversTable();
        loadMotoristasSelect();
        showNotification('Excluído!', 'Motorista removido com sucesso.', 'success');
      }
    }
    
    // Sistema de Importação de CSV
    function abrirImportarCSV() {
      const arquivo = document.getElementById('arquivo-csv');
      arquivo.click();
    }
    
    document.getElementById('arquivo-csv').addEventListener('change', async function(e) {
      const arquivo = e.target.files[0];
      if (!arquivo) return;

      // Validar arquivo
      if (!arquivo.name.endsWith('.csv')) {
        showNotification('Erro', 'Por favor, selecione um arquivo CSV válido.', 'error');
        return;
      }

      try {
        const conteudo = await lerArquivo(arquivo);
        const motoristas = parseCSV(conteudo);

        if (motoristas.length === 0) {
          showNotification('Erro', 'O arquivo CSV não contém dados válidos.', 'error');
          return;
        }

        // Validar formato
        const erros = validarMotoristas(motoristas);
        if (erros.length > 0) {
          showNotification('Erro de Validação', erros.join('\n'), 'error');
          return;
        }

        // Importar motoristas
        await importarMotoristas(motoristas);
        
        showNotification('Sucesso!', `${motoristas.length} motorista(s) importado(s) com sucesso.`, 'success');
        
        // Limpar input
        this.value = '';
        
        // Atualizar tabela
        renderDriversTable();
        loadMotoristasSelect();
      } catch (erro) {
        showNotification('Erro', erro.message, 'error');
        this.value = '';
      }
    });
    
    function lerArquivo(arquivo) {
      return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = (e) => resolve(e.target.result);
        leitor.onerror = () => reject(new Error('Erro ao ler o arquivo'));
        leitor.readAsText(arquivo);
      });
    }
    
    function parseCSV(conteudo) {
      const linhas = conteudo.split('\n').map(l => l.trim()).filter(l => l);
      if (linhas.length <= 1) return [];

      const cabecalho = linhas[0].split(',').map(h => h.trim().toLowerCase());
      const motoristas = [];

      for (let i = 1; i < linhas.length; i++) {
        const valores = linhas[i].split(',').map(v => v.trim());
        const motorista = {};

        cabecalho.forEach((col, idx) => {
          motorista[col] = valores[idx] || '';
        });

        if (motorista.nome) {
          motoristas.push(motorista);
        }
      }

      return motoristas;
    }
    
    function validarMotoristas(motoristas) {
      const erros = [];

      motoristas.forEach((m, idx) => {
        const linha = idx + 2;
        
        if (!m.nome || m.nome.length < 3) {
          erros.push(`Linha ${linha}: Nome é obrigatório e deve ter pelo menos 3 caracteres`);
        }
        
        if (m.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) {
          erros.push(`Linha ${linha}: Email inválido`);
        }
        
        if (m.status && !['ativo', 'inativo', 'ferias', 'manutencao'].includes(m.status.toLowerCase())) {
          erros.push(`Linha ${linha}: Status deve ser: ativo, inativo, férias ou manutenção`);
        }
      });

      return erros;
    }
    
    async function importarMotoristas(motoristas) {
      if (usandoBanco) {
        for (const m of motoristas) {
          try {
            await chamarApi('salvar_motorista', {
              method: 'POST',
              body: JSON.stringify({
                nome: m.nome,
                email: m.email || '',
                telefone: m.telefone || '',
                veiculo: m.veiculo || '',
                status: (m.status || 'ativo').toLowerCase(),
                observacao: m.observacao || ''
              })
            });
          } catch (erro) {
            console.error(`Erro ao importar ${m.nome}:`, erro);
            throw new Error(`Erro ao importar motorista: ${m.nome}`);
          }
        }
        await carregarDadosDoBanco();
      } else {
        // Importar localmente
        motoristas.forEach(m => {
          const novoId = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
          drivers.push({
            id: novoId,
            nome: m.nome,
            email: m.email || '',
            telefone: m.telefone || '',
            veiculo: m.veiculo || '',
            status: (m.status || 'ativo').toLowerCase(),
            observacao: m.observacao || ''
          });
        });
        motoristas = drivers;
      }
    }
    
    // Variáveis Globais de Configuração
    let activeTileLayer;

    // Sistema de Ajustes / Configurações do Sistema
    let systemSettings = {
      mapTheme: 'dark',
      gpsInterval: '10',
      soundAlerts: true,
      proximityLimit: 200
    };

    function initSystemSettings() {
      const stored = localStorage.getItem('lixoon_settings');
      if (stored) {
        systemSettings = { ...systemSettings, ...JSON.parse(stored) };
      }
      
      // Aplicar valores nos inputs do HTML
      const mapThemeEl = document.getElementById('settingMapTheme');
      const gpsIntervalEl = document.getElementById('settingGpsInterval');
      const soundAlertsEl = document.getElementById('settingSoundAlerts');
      const proximityEl = document.getElementById('settingProximity');
      
      if (mapThemeEl) mapThemeEl.value = systemSettings.mapTheme;
      if (gpsIntervalEl) gpsIntervalEl.value = systemSettings.gpsInterval;
      if (soundAlertsEl) soundAlertsEl.checked = systemSettings.soundAlerts;
      if (proximityEl) proximityEl.value = systemSettings.proximityLimit;
      
      setupSettingsListeners();
      
      // Esperar o mapa inicializar para carregar o tema customizado
      setTimeout(() => {
        if (systemSettings.mapTheme !== 'dark') {
          changeMapTheme(systemSettings.mapTheme, false); // não notificar no carregamento inicial
        }
      }, 800);
    }

    function saveSystemSetting(key, value) {
      systemSettings[key] = value;
      localStorage.setItem('lixoon_settings', JSON.stringify(systemSettings));
    }

    function toggleSoundAlerts(enabled) {
      saveSystemSetting('soundAlerts', enabled);
      showNotification('Ajustes', `Notificações sonoras ${enabled ? 'ativadas' : 'desativadas'}.`, 'info');
    }

    function changeGpsInterval(seconds) {
      saveSystemSetting('gpsInterval', seconds);
      showNotification('Ajustes', `Intervalo de rastreamento definido para: ${seconds === 'manual' ? 'Manual' : seconds + 's'}.`, 'success');
    }

    function changeProximityLimit(meters) {
      saveSystemSetting('proximityLimit', parseInt(meters, 10));
      showNotification('Ajustes', `Limite de proximidade alterado para ${meters} metros.`, 'success');
    }

    function changeMapTheme(theme, notify = true) {
      if (!map || !activeTileLayer) return;
      
      map.removeLayer(activeTileLayer);
      
      let url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      let attribution = '©OpenStreetMap, ©CartoDB';
      
      if (theme === 'light') {
        url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      } else if (theme === 'satellite') {
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      }
      
      activeTileLayer = L.tileLayer(url, {
        attribution: attribution,
        maxZoom: 19
      }).addTo(map);
      
      if (notify) {
        showNotification('Mapa Atualizado', `Estilo do mapa alterado para: ${theme === 'dark' ? 'Escuro' : theme === 'light' ? 'Claro' : 'Satélite'}.`, 'success');
      }
      
      saveSystemSetting('mapTheme', theme);
    }

    function resetSettings() {
      systemSettings = {
        mapTheme: 'dark',
        gpsInterval: '10',
        soundAlerts: true,
        proximityLimit: 200
      };
      
      const mapThemeEl = document.getElementById('settingMapTheme');
      const gpsIntervalEl = document.getElementById('settingGpsInterval');
      const soundAlertsEl = document.getElementById('settingSoundAlerts');
      const proximityEl = document.getElementById('settingProximity');
      
      if (mapThemeEl) mapThemeEl.value = 'dark';
      if (gpsIntervalEl) gpsIntervalEl.value = '10';
      if (soundAlertsEl) soundAlertsEl.checked = true;
      if (proximityEl) proximityEl.value = 200;
      
      changeMapTheme('dark', false);
      localStorage.setItem('lixoon_settings', JSON.stringify(systemSettings));
      showNotification('Ajustes', 'Todas as configurações foram resetadas para os padrões.', 'info');
    }

    function setupSettingsListeners() {
      const btn = document.getElementById('settingsBtn');
      const dropdown = document.getElementById('settingsDropdown');
      if (!btn || !dropdown) return;
      
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });

      // Clicar fora para fechar o dropdown
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
    }

    // Sistema de Notificações
    let notifications = [];

    function initNotifications() {
      const stored = localStorage.getItem('lixoon_notifications');
      if (stored) {
        notifications = JSON.parse(stored);
      } else {
        // Alertas iniciais
        notifications = [
          {
            id: 1,
            title: 'Caminhão Coletor 1',
            message: 'Iniciou a Rota Divinópolis Centro',
            type: 'success',
            timestamp: Date.now() - 5 * 60 * 1000,
            read: false
          },
          {
            id: 2,
            title: 'Agendamento Confirmado',
            message: 'Coleta seletiva agendada para Bairro Bom Pastor',
            type: 'info',
            timestamp: Date.now() - 15 * 60 * 1000,
            read: false
          },
          {
            id: 3,
            title: 'Alerta de Tráfego',
            message: 'Caminhão 3 com velocidade reduzida na Av. Paraná',
            type: 'warning',
            timestamp: Date.now() - 30 * 60 * 1000,
            read: false
          }
        ];
        saveNotifications();
      }
      renderNotifications();
      setupNotificationListeners();
    }

    function saveNotifications() {
      localStorage.setItem('lixoon_notifications', JSON.stringify(notifications));
    }

    function addNotificationToList(title, message, type = 'success') {
      // Evitar duplicidades idênticas em curto período de 3 segundos
      const isDuplicate = notifications.length > 0 && 
                          notifications[0].title === title && 
                          notifications[0].message === message &&
                          (Date.now() - notifications[0].timestamp < 3000);
      
      if (isDuplicate) return;

      const newNotification = {
        id: Date.now(),
        title: title,
        message: message,
        type: type,
        timestamp: Date.now(),
        read: false
      };
      notifications.unshift(newNotification);
      saveNotifications();
      renderNotifications();
    }

    function renderNotifications() {
      const listContainer = document.getElementById('notificationDropdownList');
      const badge = document.getElementById('notificationBadge');
      if (!listContainer) return;

      const unreadCount = notifications.filter(n => !n.read).length;
      if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
      }

      if (notifications.length === 0) {
        listContainer.innerHTML = `
          <div class="notification-empty">
            <i class="fas fa-bell-slash"></i>
            <span>Nenhuma notificação por enquanto</span>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = notifications.map(n => {
        const timeDiff = Date.now() - n.timestamp;
        let timeStr = 'Agora';
        if (timeDiff < 60000) {
          timeStr = 'Agora';
        } else if (timeDiff < 3600000) {
          timeStr = `Há ${Math.floor(timeDiff / 60000)} min`;
        } else if (timeDiff < 86400000) {
          timeStr = `Há ${Math.floor(timeDiff / 3600000)} h`;
        } else {
          timeStr = new Date(n.timestamp).toLocaleDateString('pt-BR');
        }

        let iconClass = 'info';
        let faIcon = 'info-circle';
        if (n.type === 'success') {
          iconClass = 'success';
          faIcon = 'check-circle';
        } else if (n.type === 'warning') {
          iconClass = 'warning';
          faIcon = 'exclamation-circle';
        } else if (n.type === 'error' || n.type === 'danger') {
          iconClass = 'danger';
          faIcon = 'times-circle';
        }

        return `
          <div class="notification-item ${n.read ? '' : 'unread'}" onclick="toggleNotificationRead(${n.id}, event)">
            <div class="notification-item-icon ${iconClass}">
              <i class="fas fa-${faIcon}"></i>
            </div>
            <div class="notification-item-content">
              <span class="notification-item-title">${escapeHTML(n.title)}</span>
              <span class="notification-item-message">${escapeHTML(n.message)}</span>
              <span class="notification-item-time">${timeStr}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function toggleNotificationRead(id, event) {
      if (event) event.stopPropagation();
      const index = notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        notifications[index].read = !notifications[index].read;
        saveNotifications();
        renderNotifications();
      }
    }

    function markAllNotificationsAsRead() {
      notifications.forEach(n => n.read = true);
      saveNotifications();
      renderNotifications();
      showNotification('LixoOn', 'Todas as notificações marcadas como lidas.', 'success');
    }

    function clearAllNotifications() {
      notifications = [];
      saveNotifications();
      renderNotifications();
      showNotification('LixoOn', 'Notificações limpas.', 'info');
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }

    function setupNotificationListeners() {
      const btn = document.getElementById('notificationBtn');
      const dropdown = document.getElementById('notificationDropdown');
      if (!btn || !dropdown) return;
      
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });

      // Clicar fora para fechar o dropdown
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
    }

    function showNotification(title, message, type = 'success') {
      const toast = document.getElementById('notificationToast');
      const toastTitle = document.getElementById('toastTitle');
      const toastMessage = document.getElementById('toastMessage');
      const toastIcon = toast.querySelector('.notification-icon');
      
      // Configurar tipo
      toastIcon.className = `notification-icon ${type}`;
      toastIcon.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : (type === 'error' || type === 'danger' ? 'times' : 'exclamation')}"></i>`;
      
      // Configurar texto
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      
      // Mostrar toast
      toast.classList.add('show');
      
      // Esconder após 5 segundos
      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);

      // Adicionar à lista dinâmica (evitar recursão infinita se vier do markAll/clear que disparam showNotification)
      if (title !== 'LixoOn') {
        addNotificationToList(title, message, type);
      }
    }

    // Sistema de Agendamentos
    function setupAgendamentoForm() {
      const form = document.getElementById('form-agendamento');
      if (!form) return;

      // Carregar bairros
      loadBairrosAgendamento();
      
      // Renderizar tabela inicial
      renderAgendamentosTable();

      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await salvarAgendamento();
      });

      // Botão cancelar
      const cancelBtn = document.getElementById('btn-cancelar-agend');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
          form.reset();
        });
      }
    }

    function loadBairrosAgendamento() {
      const select = document.getElementById('agend-bairro');
      if (!select) return;

      select.innerHTML = '<option value="">Selecione um bairro</option>';
      
      bairrosDivinopolis.forEach(bairro => {
        const option = document.createElement('option');
        option.value = bairro.nome;
        option.textContent = bairro.nome;
        select.appendChild(option);
      });
    }

    async function salvarAgendamento() {
      const form = document.getElementById('form-agendamento');
      const formData = new FormData(form);

      const agendamento = {
        id: agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1,
        nome: formData.get('nome'),
        telefone: formData.get('telefone'),
        email: formData.get('email'),
        cpf: formData.get('cpf'),
        rua: formData.get('rua'),
        numero: formData.get('numero'),
        complemento: formData.get('complemento'),
        bairro: formData.get('bairro'),
        referencia: formData.get('referencia'),
        data: formData.get('data'),
        horario: formData.get('horario'),
        tipo: formData.get('tipo'),
        descricao: formData.get('descricao'),
        peso: formData.get('peso'),
        observacoes: formData.get('observacoes'),
        status: 'agendado',
        criadoEm: new Date().toISOString()
      };

      if (usandoBanco) {
        try {
          await chamarApi('salvar_agendamento', {
            method: 'POST',
            body: JSON.stringify(agendamento)
          });
          await carregarDadosDoBanco();
          showNotification('Sucesso!', 'Agendamento salvo no banco de dados.', 'success');
        } catch (erro) {
          showNotification('Erro', 'Não foi possível salvar o agendamento no banco de dados.', 'error');
          return;
        }
      } else {
        agendamentos.push(agendamento);
        showNotification('Sucesso!', 'Agendamento realizado com sucesso.', 'success');
      }

      form.reset();
      renderAgendamentosTable();
    }

    function renderAgendamentosTable() {
      const tbody = document.getElementById('tbodyAgendamentos');
      if (!tbody) return;

      if (agendamentos.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 3rem; color: var(--gray-400);">
              <div style="margin-bottom: 1rem; font-size: 3rem; color: var(--gray-600);">
                <i class="fas fa-calendar"></i>
              </div>
              <div style="font-weight: 600; margin-bottom: 0.5rem;">Nenhum agendamento realizado</div>
              <div>Comece criando um novo agendamento acima.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = agendamentos.map(agendamento => {
        const endereco = `${agendamento.rua}, ${agendamento.numero}`;
        const dataBr = new Date(agendamento.data).toLocaleDateString('pt-BR');
        const statusClass = agendamento.status === 'agendado' ? 'status-pending' : agendamento.status === 'coletado' ? 'status-completed' : 'status-cancelled';
        const statusTexto = agendamento.status === 'agendado' ? 'Agendado' : agendamento.status === 'coletado' ? 'Coletado' : 'Cancelado';

        return `
          <tr>
            <td style="font-weight: 600; color: var(--gray-300);">#${agendamento.id}</td>
            <td>${agendamento.nome}</td>
            <td>${agendamento.telefone}</td>
            <td>
              <div style="font-size: 0.875rem;">${endereco}</div>
              <div style="font-size: 0.75rem; color: var(--gray-400);">${agendamento.bairro}</div>
            </td>
            <td>${dataBr}</td>
            <td>${agendamento.tipo}</td>
            <td><span class="status-badge ${statusClass}">${statusTexto}</span></td>
            <td>
              <div class="action-buttons">
                <button class="action-btn edit" onclick="editarAgendamento(${agendamento.id})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="excluirAgendamento(${agendamento.id})">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    function editarAgendamento(id) {
      const agendamento = agendamentos.find(a => a.id === id);
      if (!agendamento) return;

      // Preencher formulário
      document.getElementById('agend-nome').value = agendamento.nome;
      document.getElementById('agend-telefone').value = agendamento.telefone;
      document.getElementById('agend-email').value = agendamento.email || '';
      document.getElementById('agend-cpf').value = agendamento.cpf || '';
      document.getElementById('agend-rua').value = agendamento.rua;
      document.getElementById('agend-numero').value = agendamento.numero;
      document.getElementById('agend-complemento').value = agendamento.complemento || '';
      document.getElementById('agend-bairro').value = agendamento.bairro;
      document.getElementById('agend-referencia').value = agendamento.referencia || '';
      document.getElementById('agend-data').value = agendamento.data;
      document.getElementById('agend-horario').value = agendamento.horario;
      document.getElementById('agend-tipo').value = agendamento.tipo;
      document.getElementById('agend-descricao').value = agendamento.descricao;
      document.getElementById('agend-peso').value = agendamento.peso || '';
      document.getElementById('agend-observacoes').value = agendamento.observacoes || '';

      // Mostrar tab de agendamentos
      showTab('agendamentos');

      showNotification('Edição', 'Preencha os dados e salve as alterações.', 'info');
    }

    function excluirAgendamento(id) {
      if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        agendamentos = agendamentos.filter(a => a.id !== id);
        renderAgendamentosTable();
        showNotification('Excluído!', 'Agendamento removido com sucesso.', 'success');
      }
    }
    
    // Atualizar estatísticas em tempo real
    setInterval(() => {
      // Rotas completadas
      const routesEl = document.getElementById('completed-routes');
      let routes = parseInt(routesEl.textContent);
      routes += Math.floor(Math.random() * 3);
      routesEl.textContent = routes;
      
      // Toneladas coletadas
      const tonsEl = document.getElementById('collected-tons');
      let tons = parseFloat(tonsEl.textContent);
      tons += (Math.random() * 1.5).toFixed(1);
      tonsEl.textContent = parseFloat(tons).toFixed(1);
    }, 10000);
  
