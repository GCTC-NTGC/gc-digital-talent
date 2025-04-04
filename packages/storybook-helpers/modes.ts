import { THEMES } from "./decorators/ThemeDecorator";
import { DIMENSIONS } from "./viewports";

/**
 * Chromatic Modes
 *
 * Used to define different modes used by
 * chromatic snapshots.
 *
 * REF: https://www.chromatic.com/docs/modes/
 */
const allModes = {
  mobile: {
    viewport: DIMENSIONS.phone.width,
  },
  desktop: {
    viewport: DIMENSIONS.desktop.width,
  },
  light: {
    theme: THEMES.default.light,
  },
  dark: {
    theme: THEMES.default.dark,
  },
  "light desktop": {
    theme: THEMES.default.light,
    viewport: DIMENSIONS.desktop.width,
  },
  "dark desktop": {
    theme: THEMES.default.dark,
    viewport: DIMENSIONS.desktop.width,
  },
  "light mobile": {
    theme: THEMES.default.light,
    viewport: DIMENSIONS.phone.width,
  },
  "dark mobile": {
    theme: THEMES.default.dark,
    viewport: DIMENSIONS.phone.width,
  },
  "light iap desktop": {
    theme: THEMES.iap.light,
    viewport: DIMENSIONS.desktop.width,
  },
  "dark iap desktop": {
    theme: THEMES.iap.dark,
    viewport: DIMENSIONS.desktop.width,
  },
  "light iap mobile": {
    theme: THEMES.iap.light,
    viewport: DIMENSIONS.phone.width,
  },
  "dark iap mobile": {
    theme: THEMES.iap.dark,
    viewport: DIMENSIONS.phone.width,
  },
  french: {
    locale: "fr",
  },
  "iap french": {
    locale: "fr",
    theme: THEMES.iap.light,
  },
};

export default allModes;
