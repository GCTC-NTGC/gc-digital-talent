/**
 * Initializes dark mode if preferred to avoid a theme flash
 *
 * Intended as an early execution to happen while React and the ThemeProvider
 * are booting up.
 *
 * This should match the ThemeKey and ThemeMode in ThemeProvider
 */
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
