/**
 * LixoOn — Utilidades de UI
 * Funções compartilhadas: debounce, notificações, skeleton loaders, 
 * detecção offline, escape HTML.
 * --------------------------------------------------
 */
'use strict';

// ============================================================
// Utilidades Gerais
// ============================================================

/**
 * Debounce: atrasa a execução de uma função até que
 * o usuário pare de chamar por `delay` ms.
 */
function debounce(fn, delay = APP_CONFIG.DEBOUNCE_DELAY_MS) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Escapa caracteres HTML para prevenir XSS.
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, c => map[c]);
}

/**
 * Formata data para exibição (dd/mm/aaaa).
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR');
}

// ============================================================
// Sistema de Notificações (Toast)
// ============================================================

/**
 * Exibe uma notificação toast.
 * @param {'success'|'error'|'warning'|'info'} type
 */
function showNotification(title, message, type = 'info') {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const toastIcon = toast.querySelector('.notification-icon');

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  };

  const colors = {
    success: 'var(--primary)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--info)',
  };

  if (toastTitle) toastTitle.textContent = title;
  if (toastMessage) toastMessage.textContent = message;
  if (toastIcon) {
    toastIcon.className = `notification-icon fas ${icons[type] || icons.info}`;
    toastIcon.style.color = colors[type] || colors.info;
  }

  toast.style.borderLeftColor = colors[type] || colors.info;
  toast.classList.add('show');

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, APP_CONFIG.NOTIFICATION_DURATION_MS);
}

// ============================================================
// Indicador de Conexão Offline
// ============================================================

function setupOfflineDetection() {
  const banner = document.createElement('div');
  banner.id = 'offline-banner';
  banner.innerHTML = '<i class="fas fa-wifi-slash"></i> Sem conexão com a internet';
  banner.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
    background: var(--danger); color: white; text-align: center;
    padding: 0.5rem; font-size: 0.85rem; font-weight: 600;
    transform: translateY(-100%); transition: transform 0.3s ease;
  `;
  document.body.prepend(banner);

  function updateStatus() {
    banner.style.transform = navigator.onLine ? 'translateY(-100%)' : 'translateY(0)';
  }

  window.addEventListener('online', () => {
    updateStatus();
    showNotification('Conectado', 'Conexão restabelecida.', 'success');
  });
  window.addEventListener('offline', () => {
    updateStatus();
    showNotification('Sem Conexão', 'Você está offline. Dados salvos localmente.', 'warning');
  });

  updateStatus();
}

// ============================================================
// Skeleton Loaders
// ============================================================

/**
 * Gera HTML de skeleton loader.
 * @param {number} count - Quantidade de linhas
 * @param {'card'|'row'|'text'} type - Tipo de skeleton
 */
function createSkeleton(count = 3, type = 'row') {
  const items = [];
  for (let i = 0; i < count; i++) {
    if (type === 'card') {
      items.push(`
        <div class="skeleton-card">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      `);
    } else if (type === 'row') {
      items.push(`
        <tr>
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-text"></div></td>
          <td><div class="skeleton skeleton-text short"></div></td>
          <td><div class="skeleton skeleton-text"></div></td>
        </tr>
      `);
    } else {
      items.push(`<div class="skeleton skeleton-text" style="width: ${60 + Math.random() * 30}%;"></div>`);
    }
  }
  return items.join('');
}
