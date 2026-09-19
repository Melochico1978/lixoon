
    // Sistema de Gerenciamento de Rotas
    let map;
    let routeMarkers = {};
    let routeLines = {};
    let routes = [];
    let editingRouteId = null;
    let isMapAvailable = false;
    let activeMapLegend = null;
    let activeMapLegendTimeout = null;
    let users = [];
    let currentUser = null;
    let pendingPasswordUserId = null;

    const USERS_STORAGE_KEY = 'lixoon_users_v1';
    const SESSION_STORAGE_KEY = 'lixoon_session_v1';
    const LOGIN_ATTEMPTS_KEY = 'lixoon_login_attempts_v1';
    const PERMISSIONS_STORAGE_KEY = 'lixoon_permissions_v1';
    const ROUTES_STORAGE_KEY = 'lixoon_routes_v1';
    const DRIVERS_STORAGE_KEY = 'lixoon_drivers_v1';
    const AUDIT_STORAGE_KEY = 'lixoon_audit_v1';
    const ZONES_STORAGE_KEY = 'lixoon_zones_v1';
    const BAIRROS_STORAGE_KEY = 'lixoon_bairros_v1';

    const DEFAULT_PERMISSIONS = {
      admin: { manageRoutes: true, manageDrivers: true, manageUsers: true },
      gerente: { manageRoutes: true, manageDrivers: true, manageUsers: false },
      operador: { manageRoutes: false, manageDrivers: false, manageUsers: false }
    };

    let permissionsMatrix = JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS));
    let collectionZones = [];
    
    // Bairros de Divinópolis - Regiões Oficiais
    const bairrosDivinopolis = [
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
    const caminhoes = [
      { id: 'CAM-001', placa: 'DIV-1234', tipo: 'Compactor 15m³', status: 'disponivel' },
      { id: 'CAM-002', placa: 'DIV-5678', tipo: 'Compactor 20m³', status: 'disponivel' },
      { id: 'CAM-003', placa: 'DIV-9012', tipo: 'Basculante 10m³', status: 'disponivel' },
      { id: 'CAM-004', placa: 'DIV-3456', tipo: 'Compactor 15m³', status: 'disponivel' },
      { id: 'CAM-005', placa: 'DIV-7890', tipo: 'Compactor 15m³', status: 'em_manutencao' },
      { id: 'CAM-006', placa: 'DIV-2468', tipo: 'Basculante 10m³', status: 'disponivel' }
    ];
    
    // Motoristas disponíveis
    const motoristas = [
      { id: 1, nome: 'João Silva', status: 'ativo' },
      { id: 2, nome: 'Maria Santos', status: 'ativo' },
      { id: 3, nome: 'Carlos Oliveira', status: 'ferias' },
      { id: 4, nome: 'Ana Costa', status: 'ativo' },
      { id: 5, nome: 'Pedro Martins', status: 'ativo' },
      { id: 6, nome: 'Beatriz Lima', status: 'ativo' },
      { id: 7, nome: 'Ricardo Souza', status: 'manutencao' },
      { id: 8, nome: 'Fernanda Alves', status: 'ativo' }
    ];

    const driversExemplo = [
      { id: 1, nome: 'João Silva', email: 'joao@coletadivinopolis.com.br', telefone: '(37) 99999-1111', veiculo: 'CAM-001', status: 'ativo' },
      { id: 2, nome: 'Maria Santos', email: 'maria@coletadivinopolis.com.br', telefone: '(37) 99999-2222', veiculo: 'CAM-002', status: 'ativo' },
      { id: 3, nome: 'Carlos Oliveira', email: 'carlos@coletadivinopolis.com.br', telefone: '(37) 99999-3333', veiculo: 'CAM-003', status: 'ferias' },
      { id: 4, nome: 'Ana Costa', email: 'ana@coletadivinopolis.com.br', telefone: '(37) 99999-4444', veiculo: 'CAM-004', status: 'ativo' },
      { id: 5, nome: 'Pedro Martins', email: 'pedro@coletadivinopolis.com.br', telefone: '(37) 99999-5555', veiculo: 'CAM-005', status: 'ativo' },
      { id: 6, nome: 'Beatriz Lima', email: 'beatriz@coletadivinopolis.com.br', telefone: '(37) 99999-6666', veiculo: 'CAM-006', status: 'ativo' },
      { id: 7, nome: 'Ricardo Souza', email: 'ricardo@coletadivinopolis.com.br', telefone: '(37) 99999-7777', veiculo: 'CAM-007', status: 'manutencao' },
      { id: 8, nome: 'Fernanda Alves', email: 'fernanda@coletadivinopolis.com.br', telefone: '(37) 99999-8888', veiculo: 'CAM-008', status: 'ativo' }
    ];
    
    // Rotas de exemplo
    const rotasExemplo = [
      {
        id: 1,
        nome: "Rota Centro - Zona Sul",
        bairros: ["Centro", "Santa Rosa", "Esplanada"],
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
        bairros: ["São Sebastião", "Eldorado", "Danilo Passos"],
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
        bairros: ["Jardim Belvedere", "Niterói", "Bom Pastor"],
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
        bairros: ["São Luiz", "Cidade Jardim", "Interlagos"],
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
    
    // Inicialização do Sistema
    document.addEventListener('DOMContentLoaded', function() {
      // Controle do Menu
      const menuToggle = document.getElementById('menuToggle');
      const sidebar = document.getElementById('sidebar');
      
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
      
      // Fechar menu ao clicar fora (em mobile)
      document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
        }
      });
      
      // Inicializar Mapa para Divinópolis/MG
      initMap();
      
      // Carregar dados iniciais
      loadBairrosData();
      loadRoutes();
      loadDriversData();
      loadZonesData();
      loadInitialData();
      loadBairros();
      loadCaminhoesSelect();
      loadMotoristasSelect();
      
      // Configurar formulário de rotas
      setupRouteForm();
      setupZonesForm();
      
      // Configurar formulário de motoristas
      setupDriverForm();
      
      // Configurar busca
      setupSearch();

      // Configurar autenticacao e permissao
      initAuthSystem();
    });

    function initAuthSystem() {
      ensureDefaultAdminUser();
      loadUsersFromStorage();
      loadPermissionsFromStorage();
      bindAuthEvents();
      bindUserManagementEvents();

      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession);
        const sessionUser = users.find(u => u.id === session.userId && u.status === 'ativo');
        if (sessionUser) {
          applyAuthenticatedUser(sessionUser);
          return;
        }
      }

      showLoginOverlay();
    }

    function ensureDefaultAdminUser() {
      const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      if (existingUsers.length > 0) return;

      const adminUser = {
        id: 1,
        nome: 'Administrador do Sistema',
        email: 'admin@lixoon.local',
        perfil: 'admin',
        status: 'ativo',
        senha: 'Admin@123',
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
        createdBy: 'system'
      };

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    }

    function loadUsersFromStorage() {
      users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    }

    function saveUsersToStorage() {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }

    function saveRoutesData() {
      localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(routes));
    }

    function saveDriversData() {
      localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(drivers));
    }

    function loadBairrosData() {
      const storedBairros = JSON.parse(localStorage.getItem(BAIRROS_STORAGE_KEY) || 'null');
      if (!Array.isArray(storedBairros) || storedBairros.length === 0) {
        saveBairrosData();
        return;
      }

      storedBairros.forEach(item => {
        const bairro = bairrosDivinopolis.find(b => b.id === item.id);
        if (!bairro) return;
        if (typeof item.zona === 'string' && item.zona.trim()) {
          bairro.zona = item.zona;
        }
        if (typeof item.checked === 'boolean') {
          bairro.checked = item.checked;
        }
      });
    }

    function saveBairrosData() {
      const payload = bairrosDivinopolis.map(bairro => ({
        id: bairro.id,
        zona: bairro.zona,
        checked: !!bairro.checked
      }));
      localStorage.setItem(BAIRROS_STORAGE_KEY, JSON.stringify(payload));
    }

    function getDefaultZones() {
      const uniqueNames = [...new Set(bairrosDivinopolis.map(bairro => bairro.zona).filter(Boolean))];
      return uniqueNames.map((name, index) => ({
        id: index + 1,
        nome: name,
        status: 'ativa',
        descricao: 'Zona padrao baseada nos bairros cadastrados.'
      }));
    }

    function loadZonesData() {
      const storedZones = JSON.parse(localStorage.getItem(ZONES_STORAGE_KEY) || 'null');
      if (Array.isArray(storedZones) && storedZones.length > 0) {
        collectionZones = storedZones;
      } else {
        collectionZones = getDefaultZones();
        saveZonesData();
      }
      renderZonesTable();
      renderZoneBindingSelectors();
    }

    function saveZonesData() {
      localStorage.setItem(ZONES_STORAGE_KEY, JSON.stringify(collectionZones));
    }

    function logAudit(action, entity, payload = {}) {
      const history = JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
      history.unshift({
        when: new Date().toISOString(),
        user: currentUser ? currentUser.email : 'system',
        action,
        entity,
        payload
      });
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(history.slice(0, 200)));
      renderAuditTable();
    }

    function getProfilesList() {
      return ['admin', 'gerente', 'operador'];
    }

    function getActionsList() {
      return ['manageRoutes', 'manageDrivers', 'manageUsers'];
    }

    function normalizePermissionsMatrix(rawMatrix) {
      const normalized = {};

      getProfilesList().forEach(profile => {
        normalized[profile] = {};
        getActionsList().forEach(action => {
          const value = rawMatrix && rawMatrix[profile] ? rawMatrix[profile][action] : DEFAULT_PERMISSIONS[profile][action];
          normalized[profile][action] = !!value;
        });
      });

      // Regra de segurança: admin sempre com acesso total
      normalized.admin.manageRoutes = true;
      normalized.admin.manageDrivers = true;
      normalized.admin.manageUsers = true;

      return normalized;
    }

    function loadPermissionsFromStorage() {
      const raw = JSON.parse(localStorage.getItem(PERMISSIONS_STORAGE_KEY) || 'null');
      permissionsMatrix = normalizePermissionsMatrix(raw || DEFAULT_PERMISSIONS);
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissionsMatrix));
    }

    function savePermissionsToStorage() {
      localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissionsMatrix));
    }

    function renderPermissionsForm() {
      const form = document.getElementById('permissionsForm');
      if (!form) return;

      getProfilesList().forEach(profile => {
        getActionsList().forEach(action => {
          const checkbox = form.querySelector(`input[data-profile="${profile}"][data-action="${action}"]`);
          if (checkbox) {
            checkbox.checked = !!permissionsMatrix[profile][action];
          }
        });
      });
    }

    function savePermissionsFromForm() {
      if (!canManageUsers()) {
        showNotification('Permissao negada', 'Somente quem gerencia usuarios pode alterar permissoes.', 'error');
        return;
      }

      const form = document.getElementById('permissionsForm');
      const nextMatrix = {};

      getProfilesList().forEach(profile => {
        nextMatrix[profile] = {};
        getActionsList().forEach(action => {
          const checkbox = form.querySelector(`input[data-profile="${profile}"][data-action="${action}"]`);
          nextMatrix[profile][action] = checkbox ? checkbox.checked : false;
        });
      });

      permissionsMatrix = normalizePermissionsMatrix(nextMatrix);
      savePermissionsToStorage();
      renderPermissionsForm();
      updatePermissionUI();
      logAudit('permissions.updated', 'permissions', { updatedBy: currentUser ? currentUser.email : 'unknown' });
      showNotification('Permissoes atualizadas', 'Regras de perfil salvas com sucesso.', 'success');
    }

    function bindAuthEvents() {
      const loginForm = document.getElementById('loginForm');
      const changePasswordForm = document.getElementById('changePasswordForm');
      const logoutBtn = document.getElementById('btnLogoutSidebar');

      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const senha = document.getElementById('loginPassword').value;
        handleLogin(email, senha);
      });

      changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePasswordChange();
      });

      logoutBtn.addEventListener('click', function() {
        logout();
      });
    }

    function handleLogin(email, senha) {
      const attempts = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
      const attemptData = attempts[email] || { count: 0, blockedUntil: 0 };
      const now = Date.now();

      if (attemptData.blockedUntil && now < attemptData.blockedUntil) {
        const remainingMinutes = Math.ceil((attemptData.blockedUntil - now) / 60000);
        showNotification('Login bloqueado', `Tente novamente em ${remainingMinutes} minuto(s).`, 'error');
        return;
      }

      const user = users.find(u => u.email.toLowerCase() === email);
      if (!user || user.senha !== senha || user.status !== 'ativo') {
        attemptData.count += 1;
        if (attemptData.count >= 5) {
          attemptData.blockedUntil = now + 5 * 60 * 1000;
          attemptData.count = 0;
        }
        attempts[email] = attemptData;
        localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
        showNotification('Acesso negado', 'Credenciais invalidas ou usuario inativo.', 'error');
        return;
      }

      attempts[email] = { count: 0, blockedUntil: 0 };
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));

      if (user.mustChangePassword) {
        pendingPasswordUserId = user.id;
        showChangePasswordCard();
        return;
      }

      applyAuthenticatedUser(user);
    }

    function handlePasswordChange() {
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!newPassword || newPassword.length < 8) {
        showNotification('Senha inválida', 'A nova senha deve ter pelo menos 8 caracteres.', 'error');
        return;
      }

      const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (!specialCharsRegex.test(newPassword)) {
        showNotification('Senha fraca', 'A senha deve conter ao menos um caractere especial (ex: !@#$%^&*).', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        showNotification('Senha invalida', 'As senhas nao conferem.', 'error');
        return;
      }

      const userIndex = users.findIndex(u => u.id === pendingPasswordUserId);
      if (userIndex === -1) {
        showNotification('Erro', 'Usuario nao encontrado para trocar senha.', 'error');
        return;
      }

      users[userIndex].senha = newPassword;
      users[userIndex].mustChangePassword = false;
      saveUsersToStorage();

      const updatedUser = users[userIndex];
      pendingPasswordUserId = null;
      applyAuthenticatedUser(updatedUser);
      showNotification('Senha atualizada', 'Nova senha registrada com sucesso.', 'success');
    }

    function applyAuthenticatedUser(user) {
      currentUser = user;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: user.id, loggedAt: new Date().toISOString() }));

      updateSidebarUserInfo();
      updatePermissionUI();
      renderUsersTable();
      hideAuthOverlay();
    }

    function updateSidebarUserInfo() {
      const nameEl = document.getElementById('sidebarUserName');
      const roleEl = document.getElementById('sidebarUserRole');
      const avatarEl = document.getElementById('sidebarUserAvatar');

      nameEl.textContent = currentUser ? currentUser.nome : 'Nao autenticado';
      roleEl.textContent = currentUser ? getRoleLabel(currentUser.perfil) : 'Aguardando login';
      avatarEl.textContent = currentUser ? getInitials(currentUser.nome) : '--';
    }

    function updatePermissionUI() {
      const adminPanel = document.getElementById('adminUsersPanel');
      if (canManageUsers()) {
        adminPanel.style.display = 'block';
      } else {
        adminPanel.style.display = 'none';
      }

      renderPermissionsForm();

      const canManageRoutesPermission = canManageRoutes();
      const canManageDriversPermission = canManageDrivers();

      const navCadastro = document.getElementById('nav-cadastro');
      const navOptimization = document.getElementById('nav-optimization');
      const navAuditoria = document.getElementById('nav-auditoria');
      const tabCadastroButton = document.getElementById('tab-button-cadastro');
      const tabCadastroRotasButton = document.getElementById('tab-button-cadastro-rotas');
      const tabAuditoriaButton = document.getElementById('tab-button-auditoria');
      const sidebarNewRouteBtn = document.getElementById('btn-new-route-sidebar');
      const topOptimizationBtn = document.getElementById('btn-top-optimization');
      const saveRouteBtn = document.getElementById('btn-save-route');
      const previewRouteBtn = document.getElementById('btn-preview-route');
      const selectAllBairrosBtn = document.getElementById('btn-select-all-bairros');
      const saveZoneBtn = document.getElementById('btn-save-zone');
      const assignZoneBairroBtn = document.getElementById('btn-assign-zone-bairro');
      const moveZoneBairrosBtn = document.getElementById('btn-move-zone-bairros');
      const saveDriverBtn = document.getElementById('btn-save-driver');

      if (navCadastro) navCadastro.style.display = canManageDriversPermission ? 'flex' : 'none';
      if (navOptimization) navOptimization.style.display = canManageRoutesPermission ? 'flex' : 'none';
      if (navAuditoria) navAuditoria.style.display = canManageUsers() ? 'flex' : 'none';
      if (tabCadastroButton) tabCadastroButton.style.display = canManageDriversPermission ? 'flex' : 'none';
      if (tabCadastroRotasButton) tabCadastroRotasButton.style.display = canManageRoutesPermission ? 'flex' : 'none';
      if (tabAuditoriaButton) tabAuditoriaButton.style.display = canManageUsers() ? 'flex' : 'none';
      if (sidebarNewRouteBtn) sidebarNewRouteBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (topOptimizationBtn) topOptimizationBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';

      if (saveRouteBtn) saveRouteBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (previewRouteBtn) previewRouteBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (selectAllBairrosBtn) selectAllBairrosBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (saveZoneBtn) saveZoneBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (assignZoneBairroBtn) assignZoneBairroBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (moveZoneBairrosBtn) moveZoneBairrosBtn.style.display = canManageRoutesPermission ? 'inline-flex' : 'none';
      if (saveDriverBtn) saveDriverBtn.style.display = canManageDriversPermission ? 'inline-flex' : 'none';

      document.querySelectorAll('#form-rota input, #form-rota select, #form-rota textarea').forEach(field => {
        field.disabled = !canManageRoutesPermission;
      });

      document.querySelectorAll('#form-zona-coleta input, #form-zona-coleta select, #form-zona-coleta textarea').forEach(field => {
        field.disabled = !canManageRoutesPermission;
      });

      document.querySelectorAll('#form-vinculo-zona-bairro input, #form-vinculo-zona-bairro select, #form-vinculo-zona-bairro textarea').forEach(field => {
        field.disabled = !canManageRoutesPermission;
      });

      document.querySelectorAll('#form-transferencia-zona-lote input, #form-transferencia-zona-lote select, #form-transferencia-zona-lote textarea').forEach(field => {
        field.disabled = !canManageRoutesPermission;
      });

      document.querySelectorAll('#form-cadastro input, #form-cadastro select, #form-cadastro textarea').forEach(field => {
        field.disabled = !canManageDriversPermission;
      });

      renderRoutesTable();
      renderRoutesCards();
      renderZonesTable();
      renderDriversTable();
      renderAuditTable();
    }

    function hasRole(perfisPermitidos) {
      return !!(currentUser && perfisPermitidos.includes(currentUser.perfil));
    }

    function hasPermission(action) {
      if (!currentUser) return false;
      const profilePermissions = permissionsMatrix[currentUser.perfil] || {};
      return !!profilePermissions[action];
    }

    function canManageRoutes() {
      return hasPermission('manageRoutes');
    }

    function canManageDrivers() {
      return hasPermission('manageDrivers');
    }

    function canManageUsers() {
      return hasPermission('manageUsers');
    }

    function canAccessTab(tabName) {
      const restricoes = {
        'cadastro-rotas': canManageRoutes,
        'cadastro': canManageDrivers,
        'auditoria': canManageUsers
      };

      if (!restricoes[tabName]) return true;
      return restricoes[tabName]();
    }

    function showLoginOverlay() {
      const overlay = document.getElementById('authOverlay');
      const loginCard = document.getElementById('loginCard');
      const changeCard = document.getElementById('changePasswordCard');
      overlay.classList.add('active');
      document.body.classList.add('auth-locked');
      loginCard.classList.remove('hidden');
      changeCard.classList.add('hidden');
    }

    function showChangePasswordCard() {
      const loginCard = document.getElementById('loginCard');
      const changeCard = document.getElementById('changePasswordCard');
      loginCard.classList.add('hidden');
      changeCard.classList.remove('hidden');
    }

    function hideAuthOverlay() {
      document.getElementById('authOverlay').classList.remove('active');
      document.body.classList.remove('auth-locked');
    }

    function logout() {
      currentUser = null;
      localStorage.removeItem(SESSION_STORAGE_KEY);
      showLoginOverlay();
      updateSidebarUserInfo();
      updatePermissionUI();
      showNotification('Sessao encerrada', 'Voce saiu do sistema.', 'info');
    }

    function getInitials(nome) {
      return nome
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0].toUpperCase())
        .join('');
    }

    function getRoleLabel(perfil) {
      const labels = {
        admin: 'Administrador',
        gerente: 'Gerente',
        operador: 'Operador'
      };
      return labels[perfil] || perfil;
    }

    function bindUserManagementEvents() {
      const form = document.getElementById('form-user-create');
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        createSystemUser();
      });

      const permissionsForm = document.getElementById('permissionsForm');
      if (permissionsForm) {
        permissionsForm.addEventListener('submit', function(e) {
          e.preventDefault();
          savePermissionsFromForm();
        });
      }

      const refreshAuditBtn = document.getElementById('btn-audit-refresh');
      if (refreshAuditBtn) {
        refreshAuditBtn.addEventListener('click', function() {
          renderAuditTable();
        });
      }

      const clearAuditBtn = document.getElementById('btn-audit-clear');
      if (clearAuditBtn) {
        clearAuditBtn.addEventListener('click', function() {
          clearAuditLogs();
        });
      }

      const resetAuditFiltersBtn = document.getElementById('btn-audit-reset-filters');
      if (resetAuditFiltersBtn) {
        resetAuditFiltersBtn.addEventListener('click', function() {
          resetAuditFilters();
        });
      }

      const exportCsvBtn = document.getElementById('btn-audit-export-csv');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
          exportAuditLogs('csv');
        });
      }

      const exportJsonBtn = document.getElementById('btn-audit-export-json');
      if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', function() {
          exportAuditLogs('json');
        });
      }

      ['audit-filter-action', 'audit-filter-user', 'audit-filter-date-from', 'audit-filter-date-to'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function() {
          renderAuditTable();
        });
        el.addEventListener('change', function() {
          renderAuditTable();
        });
      });
    }

    function setupZonesForm() {
      const form = document.getElementById('form-zona-coleta');
      if (!form) return;

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        createCollectionZone();
      });

      const bindForm = document.getElementById('form-vinculo-zona-bairro');
      if (bindForm) {
        bindForm.addEventListener('submit', function(e) {
          e.preventDefault();
          assignBairroToZone();
        });
      }

      const bulkForm = document.getElementById('form-transferencia-zona-lote');
      if (bulkForm) {
        bulkForm.addEventListener('submit', function(e) {
          e.preventDefault();
          moveBairrosBetweenZones();
        });
      }

      renderZoneBindingSelectors();
    }

    function renderZoneBindingSelectors() {
      const bairroSelect = document.getElementById('bairro-select-zona');
      const zonaSelect = document.getElementById('zona-select-bairro');
      if (!bairroSelect || !zonaSelect) return;

      const selectedBairro = bairroSelect.value;
      const selectedZona = zonaSelect.value;

      const bairrosSorted = [...bairrosDivinopolis].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      bairroSelect.innerHTML = '<option value="">Selecione um bairro</option>' + bairrosSorted.map(bairro => (
        `<option value="${bairro.id}">${escapeHtml(bairro.nome)} (Zona ${escapeHtml(bairro.zona)})</option>`
      )).join('');

      const zonesSorted = [...collectionZones].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      zonaSelect.innerHTML = '<option value="">Selecione uma zona</option>' + zonesSorted.map(zone => (
        `<option value="${escapeHtml(zone.nome)}">${escapeHtml(zone.nome)} ${zone.status === 'inativa' ? '(Inativa)' : ''}</option>`
      )).join('');

      if (selectedBairro && bairrosDivinopolis.some(b => String(b.id) === String(selectedBairro))) {
        bairroSelect.value = selectedBairro;
      }
      if (selectedZona && collectionZones.some(z => z.nome === selectedZona)) {
        zonaSelect.value = selectedZona;
      }

      renderZoneBulkSelectors();
    }

    function renderZoneBulkSelectors() {
      const sourceSelect = document.getElementById('zona-source-bulk');
      const targetSelect = document.getElementById('zona-target-bulk');
      if (!sourceSelect || !targetSelect) return;

      const selectedSource = sourceSelect.value;
      const selectedTarget = targetSelect.value;
      const zonesSorted = [...collectionZones].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

      const optionsHtml = '<option value="">Selecione a zona</option>' + zonesSorted.map(zone => (
        `<option value="${escapeHtml(zone.nome)}">${escapeHtml(zone.nome)} ${zone.status === 'inativa' ? '(Inativa)' : ''}</option>`
      )).join('');

      sourceSelect.innerHTML = optionsHtml;
      targetSelect.innerHTML = optionsHtml;

      if (selectedSource && collectionZones.some(z => z.nome === selectedSource)) {
        sourceSelect.value = selectedSource;
      }

      if (selectedTarget && collectionZones.some(z => z.nome === selectedTarget)) {
        targetSelect.value = selectedTarget;
      }
    }

    function assignBairroToZone() {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode vincular bairro em zona.', 'error');
        return;
      }

      const bairroSelect = document.getElementById('bairro-select-zona');
      const zonaSelect = document.getElementById('zona-select-bairro');
      if (!bairroSelect || !zonaSelect) return;

      const bairroId = parseInt(bairroSelect.value, 10);
      const targetZone = zonaSelect.value;
      const bairro = bairrosDivinopolis.find(item => item.id === bairroId);
      const zoneExists = collectionZones.some(zone => zone.nome === targetZone);

      if (!bairro || !targetZone || !zoneExists) {
        showNotification('Dados incompletos', 'Selecione bairro e zona validos.', 'error');
        return;
      }

      const oldZone = bairro.zona;
      if (oldZone === targetZone) {
        showNotification('Sem alteracoes', 'Este bairro ja pertence a zona selecionada.', 'info');
        return;
      }

      bairro.zona = targetZone;
      saveBairrosData();
      loadBairros();
      renderZoneBindingSelectors();
      logAudit('zone.bairro_assigned', 'zone', { bairro: bairro.nome, from: oldZone, to: targetZone });
      showNotification('Vinculo atualizado', `${bairro.nome} agora pertence a zona ${targetZone}.`, 'success');
    }

    function moveBairrosBetweenZones() {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode mover bairros entre zonas.', 'error');
        return;
      }

      const sourceSelect = document.getElementById('zona-source-bulk');
      const targetSelect = document.getElementById('zona-target-bulk');
      if (!sourceSelect || !targetSelect) return;

      const sourceZone = sourceSelect.value;
      const targetZone = targetSelect.value;

      if (!sourceZone || !targetZone) {
        showNotification('Dados incompletos', 'Selecione zona de origem e destino.', 'error');
        return;
      }

      if (sourceZone === targetZone) {
        showNotification('Operacao invalida', 'Origem e destino precisam ser diferentes.', 'error');
        return;
      }

      const bairrosToMove = bairrosDivinopolis.filter(bairro => bairro.zona === sourceZone);
      if (bairrosToMove.length === 0) {
        showNotification('Sem bairros', 'Nao ha bairros na zona de origem selecionada.', 'info');
        return;
      }

      if (!confirm(`Mover ${bairrosToMove.length} bairro(s) de ${sourceZone} para ${targetZone}?`)) {
        return;
      }

      bairrosToMove.forEach(bairro => {
        bairro.zona = targetZone;
      });

      saveBairrosData();
      loadBairros();
      renderZoneBindingSelectors();
      logAudit('zone.bairros_moved_bulk', 'zone', {
        from: sourceZone,
        to: targetZone,
        count: bairrosToMove.length,
        bairros: bairrosToMove.map(bairro => bairro.nome)
      });

      showNotification('Transferencia concluida', `${bairrosToMove.length} bairro(s) movidos para ${targetZone}.`, 'success');
    }

    function createCollectionZone() {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode cadastrar zonas.', 'error');
        return;
      }

      const nomeInput = document.getElementById('zona-nome');
      const descricaoInput = document.getElementById('zona-descricao');
      if (!nomeInput) return;

      const nome = (nomeInput.value || '').trim();
      const descricao = descricaoInput ? (descricaoInput.value || '').trim() : '';

      if (!nome) {
        showNotification('Dados incompletos', 'Informe o nome da zona.', 'error');
        return;
      }

      const duplicated = collectionZones.some(zone => zone.nome.toLowerCase() === nome.toLowerCase());
      if (duplicated) {
        showNotification('Duplicado', 'Ja existe uma zona com este nome.', 'error');
        return;
      }

      const newZone = {
        id: collectionZones.length > 0 ? Math.max(...collectionZones.map(zone => zone.id)) + 1 : 1,
        nome,
        status: 'ativa',
        descricao,
        createdAt: new Date().toISOString()
      };

      collectionZones.push(newZone);
      saveZonesData();
      renderZonesTable();
      loadBairros();
      renderZoneBindingSelectors();
      logAudit('zone.created', 'zone', { id: newZone.id, nome: newZone.nome });

      document.getElementById('form-zona-coleta').reset();
      showNotification('Zona cadastrada', 'Nova zona de coleta registrada com sucesso.', 'success');
    }

    function toggleCollectionZoneStatus(zoneId) {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode alterar zonas.', 'error');
        return;
      }

      const zone = collectionZones.find(item => item.id === zoneId);
      if (!zone) return;

      zone.status = zone.status === 'ativa' ? 'inativa' : 'ativa';
      saveZonesData();
      renderZonesTable();
      loadBairros();
      renderZoneBindingSelectors();
      logAudit('zone.status_toggled', 'zone', { id: zone.id, nome: zone.nome, status: zone.status });
      showNotification('Zona atualizada', `Zona ${zone.nome} agora esta ${zone.status}.`, 'info');
    }

    function deleteCollectionZone(zoneId) {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode remover zonas.', 'error');
        return;
      }

      const zone = collectionZones.find(item => item.id === zoneId);
      if (!zone) return;

      const usedByBairro = bairrosDivinopolis.some(bairro => bairro.zona.toLowerCase() === zone.nome.toLowerCase());
      if (usedByBairro) {
        showNotification('Operacao bloqueada', 'Esta zona possui bairros vinculados e nao pode ser removida.', 'error');
        return;
      }

      if (!confirm(`Deseja remover a zona ${zone.nome}?`)) {
        return;
      }

      collectionZones = collectionZones.filter(item => item.id !== zoneId);
      saveZonesData();
      renderZonesTable();
      loadBairros();
      renderZoneBindingSelectors();
      logAudit('zone.deleted', 'zone', { id: zone.id, nome: zone.nome });
      showNotification('Zona removida', 'Zona de coleta excluida com sucesso.', 'success');
    }

    function renderZonesTable() {
      const tbody = document.getElementById('zonesTable');
      if (!tbody) return;

      if (!Array.isArray(collectionZones) || collectionZones.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 1rem; color: var(--gray-400);">
              Nenhuma zona cadastrada.
            </td>
          </tr>
        `;
        return;
      }

      const allowManage = canManageRoutes();
      tbody.innerHTML = collectionZones.map(zone => `
        <tr>
          <td style="font-weight: 600; color: var(--gray-300);">#${zone.id}</td>
          <td>${escapeHtml(zone.nome)}</td>
          <td>
            <span class="status-badge ${zone.status === 'ativa' ? 'status-active' : 'status-inactive'}">
              ${zone.status === 'ativa' ? 'Ativa' : 'Inativa'}
            </span>
          </td>
          <td style="font-size: 0.85rem; color: var(--gray-400);">${escapeHtml(zone.descricao || 'Sem descricao')}</td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              ${allowManage ? `
                <button class="btn btn-outline" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;" onclick="toggleCollectionZoneStatus(${zone.id})">
                  <i class="fas fa-power-off"></i>
                  ${zone.status === 'ativa' ? 'Inativar' : 'Ativar'}
                </button>
                <button class="btn btn-danger" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;" onclick="deleteCollectionZone(${zone.id})">
                  <i class="fas fa-trash"></i>
                  Excluir
                </button>
              ` : `<span style="font-size: 0.8rem; color: var(--gray-400);">Somente leitura</span>`}
            </div>
          </td>
        </tr>
      `).join('');
    }

    function getAuditActionLabel(action) {
      const labels = {
        'permissions.updated': 'Permissões atualizadas',
        'user.created': 'Usuário criado',
        'user.password_reset': 'Senha resetada',
        'user.status_toggled': 'Status de usuário alterado',
        'route.created': 'Rota criada',
        'route.updated': 'Rota atualizada',
        'route.deleted': 'Rota excluída',
        'zone.created': 'Zona criada',
        'zone.status_toggled': 'Status de zona alterado',
        'zone.deleted': 'Zona excluida',
        'zone.bairro_assigned': 'Bairro vinculado a zona',
        'zone.bairros_moved_bulk': 'Bairros movidos em lote',
        'driver.created': 'Motorista criado',
        'driver.updated': 'Motorista atualizado',
        'driver.deleted': 'Motorista excluído',
        'audit.cleared': 'Logs de auditoria limpos'
      };
      return labels[action] || action;
    }

    function formatAuditDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function formatAuditPayload(payload) {
      const text = JSON.stringify(payload || {});
      return text.length > 180 ? `${text.slice(0, 177)}...` : text;
    }

    function getAuditHistory() {
      return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
    }

    function getFilteredAuditHistory() {
      const actionFilterEl = document.getElementById('audit-filter-action');
      const userFilterEl = document.getElementById('audit-filter-user');
      const fromFilterEl = document.getElementById('audit-filter-date-from');
      const toFilterEl = document.getElementById('audit-filter-date-to');

      const actionFilter = actionFilterEl ? actionFilterEl.value : '';
      const userFilter = userFilterEl ? userFilterEl.value.trim().toLowerCase() : '';
      const fromDate = fromFilterEl && fromFilterEl.value ? new Date(`${fromFilterEl.value}T00:00:00`) : null;
      const toDate = toFilterEl && toFilterEl.value ? new Date(`${toFilterEl.value}T23:59:59.999`) : null;

      return getAuditHistory().filter(item => {
        if (actionFilter && item.action !== actionFilter) return false;

        const itemUser = (item.user || '').toLowerCase();
        if (userFilter && !itemUser.includes(userFilter)) return false;

        if (fromDate || toDate) {
          const itemDate = new Date(item.when);
          if (Number.isNaN(itemDate.getTime())) return false;
          if (fromDate && itemDate < fromDate) return false;
          if (toDate && itemDate > toDate) return false;
        }

        return true;
      });
    }

    function populateAuditActionFilter() {
      const actionFilterEl = document.getElementById('audit-filter-action');
      if (!actionFilterEl) return;

      const selected = actionFilterEl.value;
      const actionSet = new Set(getAuditHistory().map(item => item.action).filter(Boolean));
      const actions = Array.from(actionSet).sort();

      actionFilterEl.innerHTML = '<option value="">Todas as acoes</option>' + actions.map(action => (
        `<option value="${escapeHtml(action)}">${escapeHtml(getAuditActionLabel(action))}</option>`
      )).join('');

      if (selected && actions.includes(selected)) {
        actionFilterEl.value = selected;
      }
    }

    function updateAuditResultCount(filteredCount, totalCount) {
      const countEl = document.getElementById('audit-result-count');
      if (!countEl) return;
      countEl.textContent = `Exibindo ${filteredCount} de ${totalCount} evento(s).`;
    }

    function renderAuditTable() {
      const tbody = document.getElementById('auditTableBody');
      if (!tbody) return;

      populateAuditActionFilter();

      if (!canManageUsers()) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 1rem; color: var(--gray-400);">
              Acesso restrito ao perfil com permissão de auditoria.
            </td>
          </tr>
        `;
        updateAuditResultCount(0, getAuditHistory().length);
        return;
      }

      const history = getAuditHistory();
      const filtered = getFilteredAuditHistory();
      updateAuditResultCount(filtered.length, history.length);

      if (!filtered.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 1rem; color: var(--gray-400);">
              Nenhum evento encontrado para os filtros aplicados.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.slice(0, 100).map(item => `
        <tr>
          <td>${escapeHtml(formatAuditDate(item.when))}</td>
          <td>${escapeHtml(item.user || '-')}</td>
          <td>${escapeHtml(getAuditActionLabel(item.action))}</td>
          <td>${escapeHtml(item.entity || '-')}</td>
          <td style="font-size: 0.8rem; color: var(--gray-400);">${escapeHtml(formatAuditPayload(item.payload))}</td>
        </tr>
      `).join('');
    }

    function resetAuditFilters() {
      const actionFilterEl = document.getElementById('audit-filter-action');
      const userFilterEl = document.getElementById('audit-filter-user');
      const fromFilterEl = document.getElementById('audit-filter-date-from');
      const toFilterEl = document.getElementById('audit-filter-date-to');

      if (actionFilterEl) actionFilterEl.value = '';
      if (userFilterEl) userFilterEl.value = '';
      if (fromFilterEl) fromFilterEl.value = '';
      if (toFilterEl) toFilterEl.value = '';

      renderAuditTable();
    }

    function downloadTextFile(filename, content, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    function exportAuditLogs(format) {
      if (!canManageUsers()) {
        showNotification('Permissão negada', 'Seu perfil não pode exportar auditoria.', 'error');
        return;
      }

      const filtered = getFilteredAuditHistory();
      if (!filtered.length) {
        showNotification('Sem dados', 'Nao ha eventos para exportar com os filtros atuais.', 'info');
        return;
      }

      const stamp = new Date().toISOString().replace(/[:.]/g, '-');

      if (format === 'csv') {
        const header = 'when,user,actionLabel,action,entity,payload';
        const rows = filtered.map(item => {
          const cols = [
            item.when || '',
            item.user || '',
            getAuditActionLabel(item.action),
            item.action || '',
            item.entity || '',
            JSON.stringify(item.payload || {})
          ];
          return cols.map(col => `"${String(col).replace(/"/g, '""')}"`).join(',');
        });
        downloadTextFile(`auditoria-${stamp}.csv`, [header, ...rows].join('\n'), 'text/csv;charset=utf-8');
        showNotification('Exportacao concluida', 'Arquivo CSV de auditoria gerado.', 'success');
        return;
      }

      const json = JSON.stringify(filtered, null, 2);
      downloadTextFile(`auditoria-${stamp}.json`, json, 'application/json;charset=utf-8');
      showNotification('Exportacao concluida', 'Arquivo JSON de auditoria gerado.', 'success');
    }

    function clearAuditLogs() {
      if (!canManageUsers()) {
        showNotification('Permissão negada', 'Seu perfil não pode limpar auditoria.', 'error');
        return;
      }

      if (!confirm('Deseja realmente limpar todos os logs de auditoria locais?')) {
        return;
      }

      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify([]));
      logAudit('audit.cleared', 'audit', { clearedBy: currentUser ? currentUser.email : 'unknown' });
      resetAuditFilters();
      renderAuditTable();
      showNotification('Auditoria limpa', 'Os logs locais foram removidos.', 'success');
    }

    function createSystemUser() {
      if (!canManageUsers()) {
        showNotification('Permissao negada', 'Seu perfil nao possui permissao para cadastrar usuarios.', 'error');
        return;
      }

      const nome = document.getElementById('user-nome').value.trim();
      const email = document.getElementById('user-email').value.trim().toLowerCase();
      const perfil = document.getElementById('user-perfil').value;
      const status = document.getElementById('user-status').value;
      const senha = document.getElementById('user-senha').value;

      if (!nome || !email || !senha) {
        showNotification('Dados incompletos', 'Preencha todos os campos obrigatorios.', 'error');
        return;
      }

      if (senha.length < 8) {
        showNotification('Senha fraca', 'A senha inicial deve ter no minimo 8 caracteres.', 'error');
        return;
      }

      const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (!specialCharsRegex.test(senha)) {
        showNotification('Senha fraca', 'A senha deve conter ao menos um caractere especial (ex: !@#$%^&*).', 'error');
        return;
      }

      const emailExists = users.some(u => u.email.toLowerCase() === email);
      if (emailExists) {
        showNotification('Duplicado', 'Ja existe usuario com este e-mail.', 'error');
        return;
      }

      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        nome,
        email,
        perfil,
        status,
        senha,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.email
      };

      users.push(newUser);
      saveUsersToStorage();
      logAudit('user.created', 'user', { id: newUser.id, email: newUser.email, perfil: newUser.perfil });
      renderUsersTable();
      document.getElementById('form-user-create').reset();
      showNotification('Usuario criado', 'Cadastro realizado com sucesso.', 'success');
    }

    function renderUsersTable() {
      const tbody = document.getElementById('usersTable');
      if (!tbody) return;

      if (!canManageUsers()) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 1rem; color: var(--gray-400);">
              Painel visivel apenas para administradores.
            </td>
          </tr>
        `;
        return;
      }

      if (users.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 1rem; color: var(--gray-400);">
              Nenhum usuario cadastrado.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = users.map(user => `
        <tr>
          <td>#${user.id}</td>
          <td>${user.nome}</td>
          <td>${user.email}</td>
          <td>${getRoleLabel(user.perfil)}</td>
          <td>
            <span class="status-badge ${user.status === 'ativo' ? 'status-active' : 'status-inactive'}">
              ${user.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit" title="Resetar senha" onclick="resetUserPassword(${user.id})">
                <i class="fas fa-key"></i>
              </button>
              <button class="action-btn delete" title="Ativar/Inativar" onclick="toggleUserStatus(${user.id})">
                <i class="fas fa-user-slash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    function resetUserPassword(userId) {
      if (!canManageUsers()) {
        showNotification('Permissao negada', 'Seu perfil nao possui permissao para resetar senhas.', 'error');
        return;
      }

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return;

      const tempPassword = prompt('Digite a nova senha temporaria para o usuario:');
      if (!tempPassword) return;
      if (tempPassword.length < 8) {
        showNotification('Senha invalida', 'A senha temporaria deve ter no minimo 8 caracteres.', 'error');
        return;
      }

      users[userIndex].senha = tempPassword;
      users[userIndex].mustChangePassword = true;
      saveUsersToStorage();
      logAudit('user.password_reset', 'user', { id: users[userIndex].id, email: users[userIndex].email });
      showNotification('Senha resetada', 'Senha temporaria definida com sucesso.', 'success');
    }

    function toggleUserStatus(userId) {
      if (!canManageUsers()) {
        showNotification('Permissao negada', 'Seu perfil nao possui permissao para alterar status de usuario.', 'error');
        return;
      }

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) return;

      if (users[userIndex].id === currentUser.id) {
        showNotification('Operacao bloqueada', 'Nao e permitido inativar o usuario logado.', 'error');
        return;
      }

      users[userIndex].status = users[userIndex].status === 'ativo' ? 'inativo' : 'ativo';
      saveUsersToStorage();
      logAudit('user.status_toggled', 'user', { id: users[userIndex].id, status: users[userIndex].status });
      renderUsersTable();
      showNotification('Status atualizado', 'Status do usuario alterado com sucesso.', 'success');
    }
    
    // Sistema de Mapa - DIVINÓPOLIS
    function initMap() {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.warn('Container do mapa não encontrado.');
        return;
      }

      if (typeof L === 'undefined') {
        showMapOfflineFallback('Mapa indisponível offline. Dados simulados continuam ativos.');
        return;
      }

      // Coordenadas de Divinópolis, Minas Gerais
      const divinopolisCenter = [-20.1389, -44.8833];
      
      try {
        // Criar mapa centralizado em Divinópolis
        map = L.map('map').setView(divinopolisCenter, 13);

        // Tile layer personalizada (estilo escuro)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '©OpenStreetMap, ©CartoDB',
          maxZoom: 19,
        }).addTo(map);

        // Plugin de localização é opcional
        if (L.control && typeof L.control.locate === 'function') {
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
              <div>Total de Rotas: ${(routes.length > 0 ? routes.length : rotasExemplo.length)}</div>
              <div>Caminhões Ativos: ${caminhoes.filter(c => c.status === 'disponivel').length}</div>
              <div>Bairros Cobertos: ${bairrosDivinopolis.length}</div>
            </div>
          </div>
        `);

        isMapAvailable = true;
      } catch (error) {
        console.error('Falha ao inicializar o mapa:', error);
        isMapAvailable = false;
        showMapOfflineFallback('Mapa indisponível no momento. Usando modo simulação offline.');
      }
    }

    function showMapOfflineFallback(message) {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) return;

      mapContainer.innerHTML = `
        <div style="height: 100%; min-height: 420px; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: linear-gradient(135deg, #0f1a2b, #162742); color: #e2e8f0; text-align: center;">
          <div>
            <div style="font-size: 2rem; margin-bottom: 0.75rem;"><i class="fas fa-map-marked-alt"></i></div>
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Mapa em modo offline</div>
            <div style="font-size: 0.9rem; color: #94a3b8;">${message}</div>
          </div>
        </div>
      `;
    }
    
    // Carregar dados iniciais
    function loadInitialData() {
      const activeRoutesCount = routes.filter(r => r.status === 'ativa').length;

      // Atualizar estatísticas
      document.getElementById('active-routes').textContent = activeRoutesCount;
      document.getElementById('live-count').textContent = activeRoutesCount;
      
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

      // Garantir exibicao de zonas cadastradas mesmo sem bairros vinculados
      collectionZones.forEach(zone => {
        if (!bairrosPorZona[zone.nome]) {
          bairrosPorZona[zone.nome] = [];
        }
      });

      const zoneOrder = collectionZones.map(zone => zone.nome);
      Object.keys(bairrosPorZona).forEach(zona => {
        if (!zoneOrder.includes(zona)) {
          zoneOrder.push(zona);
        }
      });
      
      // Criar cards para cada zona
      zoneOrder.forEach(zona => {
        const zonaCard = document.createElement('div');
        zonaCard.style.marginBottom = '1rem';

        const zoneConfig = collectionZones.find(item => item.nome === zona);
        const zoneActive = !zoneConfig || zoneConfig.status === 'ativa';
        const zoneColor = zoneActive ? 'var(--primary)' : 'var(--gray-400)';
        const zoneBackground = zoneActive ? 'rgba(0,200,81,0.1)' : 'rgba(148,163,184,0.1)';
        
        let bairrosHTML = `
          <div style="font-weight: 600; color: ${zoneColor}; margin-bottom: 0.5rem; padding: 0.5rem; background: ${zoneBackground}; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <span><i class="fas fa-map-marker-alt"></i> Zona ${escapeHtml(zona)}</span>
            <span style="font-size: 0.75rem; color: var(--gray-400);">${zoneActive ? 'Ativa' : 'Inativa'}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        `;

        if (bairrosPorZona[zona].length === 0) {
          bairrosHTML += `
            <div style="font-size: 0.8rem; color: var(--gray-400); padding: 0.5rem;">
              Nenhum bairro vinculado a esta zona.
            </div>
          `;
        }
        
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

      renderZoneBindingSelectors();
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

      const sourceDrivers = drivers.length > 0 ? drivers : motoristas;

      sourceDrivers.forEach(motorista => {
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

      routes.filter(rota => rota.status === 'ativa').forEach(rota => {
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
      if (!isMapAvailable || typeof L === 'undefined' || !map) {
        return;
      }

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
      if (!isMapAvailable || typeof L === 'undefined' || !map) {
        showNotification('Modo offline', 'Mapa indisponível. Visualização gráfica foi desativada.', 'info');
        return;
      }

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
      if (!isMapAvailable || typeof L === 'undefined' || !map) {
        showNotification('Modo offline', 'Mapa indisponível. Rotas continuam disponíveis na tabela.', 'info');
        return;
      }

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
      if (!isMapAvailable || typeof L === 'undefined' || !map) {
        showNotification('Modo offline', 'Mapa indisponível. Use a tabela para acompanhar rotas ativas.', 'info');
        return;
      }

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
      const storedRoutes = JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY) || 'null');
      if (Array.isArray(storedRoutes)) {
        routes = storedRoutes;
      } else {
        routes = [...rotasExemplo];
        saveRoutesData();
      }

      renderRoutesTable();
      renderRoutesCards();
    }
    
    // Renderizar tabela de rotas
    function renderRoutesTable() {
      const tbody = document.getElementById('routesTable');
      const allowManage = canManageRoutes();
      
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
                ${allowManage ? `
                <button class="action-btn edit" onclick="editRoute(${rota.id})">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteRoute(${rota.id})">
                  <i class="fas fa-trash"></i>
                </button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
    
    // Renderizar cards de rotas
    function renderRoutesCards() {
      const container = document.getElementById('routesCards');
      const allowManage = canManageRoutes();
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
              ${allowManage ? `
              <button class="action-btn edit" onclick="editRoute(${rota.id})">
                <i class="fas fa-edit"></i>
              </button>
              ` : ''}
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
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveRoute();
      });
      
      cancelBtn.addEventListener('click', function() {
        resetRouteForm();
        showNotification('Ação cancelada', 'Formulário de rota reinicializado.', 'info');
      });
    }
    
    // Salvar rota
    function saveRoute() {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil possui acesso somente leitura para rotas.', 'error');
        return;
      }

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
      
      const diasSelecionados = Array.from(document.querySelectorAll('input[name="dias"]:checked'))
        .map(cb => cb.value);
      
      const novaRota = {
        id: editingRouteId ? editingRouteId : (routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1),
        nome: formData.get('rota-nome'),
        bairros: bairrosSelecionados,
        caminhao: formData.get('rota-caminhao'),
        motorista: formData.get('rota-motorista'),
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
      
      if (editingRouteId) {
        // Atualizar rota existente
        const index = routes.findIndex(r => r.id === editingRouteId);
        routes[index] = novaRota;
        saveRoutesData();
        logAudit('route.updated', 'route', { id: novaRota.id, nome: novaRota.nome });
        showNotification('Sucesso!', 'Rota atualizada com sucesso.', 'success');
      } else {
        // Adicionar nova rota
        routes.push(novaRota);
        saveRoutesData();
        logAudit('route.created', 'route', { id: novaRota.id, nome: novaRota.nome });
        showNotification('Sucesso!', 'Rota cadastrada com sucesso.', 'success');
      }
      
      // Atualizar interface
      resetRouteForm();
      renderRoutesTable();
      renderRoutesCards();
      loadTrucksPanel();
      addRouteMarker(novaRota);
      
      // Atualizar estatísticas
      document.getElementById('active-routes').textContent = routes.filter(r => r.status === 'ativa').length;
      document.getElementById('live-count').textContent = routes.filter(r => r.status === 'ativa').length;
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
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode editar rotas.', 'error');
        return;
      }

      const rota = routes.find(r => r.id === id);
      if (!rota) return;
      
      // Preencher formulário
      document.getElementById('rota-nome').value = rota.nome;
      document.getElementById('rota-caminhao').value = rota.caminhao;
      document.getElementById('rota-motorista').value = rota.motorista;
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
    function deleteRoute(id) {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode remover rotas.', 'error');
        return;
      }

      if (confirm('Tem certeza que deseja excluir esta rota?')) {
        const deletedRoute = routes.find(r => r.id === id);
        routes = routes.filter(r => r.id !== id);
        saveRoutesData();
        logAudit('route.deleted', 'route', { id, nome: deletedRoute ? deletedRoute.nome : 'desconhecida' });
        
        // Remover do mapa
        if (isMapAvailable && routeMarkers[id]) {
          map.removeLayer(routeMarkers[id]);
          delete routeMarkers[id];
        }
        
        if (isMapAvailable && routeLines[id]) {
          map.removeLayer(routeLines[id]);
          delete routeLines[id];
        }
        
        // Atualizar interface
        renderRoutesTable();
        renderRoutesCards();
        loadTrucksPanel();
        
        // Atualizar estatísticas
        document.getElementById('active-routes').textContent = routes.filter(r => r.status === 'ativa').length;
        document.getElementById('live-count').textContent = routes.filter(r => r.status === 'ativa').length;
        
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
          ${canManageRoutes() ? `
          <button class="btn btn-primary" style="flex: 1;" onclick="editRoute(${rota.id}); closeRouteModal()">
            <i class="fas fa-edit"></i>
            Editar Rota
          </button>
          ` : ''}
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
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode criar ou alterar rotas.', 'error');
        return;
      }

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
        saveBairrosData();
      }
    }
    
    function selectAllBairros() {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode alterar bairros da rota.', 'error');
        return;
      }

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

      saveBairrosData();
      
      showNotification(allChecked ? 'Desmarcados' : 'Selecionados', 
                      `Todos os bairros foram ${allChecked ? 'desmarcados' : 'selecionados'}.`, 
                      'info');
    }
    
    function loadDivinopolisTemplate() {
      if (!canManageRoutes()) {
        showNotification('Permissao negada', 'Seu perfil nao pode carregar template de rota.', 'error');
        return;
      }

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

      saveBairrosData();
      
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
      
      const savedRoutes = routes;
      routes = filteredRoutes;
      renderRoutesTable();
      renderRoutesCards();
      routes = savedRoutes;
      
      showNotification('Filtro aplicado', `${filteredRoutes.length} rota(s) encontrada(s).`, 'info');
    }
    
    function showRouteOptimization() {
      window.location.href = 'otimizaçao.html';
    }

    function toggleExecutionRoutesPanel(buttonEl) {
      const panel = document.getElementById('mapOverlay');
      if (!panel) return;

      const isHidden = panel.classList.contains('hidden');
      panel.classList.toggle('hidden');

      if (buttonEl) {
        buttonEl.classList.toggle('active', isHidden);
      }
    }

    function openSidebarRouteDetails() {
      const selectedTruck = document.querySelector('.truck-item.active');
      if (selectedTruck && selectedTruck.dataset.id) {
        const selectedId = parseInt(selectedTruck.dataset.id, 10);
        if (!isNaN(selectedId)) {
          showRouteDetails(selectedId);
          return;
        }
      }

      const sourceRoutes = routes && routes.length > 0 ? routes : rotasExemplo;
      if (!sourceRoutes || sourceRoutes.length === 0) {
        showNotification('Sem rotas', 'Nenhuma rota disponível para exibir detalhes.', 'info');
        return;
      }

      showRouteDetails(sourceRoutes[0].id);
    }
    
    function showMapLegend() {
      if (!isMapAvailable || typeof L === 'undefined' || !map) {
        showNotification('Modo offline', 'Legenda do mapa indisponível sem carregamento do mapa.', 'info');
        return;
      }

      // Evita criar múltiplas legendas simultâneas (loop visual/empilhamento).
      if (activeMapLegend) {
        if (activeMapLegendTimeout) {
          clearTimeout(activeMapLegendTimeout);
        }
        activeMapLegendTimeout = setTimeout(() => {
          if (activeMapLegend) {
            activeMapLegend.remove();
            activeMapLegend = null;
          }
          activeMapLegendTimeout = null;
        }, 10000);
        return;
      }

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
      activeMapLegend = legend;
      
      // Remover após 10 segundos
      activeMapLegendTimeout = setTimeout(() => {
        if (activeMapLegend) {
          activeMapLegend.remove();
          activeMapLegend = null;
        }
        activeMapLegendTimeout = null;
      }, 10000);
    }
    
    // Sistema de abas
    function showTab(tabName) {
      if (!canAccessTab(tabName)) {
        showNotification('Acesso restrito', 'Seu perfil nao possui permissao para esta aba.', 'error');
        return;
      }

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
      const selectedTab = document.getElementById(`tab-${tabName}`);
      if (!selectedTab) {
        console.warn(`Aba não encontrada: tab-${tabName}`);
        return;
      }
      selectedTab.classList.add('active');
      
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
    
    // Sistema de Cadastro de Motoristas (mantido do código anterior)
    let editingId = null;
    let drivers = [];
    
    function loadDriversData() {
      const storedDrivers = JSON.parse(localStorage.getItem(DRIVERS_STORAGE_KEY) || 'null');
      if (Array.isArray(storedDrivers)) {
        drivers = storedDrivers;
      } else {
        drivers = [...driversExemplo];
        saveDriversData();
      }
      
      renderDriversTable();
    }
    
    function setupDriverForm() {
      const form = document.getElementById('form-cadastro');
      const cancelBtn = document.getElementById('btn-cancelar');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!canManageDrivers()) {
          showNotification('Permissao negada', 'Seu perfil possui acesso somente leitura para motoristas.', 'error');
          return;
        }
        
        const formData = new FormData(form);
        const driver = {
          nome: formData.get('nome'),
          email: formData.get('email'),
          telefone: formData.get('telefone'),
          veiculo: formData.get('veiculo'),
          status: formData.get('status'),
          observacao: formData.get('observacao')
        };
        
        if (editingId) {
          // Editar
          const index = drivers.findIndex(d => d.id === editingId);
          drivers[index] = { ...drivers[index], ...driver };
          saveDriversData();
          logAudit('driver.updated', 'driver', { id: editingId, nome: driver.nome });
          showNotification('Sucesso!', 'Motorista atualizado com sucesso.', 'success');
        } else {
          // Novo
          driver.id = drivers.length > 0 ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
          drivers.push(driver);
          saveDriversData();
          logAudit('driver.created', 'driver', { id: driver.id, nome: driver.nome });
          showNotification('Sucesso!', 'Motorista cadastrado com sucesso.', 'success');
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
      
      // Carregar dados iniciais (já carregados na inicialização)
    }
    
    function renderDriversTable() {
      const tbody = document.getElementById('tbody');
      const allowManage = canManageDrivers();
      
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
              ${allowManage ? `
              <button class="action-btn edit" onclick="editDriver(${driver.id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" onclick="deleteDriver(${driver.id})">
                <i class="fas fa-trash"></i>
              </button>
              ` : '<span style="font-size: 0.8rem; color: var(--gray-500);">Somente leitura</span>'}
            </div>
          </td>
        </tr>
      `).join('');
    }
    
    function editDriver(id) {
      if (!canManageDrivers()) {
        showNotification('Permissao negada', 'Seu perfil nao pode editar motoristas.', 'error');
        return;
      }

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
    
    function deleteDriver(id) {
      if (!canManageDrivers()) {
        showNotification('Permissao negada', 'Seu perfil nao pode remover motoristas.', 'error');
        return;
      }

      if (confirm('Tem certeza que deseja excluir este motorista?')) {
        const deletedDriver = drivers.find(d => d.id === id);
        drivers = drivers.filter(d => d.id !== id);
        saveDriversData();
        logAudit('driver.deleted', 'driver', { id, nome: deletedDriver ? deletedDriver.nome : 'desconhecido' });
        renderDriversTable();
        loadMotoristasSelect();
        showNotification('Excluído!', 'Motorista removido com sucesso.', 'success');
      }
    }
    
    // Sistema de Notificações
    function showNotification(title, message, type = 'success') {
      const toast = document.getElementById('notificationToast');
      const toastTitle = document.getElementById('toastTitle');
      const toastMessage = document.getElementById('toastMessage');
      const toastIcon = toast.querySelector('.notification-icon');
      
      // Configurar tipo
      const icons = { success: 'check', error: 'times', warning: 'exclamation-triangle', info: 'info-circle' };
      toastIcon.className = `notification-icon ${type}`;
      toastIcon.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i>`;
      
      // Configurar texto
      toastTitle.textContent = title;
      toastMessage.textContent = message;
      
      // Mostrar
      toast.classList.add('show');
      
      // Esconder após 5 segundos
      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    }
    
    // Atualizar estatísticas em tempo real (simulação)
    setInterval(() => {
      const tonsEl = document.getElementById('collected-tons');
      if (!tonsEl) return;
      const tons = parseFloat(tonsEl.textContent) + parseFloat((Math.random() * 1.5).toFixed(1));
      tonsEl.textContent = tons.toFixed(1);
    }, 10000);
  
