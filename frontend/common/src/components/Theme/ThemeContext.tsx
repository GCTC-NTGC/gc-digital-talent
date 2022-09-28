import React from "react";

export type ThemeMode = "dark" | "light" | "pref";
export type SetModeFunc = (newMode: ThemeMode) => void;

export interface ThemeState {
  mode: ThemeMode;
  setMode: SetModeFunc;
}

export const defaultThemeState = {
  mode: "pref" as ThemeMode,
  setMode: () => {
    // PASS
  },
};

export const ThemeContext = React.createContext<ThemeState>(defaultThemeState);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = React.useState<ThemeMode>(localStorage.theme || null);

  const setCurrentMode = React.useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode);
      if (newMode !== "pref") {
        localStorage.setItem("theme", String(newMode));
      } else {
        localStorage.removeItem("theme");
      }
    },
    [setMode],
  );

  React.useEffect(() => {
    const isSet = localStorage.theme !== undefined;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isSetDark = localStorage.theme === "dark";
    const isSetLight = localStorage.theme === "light";

    const isDark =
      (prefersDark && (!isSet || !isSetLight)) || (isSet && isSetDark);

    function testDark() {
      if (isDark) {
        setCurrentMode("dark");
      } else {
        setCurrentMode("pref");
      }
    }

    window.addEventListener("load", testDark);
    const darkMatcher = window.matchMedia("(prefers-color-scheme: dark)");
    const lightMatcher = window.matchMedia("(prefers-color-scheme: light)");

    darkMatcher.addEventListener("change", testDark);
    lightMatcher.addEventListener("change", testDark);

    return () => {
      darkMatcher.removeEventListener("change", testDark);
      lightMatcher.removeEventListener("change", testDark);
      window.removeEventListener("load", testDark);
    };
  }, [setCurrentMode]);

  const theme = React.useMemo(
    () => ({
      mode,
      setMode: setCurrentMode,
    }),
    [mode, setCurrentMode],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
