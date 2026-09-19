// Adaptado para Web: Serviço de API e WebSocket para dashboard
// Não depende de React Native

class ApiService {
  static instance = null;
  apiBaseURL = 'https://api.lixoon.com.br/api/v1';
  wsURL = 'wss://ws.lixoon.com.br';
  socket = null;
  listeners = [];

  static getInstance() {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  constructor() {
    this.setupWebSocket();
  }

  // Métodos HTTP usando fetch com tratamento de erros
  async getCaminhoes() {
    try {
      const response = await fetch(`${this.apiBaseURL}/caminhoes`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar caminhões:', error);
      throw error;
    }
  }

  async getCaminhaoProximo(lat, lng) {
    try {
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        throw new Error('Latitude e longitude devem ser números');
      }
      const response = await fetch(`${this.apiBaseURL}/caminhoes/proximo?lat=${lat}&lng=${lng}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar caminhão mais próximo:', error);
      throw error;
    }
  }

  async agendarColeta(data) {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Dados de agendamento inválidos');
      }
      const response = await fetch(`${this.apiBaseURL}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao agendar coleta:', error);
      throw error;
    }
  }

  async getRotas() {
    try {
      const response = await fetch(`${this.apiBaseURL}/rotas`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
      throw error;
    }
  }

  async getHistoricoColetas() {
    try {
      const response = await fetch(`${this.apiBaseURL}/historico`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar histórico de coletas:', error);
      throw error;
    }
  }

  async reportarProblema(data) {
    const formData = new FormData();
    formData.append('tipo', data.tipo);
    formData.append('localizacao', JSON.stringify(data.localizacao));
    formData.append('descricao', data.descricao);
    if (data.foto) {
      formData.append('foto', data.foto);
    }
    return fetch(`${this.apiBaseURL}/reportes`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());
  }

  // WebSocket com reconexão automática
  setupWebSocket() {
    const connect = () => {
      try {
        this.socket = new WebSocket(this.wsURL);
        
        this.socket.onopen = () => {
          console.log('WebSocket conectado');
          // Reseta tentativas de reconexão após conexão bem-sucedida
          this.reconnectAttempts = 0;
        };
        
        this.socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'locations:updates') {
              this.emitLocationUpdate(msg.data);
            }
          } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('Erro no WebSocket:', error);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket desconectado');
          // Reconexão automática com backoff exponencial
          if (this.reconnectAttempts < 5) {
            this.reconnectAttempts = (this.reconnectAttempts || 0) + 1;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts}/5)`);
            setTimeout(connect, delay);
          } else {
            console.error('Número máximo de tentativas de reconexão atingido');
          }
        };
      } catch (error) {
        console.error('Erro ao criar WebSocket:', error);
      }
    };
    
    this.reconnectAttempts = 0;
    connect();
  }

  subscribeToCaminhao(caminhaoId) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket não está conectado. Tentando reconectar...');
      this.setupWebSocket();
      return;
    }
    try {
      this.socket.send(JSON.stringify({ action: 'subscribe-locations', ids: [caminhaoId] }));
    } catch (error) {
      console.error('Erro ao subscrever caminhão:', error);
    }
  }

  unsubscribeFromCaminhao(caminhaoId) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket não está conectado.');
      return;
    }
    try {
      this.socket.send(JSON.stringify({ action: 'unsubscribe-locations', ids: [caminhaoId] }));
    } catch (error) {
      console.error('Erro ao cancelar subscrição:', error);
    }
  }

  updateDriverLocation(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket não está conectado. Não é possível atualizar localização.');
      return;
    }
    try {
      this.socket.send(JSON.stringify({ action: 'driver-update-location', ...data }));
    } catch (error) {
      console.error('Erro ao atualizar localização do motorista:', error);
    }
  }

  // Health Check
  async checkHealth() {
    try {
      const response = await fetch(this.apiBaseURL.replace('/api/v1', '') + '/health');
      return await response.json();
    } catch (error) {
      return { status: 'DOWN', error };
    }
  }

  // Event Emitter para atualizações de localização
  onLocationUpdate(callback) {
    this.listeners.push(callback);
  }

  emitLocationUpdate(data) {
    this.listeners.forEach(cb => cb(data));
  }
}

// Exemplo de uso:
// const api = ApiService.getInstance();
// api.getCaminhoes().then(console.log);

window.ApiService = ApiService; // Disponibiliza globalmente para uso no dashboard
