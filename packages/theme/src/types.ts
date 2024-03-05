export type ThemeKey = "default" | "iap";
export type SetThemeKeyFunc = (newThemeKey: ThemeKey) => void;
export type ThemeMode = "dark" | "light" | "pref";
export type SetThemeModeFunc = (newThemeMode: ThemeMode) => void;
export type SetThemeFunc = (value: Theme | ((val: Theme) => Theme)) => void;

export type Theme = {
  key: ThemeKey;
  mode: ThemeMode;
};

export type ThemeOverride = {
  key?: ThemeKey;
  mode?: ThemeMode;
};
