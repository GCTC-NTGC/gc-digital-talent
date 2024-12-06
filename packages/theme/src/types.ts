export type ThemeKey = "default" | "iap";
export type SetThemeKeyFunc = (newThemeKey: ThemeKey) => void;
export type ThemeMode = "dark" | "light" | "pref";
export type SetThemeModeFunc = (newThemeMode: ThemeMode) => void;
export type SetThemeFunc = (value: Theme | ((val: Theme) => Theme)) => void;

export interface Theme {
  key: ThemeKey;
  mode: ThemeMode;
}

export interface ThemeOverride {
  key?: ThemeKey;
  mode?: ThemeMode;
}
