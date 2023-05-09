import React from "react";

import { useLocalStorage } from "@gc-digital-talent/storage";

import {
  ThemeMode,
  ThemeKey,
  SetThemeFunc,
  SetThemeKeyFunc,
  SetThemeModeFunc,
  Theme,
  ThemeOverride,
} from "../types";

export interface ThemeState {
  mode: ThemeMode;
  key: ThemeKey;
  isPref: boolean;
  setMode: SetThemeModeFunc;
  setKey: SetThemeKeyFunc;
  setTheme: SetThemeFunc;
}

export const defaultThemeState = {
  mode: "pref" as ThemeMode,
  key: "default" as ThemeKey,
  isPref: true,
  setMode: () => {
    // PASS
  },
  setKey: () => {
    // PASS
  },
  setTheme: () => {
    // PASS
  },
};

export const ThemeContext = React.createContext<ThemeState>(defaultThemeState);

const defaultTheme: Theme = {
  key: "default",
  mode: "pref",
};

const getDefaultTheme = (override?: ThemeOverride): Theme => ({
  mode: override?.mode || defaultTheme.mode,
  key: override?.key || defaultTheme.key,
});

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
  const [theme, setTheme] = useLocalStorage<Theme>(
    "theme",
    getDefaultTheme(override),
  );
  const { key, mode } = theme;

  const setKey = React.useCallback(
    (newKey: ThemeKey) => {
      setTheme({
        mode,
        key: newKey,
      });
    },
    [setTheme, mode],
  );

  const setMode = React.useCallback(
    (newMode: ThemeMode) => {
      setTheme({
        key,
        mode: newMode,
      });
    },
    [setTheme, key],
  );

  React.useEffect(() => {
    const hydrogen = document.querySelectorAll(themeSelector || "[data-h2]");
    let themeString: string | undefined = "";
    // TO DO: Add mode back once dark mode is done
    if (mode && key) {
      // themeString = `${key} ${mode}`;
      themeString = key;
    } else if (key) {
      themeString = key;
    } else if (mode) {
      // themeString = mode;
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
  }, [key, mode, themeSelector]);

  React.useEffect(() => {
    const isSet = key || (mode && mode !== "pref");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isSetDark = localStorage.theme === "dark";
    const isSetLight = localStorage.theme === "light";

    const isDark =
      (prefersDark && (!isSet || !isSetLight)) || (isSet && isSetDark);

    function testDark() {
      if (isDark) {
        setTheme({
          key,
          mode: "dark",
        });
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
  }, [key, mode, setTheme]);

  const state = React.useMemo(
    () => ({
      mode,
      key,
      setTheme,
      setMode,
      setKey,
      isPref: !mode || mode === "pref",
    }),
    [mode, key, setTheme, setMode, setKey],
  );

  return (
    <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
