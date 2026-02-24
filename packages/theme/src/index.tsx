import ThemeProvider from "./components/ThemeProvider";
import useTheme from "./hooks/useTheme";
import type {
  ThemeMode,
  SetThemeModeFunc,
  ThemeKey,
  SetThemeKeyFunc,
  Theme,
} from "./types";

export { ThemeProvider, useTheme };
export type { Theme, ThemeMode, SetThemeModeFunc, ThemeKey, SetThemeKeyFunc };
