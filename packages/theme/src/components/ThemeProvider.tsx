import React from "react";

import { ThemeMode, SetModeFunc } from "../types";

export interface ThemeState {
  mode: ThemeMode;
  isPref: boolean;
  setMode: SetModeFunc;
}

export const defaultThemeState = {
  mode: "pref" as ThemeMode,
  isPref: true,
  setMode: () => {
    // PASS
  },
};

export const ThemeContext = React.createContext<ThemeState>(defaultThemeState);

export interface ThemeProviderProps {
  children: React.ReactNode;
  override?: ThemeMode;
  themeSelector?: string;
}

const ThemeProvider = ({
  children,
  override,
  themeSelector,
}: ThemeProviderProps) => {
  const [isPref, setPref] = React.useState<boolean>(!localStorage.theme);
  const [mode, setMode] = React.useState<ThemeMode>(
    localStorage.theme || "pref",
  );

  const setDOMTheme = React.useCallback(
    (newMode: ThemeMode) => {
      setMode(newMode);
      const hydrogen = document.querySelectorAll(themeSelector || "[data-h2]");
      hydrogen.forEach((item) => {
        if (item instanceof HTMLElement) {
          //  NOTE: We are setting DOM attrs here so it should be fine
          // eslint-disable-next-line no-param-reassign
          item.dataset.h2 = newMode;
        }
      });
    },
    [themeSelector, setMode],
  );

  const setCurrentMode = React.useCallback(
    (newMode: ThemeMode) => {
      setPref(newMode === "pref");
      if (newMode !== "pref") {
        localStorage.setItem("theme", String(newMode));
        setDOMTheme(newMode);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        localStorage.removeItem("theme");
        setDOMTheme(prefersDark ? "dark" : "light");
      }
    },
    [setDOMTheme, setPref],
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
    if (override) {
      setCurrentMode(override);
    }
  }, [override, setCurrentMode]);

  const theme = React.useMemo(
    () => ({
      mode,
      setMode: setCurrentMode,
      isPref,
    }),
    [mode, setCurrentMode, isPref],
  );

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
