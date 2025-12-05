import {
  ContainerDecorator,
  FeatureFlagDecorator,
  GLOBAL_A11Y_EXCLUDES,
  HelmetDecorator,
  MockGraphqlDecorator,
  ReducedMotionDecorator,
  RouterDecorator,
  ThemeDecorator,
  VIEWPORTS,
} from "@gc-digital-talent/storybook-helpers";
import { ToastDecorator } from "@gc-digital-talent/toast";
import defaultRichTextElements from "@gc-digital-talent/rich-text-elements";

import frCommonCompiled from "@gc-digital-talent/i18n/frCompiled.json";
import frCompiled from "../apps/web/src/lang/frCompiled.json";

import "../apps/web/src/assets/css/tailwind.css";

const messages = {
  en: null,
  fr: {
    ...frCompiled,
    ...frCommonCompiled,
  },
};

export const initialGlobals = {
  locale: "en",
  locales: {
    en: "English",
    fr: "Français",
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },

  backgrounds: {
    disable: true,
  },

  controls: {
    matchers: {
      date: /Date$/,
    },
  },

  options: {
    storySort: {
      method: "alphabetical",
    },
  },

  reactIntl: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    messages,
    defaultRichTextElements,
  },

  viewport: {
    options: VIEWPORTS,
  },

  a11y: {
    // 'todo' - show a11y violations in the test UI only
    // 'error' - fail CI on a11y violations
    // 'off' - skip a11y checks entirely
    test: "error",

    context: {
      // Exclude some elements from testing
      exclude: GLOBAL_A11Y_EXCLUDES,
    },
  },
};

export const decorators = [
  FeatureFlagDecorator,
  HelmetDecorator,
  ToastDecorator,
  ReducedMotionDecorator,
  MockGraphqlDecorator,
  ThemeDecorator,
  RouterDecorator,
  ContainerDecorator,
];
