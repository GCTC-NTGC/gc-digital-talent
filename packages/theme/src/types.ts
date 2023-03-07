export type ThemeKey = "default" | "admin" | "iap";
export type SetThemeKeyFunc = (newThemeKey: ThemeKey) => void;
export type ThemeMode = "dark" | "light" | "pref";
export type SetModeFunc = (newMode: ThemeMode) => void;
export type SetThemeFunc = (newKey: ThemeKey, newMode: ThemeMode) => void;
