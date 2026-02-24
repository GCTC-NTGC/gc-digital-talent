(function () {
  try {
    const theme = JSON.parse(
      localStorage.getItem("theme") || '{"key":"default","mode":"pref"}',
    );
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const mode =
      theme.mode === "pref" ? (isDark ? "dark" : "light") : theme.mode;
    const docEl = document.documentElement;

    docEl.className = theme.key + " " + mode;
    docEl.style.colorScheme = mode;
  } catch (e) {}
})();
