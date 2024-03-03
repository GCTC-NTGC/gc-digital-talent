import { withThemeByDataAttribute } from "@storybook/addon-themes";

type ThemeKey = "gcdt" | "iap";
type ThemeMode = "dark" | "light";

export const THEMES: Record<ThemeKey, Record<ThemeMode, string>> = {
  gcdt: {
    light: "GCDT Light",
    dark: "GCDT Dark",
  },
  iap: {
    light: "IAP Light",
    dark: "IAP Dark",
  },
};

const withTheme = withThemeByDataAttribute({
  themes: {
    [THEMES.gcdt.light]: "default light",
    [THEMES.gcdt.dark]: "default dark",
    [THEMES.iap.light]: "iap light",
    [THEMES.iap.dark]: "iap dark",
  },
  defaultTheme: THEMES.gcdt.light,
  attributeName: "data-h2",
});

export default withTheme;
