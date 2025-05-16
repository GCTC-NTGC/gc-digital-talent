import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";

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
  /** Full mode stores three values to determine the current setting */
  fullMode: ThemeMode;
  /**
   * Mode omits "pref" and is used by hydrogen that only supports light/dark
   * where pref will fallback to one based on users `prefers-color-scheme`
   * */
  mode: Omit<ThemeMode, "pref">;
  key: ThemeKey;
  isPref: boolean;
  setMode: SetThemeModeFunc;
  setKey: SetThemeKeyFunc;
  setTheme: SetThemeFunc;
}

const defaultThemeState = {
  fullMode: "pref" as ThemeMode,
  mode: "light" as ThemeMode,
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

export const ThemeContext = createContext<ThemeState>(defaultThemeState);

const defaultTheme: Theme = {
  key: "default",
  mode: "pref",
};

const getDefaultTheme = (override?: ThemeOverride): Theme => ({
  mode: override?.mode ?? defaultTheme.mode,
  key: override?.key ?? defaultTheme.key,
});

interface ThemeProviderProps {
  children: ReactNode;
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
  let computedMode: ThemeMode = mode;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isSetLight = localStorage.theme === "light";
  if (mode === "pref") {
    computedMode = prefersDark && !isSetLight ? "dark" : "light";
  }

  const setKey = useCallback(
    (newKey: ThemeKey) => {
      setTheme({
        mode,
        key: newKey,
      });
    },
    [setTheme, mode],
  );

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setTheme({
        key,
        mode: newMode,
      });
    },
    [setTheme, key],
  );

  useEffect(() => {
    const hydrogen = document.querySelectorAll(
      themeSelector ?? "html[data-h2], body[data-h2]",
    );
    let themeString: string | undefined = "";

    if (computedMode && key) {
      themeString = `${key} ${computedMode}`;
    } else if (key) {
      themeString = key;
    } else if (mode) {
      themeString = computedMode;
    } else {
      themeString = undefined;
    }

    hydrogen.forEach((item) => {
      if (item instanceof HTMLElement) {
        //  NOTE: We are setting DOM attrs here so it should be fine
        item.dataset.h2 = themeString;
        item.classList.value = themeString ?? "";
      }
    });
  }, [computedMode, key, mode, themeSelector]);

  const testDark = useCallback(() => {
    const isSet = mode && mode !== "pref";
    if (!isSet) {
      setTheme({
        key,
        mode: "pref",
      });
    }
  }, [key, mode, setTheme]);

  useEffect(() => {
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
  }, [key, mode, setTheme, testDark]);

  useEffect(() => {
    if (
      (override?.key && override.key !== key) ||
      (override?.mode && override.mode !== mode)
    ) {
      const newTheme = getDefaultTheme(override);
      setTheme(newTheme);
    }
  }, [setTheme, override, mode, key]);

  const state = useMemo(
    () => ({
      fullMode: override?.mode ?? mode,
      mode: override?.mode ?? computedMode,
      key: override?.key ?? key,
      setTheme,
      setMode,
      setKey,
      isPref: !mode || mode === "pref",
    }),
    [
      override?.mode,
      override?.key,
      computedMode,
      key,
      setTheme,
      setMode,
      setKey,
      mode,
    ],
  );

  return (
    <ThemeContext.Provider value={state}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
