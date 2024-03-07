import { DecoratorHelpers } from "@storybook/addon-themes";
import type { DecoratorFunction, Renderer } from "@storybook/types";
import {
  Theme,
  ThemeKey,
  ThemeProvider,
  useTheme,
} from "@gc-digital-talent/theme";
import React from "react";

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

export interface WithThemeFromHydrogenConfig {
  themes: Record<string, string>;
  defaultTheme: string;
}

type ThemeSetterProps = {
  theme: Theme;
};
const ThemeSetter = ({ theme }: ThemeSetterProps) => {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme({
      key: theme.key,
      mode: theme.mode,
    });
  }, [theme.key, theme.mode]);

  return null;
};

const withThemeFromHydrogen = <TRenderer extends Renderer = any>({
  themes,
  defaultTheme,
}: WithThemeFromHydrogenConfig): DecoratorFunction<TRenderer> => {
  initializeThemeState(Object.keys(themes), defaultTheme);
  return (storyFn, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const { themeOverride } = useThemeParameters();
    const selected = themeOverride || selectedTheme || defaultTheme;

    const themeArr = themes[selected].split(" ") as [
      ThemeKey | undefined,
      ThemeMode | undefined,
    ];

    return (
      <ThemeProvider>
        {storyFn() as React.ReactNode}
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
