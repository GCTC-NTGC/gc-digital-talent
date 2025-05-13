import {
  ContainerDecorator,
  FeatureFlagDecorator,
  HelmetDecorator,
  MockGraphqlDecorator,
  ReducedMotionDecorator,
  RouterDecorator,
  ThemeDecorator,
  VIEWPORTS,
} from "@gc-digital-talent/storybook-helpers";
import { ToastDecorator } from "@gc-digital-talent/toast";
import { richTextElements as defaultRichTextElements } from "@gc-digital-talent/i18n";

import frCommonCompiled from "@gc-digital-talent/i18n/frCompiled.json";
import frCompiled from "../src/lang/frCompiled.json";

import "../src/assets/css/hydrogen.css";
import "../src/assets/css/app.css";
import "../src/assets/css/tailwind.css";

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
      color: /(background|color)$/i,
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
    viewports: VIEWPORTS,
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
