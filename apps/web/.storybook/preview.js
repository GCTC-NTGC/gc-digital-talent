import {
  INITIAL_VIEWPORTS,
  MINIMAL_VIEWPORTS,
} from "@storybook/addon-viewport";
import {
  HelmetDecorator,
  MockGraphqlDecorator,
  RouterDecorator,
  ThemeDecorator,
  themeKey,
  themeMode,
} from "storybook-helpers";
import { richTextElements as defaultRichTextElements } from "@gc-digital-talent/i18n";
import frCommonCompiled from "@gc-digital-talent/i18n/src/lang/frCompiled.json";

import frCompiled from "../src/lang/frCompiled.json";

import "../src/assets/css/hydrogen.css";
import "../src/assets/css/app.css";

const messages = {
  en: null,
  fr: {
    ...frCompiled,
    ...frCommonCompiled,
  },
};

const getMessages = (locale) => messages[locale];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    // Set default to "light gray" rather that default "white", to better catch
    // components with transparent backgrounds.
    default: "light",
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  intl: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    getMessages,
    defaultRichTextElements,
  },
  viewport: {
    // for possible values: https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...MINIMAL_VIEWPORTS,
    },
  },
};

export const globalTypes = {
  themeKey,
  themeMode,
};

export const decorators = [
  HelmetDecorator,
  MockGraphqlDecorator,
  ThemeDecorator,
  RouterDecorator,
  (Story) => (
    <div
      data-h2-color="base(black)"
      data-h2-background="base(background)"
      data-h2-font-family="base(sans)"
    >
      <Story />
    </div>
  ),
];
