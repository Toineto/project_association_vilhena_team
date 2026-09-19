(function () {
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    const isDark = theme === 'dark';

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

    if (toggle) {
      toggle.setAttribute('aria-label', isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro');
      toggle.innerHTML = isDark
        ? '<span class="theme-icon" aria-hidden="true">☀️</span><span class="theme-text">Modo claro</span>'
        : '<span class="theme-icon" aria-hidden="true">🌙</span><span class="theme-text">Modo escuro</span>';
    }
  }

  let stored = 'light';
  try {
    stored = localStorage.getItem('theme') || 'light';
  } catch (e) {}

  applyTheme(stored === 'dark' ? 'dark' : 'light');

  if (toggle) {
    toggle.addEventListener('click', function () {
      const isDark = root.classList.contains('dark-mode') || (body && body.classList.contains('dark-mode'));
      applyTheme(isDark ? 'light' : 'dark');
    });
  }
})();

