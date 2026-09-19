/**
 * LixoOn — Camada de Serviços (HTTP)
 * Interceptor centralizado para todas as requisições ao backend.
 * --------------------------------------------------
 */
'use strict';

const ApiService = (() => {

  // Cache simples em memória
  const _cache = new Map();

  /**
   * Faz uma requisição HTTP com retry, timeout e cache.
   */
  async function request(url, options = {}) {
    const {
      method = 'GET',
      body = null,
      cache = false,
      cacheTTL = APP_CONFIG.CACHE_TTL_MINUTES,
      timeout = APP_CONFIG.REQUEST_TIMEOUT_MS,
      retries = APP_CONFIG.MAX_RETRIES,
    } = options;

    // Checar cache
    const cacheKey = `${method}:${url}`;
    if (cache && method === 'GET' && _cache.has(cacheKey)) {
      const cached = _cache.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheTTL * 60 * 1000) {
        return cached.data;
      }
      _cache.delete(cacheKey);
    }

    // Checar conexão
    if (!navigator.onLine) {
      const offlineData = localStorage.getItem(cacheKey);
      if (offlineData) {
        console.warn('[ApiService] Offline — usando dados do localStorage');
        return JSON.parse(offlineData);
      }
      throw new Error('Sem conexão com a internet. Verifique sua rede.');
    }

    // Configurar fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions = {
      method,
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      signal: controller.signal,
    };
    if (body) fetchOptions.body = JSON.stringify(body);

    // Retry com backoff exponencial
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorBody}`);
        }

        const data = await response.json();

        // Armazenar no cache
        if (cache && method === 'GET') {
          _cache.set(cacheKey, { data, timestamp: Date.now() });
          try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
          } catch (e) { /* localStorage cheio, ignorar */ }
        }

        return data;

      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;

        if (error.name === 'AbortError') {
          throw new Error('A requisição excedeu o tempo limite. Tente novamente.');
        }

        if (attempt < retries) {
          const delay = APP_CONFIG.RETRY_DELAY_MS * Math.pow(2, attempt);
          console.warn(`[ApiService] Tentativa ${attempt + 1}/${retries} falhou. Retry em ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }

    throw lastError;
  }

  // -------------------------------------------------------
  // Endpoints públicos
  // -------------------------------------------------------

  const baseUrl = APP_CONFIG.API_BASE_URL;

  return {
    /** Carrega todos os dados iniciais (bairros, caminhões, motoristas, rotas) */
    carregarDados() {
      return request(`${baseUrl}?acao=dados`, { cache: true });
    },

    /** Salvar ou atualizar rota */
    salvarRota(rota) {
      _cache.clear();
      return request(`${baseUrl}?acao=salvar_rota`, { method: 'POST', body: rota });
    },

    /** Excluir rota */
    excluirRota(id) {
      _cache.clear();
      return request(`${baseUrl}?acao=excluir_rota&id=${id}`, { method: 'GET' });
    },

    /** Salvar ou atualizar motorista */
    salvarMotorista(motorista) {
      _cache.clear();
      return request(`${baseUrl}?acao=salvar_motorista`, { method: 'POST', body: motorista });
    },

    /** Excluir motorista */
    excluirMotorista(id) {
      _cache.clear();
      return request(`${baseUrl}?acao=excluir_motorista&id=${id}`, { method: 'GET' });
    },

    /** Salvar relatório */
    salvarRelatorio(relatorio) {
      return request(`${baseUrl}?acao=salvar_relatorio`, { method: 'POST', body: relatorio });
    },

    /** Excluir relatório */
    excluirRelatorio(id) {
      return request(`${baseUrl}?acao=excluir_relatorio&id=${id}`, { method: 'GET' });
    },

    /** Enviar relatório */
    enviarRelatorio(id) {
      return request(`${baseUrl}?acao=enviar_relatorio&id=${id}`, { method: 'GET' });
    },

    /** Limpar cache manualmente */
    limparCache() {
      _cache.clear();
    },
  };
})();
