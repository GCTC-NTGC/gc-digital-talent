import React from "react";
import { ThemeMode, SetModeFunc, ThemeKey, SetThemeKeyFunc } from "../types";

export interface ThemeState {
  mode: ThemeMode;
  key: ThemeKey;
  isPref: boolean;
  setMode: SetModeFunc;
  setThemeKey: SetThemeKeyFunc;
}

export const defaultThemeState = {
  mode: "pref" as ThemeMode,
  key: "default" as ThemeKey,
  isPref: true,
  setMode: () => {
    // PASS
  },
  setThemeKey: () => {
    // PASS
  },
};

export const ThemeContext = React.createContext<ThemeState>(defaultThemeState);

export interface ThemeProviderProps {
  children: React.ReactNode;
  override?: {
    key?: ThemeKey;
    mode?: ThemeMode;
  };
  themeSelector?: string;
}

const ThemeProvider = ({
  children,
  override,
  themeSelector,
}: ThemeProviderProps) => {
  const currentTheme = localStorage.theme ? JSON.parse(localStorage.theme) : {};
  const [isPref, setPref] = React.useState<boolean>(!localStorage.theme);
  const [key, setKey] = React.useState<ThemeKey>(
    currentTheme?.key || "default",
  );
  const [mode, setMode] = React.useState<ThemeMode>(
    currentTheme?.mode || "pref",
  );

  const setDOMTheme = React.useCallback(
    (newKey: ThemeKey, newMode: ThemeMode) => {
      setMode(newMode);
      setKey(newKey);
      const hydrogen = document.querySelectorAll(themeSelector || "[data-h2]");
      let themeString: string | undefined = "";
      if (newMode && newKey) {
        themeString = `${newKey} ${newMode}`;
      } else if (newKey) {
        themeString = newKey;
      } else if (newMode) {
        themeString = newMode;
      } else {
        themeString = undefined;
      }

      hydrogen.forEach((item) => {
        if (item instanceof HTMLElement) {
          //  NOTE: We are setting DOM attrs here so it should be fine
          // eslint-disable-next-line no-param-reassign
          item.dataset.h2 = themeString;
        }
      });
    },
    [themeSelector],
  );

  const setCurrentMode = React.useCallback(
    (newMode: ThemeMode) => {
      setPref(newMode === "pref");
      if (newMode !== "pref") {
        localStorage.setItem(
          "theme",
          JSON.stringify({
            key,
            mode: newMode,
          }),
        );
        setDOMTheme(key, newMode);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        localStorage.removeItem("theme");
        setDOMTheme(key, prefersDark ? "dark" : "light");
      }
    },
    [setDOMTheme, setPref, key],
  );

  const setCurrentKey = React.useCallback(
    (newKey: ThemeKey) => {
      setDOMTheme(newKey, mode);
      localStorage.setItem(
        "theme",
        JSON.stringify({
          mode,
          key: newKey,
        }),
      );
    },
    [mode, setDOMTheme],
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

  React.useEffect(() => {
    if (override?.mode) {
      setCurrentMode(override.mode);
    }
  }, [override?.mode, setCurrentMode]);

  React.useEffect(() => {
    if (override?.key) {
      setCurrentKey(override.key);
    }
  }, [override?.key, setCurrentKey]);

  const theme = React.useMemo(
    () => ({
      mode,
      key,
      setMode: setCurrentMode,
      setThemeKey: setCurrentKey,
      isPref,
    }),
    [mode, key, setCurrentMode, setCurrentKey, isPref],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
