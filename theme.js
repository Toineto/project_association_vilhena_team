(function () {
  var root = document.documentElement;

  function getStoredTheme() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {}
    return 'light';
  }

  function updateToggleButton(toggle, isDark) {
    if (!toggle) return;
    toggle.setAttribute('aria-label', isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro');
    
    // Se o botão não contiver a estrutura dupla controlada por CSS, fornece o conteúdo correto
    if (!toggle.querySelector('.theme-icon-sun')) {
      toggle.innerHTML =
        '<span class="theme-icon theme-icon-moon" aria-hidden="true">🌙</span>' +
        '<span class="theme-icon theme-icon-sun" aria-hidden="true">☀️</span>' +
        '<span class="theme-text theme-text-dark">Modo escuro</span>' +
        '<span class="theme-text theme-text-light">Modo claro</span>';
    }
  }

  function applyTheme(theme) {
    var isDark = theme === 'dark';
    var body = document.body;

    if (isDark) {
      root.classList.add('dark-mode');
      if (body) body.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
      if (body) body.classList.remove('dark-mode');
    }

    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}

    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      updateToggleButton(toggle, isDark);
    }
  }

  function toggleTheme() {
    var isCurrentlyDark = root.classList.contains('dark-mode') ||
      (document.body && document.body.classList.contains('dark-mode'));
    applyTheme(isCurrentlyDark ? 'light' : 'dark');
  }

  // Expor funções seguras globalmente
  window.applyTheme = applyTheme;
  window.toggleTheme = toggleTheme;

  // Aplica o tema imediatamente para evitar qualquer flash
  var initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  // Delegação global de cliques no document:
  // Funciona instantaneamente sem aguardar o DOM carregar completamente
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target) return;
    var btn = target.closest ? target.closest('#theme-toggle') : null;
    if (btn) {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Acessibilidade por teclado (Enter / Barra de espaço)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var target = e.target;
      if (target && target.closest && target.closest('#theme-toggle')) {
        e.preventDefault();
        toggleTheme();
      }
    }
  });

  // Sincronização garantida do body e do botão
  function syncDOM() {
    var isDark = root.classList.contains('dark-mode');
    if (document.body) {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      updateToggleButton(toggle, isDark);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncDOM);
  } else {
    syncDOM();
  }

  // Mudança em tempo real de preferência do sistema operacional
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        try {
          if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        } catch (err) {}
      });
    } catch (e) {}
  }
})();
