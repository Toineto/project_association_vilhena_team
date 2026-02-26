(function () {
  const body = document.body;
  const toggle = document.getElementById('theme-toggle');

  if (!toggle) return;

  function applyTheme(theme) {
    const isDark = theme === 'dark';

    if (isDark) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    localStorage.setItem('theme', theme);
    toggle.textContent = isDark ? 'Modo claro' : 'Modo escuro';
  }

  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
  } else {
    applyTheme('light');
  }

  toggle.addEventListener('click', function () {
    const isDark = body.classList.contains('dark-mode');
    applyTheme(isDark ? 'light' : 'dark');
  });
})();

