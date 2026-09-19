/**
 * LixoOn — Configuração Global
 * Centraliza constantes, URLs e feature flags.
 * --------------------------------------------------
 */
'use strict';

const APP_CONFIG = Object.freeze({
  // Versão do sistema
  VERSION: '2.0.0',
  APP_NAME: 'LixoOn',
  APP_SUBTITLE: 'Sistema de Coleta - Divinópolis/MG',

  // URLs da API — altere conforme o ambiente
  API_BASE_URL: 'api.php',
  WS_URL: '',  // WebSocket (vazio = desabilitado)

  // Timeouts e retry
  REQUEST_TIMEOUT_MS: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,

  // UI
  DEBOUNCE_DELAY_MS: 300,
  NOTIFICATION_DURATION_MS: 4000,
  SKELETON_MIN_DURATION_MS: 600,

  // Cache (em minutos)
  CACHE_TTL_MINUTES: 5,

  // Paginação
  PAGE_SIZE: 20,

  // Feature flags
  FEATURES: {
    OFFLINE_MODE: true,
    SOUND_ALERTS: true,
    MAP_ENABLED: true,
    WEBSOCKET_ENABLED: false,
    REPORTS_ENABLED: true,
  }
});

// Regiões oficiais de Divinópolis com cores para o mapa e filtros
const REGIOES = Object.freeze({
  CENTRAL:        { id: 1, nome: 'Central',        cor: '#00C851', corFundo: 'rgba(0,200,81,0.15)' },
  SUDESTE:        { id: 2, nome: 'Sudeste',         cor: '#3A86FF', corFundo: 'rgba(58,134,255,0.15)' },
  NORDESTE:       { id: 3, nome: 'Nordeste',        cor: '#FFA502', corFundo: 'rgba(255,165,2,0.15)' },
  SUDOESTE:       { id: 4, nome: 'Sudoeste',        cor: '#FF4757', corFundo: 'rgba(255,71,87,0.15)' },
  OESTE_NOROESTE: { id: 5, nome: 'Oeste/Noroeste',  cor: '#2DCCFF', corFundo: 'rgba(45,204,255,0.15)' },
});

// Mapeamento de nome de zona → key da REGIOES
const ZONA_MAP = Object.freeze({
  'Central': REGIOES.CENTRAL,
  'Sudeste': REGIOES.SUDESTE,
  'Nordeste': REGIOES.NORDESTE,
  'Sudoeste': REGIOES.SUDOESTE,
  'Oeste/Noroeste': REGIOES.OESTE_NOROESTE,
});
