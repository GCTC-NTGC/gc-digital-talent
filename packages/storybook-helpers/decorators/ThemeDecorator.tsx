import { DecoratorHelpers } from "@storybook/addon-themes";
import type { DecoratorFunction, Renderer } from "storybook/internal/types";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";

import type { Theme, ThemeKey } from "@gc-digital-talent/theme";
import { ThemeProvider, useTheme } from "@gc-digital-talent/theme";

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

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

interface WithThemeFromTailwindConfig {
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

const withThemeFromTailwind = ({
  themes,
  defaultTheme,
}: WithThemeFromTailwindConfig): DecoratorFunction<Renderer> => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (storyFn, context) => {
    const selectedTheme = pluckThemeFromContext(context);

    const selected =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (context?.parameters?.themes?.themeOverride as string) ||
      selectedTheme ||
      defaultTheme;

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

const withTailwindTheme = withThemeFromTailwind({
  themes: {
    [THEMES.default.light]: "default light",
    [THEMES.default.dark]: "default dark",
    [THEMES.iap.light]: "iap light",
    [THEMES.iap.dark]: "iap dark",
  },
  defaultTheme: THEMES.default.light,
});

export default withTailwindTheme;
