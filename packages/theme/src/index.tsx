import ThemeProvider from "./components/ThemeProvider";
import useTheme from "./hooks/useTheme";
import type {
  ThemeMode,
  SetThemeModeFunc,
  ThemeKey,
  SetThemeKeyFunc,
  Theme,
} from "./types";
import initScript from "./init.js?raw";
export { initScript };

export { ThemeProvider, useTheme };
export type { Theme, ThemeMode, SetThemeModeFunc, ThemeKey, SetThemeKeyFunc };
