import { DecoratorHelpers } from "@storybook/addon-themes";
import type { DecoratorFunction, Renderer } from "storybook/internal/types";
import { ReactNode, useEffect, useMemo } from "react";

import {
  Theme,
  ThemeKey,
  ThemeProvider,
  useTheme,
} from "@gc-digital-talent/theme";

const { useThemeParameters, initializeThemeState, pluckThemeFromContext } =
  DecoratorHelpers;

type ThemeMode = "light" | "dark";
export const THEMES: Record<ThemeKey, Record<ThemeMode, string>> = {
  default: {
    light: "GCDT Light",
    dark: "GCDT Dark",
  },
  iap: {
    light: "IAP Light",
    dark: "IAP Dark",
  },
};

interface WithThemeFromHydrogenConfig {
  themes: Record<string, string>;
  defaultTheme: string;
}

interface ThemeSetterProps {
  theme: Theme;
}
const ThemeSetter = ({ theme }: ThemeSetterProps) => {
  const { setTheme, key, mode } = useTheme();

  useEffect(() => {
    if (theme.key !== key || theme.mode !== mode) {
      setTheme({
        key: theme.key,
        mode: theme.mode,
      });
    }
  }, [key, mode, setTheme, theme.key, theme.mode]);
  return null;
};

// Note: Type matches documentation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withThemeFromHydrogen = <TRenderer extends Renderer = any>({
  themes,
  defaultTheme,
}: WithThemeFromHydrogenConfig): DecoratorFunction<TRenderer> => {
  initializeThemeState(Object.keys(themes), defaultTheme);
  return (storyFn, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const { themeOverride } = useThemeParameters();
    const selected = (themeOverride ?? selectedTheme) || defaultTheme;

    const themeArr = useMemo(
      () =>
        themes[selected].split(" ") as [
          ThemeKey | undefined,
          ThemeMode | undefined,
        ],
      [selected],
    );

    return (
      <ThemeProvider>
        {storyFn() as ReactNode}
        <ThemeSetter
          theme={{
            key: themeArr[0] ?? "default",
            mode: themeArr[1] ?? "light",
          }}
        />
      </ThemeProvider>
    );
  };
};

const withHydrogenTheme = withThemeFromHydrogen({
  themes: {
    [THEMES.default.light]: "default light",
    [THEMES.default.dark]: "default dark",
    [THEMES.iap.light]: "iap light",
    [THEMES.iap.dark]: "iap dark",
  },
  defaultTheme: THEMES.default.light,
});

export default withHydrogenTheme;
